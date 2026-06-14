// services/mcp/vector.ts
// ============================================================
// Anchoring Experiment - MCP-VECTOR Service
// Project-scoped + version-aware FAISS management
// ============================================================

import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import OpenAI from "openai";
import { IndexFlatIP } from "faiss-node";
import { prisma } from "../../lib/db/logs";
import { runFaissOp } from "./faissQueue";

function getOpenAI(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY not set");
  }
  return new OpenAI({ apiKey });
}

function getFAISSDir(): string {
  return process.env.FAISS_DIR ?? path.resolve(process.cwd(), "lib", "faiss");
}

function getModel(): string {
  return process.env.OPENAI_EMBED_MODEL ?? "text-embedding-3-large";
}

function getDim(): number {
  return Number(process.env.OPENAI_EMBED_DIM ?? 3072);
}

// === types ==================================================
export type IndexName = "anchors" | "prompts" | "responses";
export type EmbedResult = {
  vectorId: string;
  dim: number;
  vector: Float32Array;
};
export type SearchResult = { id: string; score: number };

// === path helpers (project-scoped + version-aware) ===========
const ensureDir = async (p: string) => fsp.mkdir(p, { recursive: true });

// example indexId: "anchors_v3_3072"
function idxPath(projectId: string, indexId: string) {
  return path.join(getFAISSDir(), projectId, `${indexId}.faiss`);
}

function mapPath(projectId: string, indexName: string) {
  return path.join(getFAISSDir(), projectId, "maps", `${indexName}.map.json`);
}

function vecPath(projectId: string, indexName: string, vectorId: string) {
  return path.join(
    getFAISSDir(),
    projectId,
    "vectors",
    indexName,
    `${vectorId}.f32`
  );
}

// --- ID map helpers (persisted per project + indexName) ---------------------
async function readIdMap(
  projectId: string,
  indexName: IndexName
): Promise<Record<string, string>> {
  const p = mapPath(projectId, indexName);
  if (!fs.existsSync(p)) return {};
  return JSON.parse(await fsp.readFile(p, "utf8")) as Record<string, string>;
}

async function writeIdMap(
  projectId: string,
  indexName: IndexName,
  map: Record<string, string>
) {
  await ensureDir(path.dirname(mapPath(projectId, indexName)));
  await writeFileAtomic(
    mapPath(projectId, indexName),
    Buffer.from(JSON.stringify(map, null, 2), "utf8")
  );
}

// === vector math =============================================
function l2Normalize(vec: number[] | Float32Array): Float32Array {
  let s = 0;
  for (let i = 0; i < vec.length; i++) s += vec[i] * vec[i];
  const inv = s > 0 ? 1 / Math.sqrt(s) : 1;
  const out = new Float32Array(vec.length);
  for (let i = 0; i < vec.length; i++) out[i] = vec[i] * inv;
  return out;
}

function cosine(a: Float32Array, b: Float32Array): number {
  let dot = 0,
    na = 0,
    nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return na && nb ? dot / (Math.sqrt(na) * Math.sqrt(nb)) : 0;
}

// === I/O utils ===============================================
async function writeFileAtomic(targetPath: string, data: Buffer | string) {
  // new code
  const tmp = targetPath + ".tmp"; // new code
  await fsp.writeFile(tmp, data); // new code
  await fsp.rename(tmp, targetPath); // new code
}

async function writeIndexAtomic(index: IndexFlatIP, filePath: string) {
  const tmp = filePath + ".tmp"; // new code
  index.write(tmp); // new code
  await fsp.rename(tmp, filePath); // new code
}

async function writeF32(f: string, v: Float32Array) {
  await ensureDir(path.dirname(f));
  // await fsp.writeFile(f, Buffer.from(v.buffer));
  await writeFileAtomic(f, Buffer.from(v.buffer));
}

async function readF32(f: string, dim: number) {
  const buf = await fsp.readFile(f);
  return new Float32Array(buf.buffer, buf.byteOffset, dim);
}

// === helpers for DB meta append ===============================
async function appendVectorMetaToDB(
  itemId: string,
  name: IndexName,
  vectorId: string,
  extra?: object
) {
  if (!itemId) return;
  const existing = await prisma.item.findUnique({
    where: { id: itemId },
    select: { meta: true },
  });

  if (!existing) return;

  const currentMeta = (existing?.meta ?? {}) as Record<string, any>;
  const faissEntry = {
    index: name,
    vectorId,
    timestamp: new Date().toISOString(),
    ...extra,
  };

  await prisma.item.update({
    where: { id: itemId },
    data: {
      meta: { ...currentMeta, faiss: faissEntry },
    },
  });
}

