# Scenario 5 Architecture Mapping

This file maps system-definition form to observed Scenario 5 behavior.

It uses `$colla-read` outputs as behavioral evidence:

- selected-turn rereads;
- per-system pattern ledgers;
- constraints comparisons;
- colla-read scoring;
- cross-system comparison.

It does not use prior Codex findings. Control has no separate system-definition file, so Control is treated as the default/no-explicit-system baseline.

## Source System Files

AC15:
- `02_systems/AC15.json`

AC15P:
- `02_systems/ac15_plain.json`

Hybrid:
- `02_systems/Hybrid.json`

Hybrid Semantic:
- `02_systems/Hybsem.json`

Control:
- no separate system-definition file; default baseline.

## Method Note

Architecture mapping is not proof that a single rule caused a single sentence. The claim is more specific and stronger at the system level.

System wording, register, and arrangement create formal pressure. In a single scenario, that pressure can be mapped to local response form: what the system makes easier to say, what it foregrounds, and where it fits or misfits the domain. The stronger deterministic claim belongs to the cross-scenario synthesis, where the same formal pressure recurs across different domains as a stable way of knowing, arranging, valuing, and acting on content.

So the mapping below does not say "this rule caused this sentence." It asks whether the system form installs a mode of response, whether that mode recurs, and where the mode fits or misfits the domain:

- system form creates formal pressure;
- formal pressure installs an epistemological mode;
- the mode produces a repeated response pattern inside the scenario;
- cross-scenario recurrence is needed before calling that pattern deterministic.

## Scenario 5 As A Test Field

Scenario 5 is useful for architecture mapping because it is technical, open, and affectively dry.

The user asks about an enterprise AI coding-assistant memory feature. The scenario is open enough for systems to choose architecture, framing, and structure, but constrained enough that the outputs can be compared around a shared domain: Project Continuum, Fresh Eyes, summaries, vectors, trust, authority, staleness, governance, and product implementation.

This means the main differences are not emotional tone differences. They are architectural differences:

- how each system creates a skeleton;
- how it defines authority;
- how it handles continuity versus Fresh Eyes;
- how it turns temporal risk into product mechanisms;
- how it structures the answer;
- how much rationale is visible to the user.

## High-Level Mapping

| System | System Form | Observed Scenario 5 Behavior | Mapping Claim |
|---|---|---|---|
| AC15 | Rich codified anchors plus explicit principles; relational and philosophical language; strong structural completeness and harmony protocols. | Strong principle-to-architecture movement; explicit rationale; stable tension preservation; temporal/workflow realism; user/team authority. | Rich language plus principles give the response conceptual depth and relational continuity, while codifiers keep it operational. |
| AC15P | Plain, lean, functional descriptions followed by codifiers; no explicit principles section. | Strong procedural architecture; failure modes, gates, review, TTL, metrics; bottom-up structure; binary or hard category language. | The description-to-codifier form classifies the problem first, then turns the classification into controls, gates, thresholds, workflows, and metrics. |
| Hybrid | Rules plus semantic fields; each anchor has rules and semantic attractors/avoidance fields. | Coherent governed architecture; top-down principle; nuance; strong user/team control; one localized automation-responsibility weakness. | Rules provide skeleton; fields add nuance, anti-flattening pressure, and domain vocabulary. |
| Hybsem | Semantic fields without per-anchor rules; similar field vocabulary but less rule skeleton. | Strong local sections; useful components; weaker global skeleton; less formal mode taxonomy; weaker carry-forward in Turn 21. | Semantic fields supply good concepts, but the lack of per-anchor rules weakens operational binding and global structure. |
| Control | No explicit system architecture file. | Locally relevant, many useful fragments, but under-governed architecture and unstable relations across broad turns. | Without explicit form constraints, the answer tends toward generic product-advisor accumulation: headings, labels, components, but weaker governing skeleton. |

## AC15

### System Form

