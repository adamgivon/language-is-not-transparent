"use client";

  import { useState, useEffect } from "react";
  import styles from "./ProjectDescriptionModal.module.css";

  interface ProjectDescriptionModalProps {
    isOpen: boolean;
    projectId: string;
    projectName: string;
    currentDescription: string | null;
    onClose: () => void;
    onSave: (description: string) => void;
  }

  export default function ProjectDescriptionModal({
    isOpen,
    projectId,
    projectName,
    currentDescription,
    onClose,
    onSave,
  }: ProjectDescriptionModalProps) {
    const [description, setDescription] = useState(currentDescription || "");

    useEffect(() => {
      setDescription(currentDescription || "");
    }, [currentDescription, isOpen]);

    if (!isOpen) return null;

    const handleSave = () => {
      onSave(description.trim());
      onClose();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    return (
      <div className={styles.overlay} onClick={onClose}>
        <div
          className={styles.modal}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={handleKeyDown}
        >
          <div className={styles.header}>
            <h3 className={styles.title}>Edit Project Description</h3>
            <p className={styles.subtitle}>{projectName}</p>
          </div>

          <div className={styles.content}>
            <textarea
              className={styles.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter project description..."
              rows={6}
              autoFocus
            />
          </div>

          <div className={styles.footer}>
            <button className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <button className={styles.saveButton} onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }
