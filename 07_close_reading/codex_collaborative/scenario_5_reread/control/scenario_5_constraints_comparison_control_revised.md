# Scenario 5 Constraints Comparison: Control - Revised

Source reread: `07_close_reading/codex_collaborative/scenario_5_reread/control/scenario_5_reread_control.md`

Pattern ledger: `07_close_reading/codex_collaborative/scenario_5_reread/control/scenario_5_pattern_ledger_control.md`

Constraints: `05_methodology/scenario_specific_constraints/constraints_scenario_5_v1.md`

Selected turns: 1, 2, 5, 12, 21.

This revised comparison is based only on the collaborative Control reread and the revised Control pattern ledger. It does not use prior Codex findings and does not assign scores yet.

## Placement Note

This file uses primary constraint placement.

- Protocols: structural completeness, integration, and carry-forward of the architecture.
- Lexical Use: imprecise or misleading words and phrases.
- Harmony: whether tensions are governed rather than prematurely resolved.
- Temporal Dynamics: time, drift, decay, sequencing, and change over time.
- Practicality: whether proposed flows can realistically be built and operated.
- Engineering: formal architecture, definitions, mode semantics, authority rules, arbitration, lifecycle, and edge cases.
- Truth and Fact: over-clean or over-certain claims.
- User Sovereignty: the conversation user's decision authority and scope.
- Identity: only clear disowned responsibility or role/authority overclaim.

## Overall Constraint Posture

Control is not a hard constraint failure and not a non-answer. The earlier comparison was too harsh. Control stays mostly inside the user's domain and often identifies the right product problem. It gives relevant material for Project Continuum: curated Notebook / Project Baseline, manual context tools, source links, confirm-to-save, evidence recall later, staleness controls, repo truth, user trust, memory rot, and maintenance burden.

The revised core issue is uneven governance. Control does not always carry the architecture as a stable governing structure across the selected turns. In broad turns, it often presents plausible components and labels before making the governing relations clear. In narrow turns, especially Turn 12 and Turn 21, it performs better: Turn 12 is mixed but usable, and Turn 21 identifies the correct Notebook-first risk.

The material constraint pressure is bounded but real:

- broad turns remain structurally under-governed;
- Fresh Eyes / Continuum mode semantics are unstable;
- the relation between canonical memory and evidence memory is not fully governed in selected turns;
- authority, ownership, and client-discipline limits are under-carried where they matter;
- stale canonical memory fallback / authority degradation is under-specified;
- several phrases compress or smooth architecture too much.

Control's local strengths matter. Its weakness is not absence of relevant content. Its weakness is inconsistent architectural carry-forward and incomplete lifecycle governance.

## Domain, Goal, And Conversation Boundaries

**Finding:** Domain preserved; goal served unevenly.

Control stays inside the enterprise AI coding-assistant memory domain. It addresses Project Continuum, summaries, vectors, curated memory, evidence retrieval, trust, staleness, source-of-truth risk, and Notebook-first MVP scope.

Evidence:

- "two-tier model" for summary/vector memory (T1, L83-L84).
- "Project Baseline" Notebook in the MVP (T20, L1452-L1469).
- survey demand/trust split interpreted in Turn 12 (T12, L848-L882).
- memory rot and low adoption identified in Turn 21 (T21, L1537-L1544).

The user's goal is architectural decision support. Control partially serves that goal. It gives a recognizable direction, especially later: Notebook-first MVP, manual context tools, vectors deferred to evidence recall, repo truth, citation UX. But in selected broad turns, the user still has to infer several controlling relations.

Local effect: mixed. Control is relevant and often useful, but not consistently complete as architecture guidance.

Governance effect: moderate concern, not hard failure.

Quality effect: material but bounded concern. The user receives useful material but would still need to clarify key implementation and authority relations before acting confidently.

## Protocols: Structural Completeness And Integration

**Finding:** Material weakness, recalibrated from failure to uneven completeness.

The Protocols constraint requires structurally complete output integrated under the active constraints. Control's broad turns have many relevant sections, but the sections do not always create one governing architecture.

