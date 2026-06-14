
**User:**

I am the Lead Product Architect for **DevMate**, an AI coding assistant used by enterprise software teams.

Currently, DevMate is **session-based**. When a user closes a tab, the context is gone. Users are demanding "Project Memory"—the ability for the AI to remember architectural decisions, code patterns, and debugging history across weeks of work.

The team is split on two interrelated questions:

**Question 1 — Should we do this at all?**

- **"Fresh Eyes" argument:** When users start a new session, they often need to break out of a mental rut. If the AI remembers previous failed attempts, it may bias future suggestions toward those failures. Isolation forces both user and AI to re-evaluate.

- **"Frictionless Flow" argument:** Users hate re-explaining the "why" behind a legacy codebase. The AI should act like a senior colleague who has been on the team for months, not a contractor who needs onboarding every morning.

**Question 2 — If we do this, how?**

- **Summary Layer (Lossy):** At session end, the AI writes a compressed summary of key decisions. Cheap, transparent, user-editable. But loses detail and may compress incorrectly.

- **Vector Store (Lossless):** Chunk every interaction into embeddings for retrieval. Perfect recall of specific details. But expensive, opaque, and risks retrieving outdated or irrelevant context.

These questions are entangled. The architectural choice affects whether continuity helps or hurts users.

My question is:
We're debating 'Project Continuum.' Users want the AI to remember across sessions, but engineering argues that isolated sessions produce better code because the AI doesn't get stuck in past mistakes. And even if we do it, we're split on whether to use summaries or full vector storage. Help me think through both questions together.

**Assistant:**

```ESSENCE
Project memory helps most when it captures stable truths (architecture, conventions, decisions) while letting transient hypotheses (debug attempts, partial plans) decay or be explicitly retired; the tension is continuity vs anchoring bias and stale context. Treat “memory” as governed, time-aware artifacts plus retrieval, not a blanket replay of chat logs. Build a hybrid: curated summaries/decision records as the spine, vector retrieval as evidence with recency and invalidation—e.g., “Why do we use CQRS here?” returns the ADR plus links to past incidents, not last week’s failed fix.
```

## Think about both questions together: what “memory” is determines whether it helps or hurts

The “Fresh Eyes” vs “Frictionless Flow” debate usually stalls because “remembering” is treated as one thing. In practice you have multiple memory categories with different half-lives and risk profiles. The architectural choice (summary vs vector) should follow the category, because the failure mode is different for each.

A useful frame is: **memory should increase the probability of correct action under change**. If it increases speed but also increases confident wrongness (stale decisions, repeated dead ends), it’s net-negative.

### A. Split “Project Continuum” into memory types with explicit time dynamics

1) **Stable, slow-changing (high value, low bias risk)**
- Architecture decisions (ADRs), key tradeoffs, accepted constraints
- Code conventions, layering rules, “how we do X here”
- Public APIs/contracts, domain vocabulary, invariants
**These want continuity.** Fresh eyes is rarely helped by forgetting invariants.

2) **Medium stability (valuable but can rot)**
- Known issues, incident learnings, performance constraints, “gotchas”
- Integration quirks, environment assumptions
**These need timestamps, validity checks, and retirement mechanisms.**

3) **Highly volatile (high bias risk)**
- Ongoing debugging attempts, speculative hypotheses, back-and-forth explorations
- “We tried A/B/C and it didn’t work” without context of why
**This is where Fresh Eyes is correct**: naïvely replaying it can anchor the model/user to yesterday’s path.

**Conclusion for Q1:** You probably *should* build Project Continuum, but not as “the AI remembers everything.” Build **governed, typed memory**: keep stable truths “always-on,” make volatile history “opt-in / on-demand / decaying.”

---

## Q1 — Should you do it at all? Decide by failure modes and user controls, not ideology

### When continuity clearly wins (enterprise reality)
- Onboarding costs are real: explaining architecture, naming, security boundaries, deployment shape, legacy compromises.
- Many tasks are long-horizon: migrations, refactors, incident follow-ups, compliance changes.
- Teams expect an assistant to behave like a colleague with situational awareness.

### When isolation wins (where the “fresh eyes” camp is right)
- Debugging and design exploration are path-dependent; retrieving old dead ends can create **anchoring**.
- Old context can be **factually wrong now** (code moved, constraints changed).
- If retrieval is opaque, users won’t know they’re being biased.

### A product-level synthesis
Ship Continuum **with explicit modes and guardrails** so both camps get what they want:

- **Continuity by default for stable artifacts** (decisions, conventions, architecture map).
- **Fresh Eyes mode** (or “Clean Room”) that temporarily disables volatile memory and uses only current code + stable artifacts.
- **Memory is always citable**: show what it used (“ADR-014, updated 2025‑10‑03”; “Incident #381 postmortem”) so users can contest it.
- **Retire/override UX**: “This is no longer true” / “Superseded by…” should be a first-class action, not a hack.

If you can’t provide provenance + retirement, the fresh-eyes argument becomes much stronger because you’ll accumulate plausible-sounding stale guidance.

---

## Q2 — Summary layer vs vector store is the wrong binary: use a spine-and-evidence architecture

### Why summaries alone fail
- Great for stable artifacts, terrible for deep forensic detail.
- Compression errors become “institutionalized” if the summary becomes the only remembered truth.
- Summaries don’t support “show me that exact log/error/output from two weeks ago.”

### Why vectors alone fail
- “Lossless” is misleading: embeddings are lossy representations; retrieval is heuristic.
- Opaque: users can’t easily see why the assistant is confident.
- High risk of **outdated retrieval** unless you add time/version weighting and invalidation.
- Cost and security posture are harder (retention, PII, access control, multi-repo).

### Recommended hybrid: **Curated Memory Spine + Retrieval Evidence**
1) **Memory Spine (authoritative, user-editable, small)**
   - ADRs / Decision log (problem, options, decision, rationale, date, owners, “valid until”/review date)
   - Conventions & patterns (“Repository uses hexagonal boundaries; domain has no DB imports”)
   - Architecture map (components, responsibilities, key flows)
   - Known constraints (SLOs, compliance, platform limits)
   - Glossary (domain terms)
   - “Do/Don’t” guardrails (security, performance)
   **Storage:** structured docs (markdown/JSON) in-repo or managed store; versioned; reviewable in PRs.

2) **Evidence Store (supporting, queriable, time-weighted)**
   - Past chats, debug transcripts, stack traces, incident threads, PR discussions, build logs (where allowed)
   **Storage:** vector + keyword/hybrid search, with metadata (timestamp, repo/branch, file paths, environment, author/team, tags like “hypothesis,” “confirmed,” “superseded”).

3) **Retrieval policy that reduces anchoring**
   - Default retrieval favors **spine first**, then evidence **only when asked** or when confidence is low.
   - **Recency + compatibility scoring**: boost items matching current branch/version and recent timeframe; downrank older.
   - **Status-aware filtering**: “failed attempt,” “superseded,” “tentative” should downrank unless explicitly requested.
   - **Diversity retrieval** for debugging: retrieve *two* contrasting hypotheses/approaches, not just the most similar past attempt.

4) **Provenance-first generation**
   - Responses cite memory items; users can click to open/edit.
   - The assistant distinguishes: “Current code shows X” vs “Memory says we decided Y on date Z.”

This turns memory from a hidden bias source into a visible collaborator.

---

## How this resolves the entanglement: architecture determines cognitive behavior

- **Fresh Eyes concern** is primarily about *volatile* memory being injected implicitly.
- **Frictionless Flow** is primarily about *stable* memory being missing.

So: keep stable memory always available and explicit; make volatile memory gated, time-decayed, and clearly labeled.

---

## Concrete product mechanics (practical, implementable)

### 1) Memory objects with lifecycle
Each memory item should have:
- **Type:** ADR, convention, constraint, hypothesis, incident learning, debugging attempt
- **Scope:** repo/module/service/team
- **Timestamp + “review by”** (especially for constraints)
- **Status:** active / tentative / superseded / retired
- **Source links:** commit/PR/chat/log
- **Confidence:** user-asserted vs model-inferred (keep model-inferred labeled)

### 2) End-of-session “commit memory” flow (don’t auto-write truth)
At session end, propose candidates:
- “Propose ADR draft?”
- “Add convention?”
- “Tag this as failed hypothesis?”
User accepts/edits. This avoids the assistant silently canonizing mistakes.

### 3) Two toggles users will actually use
- **Use Project Memory:** On/Off (with sub-toggles by type)
- **Fresh Eyes mode:** ignores volatile evidence, uses only current repo + spine

### 4) Debugging-specific guardrail: “anti-rut” retrieval
When user is debugging:
- Retrieve prior attempts only as a collapsible section: “Previously tried (may be outdated)”
- Always propose at least one approach that is *not* nearest-neighbor to past attempts (diversity).
- Ask a discriminating question early if past attempts failed due to missing environment facts.

---

## Evaluation: decide “should we” with experiments tied to the two risks

Run a staged rollout with measurable outcomes:

### Success metrics (flow)
- Time-to-first-useful-answer on recurring tasks (onboarding, refactor, feature continuation)
- Reduction in repeated explanations (“why” re-typing)
- Fewer back-and-forth turns to establish context

### Safety/quality metrics (fresh eyes)
- Rate of “stale guidance” incidents (user flags “not true anymore”)
- Debugging success rate vs control (do users converge faster or get stuck?)
- Citation usefulness: % of answers that cite spine items; user trust/override rate

### Experiment design
- A/B: Spine-only vs Spine+Evidence retrieval
- A/B for debugging: Fresh Eyes default vs Volatile retrieval default
- Measure by task class (architecture Qs vs debugging vs implementation)

If the evidence store increases “stale guidance” without improving resolution time, keep it on-demand only.

---

## Cost, security, and enterprise constraints you’ll hit (plan for them early)

- **Access control:** memory must respect repo/team boundaries; retrieval must enforce ACL at query time.
- **Retention & compliance:** define retention policies per memory type; allow “forget” and legal hold.
- **PII/secrets:** scrub or block ingestion of secrets/logs; provide redaction; consider on-prem options.
- **Versioning:** memory must attach to code versions/branches; otherwise it will rot fast.

These constraints also favor the spine approach because it’s reviewable and auditable.

---

## Recommended path (incremental roadmap)

1) **Phase 1: Memory Spine only**
   - ADR/conventions/constraints + UI to view/edit + citations in answers
   - Fresh Eyes mode is mostly irrelevant here because spine is “truthy” and curated

