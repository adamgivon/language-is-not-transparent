"use client";

import { useEffect, useRef } from "react";
import { Settings } from "lucide-react"; 
import styles from "./ChatView.module.css";
import MessageBubble from "./MessageBubble";
import PromptInput from "./PromptInput";

interface Message {
  role: string;
  content: string;
}

interface Props {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
  disabled?: boolean;
  sessionId?: string | null;
  sessionName?: string;
  onShowConfig?: () => void;
}

export default function ChatView({
  messages,
  isLoading,
  onSendMessage,
  disabled = false,
  sessionId,
  sessionName,
  onShowConfig,
}: Props) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <section className={styles.container}>
      {/* new code - header with config button */}
      {sessionId && (
        <div className={styles.header}>
          <div className={styles.headerTitle}>{sessionName || "Chat"}</div>
          <button
            className={styles.configButton}
            onClick={onShowConfig}
            title="View session configuration"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      )}

      <div ref={scrollRef} className={styles.messages}>
        {messages.map((m, i) => (
          <MessageBubble key={i} role={m.role} content={m.content} />
        ))}
      </div>
      <div className={styles.inputContainer}>
        <PromptInput
          onSend={onSendMessage}
          disabled={disabled}
          sessionId={sessionId}
        />
      </div>
    </section>
  );
}