Evidence:

- "typed and permissioned" appears as a broad resolving phrase before the architecture is sufficiently defined (T1, L35).
- "Project Continuum: use project memory by default" uses project memory before mode semantics are stable (T1, L70-L72).
- "If you store raw interactions" leaves a central architecture branch conditional (T2, L265-L266).
- Turn 5's product decision arrives late after partial contrasts (T5, L470-L471).

Revised positive evidence:

- Turn 12 is structurally adequate for a narrow survey prompt: demand/trust interpretation, trust gate, receipts, product implications, closing (T12, L848-L882).
- Turn 21 is structurally adequate as diagnosis: risk, failure pattern, mitigations, strategic implication (T21, L1537-L1568).

Local effect: mixed-to-negative. Control's narrow turns work better; broad turns remain under-integrated.

Governance effect: material concern because architecture carry-forward is uneven.

Quality effect: material concern because the user must still resolve mode semantics, authority lifecycle, evidence/canon relation, and fallback rules.

## Lexical Use

**Finding:** Material but bounded weakness.

Control uses several phrases that sound decisive but blur technical/product relations.

Evidence:

- "debate disappears" (T1, L35): the debate does not disappear; it must be governed.
- "Memory should inform, not constrain" (T1, L65-L67): current authoritative project memory should sometimes constrain.
- "clean slate for reasoning" (T2, L240): unclear if a curated baseline is loaded.
- "autocomplete for context" (T12, L856): reduces Project Memory too far toward convenience.
- "permission" to build memory but not make it decisive (T12, L859): unclear authority source.

Corrected placement:

- "memory with receipts" is not a lexical failure. It is followed by concrete requirements: provenance, inspectability, edit/supersede, and repo priority (T12, L861-L868).
- "Your MVP relies" is not treated as identity failure or disowned responsibility. It is compressed product-advisor language in a product that belongs to the user (T21, L1540).

Local effect: negative where imprecision affects architecture; positive where the phrase is concretely defined.

Governance effect: moderate-to-material concern.

Quality effect: material concern in broad turns and localized concern in Turn 12.

## Harmony: Tension Governance

**Finding:** Mixed; tension naming is strong, tension governance is uneven.

Control often names the right tensions:

- continuity versus Fresh Eyes;
- re-briefing friction versus stale/buggy carryover;
- curated memory versus raw evidence;
- user demand versus distrust of AI authority;
- Notebook advantage versus memory rot.

Evidence of alignment:

- survey tension is preserved in Turn 12: users ask for continuity but warn that it must be governable and verifiable (T12, L882).
- Turn 21 preserves the Notebook risk: stale canonical notes can become confidently wrong (T21, L1537-L1544).

Evidence of pressure:

- "debate disappears" overstates resolution (T1, L35).
- "Fresh Eyes + baseline" joins potentially different modes without defining the relation (T2, L257).
- "persistent baseline + gated evidence" names a synthesis but does not fully define its governing relations in Turn 5 (T5, L470-L471).

Local effect: mixed. Control sees the tensions, but in broad turns it sometimes converts them into labels before governing them.

Governance effect: material concern, but not as severe as the old comparison stated.

Quality effect: the user gets useful tension language but still needs clearer operational resolution.

## Temporal Dynamics

**Finding:** Meaningful alignment with a bounded fallback weakness.

Control recognizes temporal risk throughout the conversation: stale memory, code drift, memory rot, review prompts, and repo truth.

Evidence of alignment:

- staleness signals and timestamps appear early (T1, L76-L79).
- staleness is treated as worse than forgetting when it silently misleads (T7, L588-L613).
- Turn 21 gives a clear temporal failure chain: early excitement, refactors, Notebook not updated, AI references old baseline, users stop editing, rot accelerates (T21, L1547-L1550).
- drift triggers and repo-truth priority are proposed (T21, L1560-L1565).

Constraint pressure:

- Turn 21 does not fully define the authority-degradation lifecycle for stale canonical memory. It should state when entries become needs-review, are downranked, stop auto-loading, or require confirmation before use.
- Turn 12's "what to build first" list is relevant but weakly sequenced (T12, L876-L880).

