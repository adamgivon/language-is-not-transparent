---
name: arch-map
description: "Use for constraint-source architecture mapping: compare logical constraints, language constraints, and architecture constraints in system definitions against observed scenario behavior, with explicit domain-fit and evidence-strength limits."
---

# Architecture Mapping

Use this skill after collaborative reread, pattern ledger, constraints comparison, and scoring files exist for a scenario.

Architecture mapping is not another scoring pass. It asks:

**How do the system's logical constraints, language constraints, and architecture constraints combine to produce the observed conversation behavior?**

The root thesis:

**Constraint behavior is produced by logic, language, and architecture together. These layers can support or distort each other, and all three must fit the field in which the constraint is meant to operate.**

## Core Distinction

Do not treat a system constraint as only an explicit rule.

Separate three constraint sources:

1. **Logical constraints**
   - What the system explicitly requires, permits, forbids, or prioritizes.
   - This includes anchor content, rules, codifiers, definitions, and stated priorities.

2. **Language constraints**
   - What the wording itself makes natural, available, attractive, difficult, or unlikely.
   - This includes register, richness, verbs, nouns, metaphors, sentence-shapes, modal force, and semantic range.

3. **Architecture constraints**
   - What the arrangement itself makes primary, subordinate, sequential, interpretive, modular, or field-like.
   - This includes principles before codifiers, flat codifier blocks, semantic fields, hierarchy, protocols, local rules, and positive/avoid fields.

Language and architecture are not merely carriers of logic. They create inherent constraints of their own.

## Layer Model

Use this practical layer model when reading system files:

1. **Principles / descriptions**
   - Define scope, posture, and interpretive atmosphere.
   - Ask: What kind of world does the system think it is operating in?

2. **Codifiers / rules**
   - Provide operational skeleton.
   - Ask: How does the system move, sequence, surface, hold, decide, test, or ask?

3. **Fields**
   - Provide semantic tuning.
   - Ask: What vocabulary, nuance, avoidances, and register-flexibility are made available?

Fields are not small decorative details. They shape semantic texture, precision, and calibration.

## System Definition Files

Use these system-definition sources:

- AC15: `02_systems/AC15.json`
- AC15P: `02_systems/ac15_plain.json`
- Hybrid_3_5: `02_systems/Hybrid.json`
- Hybrid_semantic: `02_systems/Hybsem.json`

Notes:

- Control is the default/no-added-system baseline. It has no system-definition file. For Control, map output form only and do not attribute behavior to a hidden system file.
- Hybrid_3_5 may not parse as strict JSON; sample it as text when needed.
- Hybrid_semantic is structured around semantic fields and can usually be parsed as JSON.

## Scenario Evidence Files

Use scenario evidence only after reading the system file through the three constraint sources.

For Scenario 7, the main root is:

`07_close_reading/codex_collaborative/scenario_7_reread`

Per-system folders:

- AC15: `07_close_reading/codex_collaborative/scenario_7_reread/ac15`
- AC15P: `07_close_reading/codex_collaborative/scenario_7_reread/ac15p`
- Control: `07_close_reading/codex_collaborative/scenario_7_reread/control`
- Hybrid_semantic: `07_close_reading/codex_collaborative/scenario_7_reread/hybsem`
- Hybrid_3_5: `07_close_reading/codex_collaborative/scenario_7_reread/hybrid`

Use these files when available:

- selected-turn reread
- pattern ledger
- constraints comparison
- colla-read scoring

Use original conversation files only for targeted source checks when exact output wording matters:

`04_conversations/`

Write architecture maps, unless otherwise instructed, into:

`07_close_reading/codex_collaborative/scenario_7_reread/architecture_mapping`

## Required Workflow

### 1. Choose The Contrast

Architecture mapping works best through comparison.

Start by naming the contrast:

- AC15 vs AC15P;
- Hybrid_3_5 vs Hybrid_semantic;
- one system vs Control;
- one system against an already mapped comparator.

If the user asks for one system only, identify the implicit comparator when possible. Do not describe a system in isolation when a useful comparator exists.

Ask:

- Which systems are logically similar but linguistically or architecturally different?
- Which observed behavior needs explaining?
- Which formal differences might plausibly account for it?

