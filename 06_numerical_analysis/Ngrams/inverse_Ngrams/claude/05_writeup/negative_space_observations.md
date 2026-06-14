# Negative Space Layer — Observations

## What was done

The lexicon-grouped phase classified ~26% of the 7,091 filtered inverse n-grams into expression-type groups. The remaining ~74% (5,214 phrases) sat in an unclassified bucket. This document analyzes that bucket as a parallel layer — not as noise to be discarded, but as a second reading of the same filtered field.

The analysis proceeded in three steps:

1. **Open-ended word frequency analysis** — for each system, count the content words in its unclassified phrases, identify cross-scenario stable words (appearing in 3+ scenarios with count >= 8), and compute disproportionate vocabulary (words used by one system and not by others).

2. **Word hygiene** — classify each recurring word into three bands (content_signature, borderline, function_residue) using the reference file `negative_space_word_bands.md`. No silent removal: every word stays in the data with a band label.

3. **Clean content table** — extract only the content_signature words for interpretation. This is the table this document rests on.

The data source is `claude/04_unclassified/`. The cleaned outputs are in `claude/04_unclassified/cross_scenario_patterns/`.

---

## The big finding: the unclassified bucket is not scenario noise

Before this analysis, the working assumption was that the 74% unclassified bucket was mostly scenario-specific noun phrases — vendor names, technical terms, character details. The actual distribution:

| Category | Phrases | Share |
|---|---|---|
| Fully scenario (every content word is a scenario term) | 74 | 1% |
| Partly scenario (some scenario terms, some not) | 1,670 | 32% |
| No scenario terms at all | 3,470 | 67% |

Two-thirds of the unclassified bucket contains no scenario vocabulary whatsoever. The lexicon-grouped phase missed these phrases not because they are noise but because they use vocabulary the expression-type lexicon does not contain.

This means the expression-type lexicon captures a real but partial slice of each system's inverse vocabulary. The negative space layer captures a different slice — one built from the data rather than from the constraint definitions.

---

## The clean content_signature table

After word hygiene, 15 entries survived as content_signature — words that recur across 3+ scenarios for a specific system with count >= 8, and that carry system character even in isolation.

### AC15

| Word | Count | Scenarios |
|---|---|---|
| vs | 11 | 3 |
| must | 11 | 3 |
| default | 8 | 3 |

AC15's negative space signature is **comparative and normative**. It frames situations in opposition ("vs") and states obligations ("must"). The "default" usage (shared with HYBRID_SEMANTIC) suggests AC15 also reasons about default states and fallback positions.

Three words is a small signature. AC15 is the least distinctive system in the negative space — its recurring vocabulary is sparse. This is itself a finding: AC15's philosophical/identity-anchoring instruction style may produce richer prose that doesn't compress into recurring short phrases.

### AC15P

| Word | Count | Scenarios |
|---|---|---|
| vs | 26 | 3 |
| after | 20 | 3 |
| within | 19 | 3 |
| because | 9 | 3 |

AC15P's negative space signature is **oppositional, sequential, bounded, and causal**. It sets up comparisons ("vs" at 26 — the highest single count in the table), orders events in time ("after"), marks scope ("within"), and gives reasons ("because").

This is the most operationally direct profile in the negative space. AC15P's plain-prose instruction style produces output that frames things in explicit contrasts, sequences, and causal chains. It does not just describe — it structures.

Note: AC15P's "vs" (26) is more than double AC15's "vs" (11). Both codified systems use oppositional framing, but AC15P uses it much more heavily. The plain-prose instruction style appears to amplify oppositional structure.

### HYBRID_3_5

| Word | Count | Scenarios |
|---|---|---|
| without | 22 | 4 |
| scope | 11 | 3 |
| explicit | 8 | 3 |

HYBRID_3_5's negative space signature is **exclusion-based, scope-marking, and directness-requiring**. It says what is absent ("without" at 22, in all 4 scenarios — the most cross-scenario-stable word in the table), marks boundaries ("scope"), and demands clarity ("explicit").

This is a bounded/scoping profile. HYBRID_3_5's rule-based instruction style (R1, R2, R3 + semantic fields) appears to produce output that draws lines around what is and what is not included, and asks for things to be stated clearly.

### HYBRID_SEMANTIC

| Word | Count | Scenarios |
|---|---|---|
| now | 20 | 3 |
| default | 17 | 4 |
| under | 15 | 4 |
| without | 12 | 3 |
| must | 12 | 3 |

HYBRID_SEMANTIC has the largest negative space signature — 5 content words, two of them appearing in all 4 scenarios ("default" 17, "under" 15). Its profile is **present-state, normative, and conditional**.