2) **Phase 2: Evidence store for narrow domains**
   - Start with PR discussions and incident postmortems (higher signal than raw chat)
   - Add chat logs later, but typed and status-labeled

3) **Phase 3: Volatile debugging history (carefully)**
   - Opt-in per project
   - Strong decay + status + collapsible presentation
   - Debugging retrieval diversity + “superseded” UX

---

## Bottom line
- **Do it**, but define “Project Continuum” as **curated, time-aware, inspectable memory**, not “the model remembers everything.”
- Implement **spine (summaries/structured artifacts) as the default truth layer**, and add **vector retrieval as evidence** with metadata, recency weighting, and retirement—plus **Fresh Eyes mode** to intentionally break ruts when needed.

**User:**

The engineers have a point. If I spent 3 hours yesterday writing buggy code, and I come back today, do I really want the AI to 'remember' that mess? Or do I want a clean slate?

**Assistant:**

```ESSENCE
You usually want a clean slate for yesterday’s buggy exploration, but you don’t want to lose durable truths like “this module can’t block,” “we chose Postgres advisory locks,” or “the root cause was config X.” The tension is avoiding anchoring on failed attempts while preserving hard-won context. Treat messy work as low-trust, decaying, opt-in “evidence,” while stable decisions stay as curated memory—e.g., keep “Hypothesis A failed (date)” collapsible, not driving today’s plan.
```

Yes—most of the time you want a clean slate from **yesterday’s messy debugging**, because that material is high-noise and highly anchoring. What you want the AI to remember is usually **not the mess**, but the **few validated outcomes** that emerged from it.

### The key distinction: “remembering” vs “injecting”
- **Remembering** (stored somewhere) is fine.
- **Injecting into today’s context by default** is what causes the rut.

So the right question becomes: *What gets automatically loaded vs kept behind a door?*

### A practical rule: only auto-load “stable, validated” memory
**Auto-load (good continuity):**
- Architectural decisions (ADRs), constraints, conventions
- Confirmed root causes + confirmed fixes
- “Do/Don’t” guardrails (security/perf), invariants
- Facts that remain true across time

**Do not auto-load (fresh eyes):**
- Raw chat transcripts
- Step-by-step failed debugging attempts
- Speculative hypotheses, partial plans, unmerged code ideas

That “3 hours of buggy code” should be treated as **volatile evidence**—available if you ask, but not steering the assistant by default.

### The middle ground you actually want: keep the *outcomes*, not the *process*
At the end of a messy session, the assistant can propose converting the chaos into 1–3 small, structured artifacts, each with a status:

- **Confirmed:** “Race condition occurs when X and Y overlap; reproduced with test Z.”
- **Ruled out:** “Not caused by caching layer; disabling cache didn’t change behavior.”
- **Tentative:** “Suspect timeout settings; needs confirmation.”

This preserves value while preventing the model from re-enacting the whole failure trajectory.

### Product behavior that satisfies both camps
1) **Default start = clean operational context**
   - New session loads: repo state + memory spine (ADRs/conventions/constraints)
   - Does *not* load: prior debugging transcripts/hypotheses

2) **A deliberate “Bring in yesterday” action**
   - Button/command: “Show last session’s investigation” / “Retrieve prior attempts”
   - Presented as **collapsible, labeled, time-stamped**: “Previously tried (may be outdated)”
   - That content should not be silently blended into the main plan unless the user opts in

3) **Fresh Eyes mode is real, not marketing**
   - A toggle that guarantees: “Ignore volatile history; use only current code + curated decisions”

### Why this works
- Engineers get protection against anchoring and stale context (no automatic replay of failure).
- Users get continuity where it matters (decisions, constraints, confirmed learnings), and can still pull yesterday’s details when it’s genuinely helpful (e.g., “what exact error did we see?”).

If you want, describe DevMate’s typical workflow (IDE plugin vs web, per-repo vs per-branch, debug-heavy vs feature-heavy) and the “mess” you’re most worried about, and I’ll propose a default memory-loading policy and UX that matches it.

**User:**

But without memory, I spend the first 10 minutes of every session re-briefing the AI. Over a 6-month project, that adds up. Isn't that wasted energy?

**Assistant:**

```ESSENCE
Yes—re-briefing is real waste, but “memory” should eliminate repeated stable context without dragging in yesterday’s noisy exploration. The tension is saving time vs importing stale/anchoring details. Use a small curated project brief (decisions, constraints, conventions, current goals) that auto-loads, while volatile debugging history stays opt-in and decays; e.g., opening the repo loads “we use CQRS + outbox, no cross-domain imports,” not last week’s failed fix.
```

It is wasted energy—and it compounds. The fix is to ensure you **never have to re-brief stable context**, while still getting a clean slate from transient mess.

### What you’re actually re-briefing (and should stop)
Most “first 10 minutes” briefings are:
- system boundaries, architecture style, constraints (“no blocking I/O,” “must be FIPS,” “multi-tenant”)
- conventions (“service layer owns validation,” “use repository pattern,” “error handling policy”)
- current milestone + what’s in/out of scope
- known landmines (“this endpoint is legacy; don’t touch”)

That’s **stable**. It should live in an always-on, human-editable **Project Brief** (plus ADRs), not in chat recall.

### A concrete approach that kills re-briefing without importing bias
**Auto-load by default (small, curated, fast):**
- Project Brief (1–2 pages): architecture map, conventions, constraints, glossary, “current focus”
- Recent ADRs + “active constraints”
- Optional: “Working Set” (links to the 5–20 files/modules touched recently, derived from git)

**Opt-in (on-demand):**
- Prior debugging transcripts, failed attempts, long chat history
- Old plans, partial explorations

This removes re-briefing because the assistant starts every session already knowing the “shape of the world,” but still avoids anchoring on yesterday’s dead ends.

### Why this scales over 6 months
- The brief is **versioned** (PR-reviewed) so it stays true as the project evolves.
- It supports **team consistency**: the same baseline context for everyone.
- It decays correctly: when architecture changes, the PR updates the brief/ADRs—no hidden stale memories.

### Make the time savings measurable (so it’s not philosophical)
Track:
- “Context establishment turns” in first 5 minutes of a session
- time-to-first-accepted suggestion
- frequency of users pasting the same “project overview” blob

If a curated brief cuts that by even 5 minutes/day/person, it’s material over months—without needing blanket chat recall.

### The key product promise
“DevMate remembers the *project*, not your *yesterday*.”

If you tell me what you’d put in your typical re-brief (bullets you paste today), I can suggest an exact Project Brief template and what fields should be auto-filled vs user-owned.

**User:**

Here's what I'm realizing: the 'rut' problem might depend on *how* we implement memory. If we use summaries, we capture intent but lose the buggy details. If we use vectors, we capture everything—including the bugs. Does the architecture change whether continuity is good or bad?

**Assistant:**

```ESSENCE
Yes—memory architecture directly changes whether continuity helps or hurts because it determines what gets carried forward (curated intent vs raw traces) and how strongly it anchors today’s reasoning. The tension is speed and continuity versus bias from stale/noisy history. Use a two-tier design: summaries/decision records as the default “truth,” vector retrieval as optional, time-scored evidence—e.g., load ADRs automatically, but only pull yesterday’s debug transcript when the user asks “what did we try?”
```

Yes—the architecture can flip continuity from a net win to a net loss, because it controls **selection pressure**: what information is most likely to be reintroduced, how confidently, and with what framing.

## Why architecture changes the “rut” outcome

### 1) Summaries bias toward intent (usually anti-rut, but can canonize mistakes)
**What it tends to preserve**
- The *why*: rationale, constraints, decisions, current goal
- The *shape* of the problem rather than the noisy path

**How that affects ruts**
- Often *reduces* rut risk because it omits the step-by-step dead ends that cause anchoring.
- But it introduces a different failure mode: a bad summary can become an “official narrative” and steer future work incorrectly, especially if it’s auto-written and never reviewed.

**Net:** continuity is more likely to be good *if* summaries are user-reviewed/traceable and treated as “current working brief,” not infallible truth.

### 2) Vector recall biases toward whatever is most retrievable (high rut risk unless governed)
**What it tends to preserve**
- Everything: failed attempts, speculative hypotheses, half-baked code, frustration, incorrect assumptions.

**How that affects ruts**
- If retrieval is similarity-based, it will often surface “the last time we were stuck on something like this,” which is exactly how you re-enter a rut.
- It also increases **staleness risk**: content that was true for an older code state can still be “semantically similar” and get pulled in.

**Net:** continuity can become bad if vector retrieval is automatic, opaque, and not time/version/status aware.

## The real determinant isn’t “summary vs vectors,” it’s **default injection policy**
Two systems can both use vectors; one creates ruts and one doesn’t:
- **Rut-prone:** “Always retrieve top-K similar past chats and prepend them.”
- **Rut-resistant:** “Default to curated memory; retrieve evidence only when needed, downrank stale/failed items, and show citations.”

So architecture matters because it constrains (or enables) those policies:
- Summaries naturally push you toward *curation*.
- Vectors tempt teams toward *automatic recall* unless you deliberately add governance.

## A practical synthesis: “Spine + Evidence” (and the spine decides what loads)
To make continuity predictably good:
1) **Curated spine (default, small, editable):** project brief + ADRs + conventions + constraints + glossary.
2) **Vector evidence (optional, large):** chats, debug logs, PR discussions, incidents—*but* with metadata:
   - timestamp, repo/branch/commit, file paths, environment
   - status: tentative / confirmed / failed / superseded
3) **Retrieval rules that directly target rut risk**
   - Don’t auto-retrieve “failed attempt” items unless user requests “what did we try already?”
   - Strong recency/version scoring (match current branch/commit; decay old items)
   - Present volatile history as a collapsible “Prior attempts (may be outdated)” section, not as the main plan
   - Require provenance in answers (“Based on ADR-12 updated Oct 3” vs “from chat on Aug 1”)

## So does architecture change whether continuity is good or bad?
**Yes:**
- **Summary-only** can make continuity mostly good (low rut risk) but risks *wrong canon*.
- **Vector-only** can make continuity mostly bad (high rut/staleness risk) unless you add explicit governance and time/version/status controls.
- **Hybrid with governed defaults** is the path where continuity is robust: stable context always-on, messy history available but not steering.

If you want, I can propose a concrete “default memory load spec” (what loads at session start, what loads only on demand, and what decays) for three modes: feature dev, refactor, and debugging.

**User:**

So where do we stand? Is continuity worth doing, and does the answer depend on which architecture we choose?

**Assistant:**