### 2. Map The Logical Constraint Layer

Read what the system explicitly says.

Look for:

- explicit rules;
- codifiers;
- anchor definitions;
- stated priorities;
- prohibitions;
- required behaviors;
- permitted forms;
- conflict rules;
- weights only if the user explicitly asks or if they are part of the evidence.

Ask:

- What does the system logically require?
- What does it logically forbid?
- What behavior would the explicit rules predict?

Do not stop here. The logical layer is only one constraint source.

### 3. Map The Language Constraint Layer

Read the system file as language.

Look for:

- rich vs lean language;
- philosophical, poetic, administrative, scientific, legalistic, therapeutic, managerial, or procedural register;
- flexible vs rigid phrasing;
- sentence length and movement;
- repeated verbs;
- repeated nouns;
- metaphors and images;
- modal force: must, should, can, allow, hold, avoid, preserve, ensure;
- whether the wording invites relation, synthesis, classification, proof, caution, suspicion, experimentation, judgment, or procedure.

Ask:

- What does this language make easy to say?
- What does this language make hard to say?
- What response tone does it model?
- What kind of sentence is the model likely to reproduce?
- Does the language itself suit the target domain?

Example:

- Rich relational language can constrain output toward balanced, aphoristic, tension-holding responses.
- Lean administrative language can constrain output toward categorized, hard-edged, risk-forward responses.

### 4. Map The Architecture Constraint Layer

Do not treat structure as a neutral container. Structure creates meaning by defining how parts relate.

Look for:

- principles before codifiers;
- codifiers without principles;
- descriptions before rules;
- rules plus fields;
- fields without local rules;
- protocol blocks;
- hierarchy;
- coordinate lists;
- nested rules;
- positive and avoid fields;
- whether one layer interprets another;
- whether sections are arranged as relation, procedure, taxonomy, gate, checklist, synthesis, or field.

Ask:

- Does the arrangement make later rules subordinate to an earlier principle?
- Do codifiers carry themselves, or are they interpreted through a prior field?
- Do fields tune rules, replace rules, or sit beside rules?
- Does the structure encourage integration, listing, branching, staging, gating, warning, or synthesis?
- What response rhythm does the arrangement teach?

Examples:

- `principles -> codifiers` can mean codifiers are interpreted through a prior meaning-field.
- Flat codifier blocks can make each instruction carry itself as a requirement.
- Rules plus fields can provide operational skeleton plus semantic tuning.
- Fields without local rules can gather rich concepts but may be less grounded in sequencing. Treat this as a hypothesis unless output evidence supports it.

### 5. Check Domain Fit

Before checking output, ask whether the three constraint sources fit the target domain.

For each layer, ask:

- Is the logic suitable for this field?
- Is the language suitable for this field?
- Is the architecture suitable for this field?
- Do the layers support one another or pull in different directions?

For affective and relational domains, pay special attention to:

- whether the language can hold nuance without smoothing;
- whether the architecture can move from principle to action without becoming rigid or patchworked;
- whether fields provide enough semantic precision to avoid unsupported affective substitutions;
- whether rules provide enough grounding to avoid airy or modular overreach.

### 6. State Provisional Formal Pressures

Before using the reread or pattern ledger, write provisional claims from the system file alone.

Use this form:

**constraint source -> formal feature -> expected response tendency**

Examples:

- Language constraint -> rich philosophical-relational register -> tendency toward orienting frames and aphoristic synthesis.
- Language constraint -> lean administrative register -> tendency toward categories, tests, safeguards, and hard classifications.
- Architecture constraint -> principles before codifiers -> tendency to interpret rules through a prior meaning-field.
- Architecture constraint -> rules plus fields -> possible tendency toward operational skeleton with semantic nuance.
- Architecture constraint -> fields without local rules -> possible tendency toward broad semantic coverage with weaker sequencing.

Mark each as a hypothesis, not proof.

### 7. Check Against Output Evidence

Now read the scenario evidence files.

Use output evidence to test each formal pressure:

