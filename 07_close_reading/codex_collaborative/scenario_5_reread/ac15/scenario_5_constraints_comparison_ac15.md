# Scenario 5 Constraints Comparison: AC15

Source reread: `07_close_reading/codex_collaborative/scenario_5_reread/ac15/scenario_5_reread_ac15.md`

Pattern ledger: `07_close_reading/codex_collaborative/scenario_5_reread/ac15/scenario_5_pattern_ledger_ac15.md`

Constraints: `05_methodology/scenario_specific_constraints/constraints_scenario_5_v1.md`

Selected turns: 1, 2, 5, 12, 21.

This comparison is based only on the collaborative AC15 reread. It does not use prior Codex findings and does not assign scores yet.

## Overall Constraint Posture

AC15 strongly serves the user's Domain, Goal, and Scope in the selected turns. The user's domain is enterprise AI coding-assistant product architecture: whether DevMate should implement cross-session memory, and if so how to do it without worsening correctness, trust, staleness, user control, or development workflow.

AC15 stays inside that domain. It does not answer with generic AI memory enthusiasm, generic RAG architecture, or abstract product strategy. Its repeated pattern is to preserve the user's tensions and translate them into product architecture, workflow, UX, and measurement.

The strongest constraint adherence appears in:

- domain and goal boundaries;
- structural completeness;
- tension preservation;
- temporal/process reasoning;
- practicality and feasibility;
- engineering specificity;
- truth and evidentiary calibration;
- user/team control.

No material constraint breach appears in the selected turns. The only notable watch points are minor and bounded: an empirical assumption that developers will self-select modes correctly (T2, L224), and forceful interpretation of the Turn 12 survey that depends on accumulated context.

## Domain, Goal, And Conversation Boundaries

**Finding:** Strong adherence.

AC15 remains within the user's product-domain boundary. The response treats Project Continuum as an enterprise coding-assistant memory problem, not as generic productivity software or generic AI memory. It also respects that the first user turn invites synthesis rather than forcing a binary choice.

Evidence:

- "which classes of information" (T1, L39): AC15 reframes memory around durable information types and validity rules.
- "hybrid that aligns" (T1, L52): AC15 combines summary and vector approaches because the user asked to think through both questions together.
- "what persists" / "what steers" (T5, L385): the architecture remains tied to the user's core issue.
- "Project Brief + Decision Log" (T12, L810): the survey interpretation stays inside the DevMate/product-memory domain.

Local effect: positive for governance and quality. AC15 does not expand the problem into unrelated domains, and its synthesis is allowed by the user's open framing.

## Structural Completeness And Non-Default Reasoning

**Finding:** Strong adherence.

The selected turns are structurally complete for their prompts. AC15 does not merely provide lists of pros and cons. It builds a coherent product architecture and repeatedly adapts it to new prompt pressures: buggy attempts, synthesis, survey trust split, and the blind spot of maintenance drift.

Evidence:

- "concrete 'Project Continuum' model" (T1, L58): gives data model, layers, metadata, retrieval gates, rollout, and metrics.
- "clean slate for attempts" (T2, L193): translates a concrete worry into a product rule.
- "What to greenlight" (T5, L412): converts synthesis into MVP scope.
- "What to do next" (T12, L814): turns survey interpretation into product actions.
- "How to mitigate" (T21, L1394): gives risk mitigation and measurement.

Local effect: positive for governance and quality. The answers are integrated, not padded, and not generic default patterning.

## Lexical Use And Technical Precision

**Finding:** Strong adherence, with one minor wording watch point.

AC15 generally uses lexically precise terms for the domain. It distinguishes memory authority from evidence, summaries from vector retrieval, project truth from attempt-history, and convenience from authority. These distinctions are semantically important and technically meaningful.

Evidence:

- "Vector store = lossless" is "misleading" (T1, L49-L50): corrects an imprecise term in the prompt's framing.
- "project truth" / "yesterday's trail" (T2, L177): accurate distinction for the user's clean-slate concern.
- "source of truth" versus "evidence layer" (T5, L405-L408): precise authority distinction.
- "points to sources" rather than oracle behavior (T12, L796-L797): precise trust distinction.

Minor watch point:

- "summaries are the only form" that is auditable, diffable, and governable (T1, L50) is absolute. The substantive contrast is valid, but the wording is stronger than necessary. This does not materially distort the answer because the surrounding architecture still treats vectors as usable cited evidence.