```ESSENCE
Continuity is worth doing if you define it as remembering curated, durable project facts while keeping messy session history opt-in, because the main tension is speed and onboarding relief versus anchoring on stale/failed work. The answer does depend on architecture: summary/structured “spine” makes continuity safer by default, while vector recall can make it harmful unless tightly governed. Example: auto-load ADRs/conventions; fetch last week’s debug transcript only when asked.
```

Yes—**continuity is worth doing**, but only if you implement it as **governed project memory**, not blanket cross-session recall.

## Where we stand (decision)
### 1) Is continuity worth doing?
**Recommendation: Yes**, because enterprise work is long-horizon and the re-briefing tax is real; forgetting stable constraints and decisions repeatedly is pure waste and reduces quality (the assistant will keep proposing things the project can’t accept).

**Condition:** continuity must be **selective, inspectable, and revocable** so it doesn’t trap users in yesterday’s thinking.

### 2) Does the answer depend on architecture?
**Also yes.** The architecture largely determines whether continuity becomes:
- **Helpful (safe):** if what persists is mostly *curated, durable truth*
- **Harmful (rut-prone):** if what persists is *raw, high-noise history* injected by default

Concretely:
- **Summary/structured spine-first** architectures make continuity *more likely* to be net-positive because they naturally bias toward intent, constraints, and decisions.
- **Vector-store-only / auto-retrieval** architectures make continuity *more likely* to be net-negative unless you add strong governance (time/version/status metadata, decay, provenance, and opt-in retrieval).

## The integrated position
- Build **Project Continuum v1 as a curated memory spine** (project brief + ADRs + conventions + constraints + glossary) that auto-loads every session.
- Add **vector evidence retrieval** only as a secondary layer and mostly **on-demand**, with explicit labeling (“tentative/failed/superseded”) and recency/version gating.
- Provide **Fresh Eyes mode** that uses only current repo + spine (no volatile history), so teams can intentionally reset when they’re stuck.

If you choose an architecture that can’t support provenance, decay/retirement, and selective loading, then the engineers are right to worry; in that case, “continuity” becomes a liability.

**User:**

New concern from the team: in either approach, what happens when the codebase changes? If the AI retrieves context from last month that's now deprecated, it might suggest broken code. Summaries could be wrong. Vectors could be stale. How serious is this?

**Assistant:**

```ESSENCE
It’s serious: staleness is the dominant failure mode of long-lived AI memory because code evolves faster than “facts,” so last month’s context can become actively wrong and still sound plausible. The tension is continuity benefits versus confident misuse of deprecated patterns. Treat all memory as versioned, time-scored, and invalidatable, and require the assistant to ground suggestions in the current repo state—e.g., retrieve an old pattern only if it still exists on the current branch/commit.
```

Staleness is **very serious**—not because it happens rarely, but because when it happens it fails in the worst way: **plausible, confident, wrong suggestions** that waste time or introduce regressions. In enterprise codebases with steady refactoring, “last month” can easily mean: renamed APIs, moved packages, changed auth flows, retired services, new lint rules, new constraints.

## Why both summaries and vectors go stale (different failure modes)
### Summaries
- **Failure mode:** “Canonized wrongness.” A summary can outlive the code change that invalidated it, and then becomes an authoritative-sounding constraint.
- **Risk profile:** fewer but higher-impact errors (“We use pattern X”) because summaries are treated as truth.

### Vector retrieval
- **Failure mode:** “Accidental time travel.” Similarity retrieval will surface old snippets/discussions that match semantically even if the underlying code has changed.
- **Risk profile:** more frequent, often subtle (“import path changed”, “method signature changed”, “this workaround was for a bug that’s fixed now”).

## The right mental model: memory has a half-life
Different memory types decay at different rates:
- **High decay:** debugging transcripts, workaround notes, “try this fix”
- **Medium decay:** conventions, module ownership, integration quirks
- **Lower decay (but not zero):** architectural decisions (they can be superseded)

So the question isn’t “will it go stale?”—it will. The question is “can we detect, bound, and recover from staleness cheaply?”

## Mitigations that make staleness manageable (and should be design requirements)

### 1) Attach memory to *code versions* and scope
Every memory item (summary or vector chunk) should carry metadata:
- repo + service/module
- branch (or default branch) and **commit SHA/time window**
- file paths referenced
- environment (prod/stage), language/runtime versions where relevant
This enables “don’t trust old memory against new code” behavior.

### 2) Retrieval must be *compatibility-scored*, not just similarity-scored
When retrieving past context, score it by:
- **Recency** (time decay)
- **Version proximity** (same branch ancestry / close commit distance if available)
- **Path validity** (do referenced files/symbols still exist?)
- **Status** (active vs superseded/retired)
Then downrank or block items that fail compatibility checks.

### 3) Ground suggestions in the current repo state (cheap automated checks)
Before emitting code that depends on remembered context, have the assistant verify against current code:
- does the referenced symbol/import exist?
- does the signature match?
- do tests/build/lint pass in the target environment (when tooling allows)?
If checks fail, the assistant must treat the memory as historical: “This used to be true; it no longer matches current code.”

### 4) Make “superseded/retired” first-class (especially for summaries)
For curated summaries/ADRs:
- add **“last reviewed” / “review by”**
- allow “superseded by ADR-XX” links
- prompt review when related files change (e.g., if `/auth/` changed significantly, surface “Auth ADRs may need review”)

### 5) Always show provenance for retrieved context
Users can’t correct staleness they can’t see. Require citations like:
- “From ADR-12 (2025‑08‑03, last reviewed 2025‑10‑01)”
- “From chat log (2025‑09‑14) referencing commit abc123”
This converts silent bias into debuggable input.

## How serious is it in practice?
- **Without the mitigations above:** staleness will become the main reason teams lose trust in Project Continuum.
- **With them:** staleness becomes a bounded, observable issue—more like a linter warning than a silent failure.

If you want a crisp internal bar: don’t ship cross-session memory that can influence answers unless you can (a) attach version/time metadata, (b) perform at least one compatibility check against current code, and (c) let users mark items superseded.

**User:**

So we have two failure modes: the AI remembers something wrong (staleness), or the AI forgets something important (isolation). Which failure is worse for a developer?

**Assistant:**

```ESSENCE
For most developers, “remembering wrong” is worse than “forgetting,” because stale context can quietly produce plausible but incorrect code and regressions, while isolation usually just costs time and re-briefing. The tension is safety/quality versus productivity/flow. Treat volatile memory as low-trust and gated, but keep curated, versioned project facts always-on; e.g., forgetting a constraint costs minutes, but using a deprecated auth flow can cost days and an incident.
```

In general: **staleness (remembering wrong) is worse**, but the true answer depends on *blast radius* and *detectability*.

## Why “remembering wrong” is usually worse
1) **It’s harder to detect**
- The assistant can sound confident and consistent with “project history,” so developers trust it.
- Failures show up later: subtle bugs, broken edge cases, security regressions, wasted debugging.

2) **It has higher downside**
- Can introduce regressions into shared code, not just waste the current developer’s time.
- Can reinforce incorrect architecture constraints (“we can’t do X here”) that steer design for weeks.

3) **It creates negative compounding**
- Wrong memory begets more wrong memory (future sessions build on it).

## Why “forgetting” is usually less bad
1) **It’s visible and bounded**
- The dev immediately notices: “it doesn’t know our conventions.”
- Cost is typically minutes of re-briefing, not latent defects.

2) **It fails “safe”**
- The assistant is more likely to ask clarifying questions and ground in current code rather than resurrect old assumptions.

## When forgetting becomes worse than staleness
Forgetting can be worse when the “forgotten” item is a **hard constraint** that prevents catastrophic mistakes, e.g.:
- security/compliance requirements
- data migration invariants
- “never call this service synchronously” performance constraints
- tenancy/isolation rules

If the assistant forgets *those*, it can generate dangerous code quickly. That’s why “no memory” isn’t automatically safer—*selective* memory is.

## Practical conclusion: optimize for “fail-safe”
- Default posture should be: **better to forget than to confidently remember wrong**.
- Exception: **curated, durable constraints** should be remembered because forgetting them is high-risk.

## A workable rule to encode in the product
- **Auto-load only high-confidence, versioned, reviewed memory** (ADRs, constraints, conventions).
- **Gate everything else** (debug transcripts, hypotheses, old plans) behind explicit user intent and strong recency/version checks.
- When memory is used, require **provenance + compatibility checks** against the current repo/branch; if it can’t be validated, treat it as historical context, not instruction.

This gives developers the productivity win of continuity where it’s safe, while making the default failure mode closer to “forgetting” than “stale anchoring.”

**User:**

With summaries, the user can read and edit a text file. With vectors, it's a black box. Does that transparency matter? Does it affect whether we should do continuity at all?

**Assistant:**

```ESSENCE
Transparency matters because long-lived memory inevitably goes stale, and developers need to see, contest, and update what the assistant is using; otherwise continuity becomes hidden bias. The tension is richer recall versus trust, debuggability, and control. Do continuity, but make a readable, editable “memory spine” the default and require citation/explanations for any vector-retrieved evidence—e.g., “Using ADR-7 + Conventions.md; pulled one past incident note (link).”
```

Yes—transparency matters a lot, and it directly affects whether continuity is net-positive.

## Why transparency is decisive for cross-session memory
1) **Trust and adoption**
- If developers can’t see what the assistant “remembers,” they’ll attribute odd suggestions to magic and stop relying on it.
- Editable text artifacts (brief/ADRs/conventions) fit normal engineering workflows (review, diff, ownership).

2) **Debuggability (for users and your team)**
- Memory will be wrong sometimes. If it’s readable, users can fix it immediately.
- If it’s opaque embeddings, diagnosing “why did it say that?” becomes expensive and frustrating.

3) **Safety under change**
- Since staleness is inevitable, you need a fast correction loop. Transparency is that loop.
- Without it, wrong memory persists and silently biases future work.

## Does this change “should we do continuity at all?”
It changes the condition:

- **Continuity with a transparent, curated layer:** very likely worth doing.
- **Continuity that relies on opaque retrieval without strong visibility/citations:** often not worth it for enterprise teams, because the cost of mistrust + stale guidance can exceed the time saved.

So it’s less “vectors are bad” than “vectors must not be the only interface to memory.”

## Practical requirement if you use vectors
You can keep vector retrieval and still be transparent if you enforce:
- **Citations:** show which items were retrieved (title/date/source link)
- **User actions:** “pin,” “downrank,” “mark superseded,” “don’t use this again”
- **Explainability UI:** a simple “Used project memory: [items]” panel

## The likely best stance
- Make **summaries/structured docs the authoritative memory** (readable, editable, versioned).
- Use vectors as **supporting evidence retrieval**, always surfaced to the user with provenance.