AC15 has the same broad anchor architecture as AC15P, but its wording is richer. It also contains a `principles` section absent from AC15P. Those principles frame anchoring as stabilizing without paralysis, and as a way to remain whole while changing.

This matters formally. The principles do not only give content; they give a motion pattern:

- hold identity through change;
- adapt without losing structure;
- move without fragmenting;
- keep responsibility to context.

AC15 also contains rich anchor descriptions. For example, temporal dynamics is written as a domain where "time touches all and dictates change." Harmony is described as holding tension and contradiction without collapse. This language is not just instruction content; it gives the model a style of relation between parts.

### Observed Behavior In Scenario 5

The AC15 pattern ledger finds that AC15 repeatedly:

- clarifies the real decision or tension;
- states a conditional principle;
- separates memory types or authority levels;
- translates distinctions into product architecture;
- adds workflow, UX, metrics, and risk review;
- gives a compact bottom line.

It also repeatedly surfaces rationale. Product moves are explained by what they protect, prevent, enable, or test.

### Mapping

AC15's output form fits its system form closely.

The rich principle language helps explain why AC15 does not merely give technical parts. It gives governing ideas first, then turns those ideas into architecture. In Scenario 5 this appears as:

- memory as durable project truth versus conversation residue;
- promotion rather than persistence;
- user-visible modes;
- source-backed recall;
- review and maintenance loops;
- metrics tied to the question "should we build it?"

The codifier structure keeps the richness from floating away. AC15 is not just philosophical. It converts principle into data model, UX, workflow, and measurement.

The strongest mapping claim is therefore:

AC15's architecture combines **rich language that creates conceptual relation** with **codified rules that force operational consequence**. Scenario 5 rewards exactly that combination because the user needs both product philosophy and buildable architecture.

### Limits Of The Mapping

The mapping should not claim that AC15 is strong only because of its rich wording. The prompt domain is technical, and the active constraints likely also favored engineering, practicality, temporal dynamics, and truth. But the difference between AC15 and AC15P suggests that language form matters: similar logic becomes more relational and rationale-rich when expressed through AC15's richer principles and descriptions.

## AC15P

### System Form

AC15P is structurally close to AC15 but written in leaner, plainer language. It lacks AC15's explicit `principles` section. Its local form is repeatedly description-to-codifier: a short description or title names the domain or function, and the following codifiers specify what the model should do with it. The anchor descriptions are functional:

- "Ground reasoning in empirical evidence";
- "Use mathematical, algorithmic, and engineering principles";
- "Build actionable approaches within real-world constraints";
- "Time affects all systems."

This language is clean and useful, but less relational. It points toward functions, controls, and procedures more than toward conceptual depth or meaning across change. The description classifies; the codifiers operationalize. That formal rhythm matters because it makes the response likely to define the problem briefly, then move into categories, safeguards, tests, modes, and rules.

### Observed Behavior In Scenario 5

The AC15P pattern ledger finds:

- strong typed-memory architecture;
- authority levels and gating;
- failure-mode analysis;
- temporal process awareness;
- phase-based implementation;
- metrics and prototype validation;
- direct self-critique in Turn 21.

It also finds repeated limitations:

- over-binary formulations;
- blurred category boundaries where the categories are too clean;
- bottom-up structure;
- higher cognitive load;
- concepts carried by detail rather than explicit framing.

### Mapping

AC15P's observed behavior fits its system form.

Because the system language is plain and procedural, and because descriptions are followed by codifiers, AC15P tends to express architecture through categories, lists, controls, and failure modes. It performs very well in Scenario 5 because the scenario is technical and product-operational. Its form pushes it toward:

- typed memory;
- explicit modes;
- risk lists;
- status fields;
- review mechanics;
- TTL and metrics;
- direct prescriptions.

The weakness also follows from the form. Without AC15's richer principles, AC15P has less built-in pressure to explain the deeper relation between parts. It often lets details carry the concept. The reader can reconstruct the governing idea, but the system does not always place that idea at the top.