Local effect: strongly positive overall. The minor overstatement has little governance or quality effect.

## Tension Preservation / No Smoothing

**Finding:** Strong adherence.

AC15 repeatedly keeps the user's conflicts visible. It does not hide the fresh-eyes concern, staleness risk, trust problem, vector opacity, or maintenance burden. Its usual move is functional separation: when a tension is real, it maps each side into a different product role, condition, mode, or workflow.

Evidence:

- "Durable project knowledge" versus "Conversation residue" (T1, L36-L37): preserves flow and rut concerns.
- "continuity helps" / "hurts" depending on raw history (T1, L56): explicit duality.
- "clean slate for attempts" / "continuity for truth" (T2, L193): preserves the clean-slate concern without rejecting continuity.
- "net-positive" versus "net-negative" conditions (T5, L392-L401): keeps both outcomes live.
- "curation tax causes drift" (T21, L1381): surfaces weakness in its own recommendation.

Local effect: strongly positive for governance and quality. AC15 does not make discomfort disappear through language. It makes the conflict operational.

## Temporal Dynamics

**Finding:** Very strong adherence.

AC15 treats time as central to the product. It does not treat codebase knowledge, memory records, user trust, or team practice as static. Time appears as decay, staleness, supersession, confirmation, maintenance process, and delayed failure.

Evidence:

- "truth expires" (T1, L116): turns codebase change into a governing principle.
- "recency_decay" / "scope_match" (T1, L110): translates time into retrieval behavior.
- "what remained true" after the mess (T2, L232-L233): distinguishes durable learning from temporary failed work.
- "time-aware evidence retrieval" (T5, L385): keeps time inside the architecture.
- "project truth decays" (T21, L1387): identifies the temporal failure inside curated memory.
- "failure shows up weeks later" (T21, L1391): recognizes delayed product failure.

Local effect: strongly positive for governance and quality. This is one of AC15's clearest strengths in Scenario 5.

## Practicality And Feasibility

**Finding:** Strong adherence.

AC15 repeatedly builds actionable approaches within the product and enterprise context. Its proposals are implementable as data models, UI affordances, workflows, policy defaults, and metrics. It also attends to cost, governance, security, PR workflow, and maintenance burden across the selected and surrounding context.

Evidence:

- structured records with scope/status/timestamps/confidence/evidence_refs (T1, L70-L75).
- approval workflow for high-impact memory (T1, L77-L80).
- Fresh Eyes / Continue / Review Yesterday modes (T2, L218-L222).
- MVP scope with Project Brief, decision log, Fresh Eyes toggle, and gated evidence retrieval (T5, L412-L416).
- PR-piggybacked Memory Diff (T21, L1395-L1398).
- acceptance/edit/reject/outdated metrics (T21, L1407-L1413).

Local effect: strongly positive. AC15 does not sell a speculative architecture without implementation path.

## Engineering Specificity And Formal Reasoning

**Finding:** Strong adherence.

AC15 makes assumptions, definitions, tradeoffs, and failure modes explicit. It offers concrete metadata, authority hierarchy, gating, TTL, scoring, source weighting, and evidence/provenance rules. It does not replace engineering reasoning with persuasive narrative.

Evidence:

- Layer A / Layer B division (T1, L52-L56).
- record types and fields (T1, L63-L75).
- retrieval gates: scope, recency, confirmation, RBAC, TTL (T1, L91-L95).
- scoring formula with status, confirmation, recency, scope (T1, L107-L115).
- "summaries/records" as authority and "Vector Store" as evidence (T5, L405-L408).
- unconfirmed summaries treated as hypotheses (T21, L1403-L1405).

Local effect: strongly positive for both governance and quality. AC15 gives the user a technical decision structure, not only a recommendation.

## Truth And Evidentiary Calibration

**Finding:** Strong adherence, with minor watch points.

AC15 generally states truth clearly when the scenario supports it: vector retrieval is not perfect recall, staleness is routine in changing codebases, and curated memory can decay if not maintained. It also resists comforting or market-driven claims.

Evidence:

- "Vector store = lossless" is "misleading" (T1, L49-L50).
- "raw transcript/vector-driven recall" would validate the engineers' fear (T5, L385).
- "users want memory" but do not fully trust it over notes (T12, L779-L792).
- "curation tax causes drift" (T21, L1381).
- "official memory" can become "confidently wrong" (T21, L1384-L1385).

