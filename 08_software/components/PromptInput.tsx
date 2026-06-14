"use client";

import UploadBadge from "./UploadBadge";
import CopyBadge from "./CopyBadge";
import { useState, useRef, useEffect } from "react";
import styles from "./PromptInput.module.css";

export default function PromptInput({
  onSend,
  disabled = false,
  sessionId, //new - add sessionId prop
}: {
  onSend: (text: string) => void;
  disabled?: boolean;
  sessionId?: string | null; //new - add sessionId type
}) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus when disabled changes from true to false (after response)
  useEffect(() => {
    if (!disabled && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [disabled]);

  useEffect(() => {
    setValue("");
  }, [sessionId]);

  // Auto-grow textarea based on content (max 4 lines)
  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to recalculate
      textareaRef.current.style.height = "auto";
      // Calculate height, max 4 lines (~20px per line + 8px padding = ~88px)
      const maxHeight = 88; // Exactly 4 lines
      const newHeight = Math.min(textareaRef.current.scrollHeight, maxHeight);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    console.log(`[KEYDOWN] key=${e.key}, shift=${e.shiftKey}, value="${value}"`); // ← ADD  
    if (e.key === "Enter" && !e.shiftKey) {
      console.log(`[KEYDOWN] Calling onSend`); // ← ADD  
      e.preventDefault(); // stop newline
      if (value.trim()) {
        onSend(value.trim());
        setValue("");
      }
    }
  };

  return (
    <div className={`${styles.container} ${disabled ? styles.disabled : ""}`}>
      <textarea
        ref={textareaRef}
        className={styles.textarea}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={disabled ? "Start a new chat first…" : "Say something…"}
        onKeyDown={handleKeyDown}
        rows={1}
        disabled={disabled}
      />
      <div className={styles.actions}>
        <UploadBadge />
        <CopyBadge onClick={() => navigator.clipboard.writeText(value)} />
      </div>
    </div>
  );
}