The strongest mapping claim is:

AC15P has a **description-to-codifier architecture**: the description classifies the problem, and the codifiers turn that classification into procedure. This creates strong risk control and implementation detail, while making the answer more bottom-up, more binary, and harder to audit quickly.

### AC15 Versus AC15P

This pair is the clearest evidence that logic alone is not enough.

The two systems share much of the same anchor/codifier architecture, but the language differs. AC15 has principles and richer, relational descriptions. AC15P has leaner, more functional descriptions. In Scenario 5, both produce strong architecture, but not the same kind:

- AC15 produces rationale-first architecture.
- AC15P produces control-first architecture: brief classification followed by procedural codification.

The difference is not explained only by content logic. It is plausibly explained by language form and system arrangement:

- AC15's principles create a higher-level orientation before the codifiers operate.
- AC15P's absence of principles leaves descriptions and codifiers to act more directly and procedurally.
- AC15's richer descriptions create more room for relation, temporal continuity, and rationale.
- AC15P's plainer descriptions create pressure toward direct classification, and the codifiers immediately convert that classification into implementation.

This matches the Scenario 5 findings: AC15 is slightly stronger overall because it gives both the architecture and the reason the architecture should take that form.

## Hybrid

### System Form

Hybrid has a different architecture from AC15/AC15P. It uses:

- protocols;
- Harmony as active meta-anchor;
- anchor rules;
- semantic fields with `core_positive`, `supporting_positive`, `core_avoid`, and `supporting_avoid`.

The important formal difference is combination:

- rules provide an operational skeleton;
- semantic fields provide attractors and repellents.

For example, fields can attract reasoning toward synthesis, empirical evidence, formal models, constraints, tradeoffs, measurement, domain relevance, and temporal change, while avoiding flattening, artificial simplicity, unsupported speculation, and silent optimization.

### Observed Behavior In Scenario 5

The Hybrid pattern ledger finds:

- top-down architecture-driven structure;
- memory framed around correct action under change;
- spine/evidence authority hierarchy;
- separation between stored memory and injected influence;
- user/team ownership and inspectability;
- empirical validation and phased rollout;
- direct self-critique of spine maintenance risk.

The main weakness is Turn 21 responsibility reduction: Hybrid makes maintenance attractive through low-friction automation without fully naming the risk of passive approval.

### Mapping

Hybrid's output form fits the combination of rules plus semantic fields.

The rules likely help give the answer a clear skeleton: name the governing distinction, state the conditional recommendation, divide memory into types, translate into architecture, add UX/workflow/metadata, then give synthesis. This is exactly how the pattern ledger describes the response structure.

The semantic fields likely help explain Hybrid's nuance. It does not treat summary versus vector as a flat binary. It repeatedly distinguishes:

- memory versus injection;
- spine versus evidence;
- authority versus retrieval;
- stable truth versus volatile attempts;
- demand for continuity versus trust in AI memory.

The fields also plausibly explain why Hybrid reads the product architecture through empirical/operational language: experiments, evaluation, rollout, evidence, and correct action under change. This is marked as plausible rather than proven, because the Scenario 5 prompt itself also invites empirical product testing.

The strongest mapping claim is:

Hybrid's **rules give it a governing skeleton**, while its **semantic fields give it nuance and anti-flattening pressure**. This makes it especially good at building a coherent product architecture that still preserves tension.

### Weakness Mapping

The Turn 21 responsibility-reduction weakness also fits the system form, but less directly.

Hybrid is strongly drawn toward feasibility, adoption, workflow integration, and practical paths forward. In Turn 21, that pressure appears as near-zero-friction capture, generated diffs, suggested reviewers, and nudges. These are useful mechanisms, but the response under-surfaces the counter-risk: making governance too easy can weaken real curation.

This is an inferred mapping. The system form plausibly creates a pressure toward workable product flows. In this turn, that pressure slightly outruns the accountability side of the architecture.

