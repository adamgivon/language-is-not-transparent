# UI Workflow And Storage Notes

This document explains the normal UI workflow and the main storage behavior of the experimental UI.

The software is research software. It was built to run the anchoring-system experiment, not as a production application. The workflow is usable, but a reader should expect some rough edges.

## UI Layout

The UI is divided into three main panes.

### Left Pane: Projects And Sessions

The left side contains the project and session navigation.

- The projects column lists active and archived projects.
- The sessions column lists sessions inside the selected project.
- Both project and session panes are foldable.
- A project is the container for a system setup and its related sessions.
- A session is one chat conversation inside a project.

### Center Pane: Conversation

The center pane is the communication area.

- It displays the current session messages.
- It contains the prompt input area.
- `Enter` sends the prompt.
- `Shift+Enter` inserts a new line in the prompt.
- The paperclip/upload icon is visible in the prompt area, but the upload function is not wired in this published copy.
- The copy icon in the prompt area copies the current prompt text.
- The conversation area above the prompt also has copy icons on message bubbles; these copy the text of the relevant message.
- The session header contains a configuration icon that opens the session configuration view.

### Right Pane: Run Parameters

The right pane contains per-run parameters.

These settings are sent with the prompt and may be restored from the last stored request for the selected session.

#### Run Mode

- `Anchored`: the app embeds the prompt, selects anchors according to the session configuration, assembles the instruction block, and sends that instruction block with the user prompt.
- `Control (no anchors)`: the app still prepares the local turn, but the instruction block is empty and the response is generated without injected anchors.

#### Model

The model field contains the default response model, but it can be changed by typing another OpenAI API model name.

Use the model name as expected by the OpenAI API route, not a display name.

#### Technical Parameters

- `Temperature`: default is `1`. In the experiment setup, changing this was not recommended because some model/API combinations failed with other values.
- `Top-p`: present in the UI, but not active in the published response call.
- `Max output`: maximum output length in tokens.
- `Presence`: present in the UI and stored in request metadata, but not active in the published response call.
- `Frequency`: present in the UI and stored in request metadata, but not active in the published response call.

#### Reasoning

The reasoning selector can be set to:

- none
- low
- medium
- high

The selected reasoning level is sent to the response call when set. Choosing the reasoning level matters for models that support reasoning effort.

#### Store And Stream

The normal setting is `Store` on and `Stream` off. This should be left unchanged during normal use.

With `Store` enabled, the conversation is stored on OpenAI's side as part of the conversation flow, while the local app also stores the session and turn data in SQLite. `Stream` is present in the UI but should be treated as inactive in this published copy.

#### System Prompt Debug Field

The right pane also contains a `System Prompt (debug)` textarea. In this published copy it is a scratch/debug field and is not wired into the request flow.

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
8. Configure the session. For the first session in a project, the configuration becomes the project default. For later sessions, the default is shown first and can be used as-is or edited for that session.
9. Send prompts through the chat UI.


## Projects And Sessions

The UI is organized around projects and sessions.

- A project is the container for a system setup and its related sessions.
- Each project can contain multiple sessions.
- One session corresponds to one OpenAI API conversation.
- Projects can be renamed, archived, and deleted.
- Sessions can be renamed and deleted.
- Sessions cannot be archived.
- Project descriptions can be edited from the UI.
- A project can only be deleted when it is empty. To delete a project, first delete all sessions inside it.
- These management functions are available through mouse right-click context menus on the relevant project or session.

This means that the usual hierarchy is:

```text
Project
  -> Session
       -> User and assistant turns
```

The project and session information is stored in the local database. Readers who want the exact storage details can check the database section below.

## Creating A Project

Starting a new project requires choosing a system.

The UI offers two options:

- `Use existing system`: select a system that already exists in the local database.
- `Use new anchor set`: initialize a new system from a folder containing chunk JSON files.

When `Use new anchor set` is selected, the user supplies the chunks folder path. The UI is responsible for passing that path to the initialization endpoint. There is no normal workflow requirement to edit a seed script.

After the project is created and initialized, the project can be selected from the left pane and sessions can be created inside it.

## Creating And Configuring A Session

Every first session in a project starts with the `Configure Session` form.

For the first session, the selected configuration becomes the project default. Later sessions in the same project initially show that default configuration. The user can click `Edit Configuration` to change the settings for the new session, but editing the new session does not change the stored project default.

### Selection Method

The first setting is the anchor selection method:

- `Semantic (FAISS)`: selects anchors by embedding similarity. This was the method used for the published project.
- `Manual`: lets the user manually choose anchors and weights.
- `LLM-Chosen`: uses the configured selection model, shown in the UI as `LLM-Chosen (gpt-5-mini)`, to choose anchors.

All three methods are present in the software. The published experiment used `Semantic (FAISS)`.

### Select Protocols And Forced Anchors

For semantic and LLM-chosen selection, the next section is named `Select Protocols and Forced Anchors`.

This section lets the user choose:

- protocols
- forced anchors
- weights for forced anchors
- order for protocols

In this app, a `protocol` means a chunk that is always inserted into the instruction block. It does not have to be only a procedural protocol. It can also be harmony, an anchor, or any chunk the user wants to force into every turn.

Protocols are placed at the top of the instruction block. Their order field controls their order:

```text
order 1 -> first protocol in the instruction block
order 2 -> second protocol in the instruction block
and so on
```

After the forced protocols, the instruction block includes the selected anchors.

A `forced anchor` is also always active. Its configured weight is a minimum per-turn weight. If embedding selection gives the same anchor a higher weight, the higher weight can be used by the selection logic.

### Selection Parameters

The configuration form also contains selection parameters.

- `K (Retrieval Count)`: the number of candidate anchors retrieved by semantic search.
- `Max Selected Anchors`: the maximum number of anchors that can be selected from the retrieved candidates. `K` is the upper retrieval limit; `Max Selected Anchors` controls how many of those retrieved candidates can be used.
- `Similarity Floor`: the similarity threshold below which anchors are not selected, except for forced anchors. The default used in the form is `0.2`.
- `Weight Precision`: the number of decimal places used for weights. The default is `2`.

### Creating The Session

After configuration, click `Create Session`.

For the first session in a project, this creates both the session and the project-default anchoring configuration. For later sessions, the form first displays the project default. If the user does not edit it, the new session uses that default.

### Author's Default Experiment Configuration

The default configuration used by the author for the project was:

- Protocols:
  - `protocols`, order `1`
  - `harmony`, order `2`
- Forced anchors:
  - `truth`, weight `0.1`
  - `sovereignty`, weight `0.1`

Exact chunk names depend on the chosen system's JSON files and naming conventions.

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

This is a known operational caveat of the API/conversation flow used by the app, not a problem with the local storage workflow. If a message appears stuck or does not complete, retrying the same message was the practical workaround used during the experiment. At extreme cases, a new session had to be created.

This should not affect the interpretation of the published experiment materials. The conversations and outputs included in the annex are the recorded materials actually used for the analysis. The caveat is included here so that anyone running the software is not surprised by occasional retry behavior.