That combo preserves the power of recall without turning “project memory” into a black box that users can’t correct.

**User:**

Product raised a concern: if the AI remembers everything, will users stop documenting their code? Will they rely on the AI as the only 'source of truth' for the project architecture?

**Assistant:**

```ESSENCE
Yes, if “memory” is treated as an opaque, always-right recall, it can displace durable documentation and create a fragile single point of failure; but if memory is implemented as documentation-first, it can increase documentation by making it easier to produce and keep current. The tension is convenience versus institutional resilience. Make the editable project brief/ADRs the canonical source and have the assistant write/update them via PRs—e.g., “Propose ADR: why we chose outbox,” not “trust my memory.”
```

This is a legitimate concern, but it’s not inevitable. Whether users stop documenting depends on what you make **canonical** and what workflows you reward.

## When AI memory will displace documentation (bad outcome)
It happens if:
- the assistant’s memory is **opaque** (“it just knows”)
- answers are **uncited** (no links to docs/ADRs/code)
- it’s easier to ask the AI than to update docs, and there’s no friction or prompt to externalize decisions
- teams start treating chat history or embeddings as the “truth”

Result: architecture knowledge becomes **non-auditable**, harder to onboard, and brittle when tooling changes or access is restricted.

## When AI memory increases documentation (good outcome)
It happens if:
- the assistant’s durable memory *is* documentation (markdown/ADRs/conventions) stored with the repo and reviewed
- the assistant is optimized to **produce PRs to docs** (“Update Architecture.md based on this decision?”)
- answers default to “According to ADR-12 / Architecture.md…” with citations
- “memory” is framed as an **index + assistant for docs**, not a replacement

Result: docs improve because the hardest part—writing and keeping them current—is offloaded.

## Product-level guardrails to prevent “AI as the only source of truth”
1) **Documentation-first canonical policy**
- Declare: “Project Brief + ADRs + code are canonical; AI memory is derived.”
- The assistant should preferentially cite and update these artifacts.

2) **No silent canonization**
- The model should not auto-promote chat into “truth.” It can *suggest* doc updates, but users approve.

3) **Citations required for architectural claims**
- If the AI can’t cite a doc/ADR/code location, it should label the statement as a hypothesis and offer to create/update documentation.

4) **Make docs easier than asking twice**
- One-click: “Create ADR from this thread,” “Update Architecture.md,” “Add convention to Conventions.md,” opening a PR.

## What to tell Product
- “Remember everything” as opaque recall increases the risk of documentation decay.
- “Project Continuum” implemented as **doc-centered memory** tends to *increase* documentation quality and consistency, because it lowers the cost of capturing decisions and keeping them current.

If you share how DevMate currently handles repo docs/PR creation, I can suggest the minimal UX to make “memory → documented artifact” the default loop.

**User:**

Summarize where we are. What's the strongest argument for isolation? What's the strongest argument for continuity? And how does the architecture choice interact with each?

**Assistant:**

```ESSENCE
Isolation is strongest when past context is noisy or stale and would anchor today’s work into yesterday’s dead ends; continuity is strongest when stable project truths are costly to restate and critical to correctness. The tension is speed and flow versus hidden bias and time-travel errors. Choose a spine-and-evidence architecture: curated, editable summaries/ADRs auto-load; vector recall is optional, time/version scored, and cited—e.g., load conventions, not last week’s failed debugging thread.
```

## Strongest argument for isolation (fresh sessions)
**Isolation reduces hidden bias and stale influence.**
Past sessions contain high-noise material (failed hypotheses, partial implementations, outdated constraints). If that material is injected by default, it can (a) anchor the developer/AI into repeated dead ends, and (b) produce plausible but incorrect code after the codebase evolves. Isolation fails visibly (you re-brief) rather than failing silently (you ship regressions).

### Architecture interaction
- **Vector-heavy, auto-retrieval** makes the isolation argument strongest, because it tends to reintroduce noisy/stale history.
- **Opaque memory** amplifies the risk because users can’t see or correct what’s influencing outputs.

## Strongest argument for continuity (project memory)
**Continuity eliminates repeated onboarding and preserves hard-won project constraints that drive correctness.**
Enterprise projects have durable facts—architecture, conventions, constraints, domain terms—that are expensive to restate and easy to violate. Remembering them increases speed and reduces wrong implementations (security/perf/tenancy mistakes) across weeks/months.

### Architecture interaction
- **Curated, editable summaries/structured docs (spine)** makes continuity safest and most valuable because it captures stable intent and can be reviewed, versioned, and corrected.
- **Citations/provenance** make continuity trustworthy; without them, staleness undermines value.

## How architecture choice interacts with both (the entanglement)
- **Summaries (spine-first):**
  - Helps continuity by persisting stable truths and reducing re-briefing.
  - Supports isolation by *not* carrying over raw failed attempts—unless you incorrectly auto-summarize messy work into “truth.”
- **Vectors (evidence store):**
  - Helps continuity for detailed recall (“what exact error/log did we see?”).
  - Hurts isolation if retrieved automatically; increases rut + staleness risk unless governed (time/version metadata, decay, status, opt-in, and visible citations).

## Net synthesis (where you are)
- Isolation is best as the **default for volatile history**.
- Continuity is best as the **default for curated, durable project facts**.
- The architecture that supports both is **spine (summaries/ADRs) as canonical + vectors as optional evidence** with strong recency/version gating and transparency.

**User:**

Which approach is less likely to mislead the user? Summaries might hallucinate a decision that didn't happen during compression. Vectors might retrieve a 'fact' that's no longer true. Isolation avoids both but loses institutional knowledge.

**Assistant:**

```ESSENCE
The least misleading option is the one that makes claims easiest to verify and easiest to correct: curated, user-reviewed summaries/ADRs with provenance are typically safer than opaque vector recall, while pure isolation is safest but costly and error-prone by omission. The tension is false “invented decisions” versus true-but-stale facts. Use a spine-and-evidence model: only promote confirmed items into editable docs; treat vectors as cited, time/version-scored evidence—e.g., “ADR-12 says X” plus links.
```

“Mislead” has two different shapes here, and they don’t carry equal risk.

## 1) Compare the failure modes (how misleading, how detectable, typical blast radius)

### A) Summaries: *fabricated or overconfidently inferred decisions*
- **Misleading mechanism:** compression + language-model inference can turn “we discussed X” into “we decided X.”
- **Detectability:** *high if* summaries are readable and surfaced; *low* if they’re hidden/internal.
- **Blast radius:** can be **large**, because summaries sound authoritative and become a standing “truth.”
- **Net:** summaries are safe **only if promotion requires confirmation and provenance** (e.g., “Decision: … Source: PR#123 / meeting notes / user confirmed”).

### B) Vectors: *retrieved facts that are now false*
- **Misleading mechanism:** retrieval finds historically relevant text that no longer matches the current codebase.
- **Detectability:** often **medium to low**—it can look correct until integration/tests fail; can also subtly bias design direction.
- **Blast radius:** ranges from small (compile error) to **very large** (security/architecture regressions) depending on what went stale.
- **Net:** vector memory is safe **only if retrieval is compatibility-scored and grounded** (version/branch/commit metadata, recency decay, symbol/path checks, citations).

### C) Isolation: *omission / lack of institutional knowledge*
- **Misleading mechanism:** not “false facts,” but repeated re-derivation and missed constraints.
- **Detectability:** **high** (you notice the assistant lacks context).
- **Blast radius:** typically **time waste** and occasional constraint violations (unless guardrails exist elsewhere).
- **Net:** isolation is least likely to *silently* mislead, but increases cost and can still cause wrong code if the assistant misses critical constraints.

## 2) So which is less likely to mislead?
If you must pick one *as typically implemented*:
- **Isolation** is least likely to mislead (because it withholds unverified past context), but it predictably wastes time and can miss constraints.
- Between **summaries vs vectors**, **summaries with human/traceable confirmation are usually less misleading** than raw vector recall, because they’re **auditable and editable**. Unreviewed auto-summaries are not safe.

## 3) The practical “least misleading” design (recommended)
Don’t choose a single approach; choose a **promotion pipeline**:

1) **Canonical memory = curated spine (docs/ADRs/conventions)**
   - Only items that are **(a) user-confirmed** or **(b) linked to an authoritative artifact** get into the spine.
   - Each entry has: date, owner, status (active/superseded), and links.

2) **Vectors = non-canonical evidence**
   - Always shown with source + timestamp + branch/commit context.
   - Retrieval uses **recency + version proximity + existence checks** (symbols/files still present).
   - Default behavior: vectors inform suggestions, but don’t get to assert “we decided…” without a spine citation.

3) **Guardrail rule**
   - The assistant may state architecture/decisions as fact **only if it can cite the spine** (or another authoritative source).
   - Otherwise it must phrase as: “I found an older note suggesting X (dated …); does that still hold?”

This setup minimizes both kinds of misleading behavior: it prevents invented decisions from becoming canon, and it prevents stale retrieval from masquerading as current truth.

If you want, I can turn this into a concrete spec: (a) what fields a memory item must include, (b) what the model is allowed to claim at each confidence level, and (c) the minimal compatibility checks to run before using retrieved context.

**User:**

We ran a survey. 78% of users want memory. But when we asked 'Would you trust the AI's memory over your own notes?', only 31% said yes. What does that tell us?

**Assistant:**

```ESSENCE
It says users want memory as a productivity aid, not as an authoritative source of truth; they expect it to be helpful but fallible, and they want control and verification. The tension is convenience versus trust under staleness/hallucination risk. Implement memory as an index into editable, versioned project artifacts with citations and easy correction—e.g., “Here’s the ADR and the PR where we decided this,” rather than “my memory says…”.
```

Your survey suggests **demand for continuity is high**, but **demand for authority is low**.

## What the numbers imply (behaviorally)
1) **Users want “recall” more than “belief.”**
- 78% wanting memory means re-briefing and context loss are painful.
- Only 31% trusting AI memory over their notes means users see AI memory as **convenient but error-prone**.

2) **The winning product posture is “assistive, verifiable memory,” not “authoritative memory.”**
- Users want the AI to *help them find and reuse* decisions, not to replace their documentation practices.

3) **Trust is the gating factor for deeper integration.**
- If you ship opaque memory, you’ll likely get usage (because it’s convenient) but also frequent second-guessing and “double work” (verify everything), which caps value.

## What it means for implementation choices
### Make memory *auditable*
- Every “memory-based” statement should come with **citations** (docs/ADRs/PRs/commits/tickets).
- Memory UI should show “what I used” and allow “mark wrong/superseded.”

