# UI Workflow And Storage Notes

This document explains the normal UI workflow and the main storage behavior of the experimental UI.

The software is research software. It was built to run the anchoring-system experiment, not as a production application. The workflow is usable, but a reader should expect some rough edges.

## Normal UI Workflow

The intended workflow starts from the UI, not from a seed script.

1. Start the app.
2. Create a new project.
3. Choose one of two system options:
   - `Use existing system`: reuse an `AnchorSystem` that was already initialized in the database.
   - `Use new anchor set`: point the app to a folder containing system chunk JSON files.
4. If using a new anchor set, enter a chunks path, for example:

```text
chunks/ac15
```

Other bundled chunk folders are:

```text
chunks/ac15p
chunks/hybrid_v3_5
chunks/hybrid_v3_5_semantic
```

5. Click `Create & Initialize`.
6. The app initializes the project, embeds the chunks, creates FAISS indexes, and stores the project/index references.
7. Create a session inside the project.
8. Send prompts through the chat UI.


## Projects And Sessions

The UI is organized around projects and sessions.

- A project is the container for a system setup and its related sessions.
- Each project can contain multiple sessions.
- One session corresponds to one OpenAI API conversation.
- Sessions can be renamed and deleted.
- Projects can be archived and deleted from the UI.
- Project descriptions can be edited from the UI.
- The project API also supports updating the project name, but the copied UI does not expose a separate rename control.
- A project can only be deleted when it is empty; projects with existing sessions should be archived or have their sessions removed first.

This means that the usual hierarchy is:

```text
Project
  -> Session
       -> User and assistant turns
```

The project stores the active anchor system and index references. The session stores the OpenAI conversation ID and the session-level configuration used for prompts inside that project.

## New System Initialization

When `Use new anchor set` is selected, the app reads the chunk folder supplied by the user in the UI. There is no hardcoded chunks path in the normal workflow.

During initialization, the app:

- reads the chunk JSON files from the selected folder
- reads the system/version name from the chunk files
- creates an `AnchorSystem` record if the system does not already exist
- writes `AnchorChunk` records when needed
- embeds the chunk text through the OpenAI Embeddings API
- creates project-level FAISS indexes for anchors, prompts, and responses
- stores the active index IDs on the project

After a system has been initialized once, later projects can select it through `Use existing system`.

## Main Database Tables

The app uses SQLite through Prisma. The database is created from `prisma/schema.prisma` with:

```bash
npx prisma db push
```

Main tables:

- `Project`: the project container. Stores the active anchor system and project-level FAISS index IDs.
- `AnchorSystem`: a named system/chunk set, with the chunks path, embedding model, and anchor count.
- `AnchorChunk`: the individual anchors/protocol chunks loaded from JSON files.
- `Session`: a chat session under a project. Stores the OpenAI conversation ID and the session anchoring config.
- `Item`: individual user/assistant turns and related metadata.
- `ItemAnchor`: anchor-level metrics for a turn, including weights and similarities.
- `RequestSnapshot`: logged request/response payload information for inspection and later analysis.
- `JudgeEvaluation` and `ConversationJudgment`: evaluation-related tables used by the broader experimental infrastructure.

## Files Outside The Database

Some runtime state is stored outside SQLite:

- FAISS indexes and vectors: `lib/faiss/` by default, or the path set in `FAISS_DIR`
- local environment variables: `.env`
- Next.js build/runtime files: `.next/`
- installed dependencies: `node_modules/`

These files are intentionally not included in the publication snapshot.

## OpenAI API Usage

The app uses several OpenAI API surfaces:

- Embeddings API for chunk, prompt, and response embeddings.
- Conversations API to create a durable OpenAI conversation for each local session.
- Responses API to generate assistant responses while attaching them to the stored conversation.

The relevant response call uses the stored conversation ID, so the model-side conversation state is managed by OpenAI rather than being reconstructed entirely from local messages.

## Known Conversations API Caveat

During local use, some Responses API calls attached to an OpenAI conversation occasionally stalled or failed. In practice, the same message sometimes had to be sent again, and in some cases retried more than once, before the response completed.

This is a known operational caveat of the experimental software. If a message appears stuck or does not complete, retrying the same message was the practical workaround used during the experiment.

This should not affect the interpretation of the published experiment materials. The conversations and outputs included in the annex are the recorded materials actually used for the analysis. The caveat is included here so that anyone running the software is not surprised by occasional retry behavior.
