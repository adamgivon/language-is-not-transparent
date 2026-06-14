// // components/MessageBubble.tsx
// import CopyBadge from "./CopyBadge";

// export default function MessageBubble({
//   role,
//   text,
//   content,
// }: {
//   role: "user" | "assistant";
//   text?: string;
//   content?: string;
// }) {
//   const isUser = role === "user";
//   const body = (text ?? content ?? "").toString();

//   if (!body) return null;

//   return (
//     <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
//       <div
//         className={`relative max-w-lg rounded-md px-3 py-2 shadow-sm ${
//           isUser ? "bg-blue-100" : "bg-gray-200"
//         }`}
//       >
//         <p className="text-xs whitespace-pre-wrap">{body}</p>
//         <div className="absolute top-1 right-1">
//           <CopyBadge text={body} />
//         </div>
//       </div>
//     </div>
//   );
// }
// >>> BEGIN FILE: components/MessageBubble.tsx
"use client";

import CopyBadge from "./CopyBadge";
import styles from "./MessageBubble.module.css";

export default function MessageBubble({
  role,
  content,
}: {
  role: string;
  content: string;
}) {
  const isUser = role === "user";
  const body = (content ?? "").toString();

  if (!body) return null;

  return (
    <div
      className={`${styles.wrapper} ${
        isUser ? styles.userWrapper : styles.assistantWrapper
      }`}
    >
      <div
        className={`${styles.bubble} ${
          isUser ? styles.userBubble : styles.assistantBubble
        }`}
      >
        <div className={styles.roleLabel}>
             {"\n" + (isUser ? "**User:**" : "**Assistant:**")}
          </div>
          <p className={styles.text}>{body}</p>
          <div className={styles.copy}>
          <CopyBadge text={body} />
        </div>
      </div>
    </div>
  );
}
// <<< END FILE