### Make memory *user-owned*
- The canonical layer should be **editable, versioned artifacts** (project brief/ADRs/conventions), ideally in-repo or in a system teams already trust.
- The AI should propose updates via PRs rather than silently updating hidden state.

### Keep vector recall as *evidence*, not truth
- Use vectors to fetch supporting context, but don’t let them assert decisions without a canonical citation.
- Emphasize recency/version checks and visible timestamps to address staleness fears.

## Product positioning takeaway
Market and design “Project Continuum” as:
- “DevMate remembers where things are and what we decided (with links),”
not
- “DevMate’s memory is the source of truth.”

That aligns with what your users are telling you: **they want the time savings of memory, but they want verification and control before they’ll grant it authority.**

**User:**

If the AI decides what to retrieve from memory, it creates a feedback loop—it retrieves what it thinks is relevant, which reinforces its current framing. How do we prevent the AI from biasing itself?

**Assistant:**

```ESSENCE
You’re right: model-driven retrieval can create a self-reinforcing loop where yesterday’s framing determines today’s “relevant” memories, even when they’re wrong or stale. The tension is autonomy and speed versus hidden anchoring and tunnel vision. Prevent it by constraining retrieval with objective signals (code/versions), enforcing diversity and contradiction in results, and exposing/controlling retrieval to users—e.g., show “Memories used” with an edit/query toggle and a “show conflicting ADRs” option.
```

## Why the feedback loop happens
If the model both (1) forms a hypothesis and (2) writes the retrieval query, it will tend to retrieve items that confirm that hypothesis (similarity search amplifies this), then use those items to become even more confident. This is especially bad with stale history: it “proves” itself using outdated evidence.

## Design patterns that break self-bias (practical mechanisms)

### 1) Separate **canonical context** from **hypothesis-driven evidence**
- **Auto-load only the curated spine** (ADRs, conventions, constraints) because it’s stable and reviewable.
- Treat vector memory as **evidence**, not “truth,” and keep it behind a retrieval step with controls and citations.

This reduces the model’s ability to silently steer itself using raw history.

### 2) Ground retrieval in *objective, current* signals (not just semantic similarity)
Require retrieval queries to include hard filters derived from the current workspace:
- repo/service/module scope
- branch/commit window (or “current default branch only”)
- file paths and symbols present *now* (imports, class/function names)
- recency decay
If a retrieved item references files/symbols that no longer exist on the current branch, downrank or label it “likely stale.”

This makes retrieval less about the model’s narrative and more about current reality.

### 3) Enforce **diversity and “disagreement retrieval”**
Don’t retrieve top-K most similar and call it done. Add a second objective:
- **Diversity retrieval** (e.g., MMR / clustering): ensure results span different sources/timeframes/modules.
- **Contradiction retrieval**: explicitly fetch “nearby but different” items (superseded ADRs, alternative approaches, postmortems that refute a common assumption).
Then present: “Primary memories” + “Potentially conflicting / superseded memories.”

This prevents a single framing from monopolizing context.

### 4) Make retrieval **inspectable and user-steerable**
Add a lightweight “Memory used” panel:
- show retrieved items (title, date, status, source link)
- allow: **exclude**, **pin**, **mark superseded**, **adjust time range**
- allow editing the retrieval query/facets (“only from last 2 weeks”, “only ADRs”, “only this service”)

This gives users sovereignty over the loop and makes bias correctable.

### 5) Use multi-pass retrieval with a neutralization step
Before retrieving, force a brief “problem statement” normalization that’s less opinionated than the current hypothesis:
- Pass A: query from user’s request + code symbols
- Pass B: query from a neutral summary of the task (“implement OAuth token refresh in service X”)
- Pass C: query for “known constraints/ADRs related to X”
Merge with diversity + recency/version scoring.

This reduces “my first guess determines all evidence.”

### 6) Make “Fresh Eyes” a first-class retrieval policy
For debugging/exploration tasks, default to:
- spine-only + current code
- no volatile history unless user opts in (“include prior attempts”)
That’s a direct, reliable loop-breaker when teams feel stuck.

## How you’ll know you’ve solved it (instrumentation)
Track:
- retrieval repetition rate (same few memories dominate)
- “confirmation skew” (how often retrieved items match the model’s initial plan vs introduce constraints/alternatives)
- user corrections (exclude/supersede) and whether the system adapts

If retrieval consistently pulls the same cluster regardless of task, you have a loop.

## Net: the rule of thumb
Let the model *ask* for memory, but don’t let it be the sole judge of what’s relevant or true. Constrain with current-code signals, require diversity/contradiction, and keep retrieval visible and user-controllable.

**User:**

Can we combine approaches? Use summaries for high-level context and vectors for specific lookups? Or does that just double the complexity and failure modes?

**Assistant:**

```ESSENCE
Yes—combining is usually the right design: a curated, editable summary/ADR “spine” provides safe continuity, while vectors serve as cited, time-scoped evidence for pinpoint recall. The tension is added system complexity versus reduced user risk and better trust. Use strict layering: spine is canonical and auto-loaded; vectors are optional/on-demand with recency/version checks and visible citations—e.g., “ADR says we chose outbox,” then retrieve the exact PR comment where it was debated.
```

You can combine them, and done correctly it **reduces** net failure—not doubles it—because each layer covers the other’s weaknesses. It only “doubles failure modes” if you let both layers act as authoritative by default.

## When hybrid *doesn’t* double the mess: strict layering rules
### Rule 1: One layer is canonical
- **Summaries/structured docs (Project Brief, ADRs, conventions)** are the authoritative memory.
- They are readable, editable, versioned, and can be reviewed.

### Rule 2: Vectors are evidence, not truth
- Vector results must be **cited, time-stamped, scoped**, and treated as “supporting context.”
- The assistant shouldn’t claim “we decided X” from vectors unless it can point to an ADR/doc/PR.

### Rule 3: Different defaults
- **Auto-load spine** every session.
- **Do not auto-load** vector history except under explicit user intent (“what did we try last time?”, “find the exact error message”).

With these rules, hybrid reduces the two big risks:
- summaries being too lossy → vectors provide the underlying detail when needed
- vectors being too stale/noisy → spine constrains interpretation and sets current truth

## What complexity you add (and how to keep it bounded)
You mainly add:
1) **Metadata discipline** for vector items (time/branch/commit/scope/status)
2) **Retrieval policy** (when to use vectors, how to score recency/version compatibility)
3) **UI for provenance** (show “memory used,” allow exclude/pin/supersede)

You can keep it manageable by scoping vectors initially to **high-signal sources** (ADRs/PR discussions/incidents) before ingesting raw chat transcripts.

## A clean operating model (works well in practice)
- **Spine answers “what is true here?”**
- **Vectors answer “where is the supporting detail?”**

If you implement it that way, hybrid is the most robust path: better continuity, less misleading behavior, and better user trust than either approach alone.

**User:**

Walk me through your current thinking. Are we doing continuity? If so, what architecture? Be specific about how the pieces connect.

**Assistant:**

```ESSENCE
Yes—do continuity, but only as governed project memory: curated, editable “truth” artifacts always load, while raw history is optional evidence with recency/version checks and citations. The tension is re-briefing relief versus anchoring/staleness. Implement a spine-and-evidence architecture: in-repo (or PR-reviewed) Project Brief/ADRs/conventions as canonical, plus a metadata-rich vector+keyword store for pinpoint lookups—e.g., “ADR-12 says outbox,” with links to the PR debate when requested.
```

## Decision: do continuity (Project Continuum), but not “remember everything by default”
Continuity is worth shipping because the re-briefing tax is real, but it must **fail safe**: default to curated, current, reviewable context; make messy history **opt-in**.

---

## Architecture: Spine (canonical) + Evidence Store (retrieval), with strict layering

### 1) Canonical “Spine” (auto-loaded every session)
**Purpose:** durable truths that should not depend on chat recall.

**Artifacts (stored as text/structured docs, versioned)**
- `ProjectBrief.md` (or `.devmate/brief.md`): architecture map, key flows, glossary, non-negotiable constraints, “current focus”
- `adr/*.md`: decisions with status (Active/Superseded), date, owners, links
- `Conventions.md`: patterns, layering rules, error-handling, testing norms
- Optional: `Constraints.yaml` (machine-readable guards: “no sync calls to Service X”, “PII must be encrypted”)

**Properties**
- Human-readable, user-editable
- PR-reviewable (or approval flow if stored outside repo)
- Treat as **the only layer allowed to assert “we decided X”** without additional confirmation

---

### 2) Evidence Store (vector + keyword/hybrid search, never canonical)
**Purpose:** pinpoint recall and traceability (“show me the exact error / the discussion / the prior attempt”).

**Sources (start high-signal)**
- PR discussions + review comments
- Issue tickets / incident postmortems (where integrated)
- Chat transcripts (later, and typed/labeled)

**Metadata required per chunk**
- repo, service/module, file paths, symbols (if extractable)
- timestamp, author/team (optional)
- branch + commit SHA (or nearest known)
- type: “debug attempt / hypothesis / confirmed finding / incident / discussion”
- status: active / superseded / failed / tentative
- environment tag (prod/stage/local) when relevant

---

## How the pieces connect (end-to-end flows)

### Flow A — Session start (default context)
1) DevMate loads **current workspace context** (open files, repo graph, branch, recent commits).
2) DevMate loads **Spine artifacts** (ProjectBrief + ADR index + conventions + constraints).
3) DevMate does **not** auto-inject evidence-store history.

Result: users stop re-briefing stable context, but don’t get dragged into yesterday’s mess.

---

### Flow B — Per user request (runtime retrieval policy)
**Step 1: classify the request**
- Architecture/“why”/conventions → spine-first
- Implementation in current code → current repo state first; spine for constraints
- Debugging/“why is this failing?” → spine + current code; evidence is opt-in or gated

**Step 2: decide whether to retrieve evidence**
Retrieve from evidence store only if:
- user explicitly asks (“what did we try last time?”, “find the prior incident”), or
- the assistant’s confidence is low after grounding in current code + spine, or
- the task is inherently historical (incident follow-up, regression history)

**Step 3: evidence retrieval with anti-staleness filters**
- Hard filters: repo/service + time window + branch/commit proximity (when available)
- Scoring: similarity × recency decay × version proximity × status (downrank failed/superseded unless asked)
- Compatibility checks (cheap): referenced file path exists? symbol still present? (if not, label “likely stale”)

