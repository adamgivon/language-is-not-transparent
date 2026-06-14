// components/CopyBadge.tsx
"use client";
export default function CopyBadge({ text, onClick }: { text?: string; onClick?: () => void }) {
  return (
    <button
      className="text-gray-500 hover:text-gray-700"
      title="Copy text"
      onClick={() => {
        if (onClick) return onClick();
        if (text) navigator.clipboard.writeText(text);
      }}
    >
      📋
    </button>
  );
}
