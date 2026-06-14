// >>> BEGIN FILE: components/RightControls.tsx
import React from "react";
import styles from "./RightControls.module.css";

export type Toggles = {
  model: string;
  mode: "anchored" | "control";
  store: boolean;
  stream: boolean;
  temperature: number | null;
  top_p: number | null;
  max_output_tokens: number | null;
  presence_penalty: number | null;
  frequency_penalty: number | null;
  reasoning_effort: "low" | "medium" | "high" | null;
  systemPromptDraft: string;
};

type Props = {
  value: Toggles;
  onChange: (next: Toggles) => void;
};

export default function RightControls({ value, onChange }: Props) {
  const set = <K extends keyof Toggles>(k: K, v: Toggles[K]) =>
    onChange({ ...value, [k]: v });

  return (
    <aside className={styles.rightControls}>
      <div className={styles.section}>
        <h3>Run Mode</h3>
        <label className={styles.row}>
          <input
            type="radio"
            name="mode"
            checked={value.mode === "anchored"}
            onChange={() => set("mode", "anchored")}
          />
          <span>Anchored</span>
        </label>
        <label className={styles.row}>
          <input
            type="radio"
            name="mode"
            checked={value.mode === "control"}
            onChange={() => set("mode", "control")}
          />
          <span>Control (no anchors)</span>
        </label>
      </div>

      <div className={styles.section}>
        <h3>Model</h3>
        <input
          className={styles.input}
          value={value.model}
          onChange={(e) => set("model", e.target.value)}
          placeholder="e.g., gpt-5-thinking"
        />
      </div>

      <div className={`${styles.section} ${styles.grid2}`}>
        <label>
          <div className={styles.label}>Temperature</div>
          <input
            className={styles.input}
            type="number"
            step="0.1"
            min="0"
            max="2"
            value={value.temperature ?? ""}
            onChange={(e) =>
              set("temperature", e.target.value === "" ? null : Number(e.target.value))
            }
          />
        </label>
        <label>
          <div className={styles.label}>Top-p</div>
          <input
            className={styles.input}
            type="number"
            step="0.05"
            min="0"
            max="1"
            value={value.top_p ?? ""}
            onChange={(e) =>
              set("top_p", e.target.value === "" ? null : Number(e.target.value))
            }
          />
        </label>
        <label>
          <div className={styles.label}>Max output</div>
          <input
            className={styles.input}
            type="number"
            step="1"
            min="1"
            value={value.max_output_tokens ?? ""}
            onChange={(e) =>
              set(
                "max_output_tokens",
                e.target.value === "" ? null : Number(e.target.value)
              )
            }
          />
        </label>
        <label>
          <div className={styles.label}>Presence</div>
          <input
            className={styles.input}
            type="number"
            step="0.1"
            min="-2"
            max="2"
            value={value.presence_penalty ?? ""}
            onChange={(e) =>
              set(
                "presence_penalty",
                e.target.value === "" ? null : Number(e.target.value)
              )
            }
          />
        </label>
        <label>
          <div className={styles.label}>Frequency</div>
          <input
            className={styles.input}
            type="number"
            step="0.1"
            min="-2"
            max="2"
            value={value.frequency_penalty ?? ""}
            onChange={(e) =>
              set(
                "frequency_penalty",
                e.target.value === "" ? null : Number(e.target.value)
              )
            }
          />
        </label>
      </div>

      <div className={styles.section}>
        <h3>Reasoning</h3>
        <select
          className={styles.input}
          value={value.reasoning_effort ?? ""}
          onChange={(e) =>
            set(
              "reasoning_effort",
              (e.target.value || null) as Toggles["reasoning_effort"]
            )
          }
        >
          <option value="">(none)</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className={`${styles.section} ${styles.grid2}`}>
        <label className={styles.row}>
          <input
            type="checkbox"
            checked={value.store}
            onChange={(e) => set("store", e.target.checked)}
          />
          <span>Store</span>
        </label>
        <label className={styles.row}>
          <input
            type="checkbox"
            checked={value.stream}
            onChange={(e) => set("stream", e.target.checked)}
          />
          <span>Stream</span>
        </label>
      </div>

      <div className={styles.section}>
        <h3>System Prompt (debug)</h3>
        <textarea
          className={styles.textarea}
          rows={8}
          value={value.systemPromptDraft}
          onChange={(e) => set("systemPromptDraft", e.target.value)}
          placeholder="Optional scratch area (not wired yet)"
        />
      </div>
    </aside>
  );
}
// <<< END FILE