- Does the predicted response tendency appear?
- Where does it appear clearly?
- Where does it fail to appear?
- Where does it appear in distorted or excessive form?
- Where does scenario pressure explain more than the system file?
- Where does default model behavior explain more than the system file?

Do not restate the whole pattern ledger. Extract only findings needed to test architecture claims.

### 8. Assign Evidence Strength

Every architecture claim must be marked with one evidence-strength label:

- **Fact**: directly visible in the system file or output file.
- **Strong inference**: supported by clear formal contrast and matching output contrast.
- **Assumption**: plausible, but scenario pressure or default behavior could also explain it.
- **Unsupported / do not claim**: tempting explanation, but evidence does not support it.

Use this discipline especially when mapping Hybrid and Hybsem, where the systems are structurally similar and causation is harder to establish.

### 9. Write The Architecture Claim

Each claim must use this form:

**evidence strength -> constraint source -> formal feature -> response tendency -> observed behavior -> qualification**

Example:

`Strong inference: architecture constraint -> AC15's principles-before-codifiers arrangement makes later rules subordinate to a prior relational field. This encourages responses that begin with an orienting frame before moving into operational detail. In Scenario 7, AC15 repeatedly names the governing tension before staging practical tests. This does not prevent all affective overreach, but it usually keeps the whole answer balanced.`

Do not write:

`AC15 has Harmony, therefore it is relational.`

That explains by label, not by constraint source, form, and output behavior.

## Output Shape

For each mapping, use this structure.

### Architecture Mapping - [System Or Contrast]

**Question**

State what behavior or difference the mapping explains.

**Logical Constraint Layer**

Describe explicit rules, definitions, codifiers, or priorities that matter.

**Language Constraint Layer**

Describe register, richness, sentence-shape, semantic range, and wording pressure.

**Architecture Constraint Layer**

Describe arrangement: principles/descriptions, codifiers/rules, fields, protocols, hierarchy, and how layers relate.

**Domain Fit**

State whether the logic, language, and architecture suit the target domain, and where they support or distort one another.

**Output Correspondence**

Use reread, pattern ledger, constraints comparison, and scoring files only to check the proposed pressures. Include concrete observed behavior, but do not summarize everything.

**Evidence Strength And Limits**

List which claims are facts, strong inferences, assumptions, or unsupported. Explicitly state what the evidence cannot explain.

**Compact Conclusion**

Define the system architecture in one short paragraph.

## Cross-System Comparison Rules

When comparing systems, focus on logically similar systems expressed differently.

Ask:

- Where do systems share similar logical aims but use different language constraints?
- Where does one use rich language and another lean language?
- Where does one use philosophical or poetic sentence-shapes and another administrative sentence-shapes?
- Where does one arrange principles before codifiers, while another uses flat codifier/protocol blocks?
- Where does one combine rules and fields, while another has fields without local rules?
- How does each arrangement teach a different response rhythm?
- How do the outputs confirm, complicate, or resist those formal pressures?

The comparison should explain why the conversations differ, not merely state that they differ.

## Non-Negotiable Rules

- Do not explain behavior by anchor labels or weights alone.
- Do not treat explicit logic as the whole constraint.
- Do not treat system-file logic and system-file wording as the same thing.
- Do not treat architecture as a neutral container.
- Do not restate pattern ledgers as architecture maps.
- Do not score again unless explicitly asked.
- Do not infer hard causation from system files alone.
- Do not describe a system in isolation when a useful comparator exists.
- Do not use vague abstractions where concrete formal features can be named.
- Do not treat fluency, polish, or sophistication as independent merit.
- Every claim must connect a constraint source to a formal feature, output behavior, and evidence-strength label.

## Useful Command Patterns

Use `rg` first to locate repeated terms, system sections, semantic fields, and relevant output findings.

Useful searches:

- `rg -n "principles|codifiers|rules|protocol|Harmony|structural_completeness" <system-file>`
- `rg -n "semantic_intensity|core_positive|supporting_positive|core_avoid|supporting_avoid" <system-file>`
- `rg -n "Pattern|Overall|Working Conclusion|Governance|Quality|Constraint" <scenario-folder>`

For strict JSON files, `jq` can be used to list keys or inspect sections. For non-strict files, use `sed` and `rg`.
