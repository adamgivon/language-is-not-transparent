"use client";

import { useState, useEffect } from "react";
import ProjectSidebar from "@/components/ProjectSidebar";
import SessionListPane from "@/components/SessionListPane";
import ChatView from "@/components/ChatView";
import RightControls, { type Toggles } from "@/components/RightControls";
import SessionConfigModal from "@/components/SessionConfigModal"; // new code - import modal
import SessionConfigDisplay from "@/components/SessionConfigDisplay"; // new code - import display
import type { AnchoringConfig } from "@/types/anchoring_config"; // new code - import type
import {
  extractTextFromContentJson,
  extractTextFromResponse,
} from "@/lib/utils/contentExtraction";

export type Project = {
  id: string;
  name: string;
};

export type Session = {
  id: string;
  name: string;
  projectId: string;
  anchoringConfig?: any;
  notes?: string | null;
};

export type Message = {
  role: string;
  content: string;
};

export default function Page() {
  // Project & Session state
  const [projects, setProjects] = useState<Project[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [projectsRefreshKey, setProjectsRefreshKey] = useState(0);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  // Message state
  const [sessionMessages, setSessionMessages] = useState<
    Record<string, Message[]>
  >({});

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [isSessionPaneOpen, setIsSessionPaneOpen] = useState(false);
  const [isProjectSidebarOpen, setIsProjectSidebarOpen] = useState(true);
  const [showConfigModal, setShowConfigModal] = useState(false); // new code - modal visibility
  const [pendingProjectId, setPendingProjectId] = useState<string | null>(null); // new code - which project
  const [projectDefaultConfig, setProjectDefaultConfig] =
    useState<AnchoringConfig | null>(null); // new code - default config
  const [showConfigDisplay, setShowConfigDisplay] = useState(false); // new code - display modal

  // Model toggles
  const [toggles, setToggles] = useState<Toggles>({
    model: "gpt-5.2-2025-12-11",
    mode: "anchored",
    store: true,
    stream: false,
    temperature: 1,
    top_p: 1.0,
    max_output_tokens: 3500,
    presence_penalty: 0,
    frequency_penalty: 0,
    reasoning_effort: null,
    systemPromptDraft: "",
  });

  // Load sessions when project changes
  useEffect(() => {
    const loadSessions = async () => {
      if (!activeProjectId) {
        setSessions([]);
        return;
      }
      try {
        const res = await fetch(`/api/sessions?projectId=${activeProjectId}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch sessions");
        const data = await res.json();
        setSessions(data);
      } catch (err) {
        console.error("Error loading sessions:", err);
        setSessions([]);
      }
    };
    loadSessions();
  }, [activeProjectId]);

  // Load and restore session parameters when session changes
  useEffect(() => {
    const loadSessionParameters = async () => {
      if (!activeSessionId) return;

      try {
        // Fetch the last RequestSnapshot for this session
        const res = await fetch(`/api/sessions/${activeSessionId}/parameters`, {
          cache: "no-store",
        });

        if (!res.ok) {
          // No parameters found, keep current toggles
          return;
        }

        const params = await res.json();

        // Update toggles with session's last-used parameters
        setToggles((prev) => ({
          ...prev,
          model: params.model || prev.model,
          temperature: params.temperature ?? prev.temperature,
          top_p: params.topP ?? prev.top_p,
          max_output_tokens: params.maxOutputTokens ?? prev.max_output_tokens,
          presence_penalty: params.presencePenalty ?? prev.presence_penalty,
          frequency_penalty: params.frequencyPenalty ?? prev.frequency_penalty,
          mode: params.mode || prev.mode,
          store: params.store ?? prev.store,
          stream: params.stream ?? prev.stream,
          reasoning_effort: params.reasoningEffort ?? prev.reasoning_effort,
        }));
      } catch (err) {
        console.error("Error loading session parameters:", err);
        // Keep current toggles on error
      }
    };

    loadSessionParameters();
  }, [activeSessionId]);

  // ============================================================================
  // PROJECT HANDLERS
  // ============================================================================

  const handleSelectProject = (id: string) => {
    setActiveProjectId(id);
    setActiveSessionId(null);
    setIsSessionPaneOpen(true);
  };

  // ============================================================================
  // SESSION HANDLERS
  // ============================================================================

  const handleNewChat = async (projectId: string) => {
    try {
      // Check if project is initialized
      const projectRes = await fetch(`/api/projects/${projectId}`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });

      if (!projectRes.ok) {
        throw new Error("Failed to fetch project");
      }

      const { project } = await projectRes.json();

      // Verify project has required indexes
      if (
        !project.anchorIndexId ||
        !project.promptIndexId ||
        !project.responseIndexId
      ) {
        throw new Error(
          "Project not initialized. Please initialize indexes first."
        );
      }

      // Use first session's config as default (sessions are sorted by createdAt asc)
      const defaultConfig = project.defaultAnchoringConfig || null;

      setProjectDefaultConfig(defaultConfig);
      setPendingProjectId(projectId);
      setShowConfigModal(true);
    } catch (err: any) {
      alert("Failed to prepare session: " + err.message);
      console.error("Session preparation error:", err);
    }
  };

  // new code - handle config submission from modal
  const handleConfigSubmit = async (config: AnchoringConfig) => {
    if (!pendingProjectId) return;

    try {
      // Create session with unique name
      let sessionName = "Session";
      let counter = 1;
      const existingNames = sessions.map((s) => s.name);

      while (existingNames.includes(sessionName)) {
        counter++;
        sessionName = `Session ${counter}`;
      }

      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: pendingProjectId,
          name: sessionName,
          anchoringConfig: config, // new code - include config
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create session");
      }

      const session = await res.json();

      // Refresh session list
      const listRes = await fetch(
        `/api/sessions?projectId=${pendingProjectId}`,
        {
          cache: "no-store",
        }
      );
      const list = listRes.ok ? await listRes.json() : [];
      setSessions(list);

      // Set active session
      setActiveSessionId(session.id);
      setProjectsRefreshKey((k) => k + 1);
      setSessionMessages((prev) => ({ ...prev, [session.id]: [] }));
      setIsSessionPaneOpen(false); // Close pane to show chat
      // new code - close modal and clear state
      setShowConfigModal(false);
      setPendingProjectId(null);
      setProjectDefaultConfig(null);
    } catch (err: any) {
      alert("Failed to create session: " + err.message);
      console.error("Session creation error:", err);
    }
  };

  // new code - handle modal cancel
  const handleConfigCancel = () => {
    setShowConfigModal(false);
    setPendingProjectId(null);
    setProjectDefaultConfig(null);
  };

  // new code - handle showing config display
  const handleShowConfig = () => {
    setShowConfigDisplay(true);
  };

  // new code - handle closing config display
  const handleCloseConfigDisplay = () => {
    setShowConfigDisplay(false);
  };

  const handleSelectSession = async (id: string) => {
    if (!id) return;

    setActiveSessionId(id);
    setIsLoading(true);

    try {
      // Fetch items for this session
      // const res = await fetch(`/api/sessions/${id}/items`, {
      //   cache: "no-store",
      // });

      const res = await fetch(`/api/sessions/${id}`, { cache: "no-store" });

      if (!res.ok) {
        if (res.status === 404) {
          setActiveSessionId(null);
          return;
        }
        throw new Error("Failed to load session items");
      }

      //const items = await res.json();
      const { items = [] } = await res.json();

      // Transform Items to Messages (role + content only)
      const messages: Message[] = items.map((item: any) => ({
        role: item.role.toLowerCase(), // "USER" → "user", "ASSISTANT" → "assistant"
        content: extractTextFromContentJson(item.contentJson),
      }));

      setSessionMessages((prev) => ({
        ...prev,
        [id]: messages,
      }));

      setIsSessionPaneOpen(false); // Close pane to show chat
    } catch (err: any) {
      console.error("Error loading session:", err);
      alert("Failed to load session: " + err.message);
      setSessionMessages((prev) => ({ ...prev, [id]: [] }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (activeSessionId === id) {
      setActiveSessionId(null);
      setSessionMessages((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }
    setProjectsRefreshKey((k) => k + 1);
  };

  const handleRenameSession = (id: string, newName: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, name: newName } : s))
    );
  };

  // ============================================================================
  // MESSAGE HANDLERS
  // ============================================================================

  const handleSendMessage = async (userInput: string) => {
    const callId = Date.now(); // ← ADD: unique call identifier                                                                                                                              
    console.log(`[${callId}] handleSendMessage START`, { userInput, activeSessionId, isLoading }); // ← ADD   
    if (!userInput.trim() || !activeSessionId || !activeProjectId) {
      console.warn("Cannot send: missing input, session, or project");
      return;
    }

    setIsLoading(true);
    const turnId = crypto.randomUUID();
    console.log(`[${callId}] turnId generated:`, turnId); // ← ADD  

    try {
      // Optimistic UI update - show user message immediately
      const userMessage: Message = {
        role: "user",
        content: userInput.trim(),
      };

      setSessionMessages((prev) => ({
        ...prev,
        [activeSessionId]: [...(prev[activeSessionId] || []), userMessage],
      }));

      let instructionsString = "";

      // === PHASE 1: Prepare USER turn (always, mode determines behavior) ===
      const phase1Res = await fetch("/api/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: activeProjectId,
          sessionId: activeSessionId,
          turnId,
          userText: userInput.trim(),
          mode: toggles.mode, // ✅ Pass mode to API
        }),
      });

      if (!phase1Res.ok) {
        const error = await phase1Res.json();
        throw new Error(error.error || "Failed to prepare prompt");
      }
      const phase1Data = await phase1Res.json();
      instructionsString = phase1Data.instructionsString || ""; // Empty in control mode
      console.log(`[${callId}] Phase 1 complete, starting Phase 2`); // ← ADD  

      // === PHASE 2: Generate ASSISTANT response ===
      console.log(
        "DEBUG Phase 2: instructionsString =",
        JSON.stringify(instructionsString),
        "type:",
        typeof instructionsString
      );
      const phase2Res = await fetch("/api/sendMessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: activeProjectId,
          sessionId: activeSessionId,
          turnId,
          userText: userInput.trim(),
          instructionsString, // Empty string for control mode

          // Model parameters from RightControls
          model: toggles.model,
          temperature: toggles.temperature,
          top_p: toggles.top_p,
          max_output_tokens: toggles.max_output_tokens,
          presence_penalty: toggles.presence_penalty,
          frequency_penalty: toggles.frequency_penalty,
          reasoning_effort: toggles.reasoning_effort,
          store: toggles.store,
          stream: toggles.stream,
        }),
      }); 
      if (!phase2Res.ok) {
        const error = await phase2Res.json();
        throw new Error(error.error || "Failed to get assistant response");
      }

      const responseData = await phase2Res.json();
      console.log(`[${callId}] Phase 2 complete`); // ← ADD 

      // Extract text from response
      const assistantText = extractTextFromResponse(responseData);

      // Add assistant message to UI
      const assistantMessage: Message = {
        role: "assistant",
        content: assistantText,
      };

      setSessionMessages((prev) => ({
        ...prev,
        [activeSessionId]: [...prev[activeSessionId], assistantMessage],
      }));
    } catch (err: any) {
      console.error("Send message error:", err);
      alert("Failed to send message: " + err.message);

      // Remove optimistic user message on error
      setSessionMessages((prev) => ({
        ...prev,
        [activeSessionId]: (prev[activeSessionId] || []).slice(0, -1),
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <main style={{ display: "flex", height: "100vh" }}>
      <ProjectSidebar
        onProjectSelect={handleSelectProject}
        selectedProjectId={activeProjectId}
        refreshKey={projectsRefreshKey}
        isOpen={isProjectSidebarOpen}
        onCollapse={() => setIsProjectSidebarOpen(false)}
        onExpand={() => setIsProjectSidebarOpen(true)}
      />
      <SessionListPane
        projectId={activeProjectId}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        onRenameSession={handleRenameSession}
        onDeleteSession={handleDeleteSession}
        isOpen={isSessionPaneOpen}
        onCollapse={() => setIsSessionPaneOpen(false)}
        onExpand={() => setIsSessionPaneOpen(true)}
      />
      <ChatView
        messages={activeSessionId ? sessionMessages[activeSessionId] ?? [] : []}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
        disabled={!activeSessionId || isLoading}
        sessionId={activeSessionId} // new code - pass session ID
        sessionName={sessions.find((s) => s.id === activeSessionId)?.name}
        onShowConfig={handleShowConfig} // new code - pass handler
      />
      <RightControls value={toggles} onChange={setToggles} />

      {/* new code - config modal */}
      {showConfigModal && pendingProjectId && (
        <SessionConfigModal
          projectId={pendingProjectId}
          defaultConfig={projectDefaultConfig}
          onSubmit={handleConfigSubmit}
          onCancel={handleConfigCancel}
        />
      )}

      {/* new code - config display modal */}
      {showConfigDisplay && activeSessionId && (
        <SessionConfigDisplay
          sessionId={activeSessionId}
          onClose={handleCloseConfigDisplay}
        />
      )}
    </main>
  );
}