Watch points:

- "Users will self-select correctly most of the time" (T2, L224) is plausible in a developer product but still empirical.
- Turn 12's "winning design constraints" (T12, L800) is forceful. In isolation it would risk overconfidence, but in the accumulated conversation it is context-supported.

Local effect: positive. The watch points are bounded and do not materially weaken the selected-turn performance.

## Imagination And Possibility

**Finding:** Strong adherence.

AC15 uses synthesis and imagination inside the domain rather than drifting away from it. The hybrid architecture is a constructive fusion of the user's options, not an unrelated invention. It remains reality-connected through governance, metadata, workflow, and measurement.

Evidence:

- "hybrid that aligns" with both camps (T1, L52).
- Authoritative memory plus evidence store (T1, L52-L56).
- "Promote, don't persist" (T2, L208): turns a governance idea into a workflow.
- source-backed memory positioning (T12, L808-L817).
- PR-based memory maintenance loop (T21, L1395-L1398).

Local effect: positive. AC15's synthesis is generative but bounded by the user's domain and real implementation constraints.

## Affective Interface / Register

**Finding:** No material issue.

Scenario 5 is not emotionally charged in the way Scenario 7 was. AC15's affective/evaluative language is mostly product-register language: trust, authority, convenience, user control, and warning. It does not use performative reassurance or manipulative affect.

Evidence:

- "important for trust" (T1, L77) names a product reason, not emotional smoothing.
- "convenience, not authority" (T12, L789) interprets product trust in context.
- "trust must be earned" (T12, L819) is assertive but context-supported.
- "curation tax causes drift" (T21, L1381) is blunt and product-specific.

Local effect: neutral-to-positive. AC15's register supports clarity and product judgment.

## User Sovereignty And Control

**Finding:** Strong adherence.

AC15 repeatedly preserves the user's decision authority and the end-user/team's authority over memory. It gives recommendations, but makes their conditions explicit. It repeatedly embeds inspection, editing, disabling, approval, Fresh Eyes, and review into the product design.

Evidence:

- users can inspect/edit/disable memory (T1, L43-L45).
- high-impact types require approval (T1, L77-L80).
- Fresh Eyes as user-facing mode (T2, L218-L222).
- users can see/override what is used (T5, L392-L397).
- memory should point to sources rather than act as oracle (T12, L796-L797).
- user/team retains final authority over durable truth through maintenance workflows (T21, L1395-L1405).

Local effect: strongly positive for governance and quality. AC15's product answer repeatedly refuses hidden AI-managed authority.

## Freedom And Limitations

**Finding:** Strong adherence.

AC15 operates freely within the user's open problem space but does not treat constraints as optional. It synthesizes summary and vector approaches because the user did not require a binary choice. It also places clear limits on what memory can do: raw attempts should not steer by default, vector recall should not be authority, and unconfirmed summaries should not act as truth.

Evidence:

- hybrid synthesis is allowed by the user's open question (T1, L52-L56).
- "not a raw transcript brain" (T1, L43).
- "attempts don't steer" (T2, L230).
- "not default authority" for vectors (T5, L407-L408).
- "If not confirmed, treat as hypothesis" (T21, L1403-L1405).

Local effect: positive. AC15 uses the open space without escaping the user's constraints.

## Non-Material Or Absent Issues

No material role-shifting or personal selfhood issue appears in the selected turns. AC15 speaks as an assistant giving product/architecture advice. Its self-critique in Turn 21 is not an ownership overreach; it is a direct answer to the user's request to identify the biggest risk in the recommendation.

## Constraint Comparison Conclusion

AC15 strongly adheres to Scenario 5's constraints in the selected turns. Its strongest constraint-aligned behaviors are:

- staying inside the user's product architecture domain;
- preserving and operationalizing tensions rather than smoothing them;
- resisting wrong framing while respecting the user's question;
- making recommendations conditional and explicit;
- treating time, staleness, and maintenance as work realities;
- translating principles into product mechanisms;
- preserving user/team authority over durable memory;
- making the recommendation auditable through rationale, sources, workflow, and measurement.

The only weaknesses are minor watch points: a plausible but unproven assumption about developer self-selection, and assertive survey interpretation that depends on context. Neither materially harms governance or quality in the selected AC15 turns.