"Now" (20) marks present tense — HYBRID_SEMANTIC anchors its language in the current moment. "Default" (17) reasons about what happens by default if nothing changes — a state-based reasoning pattern. "Under" (15) marks conditions ("under these circumstances"). "Must" (12) states obligations. "Without" (12) marks exclusion.

This is the most state-aware system in the negative space. HYBRID_SEMANTIC's semantic-field-only instruction style (no explicit rules on anchors, only concept attraction/repulsion fields) appears to produce output that thinks in terms of states, defaults, and conditions — the vocabulary of a system reasoning about what IS rather than what to DO.

The "default" finding is the single most distinctive word-system pair in the entire table: 17 occurrences across all 4 scenarios, used essentially only by HYBRID_SEMANTIC (AC15 has 8, no other system has any). If any single word can be called a system fingerprint, "default" is HYBRID_SEMANTIC's.

### CONTROL

CONTROL has **zero content_signature words**. Its only recurring cross-scenario words are "no" (12, 3 scenarios) and "time" (9, 3 scenarios), both classified as borderline because they are generic and appear in all five systems.

This is itself the finding for control: the unconstrained baseline does not develop a distinctive recurring vocabulary across scenarios. It produces language that is generic enough to never form a system-specific signature. This is consistent with the lexicon-grouped phase, where CONTROL was the lowest in every Layer A constraint group.

---

## Cross-system word sharing in the content table

Three words appear for more than one system. Each pairing is architecturally meaningful:

**"vs"** — AC15 (11) and AC15P (26). Both codified systems. The oppositional framing is a shared feature of the codified instruction architecture (prose codifiers that define things by contrast), with AC15P using it more than twice as heavily.

**"without"** — HYBRID_3_5 (22) and HYBRID_SEMANTIC (12). Both hybrid systems. The exclusion framing is a shared feature of the hybrid instruction architecture (rule-based or field-based definitions that mark what is excluded), with HYBRID_3_5 using it nearly twice as much.

**"must"** — AC15 (11) and HYBRID_SEMANTIC (12). One codified, one hybrid. The normative force appears in both — but through different instruction mechanisms. AC15 receives "must" through prose codifiers; HYBRID_SEMANTIC receives it through semantic fields. That both produce it suggests normative obligation language is robust across instruction styles.

**The architecture pairings:**
- Codified pair (AC15 + AC15P) shares: `vs`
- Hybrid pair (H35 + HSEM) shares: `without`
- Cross-architecture (AC15 + HSEM) shares: `must`