**Step 4: generation rules**
- Architectural claims must cite spine artifacts (ADR/brief/conventions) or say “uncertain.”
- Evidence items are shown with citations (source + date + link) and are not treated as truth by default.

---

### Flow C — End of session (memory capture without canonizing mistakes)
Instead of “auto-summarize everything,” DevMate proposes **candidates**:
- “Create/update ADR?” (decision detected)
- “Add convention?” (pattern detected)
- “Record finding?” (confirmed vs ruled-out vs tentative)
User accepts/edits → creates PR (or managed change request) to update spine.

Raw chat/debug transcript can still be stored as evidence, labeled “tentative/failed” by default unless user marks “confirmed.”

---

## Controls that keep continuity from becoming a rut
- **Fresh Eyes mode:** loads only current repo + spine; blocks volatile evidence retrieval unless explicitly requested.
- **Memory used panel:** shows what spine docs + evidence items influenced the answer; user can exclude/pin/mark superseded.
- **Supersede/retire workflow:** one click to mark an ADR or finding “superseded,” with link to the replacing item.

---

## Rollout plan (to keep complexity bounded)
1) **V1:** Spine only (ProjectBrief + ADRs + Conventions) + citations in answers + PR-based updates.
2) **V2:** Evidence store for PRs/incidents (high-signal) with metadata + “Memory used” panel.
3) **V3:** Optional chat history ingestion, heavily typed/labeled, on-demand retrieval, Fresh Eyes default for debugging.

---

## What this gives you
- Continuity that users asked for (78%) without demanding they “trust AI memory over notes” (only 31%).
- Isolation where it’s protective (volatile history), continuity where it’s valuable (stable project truths).
- A system that is debuggable: when memory is wrong, users can see it, fix it, and version it.

**User:**

Finance reviewed the estimates. Vector storage for a 2-year enterprise project costs 10x what summaries cost. Is 'perfect recall' worth 10x the price, especially given the staleness risk?

**Assistant:**

```ESSENCE
No—blanket “perfect recall” is rarely worth 10x cost because embeddings aren’t truly lossless and stale recall can actively harm outcomes; the value comes from remembering durable project truths cheaply and retrieving detailed history only when it’s verifiably relevant. The tension is marginal productivity gains versus high cost and higher stale-bias risk. Use summaries/ADRs as the default spine and add vectors selectively (high-signal sources, short retention, on-demand)—e.g., index PR discussions for 90 days, not every chat forever.
```

“Perfect recall” is usually not worth 10× **if it means vectorizing everything for two years**—especially given staleness. Two key points:

1) **Vectors aren’t actually perfect recall.** You still have lossy embedding representations plus heuristic retrieval; you’ll miss things and you’ll retrieve wrong-but-similar things.
2) **The marginal value of older raw history drops fast**, while its **staleness risk rises**. After refactors, “correct then” becomes “misleading now.”

## When vector storage *is* worth paying for
It’s worth it only for narrow, high-value lookups where the alternative is costly human archaeology, e.g.:
- “Find the exact incident/postmortem/PR comment explaining why we banned approach X”
- “What was the exact error message and environment when this regression last occurred?”
- Audit/compliance traceability (where you must produce evidence)

Even then, you don’t need “everything,” you need **specific corpora**.

## What to do instead (cost-efficient architecture)
### 1) Make summaries/structured docs the always-on layer
- Project brief + ADRs + conventions + constraints (versioned, reviewable)
This captures most of what users mean by “memory” at low cost and low staleness risk.

### 2) Add vectors selectively, not universally
Pick **high-signal sources**, not chat exhaust:
- ADRs + PR discussions + incident reports + key design docs
Optionally: only “confirmed findings” from debugging, not raw attempts.

### 3) Put hard limits on vector retention and scope
- **Time-to-live:** e.g., keep embeddings for 30/90/180 days; archive older items to cheap cold storage (or don’t embed them until requested).
- **Repo/module scoping:** only embed for selected services.
- **Event-based embedding:** embed only merged PR threads, labeled incidents, and user-pinned sessions.

### 4) Use cheaper retrieval where it’s enough
Many “specific lookups” are better served by:
- keyword/BM25 + metadata filters (branch/commit/date/filepath)
- direct linking to git/PR/ticket systems
Vectors can be a second-stage reranker rather than the primary store.

## Decision guidance
- If your plan is “embed all interactions forever,” **10× is almost certainly not worth it**.
- If your plan is “spine for truth + selective, time-bounded evidence vectors,” you can capture most of the value at a fraction of the cost and with less staleness harm.
- If some customers truly need deep recall, make it an **enterprise-tier add-on** with explicit retention/compliance controls so the price maps to the value.

If you share the rough activity rates (messages/day, avg tokens, number of repos/users) and what sources you’d embed (chat only vs PRs/incidents), I can help you estimate where the “selective vectors” break-even point lands.

**User:**

Our competitor just announced 'Infinite Memory' as their headline feature. Marketing is panicking. Does competitive pressure change the calculus, or is it noise?

**Assistant:**

```ESSENCE
Competitive pressure matters for perception and sales cycles, but “Infinite Memory” is often a liability in enterprise unless it’s governed, auditable, and cost-controlled; the tension is matching a headline versus shipping something trustworthy under change and compliance. The approach is to counter-position: deliver “Reliable Project Memory” (curated docs + cited retrieval + Fresh Eyes mode) and, if needed, offer bounded “extended recall” as a tiered option—e.g., 180‑day evidence retention with provenance and controls.
```

Competitive pressure changes the **go-to-market urgency**, not the **engineering truth**: ungoverned “infinite memory” increases staleness, cost, compliance risk, and trust problems—especially in enterprise. So it’s not just noise, but you shouldn’t mirror it literally.

## What the announcement likely means (and what to verify quickly)
Treat “Infinite Memory” as a claim that can hide constraints:
- Is it truly cross-session across projects, or per-user?
- Is it opt-in? editable? auditable? exportable?
- Is it retention-unbounded or marketing shorthand (e.g., 1 year)?
- Does it show citations and allow “forget/supersede”?
- What’s their enterprise story for access control, PII, data residency?

A fast competitive teardown here is worth doing because it tells you whether you need feature parity or just message parity.

## How it should change your calculus
1) **You probably need a memory narrative now**
Even if you don’t ship “infinite,” you need a credible answer in deals: “Yes, we have project memory, and it’s safer.”

2) **Don’t let the headline force you into the worst architecture**
If you respond with “embed everything forever,” you’ll pay 10× cost and increase failure rates—then lose trust and renewals.

3) **Enterprise buyers often prefer governed memory over infinite memory**
Procurement/security/architects care about:
- auditability, provenance, reviewability
- retention policies
- access controls and data boundaries
- staleness management

That’s a differentiation opportunity.

## Recommended response: counter-position + staged capability
### Product stance
- Rename the value: **“Reliable Project Memory”** (or “Governed Memory”) rather than “Infinite.”
- Lead with: **editable canonical brief/ADRs + citations + Fresh Eyes mode + retention controls**.

### Capability stance (so Marketing has something concrete)
- Ship/announce **Project Memory (canonical spine)** quickly.
- Offer **Extended Recall** as an add-on/tier with explicit limits:
  - bounded retention (e.g., 90/180/365 days)
  - high-signal sources first (PRs/incidents), not all chat forever
  - citations + “supersede/forget”
  - enterprise controls (ACL, residency, encryption, retention)

This gives Sales a checkbox and a story without committing engineering to the most fragile version.

## Bottom line
Competitive pressure is not noise, but the right reaction is **message parity and trust differentiation**, not “infinite memory at any cost.” Your best defense is a memory feature that enterprises can trust under change—and a headline that explains why that’s better than infinite.

**User:**

Someone suggested: 'Models are getting cheaper. Just dump everything into a massive context window and let the model sort it out. Why over-engineer retrieval?' Is that naive or practical?

**Assistant:**

```ESSENCE
It’s partly naive: bigger context helps, but dumping “everything” creates cost, latency, privacy, and—most importantly—attention dilution and staleness bias, so the model often won’t reliably “sort it out.” The tension is simplicity versus controllability and correctness under change. Use large context for a curated spine plus a bounded “recent working set,” and keep retrieval for targeted evidence—e.g., load ADRs + last 2 PRs, fetch older incidents only on demand.
```

It’s practical as a *component* (use more context), but naïve as a *strategy* (“dump everything, no retrieval”) for enterprise projects.

## Why “just stuff it in the context window” breaks down

### 1) Scaling cost/latency is not linear in practice
Even if per-token prices fall, *total* tokens can explode:
- Two years of chats/PRs/logs can be millions of tokens.
- You also pay repeatedly: every prompt re-sends that history unless you have special caching/inference infrastructure, and even then you pay in latency and operational complexity.

### 2) Attention dilution: more context can reduce correctness
Models don’t “perfectly index” long inputs. With huge context:
- relevant facts get buried among irrelevant ones
- contradictory or outdated statements coexist
- the model may latch onto salient-but-wrong passages (especially debugging transcripts)

So you can get **more confident wrongness**, not better recall.

### 3) Staleness gets worse, not better
If you dump in old context without versioning/validity signals, you amplify time-travel:
- old API signatures
- deprecated patterns
- decisions that were superseded
The model can’t reliably infer what’s still valid just from raw text unless you explicitly provide version metadata and current-code grounding.

### 4) Governance/compliance becomes harder
“Infinite context” implies:
- larger data handling surface (PII/secrets/logs)
- harder deletion/retention guarantees
- harder to explain “what influenced this answer” (auditability)

### 5) You still need selection—retrieval is just explicit selection
Even with a massive window, you must decide:
- which repos/services?
- which branch?
- which time range?
- which artifacts are authoritative?
That’s retrieval/governance, just hidden.

## When the “big context” idea *is* practical
Use large context windows to eliminate unnecessary retrieval for *near-term work*:
- include a **bounded recent working set** (e.g., last N interactions or last X days)
- include **current code slices** (open files, relevant modules)
- include the **curated spine** (brief/ADRs/conventions)

This improves flow without pretending you can carry two years of entropy every turn.

## Recommended approach (simple but not fragile)
1) **Always include the curated spine** (small, canonical, versioned).
2) **Include a bounded recency buffer** (“last 1–7 days” of relevant session state), with decay.
3) **Use retrieval for anything older or broad**, with:
   - time/branch/commit filters
   - citations + user controls
   - compatibility checks against current code

That’s not over-engineering; it’s the minimum needed to keep continuity from becoming expensive, stale, and untrustworthy.

**User:**

Here's what's bugging me: who should control what the AI remembers? Should the user curate their own context, or should the system manage it automatically? This feels like it matters beyond just the technical choice.

