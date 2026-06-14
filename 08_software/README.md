# Experimental UI Software

This folder contains a cleaned source snapshot of the experimental UI used to run the anchoring-system conversations. It is supporting material for the paper, not the primary evidence. The main evidence remains the system definitions, conversations, numerical outputs, and close-reading materials.

The package is intended to show how the interface and anchoring workflow were implemented. It can also be run locally after creating a fresh database and providing an OpenAI API key.

For the UI flow, database/storage explanation, and known Conversations API retry caveat, see `UI_WORKFLOW_AND_STORAGE.md`.

## Included Material

The source snapshot includes:

- Next.js app source: `app/`, `components/`, `styles/`, `public/`
- shared source: `config/`, `data_contracts/`, `lib/`, `services/`, `types/`
- Prisma schema: `prisma/schema.prisma`
- app config files: `package.json`, `next.config.ts`, `tsconfig.json`, etc.
- final chunk folders:
  - `chunks/ac15/`
  - `chunks/ac15p/`
  - `chunks/hybrid_v3_5/`
  - `chunks/hybrid_v3_5_semantic/`

Historical migrations, local databases, generated FAISS indexes, environment files, scripts, analysis files, and scratch copies are not included.

## Requirements

- Node.js and npm
- an OpenAI API key
- local filesystem write access for the SQLite database and FAISS indexes

The app uses SQLite through Prisma and stores vector indexes with FAISS.

## Installation

From this folder:

```bash
npm install
cp .env.example .env
```

Depending on your npm security settings, `npm install` may warn that some
dependency install scripts need approval. For this app, the expected packages are
Prisma, FAISS, Next/Tailwind build dependencies, and related native helpers. If
you see this warning, approve the listed scripts and then continue:

```bash
npm approve-scripts --allow-scripts-pending
```

or approve the expected packages explicitly:

```bash
npm approve-scripts @prisma/client @prisma/engines @tailwindcss/oxide esbuild faiss-node prisma sharp unrs-resolver
```

Then edit `.env` and add at least:

```bash
OPENAI_API_KEY=your_key_here
```

The default values in `.env.example` are:

```bash
FAISS_DIR=./lib/faiss
OPENAI_EMBED_MODEL=text-embedding-3-large
OPENAI_EMBED_DIM=3072
OPENAI_RESPONSE_MODEL=
```

`OPENAI_RESPONSE_MODEL` can be set to the model used for response generation if desired. The UI also exposes model selection.

## Create The Database

The database schema is not created automatically by `npm run dev`.

Create a fresh local SQLite database from the Prisma schema:

```bash
npx prisma db push
```

This creates `prisma/dev.db` from `prisma/schema.prisma` and prepares Prisma Client.

Historical Prisma migrations are not included in this source snapshot. For this publication package, the schema is the relevant source of truth.

Prisma may print an update notice, for example from Prisma 6 to Prisma 7. Do not
upgrade Prisma for reproducing this snapshot. The package versions are kept on
the versions used to verify the publication copy, and a major Prisma upgrade
would make the software differ from the archived experiment-support code.

## Run The App

```bash
npm run dev
```

Then open the local Next.js URL shown by the terminal, normally:

```text
http://localhost:3000
```

## Initialize A System

On a fresh database, there are no existing anchor systems yet.

To create the first project:

1. Open the app.
2. Create a new project.
3. Choose `Use new anchor set`.
4. Enter a chunks path, for example:

```text
chunks/ac15
```

Other bundled options are:

```text
chunks/ac15p
chunks/hybrid_v3_5
chunks/hybrid_v3_5_semantic
```

When the project is created, the app calls the project initialization endpoint. That endpoint reads the chunk JSON files, creates an `AnchorSystem`, writes `AnchorChunk` rows, embeds the chunks, and creates project-level FAISS indexes.

After one system has been initialized, later projects can choose `Use existing system` and select it from the UI.

The package does not include a Prisma seed script. System initialization is done through the UI by pointing the app to a chunks folder.

## What Is Automatic

Automatic after project initialization:

- reading chunk JSON files
- creating or reusing an `AnchorSystem`
- writing `AnchorChunk` rows when needed
- embedding anchor texts
- creating FAISS indexes for anchors, prompts, and responses
- storing project-level index IDs in the database

Not automatic:

- installing dependencies
- creating `.env`
- creating the initial SQLite schema
- providing an OpenAI API key

## Runtime Files

Running the app will create local runtime files that are intentionally not included in the publication snapshot:

- `prisma/dev.db`
- `lib/faiss/`
- `.next/`
- `.env`
- `.env.local`
- `node_modules/`

These are ignored by the copied `.gitignore`.
