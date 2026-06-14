"use client";

import { useState, useEffect } from "react";
import styles from "./SessionNotesModal.module.css";

interface SessionNotesModalProps {
  isOpen: boolean;
  sessionId: string;
  sessionName: string;
  currentNotes: string | null;
  onClose: () => void;
  onSave: (notes: string) => void;
}

export default function SessionNotesModal({
  isOpen,
  sessionId,
  sessionName,
  currentNotes,
  onClose,
  onSave,
}: SessionNotesModalProps) {
  const [notes, setNotes] = useState(currentNotes || "");

  useEffect(() => {
    setNotes(currentNotes || "");
  }, [currentNotes, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(notes.trim());
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
          <h3 className={styles.title}>Edit Session Notes</h3>
          <p className={styles.subtitle}>{sessionName}</p>
        </div>

        <div className={styles.content}>
          <textarea
            className={styles.textarea}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter session notes..."
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
