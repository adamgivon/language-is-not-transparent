"use client";

import React, { useState, useEffect, useRef } from "react"; // changed code
import { Plus, Edit2, Trash2, Check, X, FileText } from "lucide-react";
import styles from "./SessionListPane.module.css";
import SessionNotesModal from "./SessionNotesModal";

type Session = {
  // changed code
  id: string;
  name: string;
  projectId: string;
  notes?: string | null;
};

interface SessionListPaneProps {
  // changed code
  projectId: string | null; // changed code
  sessions: Session[]; // changed code
  activeSessionId: string | null; // changed code
  onSelectSession: (sessionId: string) => void; // changed code
  onNewChat: (projectId: string) => void; // changed code
  onRenameSession?: (id: string, name: string) => void; // new code
  onDeleteSession?: (id: string) => void;
  isOpen?: boolean; // new code
  onCollapse?: () => void; // new code
  onExpand?: () => void; // new code
}

export default function SessionListPane({
  // changed code
  projectId,
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onRenameSession,
  onDeleteSession,
  isOpen = true,
  onCollapse, // new code
  onExpand, // new code
}: SessionListPaneProps) {
  // local state only for rename UX
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    sessionId: string;
  } | null>(null);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [editingNotesSession, setEditingNotesSession] =
    useState<Session | null>(null);
  const [deletingSessionId, setDeletingSessionId] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (editingSessionId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingSessionId]);

  const handleStartRename = (session: Session) => {
    setEditingSessionId(session.id);
    setEditingName(session.name);
  };

  const handleSaveRename = async () => {
    if (!editingSessionId || !editingName.trim()) return;
    try {
      const res = await fetch(`/api/sessions/${editingSessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editingName.trim() }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to rename session");
      }
      onRenameSession?.(editingSessionId, editingName.trim());
      setEditingSessionId(null);
      setEditingName("");
    } catch (err: any) {
      alert(err.message);
      console.error("Error renaming session:", err);
    }
  };

  const handleCancelRename = () => {
    // changed code
    setEditingSessionId(null);
    setEditingName("");
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (deletingSessionId) return; //new - prevent concurrent deletions
    if (
      !confirm(
        "Are you sure you want to delete this session? This cannot be undone."
      )
    )
      return;

    setDeletingSessionId(sessionId); //new - mark deletion started

    try {
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete session");
      }
      onDeleteSession?.(sessionId);
    } catch (err: any) {
      alert(err.message);
      console.error("Error deleting session:", err);
    } finally {
      setDeletingSessionId(null); //new - reset deletion state
    }
  };

  const handleUpdateNotes = async (notes: string) => {
    if (!editingNotesSession) return;

    try {
      const response = await fetch(`/api/sessions/${editingNotesSession.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });

      if (!response.ok) throw new Error("Failed to update notes");

      // Optionally trigger a refresh callback here if needed
      alert("Notes updated successfully");
    } catch (err) {
      console.error("Error updating notes:", err);
      alert("Failed to update session notes");
    }
  };

  //new - handler for context menu
  const handleContextMenu = (e: React.MouseEvent, session: Session) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, sessionId: session.id });
  };

  //new - handler for closing context menu
  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  //new - useEffect to close context menu on click
  useEffect(() => {
    if (contextMenu) {
      document.addEventListener("click", handleCloseContextMenu);
      return () =>
        document.removeEventListener("click", handleCloseContextMenu);
    }
  }, [contextMenu]);

  if (!isOpen) {
    return (
      <div className={styles.collapsedStub}>
        {" "}
        {/* new code */}
        <button
          className={styles.toggleButton}
          onClick={() => onExpand?.()}
          title="Expand sessions"
          aria-label="Expand sessions"
        >
          ›
        </button>{" "}
        {/* new code */}
      </div>
    );
  }

  if (!projectId) {
    return (
      <div className={styles.container}>
        <button
          className={styles.toggleButton}
          onClick={() => onCollapse?.()}
          title="Collapse sessions"
          aria-label="Collapse sessions"
        >
          ‹
        </button>{" "}
        {/* new code */}
        <div className={styles.emptyState}>
          Select a project to view sessions
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {" "}
      {/* changed code */}
      <button
        className={styles.toggleButton}
        onClick={() => onCollapse?.()}
        title="Collapse sessions"
        aria-label="Collapse sessions"
      >
        ‹
      </button>
      <div className={styles.header}>
        <h3 className={styles.title}>Sessions</h3>
        <button
          onClick={() => projectId && onNewChat(projectId)} // changed code
          className={styles.newButton}
          title="New Session"
          disabled={!projectId}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div className={styles.sessionList}>
        {" "}
        {/* changed code */}
        {sessions.map((session) => (
          <div
            key={session.id}
            className={`${styles.sessionItem} ${
              activeSessionId === session.id ? styles.sessionItemActive : ""
            }`}
            onContextMenu={(e) => handleContextMenu(e, session)}
          >
            {editingSessionId === session.id ? (
              <div className={styles.editMode}>
                <input
                  ref={editInputRef}
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveRename();
                    if (e.key === "Escape") handleCancelRename();
                  }}
                  className={styles.input}
                />
                <div className={styles.editActions}>
                  <button
                    onClick={handleSaveRename}
                    className={styles.iconButton}
                    title="Save"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleCancelRename}
                    className={styles.iconButton}
                    title="Cancel"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div
                  className={styles.sessionContent}
                  onClick={() => onSelectSession(session.id)}
                >
                  <div className={styles.sessionName}>{session.name}</div>
                  {/* removed project badge */} {/* changed code */}
                </div>
                <div className={styles.sessionActions}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartRename(session);
                    }}
                    className={styles.iconButton}
                    title="Rename"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSession(session.id);
                    }}
                    className={`${styles.iconButton} ${styles.dangerButton}`}
                    title="Delete"
                    disabled={deletingSessionId !== null} //new - disable when any deletion in progress
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
        {sessions.length === 0 && (
          <div className={styles.emptyState}>
            No sessions yet. Create one to get started.
          </div>
        )}
      </div>
      {contextMenu && (
        <div
          className={styles.contextMenu}
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button
            onClick={() => {
              const session = sessions.find(
                (s) => s.id === contextMenu.sessionId
              );
              setEditingNotesSession(session || null);
              setShowNotesModal(true);
              handleCloseContextMenu();
            }}
            className={styles.contextMenuItem}
          >
            <FileText className="w-4 h-4" />
            Session notes
          </button>
        </div>
      )}
      {/* new - Session Notes Modal */}
      {editingNotesSession && (
        <SessionNotesModal
          isOpen={showNotesModal}
          sessionId={editingNotesSession.id}
          sessionName={editingNotesSession.name}
          currentNotes={editingNotesSession.notes ?? null}
          onClose={() => {
            setShowNotesModal(false);
            setEditingNotesSession(null);
          }}
          onSave={handleUpdateNotes}
        />
      )}
    </div>
  );
}