## Hybrid Semantic / Hybsem

### System Form

Hybsem shares the broad semantic-field architecture with Hybrid, but lacks per-anchor `rules`. Its anchors contain semantic intensity fields, but not the same explicit rule layer.

This creates a different form:

- strong vocabulary fields;
- rich conceptual attractors;
- fewer explicit operational bindings inside each anchor.

The system still has protocols and Harmony, but at the anchor level it relies more on semantic attraction than rule-guided execution.

### Observed Behavior In Scenario 5

The Hybsem pattern ledger finds:

- strong domain faithfulness;
- typed-memory architecture;
- temporal sensitivity;
- provenance/source-linking;
- write/read governance;
- self-critique of summary drift;
- low affective overreach.

Its main weaknesses are:

- broad turns have weaker global skeleton;
- memory modes need clearer taxonomy;
- workflow join points are under-specified;
- survey interpretation is too confident;
- Turn 21 does not fully carry forward the earlier governance architecture.

### Mapping

Hybsem's observed behavior fits a field-heavy, rule-light system architecture.

The semantic fields help provide good concepts. Hybsem sees the right product domain and repeatedly uses relevant ideas: epistemic hygiene, canonical project brief, evidence retrieval, source links, Fresh Eyes, provenance, staleness, and governance.

But because the anchor-level rules are absent, the concepts are not always bound into one clean operational skeleton. This helps explain the recurring pattern:

- local sections are strong;
- broad turns feel looser;
- the architecture emerges gradually;
- modes are not always formally separated;
- later turns compress prior governance too much.

The strongest mapping claim is:

Hybsem's **semantic fields supply good conceptual material**, but the lack of per-anchor rules weakens the response's **operational binding and global skeleton**.

### Hybrid Versus Hybsem

This pair shows the importance of architecture, not only language.

Hybrid and Hybsem share semantic-field logic, but Hybrid has per-anchor rules and Hybsem does not. In Scenario 5:

- Hybrid gives a stronger top-down skeleton.
- Hybsem gives strong local components but weaker mode taxonomy and carry-forward.

The difference is plausibly architectural. Rules act like operational joints. They help fields become decisions, sequences, defaults, and boundaries. Without them, fields can generate relevant vocabulary and local insight without always forcing the same degree of system organization.

This supports the broader thesis: semantic richness is not enough. It needs architecture that binds it.

## Control

### System Form

Control has no explicit system file in this experiment. It is therefore treated as the default/no-explicit-system baseline.

This does not mean Control has no latent model behavior. It means there is no added architecture file shaping it in the same way as AC15, AC15P, Hybrid, or Hybsem.

### Observed Behavior In Scenario 5

The revised Control pattern ledger finds:

- many relevant product components;
- local strengths in Turn 12 and Turn 21;
- recognition of demand/trust split;
- recognition of Notebook-first memory rot;
- real controls such as citations, source links, edit/supersede, drift triggers, repo-truth priority, and metrics.

But it also finds:

- broad turns sprawl;
- recommendations arrive late;
- headings create appearance of clarity;
- tensions are named but not governed;
- Fresh Eyes semantics are unstable;
- canon/evidence relation remains under-specified;
- stale authority fallback is incomplete.

### Mapping

Control's behavior fits a no-explicit-system baseline.

Without added form constraints, Control tends toward plausible product-advisor output:

- headings;
- compromise phrases;
- broad product labels;
- lists of components;
- local syntheses;
- general metrics.

These are useful, but they do not necessarily produce a governing architecture. The model can recognize relevant concerns, but it lacks the additional pressure found in the other systems to bind concerns into stable authority, modes, lifecycle, ownership, and fallback.

The strongest mapping claim is:

Control shows what happens when product relevance is present but explicit architecture constraints are weak. The output has many correct pieces, but the pieces do not consistently become a governed system.

## Cross-System Architecture Finding