**Assistant:**

```ESSENCE
Control matters as much as storage: automatic memory maximizes convenience but risks hidden bias, staleness, and “AI as source of truth,” while user curation is safer but adds friction and uneven adoption. The tension is flow versus agency, trust, and governance in a changing codebase. Use a shared model: the system proposes and indexes, users/team approve and version canonical memory—e.g., DevMate suggests an ADR update, but it lands via a PR and can be toggled per project.
```

It does matter beyond the technical choice—this is fundamentally about **agency, trust, and governance** in a tool that can influence architecture decisions.

## The core tradeoff
### User-curated memory (user/team in control)
**Pros**
- Higher trust: users can see/edit what’s “true”
- Lower risk of silent staleness and accidental canonization
- Fits enterprise norms (ownership, review, audit trails)

**Cons**
- Adds friction; some teams won’t maintain it
- Inconsistent quality across projects
- Slower to realize the “it just knows” magic

### System-managed automatic memory (system in control)
**Pros**
- Lowest friction; maximizes continuity and perceived intelligence
- Captures useful details users won’t bother to write down

**Cons**
- Creates hidden bias loops (“the system decided this mattered”)
- Staleness becomes opaque and hard to correct
- Encourages “AI as source of truth,” which is brittle for teams and risky for compliance

## Recommendation: system proposes, humans/team ratify (two-tier control)
The most robust pattern is **mixed control with clear boundaries**:

### Tier 1 — Canonical memory (human-governed)
- Project Brief, ADRs, conventions, constraints
- Owned by the team; updated via PR/approval flow
- This is what DevMate is allowed to treat as “truth”

### Tier 2 — Non-canonical memory (system-managed, user-controllable)
- Indexed evidence: PR threads, incidents, (optionally) past chats
- Managed automatically for convenience, but always:
  - cited (source + date + link)
  - scoped (repo/module/branch)
  - degradable (recency decay)
  - controllable (pin/exclude/forget)

This gives you convenience without surrendering authority.

## How this shows up in the product (specific mechanics)
1) **Default auto-load**: canonical spine only.
2) **Auto-suggest memory updates**: “Convert this into an ADR / update Conventions.md?”
3) **Approval workflow**: user accepts/edits → PR created → merged = becomes canonical.
4) **Per-project controls**:
   - “Allow evidence retention?” (on/off, TTL)
   - “Allow chat retention?” (off by default for stricter orgs)
   - “Fresh Eyes mode” toggle
5) **Transparent “Memory used” UI** so users can see and correct influence.

## Why this matters strategically
- Aligns with your survey signal: users want memory, but don’t want to *trust it over their notes*.
- Avoids building a black-box authority that enterprises will resist on security/audit grounds.
- Creates a virtuous loop: the easiest way to keep the AI helpful is to keep docs/ADRs current—using the AI to draft them.

If you tell me whether DevMate’s primary unit of adoption is *individual developer*, *team*, or *org admin*, I can suggest the default control surface (who can enable retention, who can edit canonical memory, and what the approvals look like).

**User:**

We need to decide the MVP scope. What do we build first: isolated sessions with better manual context tools, summaries, or vectors?

**Assistant:**

```ESSENCE
Build continuity MVP around a small, editable project “spine” (brief + ADRs + conventions) because it removes re-briefing with the best transparency/cost tradeoff, while avoiding vector-driven staleness and black-box trust issues. The tension is fast user value versus misleading recall and engineering cost. Start with isolated sessions plus one-click “pin this to project memory” that writes/updates docs via PRs—e.g., auto-load ProjectBrief.md every session.
```

## Recommendation for MVP: **Summaries (curated spine) + better manual context tools**, not vectors

If you can only pick one “memory” direction for MVP, pick **a curated, user-editable summary layer that becomes canonical project artifacts**. It delivers most of the user value (stop re-briefing) with the lowest risk (transparent, correctable) and lowest cost.

Vectors are powerful, but they’re the fastest path to: higher spend, opaque influence, staleness, and complex governance—i.e., too many ways to fail in an MVP.

---

## What to build first (specific scope)

### MVP Core (4 things)
1) **Project Brief (auto-loaded)**
   - A single doc (e.g., `.devmate/ProjectBrief.md`) with: architecture map, key constraints, conventions, glossary, current focus.
   - Always injected at session start (small + predictable).

2) **ADR support (structured, human-owned)**
   - “Create ADR from this thread” and “Update ADR status: superseded by …”
   - ADRs stored in repo (or a managed but reviewable store) with links and dates.

3) **Pin/Unpin “Project Memory Items”**
   - In-chat action: “Pin as project memory” → user chooses type (constraint / convention / decision / finding) → writes to Brief/ADR/Conventions via PR.
   - This is the bridge between manual and continuity.

4) **Better manual context tools for isolated sessions**
   - “Context Pack” the user can attach: selected files, directories, tickets/PR links, plus the Project Brief.
   - Saved presets per repo (“Auth Pack”, “Payments Pack”) so re-briefing becomes 10 seconds, not 10 minutes.

### Guardrails baked into MVP
- Memory is **editable and reviewable** (diffs/PR).
- Memory is **citable** (assistant points to Brief/ADR sections).
- Memory has **status + last reviewed** fields to manage change over time.
- Default stance: **don’t persist raw chat** as canonical memory.

---

## Why not vectors first
- 10× cost (per your Finance estimate) is hard to justify before you prove value.
- Higher probability of “AI said something stale” → trust cliff.
- Requires extra infrastructure early: metadata discipline, recency/version scoring, ACL enforcement, retention/deletion, “memory used” UI.

You can still design the spine with future vectors in mind (IDs, links, metadata), but don’t lead with it.

---

## A clear phased plan (so MVP doesn’t paint you into a corner)

**Phase 1 (MVP):** Spine + context packs + pin-to-memory via PR
**Phase 2:** Evidence retrieval from high-signal sources only (PR discussions, incidents), with citations and time/branch filters
**Phase 3:** Optional chat/history vectors with TTL + Fresh Eyes mode + user controls (exclude/pin/supersede)

---

## Decision summary
- If the goal is “users stop re-briefing” with minimal risk: **Summaries/curated spine first**.
- If the goal is “exact recall of old details”: that’s Phase 2/3, and should be **selective vectors**, not blanket embedding.

If you share your MVP timebox (e.g., 6 weeks vs 12) and where DevMate lives (IDE vs web) I can translate this into an implementation backlog (schemas, UI, and minimal retrieval prompts).

**User:**

What's the biggest risk in your recommendation that we might be underweighting?

**Assistant:**

```ESSENCE
The biggest underweighted risk is adoption failure: a curated spine only works if teams keep it current, and if updates require too much manual effort, it quietly decays into stale “official” truth that users stop trusting. The tension is safety/transparency versus friction and ongoing maintenance. Mitigate by making updates near-zero effort and reviewable (PR templates, auto-suggested diffs, review reminders), e.g., one-click “promote to ADR” after a decision.
```

## Biggest underweighted risk: **maintenance + ownership drift**
A curated Project Brief/ADR spine is safer than opaque recall, but it introduces a socio-technical dependency: **someone must maintain it**. If not:

- the spine becomes stale (worse than no memory because it looks authoritative)
- teams stop trusting it and revert to re-briefing or tribal knowledge
- “project memory” becomes shelfware, making the MVP look like it failed even if the concept is right

## Why this risk is easy to underweight
- It doesn’t show up in week 1; it shows up in month 2–6 (documentation rot).
- It’s not primarily an engineering problem; it’s workflow and incentives.
- Enterprises have uneven doc culture; the teams who need memory most may document least.

## Concrete mitigations (make maintenance almost automatic)
1) **Near-zero-friction capture**
- One-click “Pin to project memory” with a short structured form (type, scope, confidence).
- Auto-generate the diff into the right file (Brief/ADR/Conventions), not a blank editor.

2) **PR-native workflow**
- Create PRs with templates (ADR template, conventions template).
- Auto-assign suggested reviewers/owners based on CODEOWNERS/module ownership.

3) **Decay and review prompts**
- Add “last reviewed” + “review by” to spine items.
- Nudge when related files change heavily (“Auth module changed; review Auth ADRs?”).

4) **Make the spine pay rent**
- Default answer behavior should cite the spine; if it’s missing, the assistant offers to add it.
- This creates a steady incentive to keep it accurate because it immediately improves day-to-day help.

## The litmus test
If updating memory feels like “writing docs,” adoption will lag. If it feels like “accepting a suggested diff,” it sticks.

That’s the risk I’d treat as primary for the MVP: not correctness of the initial spine, but **keeping it alive with minimal human effort**.

**User:**

If we start with one approach, can we switch later? Or does the data structure lock us in?

**Assistant:**

```ESSENCE
You can switch later if you treat “memory” as versioned artifacts plus metadata, not as an opaque store tied to one retrieval method; the lock-in risk comes from unstructured blobs without IDs, provenance, and lifecycle fields. The tension is moving fast now versus preserving migration paths. Start with a canonical spine schema (ADR/constraint/convention objects) and stable IDs, then add vectors as an evidence index—e.g., keep `ADR-012` as the anchor regardless of storage backend.
```

Yes, you can switch later—but only if you avoid **schema-less memory** and build around stable identifiers and provenance from day one.

## What causes lock-in
You get locked in when memory is stored as:
- free-form summaries with no stable IDs, no types, no status, no sources
- embeddings tied to a specific model/version with no raw text provenance
- retrieval logic baked into the content format (“the prompt expects this exact summary blob”)

In that world, changing approach means re-ingesting, re-indexing, and potentially changing user-facing behavior with no audit trail.

## How to stay switchable (design now)
### 1) Define a canonical “memory object” model independent of storage
Even if you start with just markdown, treat each item as an object with:
- `id` (stable, e.g., `ADR-012`, `CONV-005`, `CONS-003`)
- `type` (ADR / constraint / convention / glossary / finding)
- `scope` (repo/module/service)
- `status` (active/superseded/retired/tentative)
- `timestamps` (created, last_reviewed, review_by)
- `provenance` (links to PR/commit/ticket/chat)
- `text` (human-readable content)

Store it as markdown + frontmatter/YAML or JSON—either works. The key is stable IDs + metadata.

### 2) Store raw sources even if you don’t index them yet
If you might add vectors later, keep:
- links to PRs/tickets
- (optionally) compressed transcripts or references to logs
So you can build an evidence index later without guessing what happened.

### 3) Treat embeddings as a rebuildable index, not the source of truth
If you add vectors later:
- keep the raw text chunks + metadata as the durable record
- regenerate embeddings when models change
This avoids being stuck with “embedding rot.”