// === lifecycle ===============================================
export async function resetIndex(
    projectId: string,
    indexName: IndexName
  ): Promise<string> {
    return runFaissOp(projectId, async () => {
      const DIM = getDim();
      const projectDir = path.join(getFAISSDir(), projectId);
      await ensureDir(projectDir);
      await ensureDir(path.join(projectDir, "maps"));
      await ensureDir(path.join(projectDir, "vectors"));

      // Find and DELETE old versions before creating new one
      const files = await fs.promises.readdir(projectDir);
      const oldVersions = files.filter((f) => f.startsWith(indexName + "_v"));

      // Delete old index files
      for (const oldFile of oldVersions) {
        const oldPath = path.join(projectDir, oldFile);
        try {
          await fsp.unlink(oldPath);
          console.log(`Deleted old index: ${oldFile}`);
        } catch (err) {
          console.warn(`Failed to delete ${oldFile}:`, err);
        }
      }

      // Create new version starting from v1
      const newVersion = 1;
      const indexId = `${indexName}_v${newVersion}_${DIM}`;
      const filePath = idxPath(projectId, indexId);

      const index = new IndexFlatIP(DIM);
      await writeIndexAtomic(index, filePath);
      return indexId;
    });
  }



export async function switchActiveIndex(
  sessionId: string,
  indexName: IndexName,
  indexId: string
): Promise<void> {
  const data: any = {};
  // Updates session pointer in DB
  if (indexName === "anchors") data.faissAnchorsIndexId = indexId;
  if (indexName === "prompts") data.faissPromptsIndexId = indexId;
  if (indexName === "responses") data.faissResponsesIndexId = indexId;
  await prisma.session.update({ where: { id: sessionId }, data });
}

export async function getIndexMeta(projectId: string, indexId: string) {
  const filePath = idxPath(projectId, indexId);
  const stats = await fs.promises.stat(filePath);
  const index = IndexFlatIP.read(filePath);
  return {
    indexId,
    dim: getDim(),
    ntotal: index.ntotal(),
    updatedAt: stats.mtime,
  };
}

// === main class ==============================================
export class MCPVectorService {
  async init(): Promise<void> {
    await ensureDir(getFAISSDir());
  }

  async embed(text: string): Promise<EmbedResult> {
    if (!text || text.trim().length === 0)
      throw new Error("embed(): input text cannot be empty.");

    const MODEL = getModel();
    const openai = getOpenAI();
    const res = await openai.embeddings.create({
      model: MODEL,
      input: text,
      encoding_format: "float",
    });

    const emb = res.data[0].embedding as number[];
    const vec = l2Normalize(emb);
    const vectorId = crypto
      .createHash("sha256")
      .update(`${MODEL}::${text}`)
      .digest("hex");

    return { vectorId, dim: vec.length, vector: vec };
  }

  async index(
    projectId: string,
    indexId: string,
    name: IndexName,
    vectorId: string,
    vector: Float32Array,
    meta?: Record<string, any>
  ): Promise<void> {
    return runFaissOp(projectId, async () => {
      const DIM = getDim();
      // adds vector to FAISS, label assigned sequentially via ntotal()
      const vec = l2Normalize(vector);
      const filePath = idxPath(projectId, indexId);
      const idx = fs.existsSync(filePath)
        ? IndexFlatIP.read(filePath)
        : new IndexFlatIP(DIM);
      const current = idx.ntotal();

      const arr = Array.from(vec);
      idx.add(arr);
      await writeIndexAtomic(idx, filePath);

      // persist id map: vectorId -> FAISS label (string of current)
      const idmap = await readIdMap(projectId, name);
      idmap[vectorId] = String(current);
      await writeIdMap(projectId, name, idmap);

      await writeF32(vecPath(projectId, name, vectorId), vec);
      if (meta?.itemId)
        await appendVectorMetaToDB(meta.itemId, name, vectorId, meta);
    });
  }

  async search(
    projectId: string,
    indexId: string,
    name: IndexName,
    query: Float32Array,
    topK: number
  ): Promise<SearchResult[]> {
    const filePath = idxPath(projectId, indexId);
    if (!fs.existsSync(filePath))
      throw new Error(`search(): FAISS index not found (${filePath})`);

    const idx = IndexFlatIP.read(filePath);
    const q = l2Normalize(query);
    const total = idx.ntotal();
    if (total === 0) return [];
    const k = Math.min(Math.max(1, topK), total);
    const res = idx.search(Array.from(q), k);

    // reverse map: label -> vectorId
    const idmap = await readIdMap(projectId, name);
    const rev = new Map<string, string>(
      Object.entries(idmap).map(([vid, lab]) => [lab, vid])
    );

    const out: SearchResult[] = [];
    for (let i = 0; i < res.labels.length; i++) {
      const labelStr = String(res.labels[i]);
      const vid = rev.get(labelStr);
      if (vid) out.push({ id: vid, score: res.distances[i] }); // changed code
    }
    return out;
  }