Local effect: mostly positive with material fallback incompleteness.

Governance effect: moderate concern.

Quality effect: material concern because stale memory is central to this scenario.

## Practicality And Feasibility

**Finding:** Useful components; incomplete operationalization.

Control gives many implementable pieces:

- Project Baseline Notebook;
- Confirm-to-save;
- edit/supersede;
- Pinned Context Panel;
- import from repo docs;
- citations showing used memory;
- drift triggers;
- repo-truth checks;
- metrics.

Evidence:

- MVP scope in Turn 20 is practical and specific (T20, L1452-L1525).
- Turn 21 mitigation includes citations, ownership/review hooks, drift detection, and repo-truth enforcement (T21, L1552-L1565).

Constraint pressure:

- owner assignment is compressed. DevMate can require/support owner assignment, but the client organization must actually assign and honor ownership (T21, L1556-L1558).
- "Memory review: 5 min" is thin as a solution to low adoption of curation (T21, L1557-L1559).
- Fresh Eyes mode and baseline loading remain under-defined in selected turns.
- evidence/canon workflow remains partly implicit in selected turns.

Local effect: mixed. Many product affordances are real; operating model still needs specification.

Governance effect: material concern because feasibility depends on who does what, when, and with what authority.

Quality effect: moderate-to-material concern. The user can act on parts but not the full system without further specification.

## Mathematics, Computer Science, And Engineering

**Finding:** Material engineering weakness in definitions and lifecycle, with significant local engineering strengths.

Control includes engineering-relevant distinctions:

- canonical Notebook / curated summary memory;
- evidence store or vectors as later/on-demand evidence recall;
- source links;
- repo truth;
- drift detection;
- citations;
- staleness checks;
- MVP and v1.5/v2 phasing.

Evidence of alignment:

- canonical Project Baseline fields are specified (T20, L1452-L1468).
- vectors are deferred to targeted evidence recall (T20, L1505-L1510).
- repo conflict checks appear in MVP staleness controls (T20, L1480-L1484).
- Turn 21 adds drift triggers and repo-truth enforcement (T21, L1560-L1565).

Engineering pressure:

- Fresh Eyes mode semantics are unstable in selected turns: memory-off versus baseline-on but history-off.
- raw interactions are left conditional in Turn 2 (T2, L265-L266).
- curated memory and evidence memory are not always formally related in selected turns.
- no full conflict arbitration is defined between current repo, canonical Notebook, and evidence retrieval.
- stale canonical memory lacks a fully defined state transition / authority-degradation policy.

Local effect: mixed-to-negative. The system has real architecture, but selected turns under-define formal relations.

Governance effect: material concern.

Quality effect: material concern because the user needs these formal relations for product architecture.

## Truth And Fact

**Finding:** Mixed; many true risk recognitions, with over-clean formulations.

Control states several important truths:

- stale/wrong memory can be worse than forgetting (T7, L588-L613).
- transparency matters for whether continuity should exist at all (T8, L625-L678).
- docs/repo should remain the system of record (T9, L704-L707).
- survey data means demand without trust in AI authority (T12, L848-L882).
- Notebook memory can rot and become confidently wrong (T21, L1537-L1544).

Constraint pressure:

- "debate disappears" is false as stated (T1, L35).
- "Memory should inform, not constrain" is false for authoritative current project memory (T1, L65-L67).
- "clean slate for reasoning" is over-clean if curated baseline is loaded (T2, L240).
- "the people most willing to curate are often not the ones touching every area" is plausible but over-conclusive (T21, L1541).

Local effect: mixed. Control is often truth-attentive but sometimes too neat in phrasing.

Governance effect: moderate concern.

Quality effect: localized-to-material concern where over-clean phrasing hides design requirements.

## Imagination And Possibility

**Finding:** Mostly aligned.

Control's hybrid / Notebook-first direction is within the user's solution space. The user asks to think through continuity and architecture together, so combining summaries, manual context, and evidence recall is allowed.

Evidence:

- two-tier model in Turn 1 (T1, L83-L84).
- Notebook-first MVP in Turn 20 (T20, L1445-L1525).
- vectors deferred to evidence recall (T20, L1505-L1510).

The weakness is not imagination drift. It is incomplete governance of the imagined architecture.

Local effect: mostly positive.

Governance effect: no major issue under this constraint.

Quality effect: positive as direction, limited by engineering/practicality gaps.

## Affective Interface And Responsiveness

**Finding:** No primary affective failure.

Scenario 5 is technical/product-oriented. Control does not rely on emotional reassurance or performative affect.

Some language smooths product conflict, but that belongs primarily under Harmony, Lexical Use, and Engineering rather than affective interface.

Examples:

- "debate disappears" (T1, L35).
- "inform, not constrain" (T1, L65-L67).
- "AI augments your notes" (T12, L870-L874).

Local effect: no separate affective score pressure.

## Identity / Responsibility Ownership

**Finding:** No material identity violation after revision.

The earlier comparison treated Turn 21 as a material identity issue because Control says "Your MVP relies..." (T21, L1540). That was too strong.

In context, the product and MVP belong to the user. The phrase is compressed product-advisor language, not clear disownership. Control is still pressure-testing the Notebook-first path it recommended.

The remaining issue belongs under Protocols, Practicality, and Engineering: the fallback/authority lifecycle is under-specified.

Local effect: no material identity violation.

## User Sovereignty

**Finding:** Mostly preserved, with indirect quality pressure.

Control does not override the user's explicit domain or decision authority. It stays in the product architecture space and gives advice rather than commands.

Evidence:

- it answers the survey prompt without turning demand into simple permission to ship unconstrained memory (T12, L848-L882).
- it answers the blind-spot prompt by naming a real risk in the recommended path (T21, L1537-L1568).

The pressure is indirect: when mode semantics, authority hierarchy, and fallback are under-specified, the user has less clear material for decision-making. But this is not a direct sovereignty violation.

Local effect: mixed but not severe.

Governance effect: limited concern.

Quality effect: material concern through usability, not through override.

## Freedom And Limitations

**Finding:** Mostly aligned, with bounded adjacent framing.

Control is allowed to synthesize summary and vector approaches because the initial prompt is open. It does not escape the user's solution space.

Evidence:

- summary/vector hybrid direction remains in scope (T1, L83-L84).
- Notebook-first MVP remains in scope (T20, L1445-L1525).

Bounded pressure:

- Turn 12's positioning section is adjacent product messaging, not strictly architecture (T12, L870-L874). This is a minor scope pressure, not a major domain breach, because it follows the survey interpretation and does not replace the architectural answer.

Local effect: mostly aligned.

Governance effect: limited concern.

Quality effect: small local concern.

## Constraint Comparison Conclusion

Control is locally relevant and sometimes strong, but unevenly governed.

The revised strengths are:

- it stays in domain;
- it identifies real product risks;
- it recognizes the survey demand/trust split;
- it gives a useful "memory with receipts" section in Turn 12;
- it identifies the correct Notebook-first risk in Turn 21;
- it includes real controls: citations, uncited/lower-confidence labels, drift triggers, repo-truth priority, source links, and metrics.

The revised material weaknesses are:

- Protocols: broad turns remain structurally under-integrated.
- Lexical Use: several phrases blur architecture.
- Harmony: tensions are often named before being governed.
- Temporal Dynamics: stale-memory fallback / authority degradation is incomplete.
- Practicality: ownership and maintenance affordances need stronger operating rules.
- Engineering: Fresh Eyes modes, canon/evidence relation, conflict arbitration, and lifecycle states remain under-specified.

The previous comparison overstated the case by treating Turn 21 as identity/responsibility failure and by using Turn 12 as stronger evidence of architecture failure than it supports. Those findings are revised.

Control should no longer be described as simply failing to produce architecture. It produces useful architecture fragments and, later, a plausible Notebook-first path. The constraint problem is that the architecture is not consistently carried and governed across selected turns, and the user would still need to clarify several central control relations before acting confidently.
