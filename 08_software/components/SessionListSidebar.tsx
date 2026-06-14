// >>> BEGIN FILE: components/SessionListSidebar.tsx
"use client";

import { useState } from "react";
import styles from "./SessionListSidebar.module.css";

export type Session = {
  id: string;
  name: string;
  projectId: string;
};

interface Props {
  projectId: string | null;
  sessions: Session[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: (projectId: string) => void;
  onRenameSession: (id: string, name: string) => void;
  onClose?: () => void;
}

export default function SessionListSidebar({
  projectId,
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onRenameSession,
  onClose,
}: Props) {
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");

  const handleRename = (id: string, name: string) => {
    onRenameSession(id, name);
    setRenamingId(null);
    setDraftName("");
  };

  if (!projectId) {
    return <div className={styles.container}>Select a project first</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}> {/* NEW */}
        <div className={styles.header}>Sessions</div>
        <div>
          {onClose && (
            <button
              style={{ marginRight: 8, background: "transparent", border: "none", color: "#888", cursor: "pointer" }}
              onClick={onClose}
              title="Collapse"
            >
              ×
            </button>
          )}
          <button
            className={styles.newChatButton}
            onClick={() => onNewChat(projectId)}
          >
            + New Chat
          </button>
        </div>
      </div>

      <div className={styles.sessionList}>
        {sessions.length === 0 && (
          <div className={styles.header}>No sessions yet</div>
        )}
        {sessions.map((s) => (
          <div
            key={s.id}
            className={`${styles.sessionItem} ${s.id === activeSessionId ? styles.sessionItemActive : ""}`}
            onClick={() => onSelectSession(s.id)}
            onContextMenu={(e) => {
              e.preventDefault();
              setRenamingId(s.id);
              setDraftName(s.name);
            }}
          >
            {renamingId === s.id ? (
              <input
                autoFocus
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                onBlur={() => handleRename(s.id, draftName)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleRename(s.id, draftName);
                  }
                }}
                style={{
                  backgroundColor: "#1e1e1e",
                  color: "#eee",
                  border: "1px solid #555",
                  borderRadius: 4,
                  padding: "2px 6px",
                  fontSize: 13,
                }}
              />
            ) : (
              s.name
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
// <<< END FILE: components/SessionListSidebar.tsx
