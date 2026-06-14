// app/layout.tsx
import "../styles/globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Responses UI",
  description: "Interface for OpenAI Responses API",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
