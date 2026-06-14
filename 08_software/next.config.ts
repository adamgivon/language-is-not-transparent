import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  serverExternalPackages: ['faiss-node'],
  env: {
    FAISS_DIR: process.env.FAISS_DIR,
    OPENAI_EMBED_MODEL: process.env.OPENAI_EMBED_MODEL,
    OPENAI_EMBED_DIM: process.env.OPENAI_EMBED_DIM,
    OPENAI_RESPONSE_MODEL: process.env.OPENAI_RESPONSE_MODEL,
  },
};

export default nextConfig;
