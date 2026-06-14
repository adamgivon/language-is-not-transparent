"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./NewProjectModal.module.css";

interface Props {
  onCreate: (name: string) => void;
  onCancel: () => void;
}

export default function NewProjectModal({ onCreate, onCancel }: Props) {
  const [name, setName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onCreate(name);
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <div className={styles.backdrop} onKeyDown={handleKeyDown} tabIndex={-1}>
      <div className={styles.modal}>
        <div className={styles.title}>New Project</div>
        <input
          ref={inputRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
          placeholder="Enter project name"
          onKeyDown={handleKeyDown}
        />
        <div className={styles.actions}>
          <button
            className={`${styles.button} ${styles.buttonSecondary}`}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className={`${styles.button} ${styles.buttonPrimary}`} // changed line
            onClick={() => {
              // changed line
              if (name.trim()) {
                // new line
                onCreate(name.trim()); // changed line
                setName(""); // new line: reset input
              }
            }}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
// <<< END FILE: components/NewProjectModal.tsx
