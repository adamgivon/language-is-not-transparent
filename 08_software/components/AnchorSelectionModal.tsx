 "use client";

  import React, { useState, useEffect } from "react";
  import styles from "./AnchorSelectionModal.module.css";

  interface AnchorSystem {
    name: string;
    anchorCount: number;
    chunksPath: string;
  }

  interface AnchorSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (config: {
      projectName: string;
      useExisting: boolean;
      anchorSystemName?: string;
      chunksPath?: string;
    }) => void;
    availableSystems: AnchorSystem[];
  }

  export default function AnchorSelectionModal({
    isOpen,
    onClose,
    onConfirm,
    availableSystems,
  }: AnchorSelectionModalProps) {
    const [projectName, setProjectName] = useState("");
    const [mode, setMode] = useState<"existing" | "new">("existing");
    const [selectedSystem, setSelectedSystem] = useState<string>("");
    const [newChunksPath, setNewChunksPath] = useState("");
    const [error, setError] = useState<string>("");

    // Set default selected system when modal opens
    useEffect(() => {
      if (isOpen && availableSystems.length > 0 && !selectedSystem) {
        setSelectedSystem(availableSystems[0].name);
      }
    }, [isOpen, availableSystems, selectedSystem]);

    // Reset form when modal closes
    useEffect(() => {
      if (!isOpen) {
        setProjectName("");
        setMode("existing");
        setSelectedSystem("");
        setNewChunksPath("");
        setError("");
      }
    }, [isOpen]);

    const handleConfirm = () => {
      // Validation
      if (!projectName.trim()) {
        setError("Project name is required");
        return;
      }

      if (mode === "existing" && !selectedSystem) {
        setError("Please select an anchor system");
        return;
      }

      if (mode === "new" && !newChunksPath.trim()) {
        setError("Please provide a chunks path");
        return;
      }

      // Build config
      const config = {
        projectName: projectName.trim(),
        useExisting: mode === "existing",
        ...(mode === "existing"
          ? { anchorSystemName: selectedSystem }
          : { chunksPath: newChunksPath.trim() }),
      };

      onConfirm(config);
    };

    if (!isOpen) return null;

    return (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <h2 className={styles.title}>Create New Project</h2>

          {error && <div className={styles.error}>{error}</div>}

          {/* Project Name */}
          <div className={styles.field}>
            <label className={styles.label}>Project Name</label>
            <input
              type="text"
              className={styles.input}
              value={projectName}
              onChange={(e) => {
                setProjectName(e.target.value);
                setError("");
              }}
              placeholder="Enter project name..."
              autoFocus
            />
          </div>

          {/* Anchor System Selection */}
          <div className={styles.field}>
            <label className={styles.label}>Anchor System</label>

            {/* Option 1: Use Existing */}
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="mode"
                  value="existing"
                  checked={mode === "existing"}
                  onChange={() => setMode("existing")}
                />
                <span>Use existing system</span>
              </label>

              {mode === "existing" && (
                <div className={styles.indent}>
                  <select
                    className={styles.select}
                    value={selectedSystem}
                    onChange={(e) => setSelectedSystem(e.target.value)}
                  >
                    {availableSystems.length === 0 ? (
                      <option value="">No systems available</option>
                    ) : (
                      availableSystems.map((sys) => (
                        <option key={sys.name} value={sys.name}>
                          {sys.name} ({sys.anchorCount} anchors)
                        </option>
                      ))
                    )}
                  </select>
                  {selectedSystem && (
                    <div className={styles.systemInfo}>
                      {availableSystems.find((s) => s.name === selectedSystem)?.chunksPath}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Option 2: Create New */}
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="mode"
                  value="new"
                  checked={mode === "new"}
                  onChange={() => setMode("new")}
                />
                <span>Use new anchor set</span>
              </label>

              {mode === "new" && (
                <div className={styles.indent}>
                  <input
                    type="text"
                    className={styles.input}
                    value={newChunksPath}
                    onChange={(e) => setNewChunksPath(e.target.value)}
                    placeholder="Path to chunks directory..."
                  />
                  <div className={styles.hint}>
                    Version will be read from chunk files
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            <button className={styles.btnCancel} onClick={onClose}>
              Cancel
            </button>
            <button className={styles.btnConfirm} onClick={handleConfirm}>
              Create & Initialize
            </button>
          </div>
        </div>
      </div>
    );
  }
