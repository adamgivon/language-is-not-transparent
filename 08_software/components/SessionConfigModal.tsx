"use client";

import { useState, useEffect } from "react";
import type { AnchoringConfig } from "@/types/anchoring_config";
import styles from "./SessionConfigModal.module.css";
import { LLM_SELECTION_MODEL } from "@/config/anchoring";

interface Props {
  projectId: string;
  onSubmit: (config: AnchoringConfig) => void;
  onCancel: () => void;
  defaultConfig?: AnchoringConfig | null;
}

export default function SessionConfigModal({
  projectId,
  onSubmit,
  onCancel,
  defaultConfig,
}: Props) {
  const [selectionMethod, setSelectionMethod] = useState<
    "semantic" | "manual" | "llm_chosen"
  >(defaultConfig?.selectionMethod || "semantic");
  const [k, setK] = useState(defaultConfig?.k || 0);
  const [maxSelected, setMaxSelected] = useState<number | null>(
    defaultConfig?.maxSelected ?? null
  );
  const [simFloor, setSimFloor] = useState(defaultConfig?.simFloor || 0.2);
  const [weightPrecision, setWeightPrecision] = useState<number | "">(
    defaultConfig?.weightPrecision || 2
  );

  // new code - fetch and manage available chunks
  const [availableChunks, setAvailableChunks] = useState<string[]>([]);
  const [systemAnchorCount, setSystemAnchorCount] = useState<number | null>(
    null
  );
  const [loadingChunks, setLoadingChunks] = useState(true);
  const [isEditMode, setIsEditMode] = useState(!defaultConfig); // new code - edit mode if no default (first session)

  // new code - protocol selections (chunk name → order number)
  const [protocolSelections, setProtocolSelections] = useState<
    Record<string, number>
  >({});

  // new code - forced anchor selections (chunk name → floor weight)
  const [forcedAnchorSelections, setForcedAnchorSelections] = useState<
    Record<string, number>
  >(defaultConfig?.forcedAnchors || {});

  // new code - manual weight selections (chunk name → weight)
  const [manualWeightSelections, setManualWeightSelections] = useState<
    Record<string, number>
  >(defaultConfig?.manualWeights || {});

  // Manual mode ordering (chunk name → order number)
  const [manualOrderSelections, setManualOrderSelections] = useState<
    Record<string, number>
  >({});

  // new code - fetch available chunks from project
  useEffect(() => {
    const fetchChunks = async () => {
      try {
        setLoadingChunks(true);

        // Fetch project to get anchor system version
        const projectRes = await fetch(`/api/projects/${projectId}`, {
          cache: "no-store",
        });

        if (!projectRes.ok) {
          throw new Error("Failed to fetch project");
        }

        const { project } = await projectRes.json();

        // Get version from project's anchor system
        const version = project.anchorSystem?.name || "14_experiment";
        const anchorCount = project.anchorSystem?.anchorCount || 19;
        setSystemAnchorCount(anchorCount);

        // Fetch chunks for this version
        const chunksRes = await fetch(`/api/anchors?version=${version}`, {
          cache: "no-store",
        });

        if (!chunksRes.ok) {
          throw new Error("Failed to fetch chunks");
        }

        const chunks = await chunksRes.json();
        const chunkNames = chunks.map((c: any) => c.name);
        console.log("LOADED CHUNKS:", chunkNames.length, "chunks", chunkNames);

        setAvailableChunks(chunkNames);

        // new code - initialize protocol selections from defaultConfig if exists
        if (defaultConfig?.forcedProtocols) {
          const protocolMap: Record<string, number> = {};
          defaultConfig.forcedProtocols.forEach((name, index) => {
            protocolMap[name] = index + 1;
          });
          setProtocolSelections(protocolMap);
        }
        if (defaultConfig?.forcedAnchors) {
          setForcedAnchorSelections(defaultConfig.forcedAnchors);
        }

        // Initialize manual weight selections from defaultConfig if exists
        if (defaultConfig?.manualWeights) {
          setManualWeightSelections(defaultConfig.manualWeights);
        }
      } catch (err: any) {
        console.error("Error fetching chunks:", err);
        alert("Failed to load chunks: " + err.message);
      } finally {
        setLoadingChunks(false);
      }
    };

    fetchChunks();
  }, [projectId]);

  useEffect(() => {
    if (systemAnchorCount !== null && k === 0) {
      setK(systemAnchorCount);
    }
  }, [systemAnchorCount]);

  useEffect(() => {
    // new - Clear all selections when switching modes (clean slate)
    setProtocolSelections({});
    setForcedAnchorSelections({});
    setManualWeightSelections({});
    setManualOrderSelections({}); //new - also clear manual order
  }, [selectionMethod]); //new - runs whenever selection method changes

  const handleSubmit = () => {
    // new code - build forcedAnchors from forcedAnchorSelections
    const forcedAnchors =
      selectionMethod === "manual" ? {} : { ...forcedAnchorSelections };

    // new code - build forcedProtocols array from protocolSelections (sorted by order)
    const forcedProtocols = Object.entries(protocolSelections)
      .sort((a, b) => a[1] - b[1]) // sort by order number
      .map(([name, _order]) => name);

    // // new code - build manualWeights based on selection method
    // const manualWeights =
    //   selectionMethod === "manual" ? { ...forcedAnchorSelections } : null;

    // new code - build manualWeights based on selection method, preserving order
    let manualWeights: Record<string, number> | null = null; //new - explicit type
    if (selectionMethod === "manual") {
      //new - Build manualWeights object in user-specified order from manualOrderSelections
      const orderedEntries = Object.entries(manualOrderSelections)
        .sort((a, b) => a[1] - b[1]) //new - sort by order number (1, 2, 3...)
        .map(([name]) => [name, forcedAnchorSelections[name]]); //new - get weight from forcedAnchorSelections

      manualWeights = Object.fromEntries(orderedEntries) as Record<
        string,
        number
      >; //new - build object with properties in correct order
    }

    // new code - validate manual weights sum to 1
    if (selectionMethod === "manual" && manualWeights) {
      const weightsSum = Object.values(manualWeights).reduce(
        (sum, w) => sum + w,
        0
      );
      if (weightsSum < 1) {
        alert(
          `Manual weights sum to ${weightsSum.toFixed(
            2
          )}, which is less than 1.0. Please adjust the weights.`
        );
        return;
      }
    }

    const finalWeightPrecision = weightPrecision === "" ? 2 : weightPrecision;

    const config: AnchoringConfig = {
      configVersion: "1.0",
      createdAt: new Date().toISOString(),
      k,
      maxSelected,
      simFloor,
      weightPrecision: finalWeightPrecision,
      selectionMethod,
      forcedProtocols, //new - protocols come before anchors
      forcedAnchors, //new - moved after protocols
      manualWeights,
      customOrder: {
        enabled: selectionMethod === "manual",
        fullOrder:
          selectionMethod === "manual"
            ? Object.entries(manualOrderSelections)
                .sort((a, b) => a[1] - b[1]) // Sort by order number
                .map(([name, _order]) => name) // Extract just the names
            : null, //new - removed protocolsOrder
      },
      llmConfig:
        selectionMethod === "llm_chosen"
          ? { primaryModel: LLM_SELECTION_MODEL }
          : null,
    };

    onSubmit(config);
  };

  // new code - handle protocol checkbox toggle
  const handleProtocolToggle = (chunkName: string, checked: boolean) => {
    if (checked) {
      // Find next available order number
      const existingOrders = Object.values(protocolSelections);
      const nextOrder =
        existingOrders.length > 0 ? Math.max(...existingOrders) + 1 : 1;
      setProtocolSelections((prev) => ({ ...prev, [chunkName]: nextOrder }));

      // Remove from forced anchors and manual weights if was checked there
      setForcedAnchorSelections((prev) => {
        const updated = { ...prev };
        delete updated[chunkName];
        return updated;
      });
      setManualWeightSelections((prev) => {
        const updated = { ...prev };
        delete updated[chunkName];
        return updated;
      });
    } else {
      setProtocolSelections((prev) => {
        const updated = { ...prev };
        delete updated[chunkName];
        return updated;
      });
    }
  };

  // new code - handle protocol order change
  const handleProtocolOrderChange = (chunkName: string, order: string) => {
    const orderNum = parseInt(order);
    if (!isNaN(orderNum) && orderNum > 0) {
      setProtocolSelections((prev) => ({ ...prev, [chunkName]: orderNum }));
    }
  };

  // new code - handle forced anchor checkbox toggle
  const handleForcedAnchorToggle = (chunkName: string, checked: boolean) => {
    if (checked) {
      if (selectionMethod === "manual") {
        // Manual mode: add to both weight and order
        setForcedAnchorSelections((prev) => ({ ...prev, [chunkName]: 0.1 }));
        const existingOrders = Object.values(manualOrderSelections);
        const nextOrder =
          existingOrders.length > 0 ? Math.max(...existingOrders) + 1 : 1;
        setManualOrderSelections((prev) => ({
          ...prev,
          [chunkName]: nextOrder,
        }));
      } else {
        // Semantic/LLM mode: just weight
        setForcedAnchorSelections((prev) => ({ ...prev, [chunkName]: 0.1 }));
      }

      // Remove from protocols
      setProtocolSelections((prev) => {
        const updated = { ...prev };
        delete updated[chunkName];
        return updated;
      });
      setManualWeightSelections((prev) => {
        const updated = { ...prev };
        delete updated[chunkName];
        return updated;
      });
    } else {
      setForcedAnchorSelections((prev) => {
        const updated = { ...prev };
        delete updated[chunkName];
        return updated;
      });
      setManualOrderSelections((prev) => {
        const updated = { ...prev };
        delete updated[chunkName];
        return updated;
      });
    }
  };

  // new code - handle forced anchor weight change
  const handleForcedAnchorWeightChange = (chunkName: string, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 1) {
      setForcedAnchorSelections((prev) => ({ ...prev, [chunkName]: numValue }));
    }
  };

  // new code - handle manual weight checkbox toggle
  const handleManualWeightToggle = (chunkName: string, checked: boolean) => {
    if (checked) {
      setManualWeightSelections((prev) => ({ ...prev, [chunkName]: 0.1 }));

      // Remove from protocols and forced anchors
      setProtocolSelections((prev) => {
        const updated = { ...prev };
        delete updated[chunkName];
        return updated;
      });
      setForcedAnchorSelections((prev) => {
        const updated = { ...prev };
        delete updated[chunkName];
        return updated;
      });
    } else {
      setManualWeightSelections((prev) => {
        const updated = { ...prev };
        delete updated[chunkName];
        return updated;
      });
    }
  };

  // new code - handle manual weight change
  const handleManualWeightChange = (chunkName: string, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 1) {
      setManualWeightSelections((prev) => ({ ...prev, [chunkName]: numValue }));
    }
  };

  return (
    <div className={styles.backdrop} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Configure Session</h2>
          {!defaultConfig && (
            <p className={styles.subtitle}>
              This is the first session. These settings will become the project
              default.
            </p>
          )}
        </div>

        <div className={styles.content}>
          {/* new code - Show compact view if defaultConfig exists and not in edit mode */}
          {defaultConfig && !isEditMode ? (
            <>
              {/* Compact View */}
              <div className={styles.compactSection}>
                <div className={styles.compactLabel}>Selection Method:</div>
                <div className={styles.compactValue}>{selectionMethod}</div>
              </div>

              {/* Selected Protocols */}
              {Object.keys(protocolSelections).length > 0 && (
                <div className={styles.compactSection}>
                  <div className={styles.compactLabel}>Protocols:</div>
                  <div className={styles.compactList}>
                    {Object.entries(protocolSelections)
                      .sort((a, b) => a[1] - b[1])
                      .map(([name, order]) => (
                        <span key={name} className={styles.compactItem}>
                          {name} (order: {order})
                        </span>
                      ))}
                  </div>
                </div>
              )}

              {/* Forced Anchors */}
              {Object.keys(forcedAnchorSelections).length > 0 && (
                <div className={styles.compactSection}>
                  <div className={styles.compactLabel}>Forced Anchors:</div>
                  <div className={styles.compactList}>
                    {Object.entries(forcedAnchorSelections).map(
                      ([name, weight]) => (
                        <span key={name} className={styles.compactItem}>
                          {name}: {weight.toFixed(2)}
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Manual Weights */}
              {selectionMethod === "manual" &&
                Object.keys(manualWeightSelections).length > 0 && (
                  <div className={styles.compactSection}>
                    <div className={styles.compactLabel}>Manual Weights:</div>
                    <div className={styles.compactList}>
                      {Object.entries(manualWeightSelections).map(
                        ([name, weight]) => (
                          <span key={name} className={styles.compactItem}>
                            {name}: {weight.toFixed(2)}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Parameters */}
              <div className={styles.compactSection}>
                <div className={styles.compactLabel}>Parameters:</div>
                <div className={styles.compactParams}>
                  {selectionMethod === "semantic" && (
                    <div className={styles.compactParam}>K: {k}</div>
                  )}
                  <div className={styles.compactParam}>
                    Max Selected: {maxSelected ?? "all"}
                  </div>
                  {selectionMethod === "semantic" && (
                    <div className={styles.compactParam}>
                      Sim Floor: {simFloor}
                    </div>
                  )}
                  <div className={styles.compactParam}>
                    Weight Precision: {weightPrecision}
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              <div className={styles.editButtonContainer}>
                <button
                  className={styles.buttonSecondary}
                  onClick={() => setIsEditMode(true)}
                >
                  Edit Configuration
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Full Edit Form */}
              {/* new code - Selection Method at top */}
              <div className={styles.field}>
                <label className={styles.label}>Selection Method</label>
                <select
                  className={styles.select}
                  value={selectionMethod}
                  onChange={(e) =>
                    setSelectionMethod(
                      e.target.value as "semantic" | "manual" | "llm_chosen"
                    )
                  }
                >
                  <option value="semantic">Semantic (FAISS)</option>
                  <option value="manual">Manual</option>
                  <option value="llm_chosen">
                    LLM-Chosen ({LLM_SELECTION_MODEL})
                  </option>
                </select>
              </div>

              {/* new code - Loading state */}
              {loadingChunks && (
                <div className={styles.loading}>
                  Loading available anchors...
                </div>
              )}

              {/* new code - Chunk selection list (only show if not loading) */}
              {!loadingChunks && availableChunks.length > 0 && (
                <div className={styles.field}>
                  <label className={styles.label}>
                    {selectionMethod === "semantic" ||
                    selectionMethod === "llm_chosen"
                      ? "Select Protocols and Forced Anchors"
                      : "Select Protocols and Manual Weights"}
                  </label>
                  <div className={styles.chunkList}>
                    {/* Column headers */}
                    <div className={styles.chunkHeader}>
                      <div className={styles.chunkName}>Chunk Name</div>
                      <div className={styles.chunkCell}>Force Anchor</div>
                      <div className={styles.chunkCell}>Protocol</div>
                      <div className={styles.chunkCell}>Order</div>
                      <div className={styles.chunkCell}>Weight</div>
                    </div>

                    {availableChunks.map((chunkName) => {
                      const isProtocol = chunkName in protocolSelections;
                      const isForcedAnchor =
                        chunkName in forcedAnchorSelections;
                      const isManualWeight =
                        chunkName in manualWeightSelections;

                      return (
                        <div key={chunkName} className={styles.chunkRow}>
                          {/* Chunk name */}
                          <div className={styles.chunkName}>{chunkName}</div>

                          {/* Force Anchor checkbox - always visible */}
                          <div className={styles.chunkCell}>
                            <input
                              type="checkbox"
                              checked={isForcedAnchor}
                              disabled={
                                selectionMethod === "llm_chosen" ||
                                isProtocol ||
                                isManualWeight
                              }
                              onChange={(e) =>
                                handleForcedAnchorToggle(
                                  chunkName,
                                  e.target.checked
                                )
                              }
                            />
                          </div>

                          {/* Protocol checkbox - always visible */}
                          <div className={styles.chunkCell}>
                            <input
                              type="checkbox"
                              checked={isProtocol}
                              disabled={
                                selectionMethod === "llm_chosen" ||
                                isForcedAnchor ||
                                isManualWeight
                              }
                              onChange={(e) =>
                                handleProtocolToggle(
                                  chunkName,
                                  e.target.checked
                                )
                              }
                            />
                          </div>

                          {/* Order input - always visible */}
                          <div className={styles.chunkCell}>
                            <input
                              type="number"
                              className={styles.inputSmall}
                              value={
                                isProtocol
                                  ? protocolSelections[chunkName] || ""
                                  : selectionMethod === "manual" &&
                                    isForcedAnchor
                                  ? manualOrderSelections[chunkName] || ""
                                  : ""
                              }
                              disabled={
                                selectionMethod === "llm_chosen" ||
                                (selectionMethod === "semantic" &&
                                  !isProtocol) ||
                                (selectionMethod === "manual" &&
                                  !isProtocol &&
                                  !isForcedAnchor)
                              }
                              onChange={(e) => {
                                const orderNum = parseInt(e.target.value);
                                if (!isNaN(orderNum) && orderNum > 0) {
                                  if (isProtocol) {
                                    handleProtocolOrderChange(
                                      chunkName,
                                      e.target.value
                                    );
                                  } else if (
                                    selectionMethod === "manual" &&
                                    isForcedAnchor
                                  ) {
                                    setManualOrderSelections((prev) => ({
                                      ...prev,
                                      [chunkName]: orderNum,
                                    }));
                                  }
                                }
                              }}
                              placeholder="Order"
                              min={1}
                            />
                          </div>

                          {/* Weight input - always visible */}
                          <div className={styles.chunkCell}>
                            <input
                              type="number"
                              className={styles.inputSmall}
                              value={
                                isForcedAnchor
                                  ? forcedAnchorSelections[chunkName]
                                  : isManualWeight
                                  ? manualWeightSelections[chunkName]
                                  : ""
                              }
                              disabled={
                                selectionMethod === "llm_chosen" ||
                                isProtocol ||
                                (!isForcedAnchor && !isManualWeight)
                              }
                              onChange={(e) => {
                                if (isForcedAnchor) {
                                  handleForcedAnchorWeightChange(
                                    chunkName,
                                    e.target.value
                                  );
                                } else if (isManualWeight) {
                                  handleManualWeightChange(
                                    chunkName,
                                    e.target.value
                                  );
                                }
                              }}
                              placeholder="Weight"
                              min={0}
                              max={1}
                              step={0.01}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* K (Retrieval count) - only for semantic */}
              {selectionMethod === "semantic" && (
                <div className={styles.field}>
                  <label className={styles.label}>K (Retrieval Count)</label>
                  <input
                    type="number"
                    className={styles.input}
                    value={k ?? ""}
                    onChange={(e) =>
                      setK(
                        e.target.value === ""
                          ? availableChunks.length
                          : parseInt(e.target.value)
                      )
                    }
                    min={1}
                    max={availableChunks.length}
                  />
                </div>
              )}

              {/* Max Selected - hide in manual mode */}
              {selectionMethod !== "manual" && (
                <div className={styles.field}>
                  <label className={styles.label}>Max Selected Anchors</label>
                  <input
                    type="number"
                    className={styles.input}
                    value={maxSelected ?? ""}
                    onChange={(e) =>
                      setMaxSelected(
                        e.target.value === "" ? null : parseInt(e.target.value)
                      )
                    }
                    placeholder="null = all passing threshold"
                    min={1}
                  />
                </div>
              )}

              {/* Similarity Floor - only for semantic */}
              {selectionMethod === "semantic" && (
                <div className={styles.field}>
                  <label className={styles.label}>
                    Similarity Floor (0.0 - 1.0)
                  </label>
                  <input
                    type="number"
                    className={styles.input}
                    value={simFloor}
                    onChange={(e) => setSimFloor(parseFloat(e.target.value))}
                    min={0}
                    max={1}
                    step={0.05}
                  />
                </div>
              )}

              {/* Weight Precision */}
              <div className={styles.field}>
                <label className={styles.label}>
                  Weight Precision (decimals)
                </label>
                <input
                  type="number"
                  className={styles.input}
                  value={weightPrecision}
                  disabled={
                    selectionMethod === "manual" ||
                    selectionMethod === "llm_chosen"
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    setWeightPrecision(val === "" ? "" : parseInt(val));
                  }}
                  min={1}
                  max={6}
                />
              </div>
            </>
          )}
        </div>

        <div className={styles.actions}>
          <button className={styles.buttonSecondary} onClick={onCancel}>
            Cancel
          </button>
          <button className={styles.buttonPrimary} onClick={handleSubmit}>
            Create Session
          </button>
        </div>
      </div>
    </div>
  );
}
