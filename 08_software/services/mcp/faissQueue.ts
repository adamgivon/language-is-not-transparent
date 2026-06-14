// services/mcp/faissQueue.ts
// Per-process, per-project FAISS operation queue to serialize writes.

const lanes = new Map<string, Promise<unknown>>();

export async function runFaissOp<T>(
  projectId: string,
  fn: () => Promise<T>
): Promise<T> {
  const prev = lanes.get(projectId) ?? Promise.resolve();

  let advance!: () => void;
  let fail!: (e: unknown) => void;
  const gate = new Promise<void>((res, rej) => {
    advance = res;
    fail = rej;
  });

  // Chain this operation to the previous one for this project
  lanes.set(projectId, prev.finally(() => gate));

  try {
    const result = await prev.then(fn);
    advance();
    return result;
  } catch (e) {
    fail(e);
    throw e;
  } finally {
    // If nothing else is queued, clean up the lane
    if (lanes.get(projectId) === gate) lanes.delete(projectId);
  }
}
