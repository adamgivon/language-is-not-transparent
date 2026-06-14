# Changes Log — Publication Snapshot

Date: 2026-06-13

This file documents every modification made to this source snapshot after it was
copied from the working repository, as part of preparing it for publication.

## Why changes were needed

The experiment was run with `npm run dev` (the Next.js development server), which
does **not** run full production-build validation. A production build
(`npm run build`) does, and it failed on this snapshot.

The failures fell into two categories: empty or stale files left over from earlier
refactors, and type-level compatibility issues in live API route files. The live
route fixes below were intended to preserve the same runtime behavior while making
the snapshot compatible with the production build.

After the changes below, `npm install` + `npx prisma generate` + `npm run build`
complete cleanly (verified 2026-06-13, Next.js 16.0.10). The intended application
behavior is unchanged from the version used for the experiment. Generated build
and dependency artifacts created during verification are not part of the
publication package.

## Changes

### 1. Deleted: `app/api/conversations/route.ts` (and its empty folder)

- **What was there:** a 0-byte file (also 0 bytes in the working repository).
- **Change:** file and the then-empty `app/api/conversations/` directory removed.
- **Why:** an empty `route.ts` is "not a module" and fails `next build`. Nothing
  in the codebase references `/api/conversations` (verified by grep). OpenAI
  conversation creation is handled inside the session-creation flow, not by a
  dedicated route.

### 2. Deleted: `app/api/uploadFile/route.ts` (and its empty folder)

- **What was there:** a 0-byte file (also 0 bytes in the working repository).
- **Change:** file and the then-empty `app/api/uploadFile/` directory removed.
- **Why:** same as change 1 — empty file fails the build, no references anywhere.

### 3. Edited: `app/api/sessions/[id]/items/route.ts`, lines 8 and 10

- **What was there (GET handler signature):**
  ```ts
  { params }: { params: { id: string } }
  ) {
    const { id } = params;
  ```
- **Changed to:**
  ```ts
  { params }: { params: Promise<{ id: string }> }
  ) {
    const { id } = await params;
  ```
- **Why:** Next.js 15+ delivers route `params` as a Promise. All eleven other
  dynamic route handlers in this codebase were already migrated to the Promise
  signature (several carry the comment "changed code - params is now Promise");
  this one file was missed during that migration. The awaited form is the
  documented Next.js 16 pattern and behaves identically.

### 4. Edited: `app/api/projects/route.ts`, line 11

- **What was there:**
  ```ts
  const where = status ? { status } : { status: { not: 'deleted' } };
  ```
- **Changed to:**
  ```ts
  const where = status ? { status } : { status: { not: ProjectStatus.deleted } };
  ```
- **Why:** `status` is a Prisma enum (`ProjectStatus`); the generated client's
  types reject a plain string in the `not` filter. `ProjectStatus.deleted` has
  the exact runtime value `'deleted'`, so the query is unchanged. The enum was
  already imported in this file (line 3).

### 5. Edited: `lib/anchoring/defaults.ts`, line 35 removed

- **What was there (inside the `customOrder` object of the default config):**
  ```ts
  customOrder: {
    enabled: false,
    protocolsOrder: ["protocols", "harmony"],
    fullOrder: null,
  },
  ```
- **Changed to:**
  ```ts
  customOrder: {
    enabled: false,
    fullOrder: null,
  },
  ```
- **Why:** `protocolsOrder` was removed from the `AnchoringConfig` type during
  development (see the comment "removed protocolsOrder" at
  `components/SessionConfigModal.tsx:203`); this default object still carried
  the leftover key. Nothing in the codebase reads `protocolsOrder` (verified by
  grep), so removing it changes nothing at runtime. Note: session configs stored
  in the experimental database may still contain this key; it was inert there
  as well.

### 6. Edited: `app/api/sessions/[id]/config/route.ts`, lines 66–72 removed

- **What was there (in the POST handler, after the session update):**
  ```ts
  // If this is marked as project default, update project too
  if (config.isProjectDefault) {
    await prisma.project.update({
      where: { id: session.projectId },
      data: { defaultAnchoringConfig: config },
    });
  }
  ```
- **Changed to:** the block was removed; the handler proceeds directly to
  `return NextResponse.json({ success: true, config });`
- **Why:** `isProjectDefault` is not part of the `AnchoringConfig` type (it was
  removed during development — see the commented-out line
  `// isProjectDefault: false,` in `lib/anchoring/defaults.ts`), and the UI
  never sends it. The condition was therefore always falsy and the branch never
  executed. Removing dead code was preferred over widening the type to admit it.

### 7. Deleted: `services/mcp/raw.ts` (96 lines)

- **What was there:** a helper module exposing raw read/write access to a
  `Session.meta` JSON field.
- **Change:** file removed. (`services/mcp/vector.ts` and
  `services/mcp/faissQueue.ts` are untouched and remain the modules actually
  used.)
- **Why:** the file is imported by nothing (verified by grep), and the
  `Session.meta` column it reads and writes does not exist in the Prisma schema
  — neither in this snapshot nor in the working repository's schema. The module
  is stale code from an earlier design and could not have functioned against
  the experimental database. Its three type errors were the last build blockers.

### 8. Edited: `README.md`

- **What changed:** added setup notes for npm install-script approval and the
  Prisma major-version update notice.
- **Why:** during a clean smoke test, npm may require explicit approval for
  dependency install scripts used by Prisma, FAISS, Next/Tailwind, and related
  native packages. Prisma may also print a major-version update notice. The
  README now tells users to approve the expected install scripts, but not to
  upgrade Prisma when reproducing this publication snapshot.

## What was checked but NOT changed

- Build/dependency artifacts created during verification (`.next/`, `node_modules/`,
  `tsconfig.tsbuildinfo`) were removed from the publication snapshot.
- No secrets, API keys, `.env` files, databases, or FAISS indexes are present
  in the snapshot (verified by scan).
- No anchoring chunk content, selection logic, prompt/response handling,
  similarity computation, or logging code was modified in any way. The two-phase
  turn flow (`/api/prompts` → `/api/sendMessage`) is byte-identical to the
  working repository.