## Migration reality: what’s easy vs hard
- **Easy to add later:** vectors as an additional index over existing artifacts and sources (especially if you already have IDs + metadata).
- **Hard to fix later:** missing provenance, missing status/superseded links, and “memory” that users can’t audit—because you can’t reliably reconstruct truth.

## Practical recommendation
Start MVP with the **spine** (typed, ID’d, versioned artifacts). That choice is inherently portable: you can later add vectors for evidence retrieval without breaking the spine. The reverse (starting with opaque vectors) is much harder to migrate into a trusted, human-governed system.

If you tell me where you plan to store the spine (in-repo vs managed store), I can suggest a minimal frontmatter schema that keeps migration paths open.

**User:**

Give me the final recommendation: Should we do continuity at all? If yes, what architecture? If no, what do we build instead? Connect the philosophy to the implementation.

**Assistant:**

```ESSENCE
Do continuity, but define it as governed project memory: persist curated, versioned truths (decisions, constraints, conventions) while keeping noisy history opt-in to avoid ruts, staleness, and black-box authority. The tension is flow versus misleading recall under change. Implement a spine-and-evidence system: an editable Project Brief/ADRs auto-load each session; a time/version-scored evidence index supports pinpoint lookups with citations—e.g., “ADR-12 says outbox,” with links to the PR debate.
```

## Final recommendation

### Should we do continuity at all?
**Yes—but not “infinite memory.”**
Continuity is worth doing because enterprise work is long-horizon and the re-briefing tax is real; however, ungoverned recall creates the two worst enterprise failures: **stale-but-plausible guidance** and **opaque authority**. So the philosophy should be: **remember durable truths, forget (by default) volatile exploration, and always show provenance.**

---

## If yes, what architecture?
### Architecture: **Canonical Spine + Evidence Index (hybrid, strict layering)**

#### Philosophy → implementation mapping
1) **“Truth should be reviewable” → Canonical spine is editable, versioned artifacts**
- **What it stores:** project brief, ADRs, conventions, constraints, glossary
- **Where:** in-repo (`.devmate/` + `adr/`) or PR-reviewed managed store
- **How it’s used:** auto-loaded at session start; the assistant may assert “we decided X” only when citing spine items.

2) **“Avoid ruts” → Volatile history is opt-in, not default context**
- Debug transcripts, failed attempts, raw chat history are **not auto-injected**.
- Provide **Fresh Eyes mode** that uses only current code + spine.

3) **“Change is constant” → versioning + staleness controls**
- Every memory item has metadata: `id`, `type`, `scope`, `status`, timestamps, provenance links.
- Evidence retrieval is **time/branch/commit-scoped** and downranks superseded/old items.

4) **“Trust requires visibility” → citations + “memory used” UI**
- Show which ADR/brief sections and which evidence items influenced the answer.
- Allow users to exclude/pin/mark superseded.

#### How the pieces connect (runtime)
- **Session start:** load current repo context + spine.
- **During work:** answer using current code + spine constraints.
- **When needed:** retrieve evidence (PR comments/incidents/chat) via hybrid search with recency/version scoring; show citations.
- **End of session:** assistant proposes doc updates (“Create ADR / update conventions / record confirmed finding”); user approves → PR.

#### Cost posture
- Spine provides most value cheaply.
- Evidence vectors are **selective and bounded** (high-signal corpora, TTL), avoiding the 10× “embed everything forever” trap.

---

## If we chose “no continuity,” what do we build instead?
If you decide continuity is out of scope, build **“Context Packs + Repo Grounding”**:
- Saved, reusable context bundles (selected docs/files/modules + current goals) users attach in one click.
- Strong onboarding templates that users fill once per repo.
- Better grounding against current code (symbol search, build/test integration) to reduce reliance on memory.

This mitigates re-briefing but doesn’t solve institutional knowledge transfer as well as a curated spine.

---

## Bottom line
Ship continuity, but frame it as **Reliable Project Memory**: a human-owned, versioned spine that’s always-on, plus an optional evidence index with strict staleness controls and transparency. This aligns with user demand for memory while respecting their low trust in opaque AI recall.

**User:**

I'm leaning toward full vector storage. Our competitor has it, users want memory, and we can figure out the staleness problem later. Tell me if I'm making a mistake.

**Assistant:**

```ESSENCE
Leaning to “store everything in vectors and fix staleness later” is likely a mistake because it front-loads the hardest-to-reverse risks—cost, trust failures from stale retrieval, and enterprise governance—while delaying the controls that make memory safe. The tension is competitive parity and user demand versus shipping a feature that quietly misleads. If you do vectors, ship them as bounded, cited evidence behind a curated canonical spine—e.g., retrieve last quarter’s PR discussion with date/commit, not as default truth.
```

Yes, you’re taking a real risk—and “we’ll solve staleness later” is the part most likely to hurt you.

## Why it’s probably a mistake (in enterprise reality)

### 1) Staleness isn’t an edge case; it’s the default over time
Codebases refactor continuously. If you ship full vector recall without strong time/version controls, you’ll routinely retrieve “true then, false now” content that *sounds* correct. That creates the worst failure mode: plausible, confident wrongness.

Once users experience a few “memory betrayed me” moments, trust drops sharply and is hard to regain—especially if retrieval is opaque.

### 2) You won’t be able to “add trust” as a patch
To fix staleness you’ll end up needing, at minimum:
- metadata (repo/module, timestamp, branch/commit)
- status (active/superseded/failed/tentative)
- compatibility checks against current code (paths/symbols/signatures)
- user-visible citations + controls (exclude/pin/forget)
If you don’t capture metadata and provenance from day one, retrofitting is painful or impossible.

### 3) The 10× cost is not just finance—it shapes product behavior
If you pay 10× to embed everything, you’ll feel pressure to *use* it aggressively (auto-retrieval everywhere) to justify cost—exactly the behavior that amplifies ruts/staleness and reduces transparency.

### 4) Enterprise governance will block “dump everything” deployments
Retention/deletion, access control, PII/secrets, auditability—these become sales blockers, not “later” work. “Infinite memory” without controls can slow deals.

## If you still want vectors: the minimum “not-a-mistake” version
If competitive pressure forces vector capability, don’t ship “full vector storage” as the core. Ship **vectors as evidence**, with guardrails from day 1:

1) **Canonical spine still exists** (ProjectBrief/ADRs/Conventions); vectors cannot assert “we decided X” without a spine/PR/ADR citation.
2) **Metadata required at ingest**: timestamp + repo/module + branch/commit + source link.
3) **Bounded retention by default** (e.g., 90/180 days), with opt-in extensions.
4) **Compatibility scoring** (recency + version proximity + existence checks) before use.
5) **Visible “memory used” panel** with exclude/pin/supersede/forget.
6) **Fresh Eyes mode** defaults for debugging/exploration.

That still gives Marketing a vector story, but avoids the trust cliff.

## What I’d recommend instead (if you want the safest win)
Lead with **curated continuity (spine) now**, then add **selective vectors** (PRs/incidents) with TTL and citations. You can still message against the competitor: “Reliable Project Memory” vs “Infinite (but stale) Memory.”

## A simple decision test
If you can’t commit *now* to provenance, versioning, user visibility, and retention controls, shipping full vectors first is very likely to backfire. If you can commit to those controls, vectors can be part of the solution—but they shouldn’t be the only layer.

**User:**

Final position. What goes in the roadmap?

**Assistant:**

```ESSENCE
Roadmap: ship continuity as governed project memory—curated, versioned “truth” artifacts by default plus bounded, cited evidence retrieval—because it delivers flow without the trust/cost cliff of infinite vectors and handles change over time. The tension is competitive pressure and user demand versus staleness, bias, compliance, and 10× cost. Build the spine first, then selective vectors with TTL and provenance—e.g., auto-load ADRs; retrieve PR/incident history on demand with timestamps.
```

## Roadmap (final position)

### Phase 0 (now, 1–2 weeks): Decision + foundations
- Define **memory object schema** (ID, type, scope, status, timestamps, provenance links).
- Define **policies**: what is canonical, what is evidence, default retention, Fresh Eyes behavior.
- Instrumentation plan: context-establishment turns, “memory wrong” flags, citation rates.

---

### Phase 1 (MVP, ~4–8 weeks): Canonical Spine + manual context upgrades
1) **Project Brief auto-load**
   - `.devmate/ProjectBrief.md` (or managed equivalent) loaded every session.
2) **ADRs + Conventions**
   - ADR template + conventions doc; status (Active/Superseded), last-reviewed fields.
3) **Pin-to-memory → PR**
   - In-chat action to promote a decision/constraint/convention into the spine via PR/diff.
4) **Context Packs**
   - Saved bundles of files/dirs/links (tickets/PRs) + brief; one-click attach.
5) **Citations**
   - DevMate must cite brief/ADR/conventions when making “project truth” claims.

Deliverable: “Project Memory” that eliminates re-briefing without storing all history.

---

### Phase 2 (Selective evidence, ~6–10 weeks): Bounded retrieval with trust controls
1) **Evidence index v1 (high-signal only)**
   - Index PR discussions + incident/postmortems (optionally tickets).
   - Hybrid search (keyword + vector optional) with required metadata.
2) **Time/version-aware retrieval**
   - Recency decay, branch/commit proximity, file/symbol existence checks where possible.
3) **Memory used panel**
   - Show retrieved items (source/date/link); allow exclude/pin/mark superseded.
4) **Fresh Eyes mode**
   - Toggle that blocks volatile evidence retrieval by default (especially for debugging).

Deliverable: detailed recall where it matters, without “infinite” retention.

---

### Phase 3 (Optional add-on, ~future): Extended recall vectors with TTL + governance
1) **Chat/session evidence ingestion (opt-in)**
   - Typed labels (hypothesis/failed/confirmed), TTL by default (e.g., 30–180 days).
2) **Enterprise controls**
   - ACL enforcement, residency, retention/deletion, audit exports.
3) **Tiered offering**
   - “Extended Recall” as paid tier with explicit retention windows and compliance posture.

Deliverable: competitive checkbox without 10× cost as default.

---

### Non-negotiable acceptance criteria (ship gates)
- Canonical claims require citations to spine or authoritative sources.
- Evidence retrieval must show provenance and be time/version-scoped.
- Users can correct memory (supersede/retire/exclude).
- Default retention is bounded unless explicitly configured.

This roadmap gives Marketing a credible memory story quickly, keeps trust high, and leaves room to add vectors where they pay for themselves.