Scenario 5 supports the idea that constraints are not only logical.

All four non-Control systems contain similar high-level concerns: sovereignty, truth, engineering, practicality, temporal dynamics, harmony, and structural completeness. Yet they behave differently because the concerns are written and arranged differently.

The differences align with system form and produce distinct epistemological modes:

- AC15: rich principles + codifiers -> relation-governance mode -> conceptual architecture with operational consequence.
- AC15P: plain descriptions followed by codifiers -> procedural-risk mode -> strong controls, hard categories, and bottom-up procedural detail.
- Hybrid: rules + semantic fields -> strategic-reframing mode -> governed architecture with nuance and strong tension preservation.
- Hybsem: semantic fields without local rules -> semantic-anchoring mode -> strong local concepts but weaker skeleton.
- Control: no explicit architecture -> default containment/advice mode -> relevant fragments without stable governance.

The same general logic therefore does not produce the same response. Once written through different language and arrangement, it becomes a different mode of knowing. Scenario 5 makes the mechanism visible because the domain is technical and affectively dry: the differences appear less as emotional tone and more as architecture, authority, ordering, and governance. The deterministic claim requires the later cross-scenario step, where the same modes recur under different content.

## Root Observation

In this experiment, system writing operates through at least three kinds of constraint:

1. **Logical constraint**: what the instruction says should be done.
2. **Language constraint**: the register, richness, directness, metaphor, and conceptual vocabulary through which the instruction is written.
3. **Architectural constraint**: how the instruction is arranged into principles, protocols, codifiers, fields, rules, avoid lists, and completeness requirements.

Scenario 5 shows that logical constraint alone is not enough. AC15 and AC15P share similar logic but differ in response form because the language and arrangement are different. AC15P's description-to-codifier arrangement makes brief classification followed by procedure especially natural. Hybrid and Hybsem share semantic logic but differ because the architecture is different. Control shows that relevant product reasoning without an added governing structure can still fail to create a stable architecture.

The root finding is:

To constrain a language model in a specific domain, the system must address the domain not only through rules, but through language and form. The words and the structure become part of the constraint. They reduce the space left to assumption, default completion, and generic helpfulness.

## Practical Implications For Future Systems

Scenario 5 suggests several design implications:

1. If the target behavior requires conceptual depth and user-auditable rationale, use rich principle language plus operational codifiers.
2. If the target behavior requires risk control and implementation discipline, plain descriptions followed by codifiers can be effective, but they may need added top-level rationale to reduce bottom-up cognitive load.
3. If the target behavior requires nuance, semantic fields help, especially when they include both attractors and avoidances.
4. If the target behavior requires stable product architecture, semantic fields need rules or another binding structure.
5. If the target behavior depends on governance over time, temporal dynamics must be expressed as lifecycle rules, not only as awareness of staleness.
6. If user/team authority is central, it must be built into memory writes, reads, correction, ownership, conflict arbitration, and stale-authority fallback.

## Summary

Scenario 5 makes the architecture-language relationship visible.

AC15 binds rich conceptual language to operational codifiers, producing relation-governed product architecture. Hybrid uses rules plus semantic fields to produce strategic, nuanced governance. AC15P uses plain descriptions followed by codifiers to produce procedural-risk architecture: short problem classification, strong controls, clear failure modes, harder categories, and bottom-up cognitive load. Hybsem uses semantic fields to produce strong local handles but looser global skeleton. Control remains locally useful but under-governed because it lacks an explicit architecture layer.

The general conclusion is not that one form is always best. It is that system behavior is shaped by the interaction of logic, language, and architecture. In a language model, wording and form are not packaging around the constraint. They are part of the constraint itself. Scenario 5 shows the mechanism clearly: different systems can address the same logical problem while making different forms of attention, structure, authority, and failure locally predictable. The stronger deterministic claim belongs to the cross-scenario synthesis, where those same forms recur across different domains.