  async compare(
    projectId: string,
    aVectorId: string,
    bVectorId: string,
    aIndex?: IndexName,
    bIndex?: IndexName
  ): Promise<number> {
    const DIM = getDim();
    const tryRead = async (id: string, hint?: IndexName) => {
      const names: IndexName[] = hint
        ? [hint]
        : ["anchors", "prompts", "responses"];
      for (const n of names) {
        const p = vecPath(projectId, n, id);
        if (fs.existsSync(p)) return await readF32(p, DIM);
      }
      return null;
    };

    const a = await tryRead(aVectorId, aIndex);
    const b = await tryRead(bVectorId, bIndex);
    if (!a || !b)
      throw new Error(
        `compare(): missing vector(s). a=${aVectorId} (index=${aIndex}), b=${bVectorId} (index=${bIndex})`
      );

    return cosine(a, b);
  }

  async getVector(
    projectId: string,
    name: IndexName,
    vectorId: string
  ): Promise<Float32Array> {
    const DIM = getDim();
    const p = vecPath(projectId, name, vectorId);
    if (!fs.existsSync(p))
      throw new Error(
        `getVector(): vector not found ${projectId}/${name}/${vectorId}`
      );
    return readF32(p, DIM);
  }
}

// helper: rebuild index excluding specific FAISS labels
async function rebuildIndexExcluding(
  projectId: string,
  indexId: string,
  name: IndexName,
  excludeLabels: Set<string>
) {
  const DIM = getDim();
  const filePath = idxPath(projectId, indexId);
  if (!fs.existsSync(filePath)) return;

  const idx = IndexFlatIP.read(filePath);
  const total = idx.ntotal();

  const idmap = await readIdMap(projectId, name);
  const rev = new Map<string, string>(
    Object.entries(idmap).map(([vid, lab]) => [lab, vid])
  );

  const newIndex = new IndexFlatIP(DIM);
  const newMap: Record<string, string> = {};
  let nextLabel = 0;

  for (let label = 0; label < total; label++) {
    const labelStr = String(label);
    if (excludeLabels.has(labelStr)) continue;
    const vid = rev.get(labelStr);
    if (!vid) continue;
    const vec = await readF32(vecPath(projectId, name, vid), DIM);
    newIndex.add(Array.from(vec));
    newMap[vid] = String(nextLabel++);
  }

  await writeIndexAtomic(newIndex, filePath);
  await writeIdMap(projectId, name, newMap);
}

export async function removeVectors(
  projectId: string,
  indexId: string,
  name: IndexName,
  vectorIds: string[]
): Promise<{ removed: string[] }> {
  return runFaissOp(projectId, async () => {
    const idmap = await readIdMap(projectId, name);
    const labelsToRemove = new Set<string>();
    const removed: string[] = [];

    for (const vid of vectorIds.filter(Boolean)) {
      const lab = idmap[vid];
      if (lab !== undefined) {
        labelsToRemove.add(String(lab));
        removed.push(vid);
        const p = vecPath(projectId, name, vid);
        if (fs.existsSync(p)) {
          try {
            await fsp.unlink(p);
          } catch {}
        }
      }
    }

    if (labelsToRemove.size === 0) return { removed };

    await rebuildIndexExcluding(projectId, indexId, name, labelsToRemove);
    return { removed };
  });
}

 // === cleanup utility =========================================
  export async function deleteProjectFaissDir(projectId: string): Promise<void> {
    const projectDir = path.join(getFAISSDir(), projectId);

    if (!fs.existsSync(projectDir)) {
      console.log(`FAISS directory does not exist for project ${projectId}, skipping cleanup`);
      return;
    }

    try {
      await fsp.rm(projectDir, { recursive: true, force: true });
      console.log(`Successfully deleted FAISS directory: ${projectDir}`);
    } catch (error: any) {
      console.error(`Error deleting FAISS directory ${projectDir}:`, error);
      throw new Error(`Failed to delete FAISS directory: ${error.message}`);
    }
  }

// === singleton accessor ======================================
let _svc: MCPVectorService | null = null;
export async function getMCPVector(): Promise<MCPVectorService> {
  if (_svc) return _svc;
  _svc = new MCPVectorService();
  await _svc.init();
  return _svc;
}
