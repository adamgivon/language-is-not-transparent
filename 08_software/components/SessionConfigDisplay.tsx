"use client";

import { useEffect, useState } from "react";
import type { AnchoringConfig } from "@/types/anchoring_config";
import styles from "./SessionConfigDisplay.module.css";

interface Props {
  sessionId: string;
  onClose: () => void;
}

export default function SessionConfigDisplay({ sessionId, onClose }: Props) {
  const [config, setConfig] = useState<AnchoringConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch(`/api/sessions/${sessionId}/config`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch config");
        }

        const data = await res.json();
        setConfig(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, [sessionId]);

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Session Configuration</h2>
          <p className={styles.subtitle}>Read-only view</p>
        </div>

        <div className={styles.content}>
          {loading && <div className={styles.loading}>Loading...</div>}

          {error && <div className={styles.error}>Error: {error}</div>}

          {config && (
            <>
              {/* Selection Method */}
              <div className={styles.section}>
                <div className={styles.sectionTitle}>Selection Method</div>
                <div className={styles.value}>{config.selectionMethod}</div>
              </div>

              {/* Selection Parameters */}
              <div className={styles.section}>
                <div className={styles.sectionTitle}>Selection Parameters</div>
                <div className={styles.grid}>
                  {config.selectionMethod === "semantic" && (
                    <div className={styles.param}>
                      <span className={styles.paramLabel}>K (Retrieval):</span>
                      <span className={styles.paramValue}>{config.k}</span>
                    </div>
                  )}
                  <div className={styles.param}>
                    <span className={styles.paramLabel}>Max Selected:</span>
                    <span className={styles.paramValue}>
                      {config.maxSelected ?? "all passing threshold"}
                    </span>
                  </div>
                  {config.selectionMethod === "semantic" && (
                    <div className={styles.param}>
                      <span className={styles.paramLabel}>
                        Similarity Floor:
                      </span>
                      <span className={styles.paramValue}>
                        {config.simFloor}
                      </span>
                    </div>
                  )}
                  <div className={styles.param}>
                    <span className={styles.paramLabel}>Weight Precision:</span>
                    <span className={styles.paramValue}>
                      {config.weightPrecision} decimals
                    </span>
                  </div>
                </div>
              </div>

              {/* Forced Anchors / Manual Weights */}
              <div className={styles.section}>
                <div className={styles.sectionTitle}>
                  {config.selectionMethod === "manual"
                    ? "Manual Weights"
                    : "Forced Anchors"}
                </div>
                <div className={styles.forcedList}>
                  {(() => {
                    //new - Use correct ordering for each mode
                    if (config.selectionMethod === "manual") {
                      //new - Manual mode: use customOrder.fullOrder for ordering
                      const orderedNames =
                        config.customOrder?.fullOrder ||
                        Object.keys(config.manualWeights || {});
                      const weights = config.manualWeights || {};
                      return orderedNames.map((name) => (
                        <div key={name} className={styles.forcedItem}>
                          <span className={styles.anchorName}>{name}</span>
                          <span className={styles.anchorWeight}>
                            {weights[name]?.toFixed(config.weightPrecision) ||
                              "0"}
                          </span>
                        </div>
                      ));
                    } else {
                      //new - Semantic/LLM mode: order doesn't matter for forcedAnchors
                      return Object.entries(config.forcedAnchors).map(
                        ([name, weight]) => (
                          <div key={name} className={styles.forcedItem}>
                            <span className={styles.anchorName}>{name}</span>
                            <span className={styles.anchorWeight}>
                              {weight.toFixed(config.weightPrecision)}
                            </span>
                          </div>
                        )
                      );
                    }
                  })()}
                </div>
              </div>

              {/* Forced Protocols */}
              <div className={styles.section}>
                <div className={styles.sectionTitle}>Forced Protocols</div>
                <div className={styles.protocolList}>
                  {config.forcedProtocols.map((protocol) => (
                    <span key={protocol} className={styles.protocolBadge}>
                      {protocol}
                    </span>
                  ))}
                </div>
              </div>

              {/* LLM Config (if applicable) */}
              {config.llmConfig && (
                <div className={styles.section}>
                  <div className={styles.sectionTitle}>LLM Configuration</div>
                  <div className={styles.param}>
                    <span className={styles.paramLabel}>Model:</span>
                    <span className={styles.paramValue}>
                      {config.llmConfig.primaryModel}
                    </span>
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className={styles.section}>
                <div className={styles.sectionTitle}>Metadata</div>
                <div className={styles.metadata}>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Config Version:</span>
                    <span className={styles.metaValue}>
                      {config.configVersion}
                    </span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Created:</span>
                    <span className={styles.metaValue}>
                      {new Date(config.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className={styles.actions}>
          <button className={styles.buttonPrimary} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