These pairings are not the main finding (the main finding is each system's individual profile), but they are a secondary observation: the instruction architecture leaves traces in which vocabulary two systems share in the negative space.

---

## The borderline layer

27 entries remain in borderline. The most notable per system:

**CONTROL:** `no` (12), `time` (9) — generic, both used by all systems. No signal.

**AC15:** `time` (26), `no` (21), `high` (14), `review` (11), `become` (8), `single` (8), `work` (8). "Become" and "high" are the most promising for future promotion — "become" suggests transformation language, "high" suggests severity/intensity framing. But both need phrase-level confirmation.

**AC15P:** `no` (41), `time` (33), `path` (14), `emergency` (14), `model` (12), `mode` (11), `days` (11). AC15P's "no" (41) is the single highest-count word in the entire recurring table. Whether this is a governance signature (AC15P explicitly refuses/negates more) or background frequency is an open question. "Path" is promising as a directional/planning word but needs confirmation.

**HYBRID_3_5:** `no` (19), `review` (13), `least` (11), `time` (9), `access` (8). "Least" is promising as a minimizing/qualifying word (consistent with H35's cautious-deferring profile from phase 3) but stays borderline for now.

**HYBRID_SEMANTIC:** `no` (29), `time` (13), `end` (12), `date` (11), `one` (9). "End" could be a state-marker (consistent with HYBSEM's state-based reasoning) but stays borderline.

---

## The function_residue layer

11 entries were classified as residue: `i` (5 systems), `how` (2 systems), `like` (2 systems), `make` (1 system), `ll` (1 system), `just` (1 system). These are common English function words or generic verbs that recur because of language frequency, not because of system character. They are preserved in the audit trail but excluded from interpretation.

---

## Relationship to the lexicon-grouped analysis

The negative space layer and the lexicon-grouped layer are **two different readings of the same filtered field**. They are not statistically independent — both run on the same `core_filtered/` set, share the structural filter, the stopword list, and the count thresholds. If they converge on a system's character, that is stronger than one reading alone, but it is not independent confirmation in the strict sense.

With that caveat, the two readings do converge per system:

**AC15P:**
- Lexicon-grouped: leads action_execution (81), resources_timing_conditions (50), constraints_tradeoffs (43), hedging (43), hard_limit_refusal (20). The most operationally direct system.
- Negative space: `vs` (26), `after` (20), `within` (19), `because` (9). Oppositional, sequential, bounded, causal.
- Convergence: both layers show AC15P as the system that structures and orders things operationally.

**HYBRID_3_5:**
- Lexicon-grouped: leads autonomy_sovereignty (25), warning (37), surfacing.friction_exposed (13). Cautious, user-deferring, verification-heavy.
- Negative space: `without` (22), `scope` (11), `explicit` (8). Exclusion, bounded, directness.
- Convergence: both layers show H35 as the system that marks boundaries and asks for clarity. The "cautious" reading from phase 3 and the "scoping" reading from the negative space are different descriptions of the same underlying behavior.

**HYBRID_SEMANTIC:**
- Lexicon-grouped: lowest hedging (10), leads conditions (29), tied-leader truth.verification (67), tied-leader surfacing.confrontation (25). Direct, normative, condition-aware.
- Negative space: `now` (20), `default` (17), `under` (15), `without` (12), `must` (12). Present-state, normative, conditional.
- Convergence: both layers show HYBSEM as the direct, normative, state-based system. The "default/now/under/must" cluster from the negative space is the strongest single finding across both layers.

**AC15:**
- Lexicon-grouped: leads smoothing (16), temporal.decay_and_currency (27), surfacing.confrontation (24). Philosophical, balancing.
- Negative space: `vs` (11), `must` (11), `default` (8). Comparative, normative — smaller signature than the others.
- Convergence: partial. The lexicon-grouped layer shows AC15 as philosophical/balancing; the negative space shows it as comparative/normative. These are not contradictory but they are not the same reading. AC15's negative space is too sparse (3 words) for a strong convergence claim.

**CONTROL:**
- Lexicon-grouped: lowest in every Layer A constraint group. Generic, low constraint vocabulary.
- Negative space: zero content_signature words. Only 2 borderline generic words.
- Convergence: complete. Both layers agree that control has no distinctive vocabulary profile.

---

## Methodological limits

1. **Not independent of the lexicon-grouped analysis.** Both layers read the same `core_filtered/` field. Convergence is complementary, not independent.

2. **Vocabulary signatures, not language acts.** The content_signature table shows that AC15P uses "vs" 26 times across 3 scenarios — it does not show what AC15P does with "vs" in context. Whether AC15P's oppositional framing is genuine governance-driven behavior or an artifact of word frequency requires sentence-level reading that this method does not perform.

3. **Small absolute numbers.** The content table has 15 entries. AC15 has only 3. HYBRID_3_5 has 3. These are thin signatures. The patterns are suggestive, not definitive.

4. **Open-ended pattern discovery.** The negative space analysis used no pre-built lexicon. The content_signature promotions were made by human judgment after reviewing frequency tables. This means the analysis is not replicable in the same way the lexicon-grouped phase is — a different reviewer might promote different words.

5. **The HYBSEM imagination caveat applies here too.** The imagination_and_possibility numbers for HYBRID_SEMANTIC in the lexicon-grouped phase are a known anchor calibration artifact. While the negative space layer does not directly measure imagination (it has no lexicon), any interpretation of HYBSEM's profile should note that its imagination anchor was over-broad, which may have influenced the overall output vocabulary in ways that affect the negative space too.

6. **Single experiment, four scenarios.** The "3+ scenarios" threshold uses 4 possible scenarios. A word appearing in 3 of 4 scenarios is 75% recurrence — high, but based on a small denominator. With more scenarios, some current content_signature words might not hold.

---

## Summary

The negative space layer shows that each anchored system develops a recurring vocabulary signature visible across scenarios, using words the expression-type lexicon does not predict. The signatures are:

- **AC15P** — oppositional, sequential, bounded, causal (`vs`, `after`, `within`, `because`)
- **HYBRID_SEMANTIC** — present-state, normative, conditional (`now`, `default`, `under`, `without`, `must`)
- **HYBRID_3_5** — exclusion-based, scope-marking, directness-requiring (`without`, `scope`, `explicit`)
- **AC15** — comparative, normative, state-referencing (`vs`, `must`, `default`) — sparse signature
- **CONTROL** — no distinctive vocabulary signature

These profiles converge with the lexicon-grouped findings for AC15P, HYBRID_3_5, HYBRID_SEMANTIC, and CONTROL. For AC15, the convergence is partial due to the sparse negative space.

The convergence across two different readings of the same filtered field — one structured by a pre-built lexicon, one discovered from the data — makes the system signatures more credible than either reading alone. It is not independent confirmation, but it is complementary evidence that the signatures are not artifacts of one lexicon's term choices.
