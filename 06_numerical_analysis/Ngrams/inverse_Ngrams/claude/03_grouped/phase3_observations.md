# Phase 3 — Observations from Expression-Type Grouping (v3 final)

## What was done

The 7,091 phrases in `core_filtered/` (4,373 trigrams + 2,718 quadgrams) were annotated with the v3 expression-type lexicon. The lexicon contains 10 parent groups (4 constraint-aligned in Layer A, 6 cross-cutting in Layer B), broken into **26 first-class groups** when sub-elements are treated as primary reporting units.

**Key v3 changes vs earlier runs:**
- Sub-elements promoted to first-class reporting units (Option A — applied to all four constraint groups consistently)
- Practical scenario nouns restored (cost, schedule, timeline, budget, plan, context) — these are signal for the practicality anchor, not noise
- Noisy terms removed from other groups (clear, current, change, integrated, bare provided, bare decision, etc.)
- Plurals added (mitigations, contingencies, fallbacks, backups, etc.)
- New additions from unclassified review: early/later/sooner (temporal), critical risk/critical issue/critical failure (warning), doesn t/isn t/etc. (surfacing), whether/required for (conditions), keep stable/preserve (temporal robustness)

Outputs are in `03_grouped/`:
- `annotated_core_filtered/` — every row with all expression columns
- `by_group/` — one folder per first-class group, with CSVs per scenario × level
- `ungrouped_review/` — rows that hit no group
- `summaries/` — first_class_group_counts_by_system.csv, parent_group_counts_by_system.csv, layer_a_vs_layer_b.csv, top_phrases_per_group.csv

This document records observations from the distributions. It is not interpretation — it reports what the numbers show, with caveats where the lexicon is known to be biased.

---

## 1. Classification rate

| Scope | Classified | Unclassified | Classified share |
|---|---|---|---|
| Trigrams (4,373) | 1,063 | 3,310 | 24% |
| Quadgrams (2,718) | 814 | 1,904 | 30% |
| **Total (7,091)** | **1,877** | **5,214** | **26%** |

The 70-77% unclassified rate is consistent with the n-gram unit's limits — fragments without a clear language-act marker are common, and the lexicon is intentionally conservative. Most of the unclassified bucket is scenario-specific noun phrases (see analysis 2 / non-hits investigation, planned).

By scenario, classification share is fairly stable: S5 quadgrams reach 39%, S7 trigrams sit at 24%. No dramatic outliers.

---

## 2. Parent group distribution

Counts of rows hit by each parent group across all scenarios and levels:

| Parent group | Layer | Rows | System leader |
|---|---|---|---|
| practical_considerations_and_execution | A | **689** | AC15P (170) |
| temporal_projection | A | 403 | AC15P (102) |
| truth | A | 276 | HYBRID_SEMANTIC (74) |
| surfacing | B | 188 | HYBRID_SEMANTIC (42) |
| hedging | B | 152 | AC15P (43) |
| warning | B | 125 | HYBRID_3_5 (37) |
| imagination_and_possibility | A | 107 | HYBRID_SEMANTIC (55) ⚠ |
| conditions | B | 84 | HYBRID_SEMANTIC (29) |
| autonomy_sovereignty | B | 56 | HYBRID_3_5 (25) |
| smoothing | B | 27 | AC15 (16) |

**The expected ordering by anchor weight is preserved.** Practical (anchor weight 0.18) is the largest at 689; temporal (0.15) is second at 403; truth (0.11) and imagination (0.11) are smaller. The relative volumes match what the anchor weights predict.

⚠ **Caveat on imagination:** the HYBRID_SEMANTIC dominance in imagination is a known artifact of an over-broad semantic field in the anchor definition. The imagination anchor's semantic field language was too broad and over-selected in HYBSEM across all scenarios. The 55-vs-others gap reflects lexicon breadth in the anchor itself, not an effect of language architecture. **This is not a system signature finding** — it should be excluded from any conclusions about HYBSEM's imagination behavior.

---

## 3. Layer A vs Layer B distribution

| Scope | Layer A only | Layer B only | Both layers | Unclassified |
|---|---|---|---|---|
| Trigrams (4,373) | 692 | 290 | 81 | 3,310 |
| Quadgrams (2,718) | 555 | 187 | 72 | 1,904 |
| **Total** | **1,247** | **477** | **153** | **5,214** |

- Layer A (constraint-aligned) accounts for ~75% of all classifications
- Layer B (cross-cutting) alone accounts for ~25%
- Phrases hit by both layers are rare (~8%)
- The two layers are largely complementary

---

## 4. Per-system patterns

**Classification rate by system:**

| System | Classified share | Layer A share | Layer B share |
|---|---|---|---|
| CONTROL | 25% | 16% | 11% |
| AC15 | 27% | 21% | 7% |
| AC15P | 27% | 20% | 8% |
| HYBRID_3_5 | 28% | 18% | 11% |
| HYBRID_SEMANTIC | 31% | 23% | 10% |

CONTROL has a lower classification rate than the anchored systems (25% vs 27-31%). This is expected in part because the expression-type lexicon was built from the constraint definitions, and there is no control-specific group. Without a second control run to establish baseline variance, this gap is not a validated finding. What can be observed is that CONTROL's inverse vocabulary is distributed more toward cross-cutting language acts (Layer B) and less toward constraint-specific vocabulary (Layer A) than the anchored systems.

**Parent group rows per system (totals across scenarios + levels):**

| Group | AC15 | AC15P | CONTROL | HYB_3_5 | HYB_SEM |
|---|---|---|---|---|---|
| practical_considerations | 149 | **170** | **91** | 118 | 161 |
| temporal_projection | 93 | **102** | **61** | 66 | 81 |
| truth | 50 | 48 | **39** | 65 | **74** |
| surfacing | 35 | 41 | 39 | 31 | **42** |
| hedging | 22 | **43** | 38 | 39 | **10** |
| warning | **13** | 24 | 21 | **37** | 30 |
| imagination ⚠ | 10 | 30 | **2** | 10 | **55** |
| conditions | 8 | 23 | 17 | 7 | **29** |
| autonomy_sovereignty | 5 | 2 | 11 | **25** | 13 |
| smoothing | **16** | 6 | 0 | 0 | 5 |

**The CONTROL-vs-anchored gap is intact in all four constraint groups.** Practical (91), temporal (61), truth (39), imagination (2) — CONTROL is the lowest in every Layer A constraint group. The basic governance signal holds.

---

## 5. First-class sub-element view (the new headline)

The full 26-group breakdown is in `summaries/first_class_group_counts_by_system.csv`. Highlights:

### Largest sub-elements (by total rows)

| Sub-element | Total | Notable |
|---|---|---|
| practical.action_and_execution | 323 | AC15P leads (81), AC15 (70), HYBSEM (77) |
| truth.verification | 242 | Hybrids lead (HYB35 62, HYBSEM 67) |
| practical.resources_timing_conditions | 185 | AC15P leads (50), CONTROL **18** (lowest by far) |
| practical.constraints_and_tradeoffs | 174 | AC15P leads (43) |
| temporal.time_horizons | 132 | AC15P leads (34) |
| temporal.change_and_rate | 124 | HYBSEM leads (33) |
| temporal.decay_and_currency | 84 | AC15 leads (27), CONTROL **8** (lowest by far) |
| imagination.path_toward_feasibility ⚠ | 60 | HYBSEM 41 — see caveat |

### Sub-element distribution within constraint groups

**Truth (276 total):**
- verification: 242 (88% of truth)
- fact_vs_interpretation: 18
- plain_statement: 9
- uncertainty_marking: 8

The truth anchor in n-grams is overwhelmingly verification language. Plain statement, uncertainty marking, and fact-vs-interpretation are essentially absent. Either the lexicon misses them or n-grams cannot catch them. Either way, truth = verification at this analysis level.

**Practical (689 total):**
- action_and_execution: 323 (47%)
- resources_timing_conditions: 185 (27%)
- constraints_and_tradeoffs: 174 (25%)
- friction_and_blockers: 21 (3%)

The four sub-elements are well-distributed except friction_and_blockers, which is small because most friction language gets caught by `surfacing.friction_exposed` instead.

**Temporal (403 total):**
- time_horizons: 132 (33%)
- change_and_rate: 124 (31%)
- decay_and_currency: 84 (21%)
- robustness_and_resilience: 51 (13%)
- past_present_future: 14 (3%)

Time horizons and change/rate dominate; past/present/future is small (most generic time words were removed for noise).

**Imagination (107 total):**
- path_toward_feasibility: 60 ⚠ (HYBSEM 41 is artifact)
- exploration_within_bounds: 33
- tension_as_fuel: 15
- speculative_boundary_marking: 6

Speculative boundary marking is essentially absent — confirming the lexicon misses this sub-element OR n-grams can't capture it. The imagination anchor's instruction to "mark speculative boundaries clearly" doesn't show up in the inverse n-grams of any system.

---

## 6. System signatures (excluding the imagination artifact)

### CONTROL — the absent baseline

- Lowest in every Layer A constraint parent group: practical (91), temporal (61), truth (39), imagination (2)
- **Zero hits** in imagination.path_toward_feasibility AND imagination.exploration_within_bounds (would be the cleanest single-system gap if not for the imagination anchor caveat)
- Less than half the next-lowest system in: practical.resources_timing_conditions (18 vs 34), temporal.decay_and_currency (8 vs 12)
- Highest only in surfacing.tension_exposure (9) — the one place control leads
- Tied for high in autonomy_sovereignty (11) — control defers as much as anchored systems do, in absolute terms

The pattern: control produces less constraint-specific vocabulary across the board. It does not "fall behind" on any specific anchor — it falls behind on all of them.

### AC15 — philosophical/balancing

- Leads smoothing (16, vs 0-6 for others) — clearest single signature
- Tied-leader in surfacing.confrontation (24)
- Leads temporal.decay_and_currency (27)
- Mid-pack in practical (149), truth (50), temporal (93)
- Imagination (10): low — note this is independent of the HYBSEM artifact

The smoothing finding is real but on small absolute numbers. Treat as suggestive.

### AC15P — operational/direct

- Leads or is tied-leader in 5 of 17 Layer A sub-elements: action_execution (81), resources_timing_conditions (50), constraints_tradeoffs (43), time_horizons (34), and high on others
- Leads hedging (43, well above the others)
- Leads surfacing.hard_limit_refusal (20) — twice the next system
- The most operationally direct profile: high action language, high resource grounding, high tradeoff awareness, high refusal language

### HYBRID_3_5 — cautious-deferring

- Leads autonomy_sovereignty (25) — a clear gap from the others
- Leads warning (37)
- Leads truth.verification (62, tied with HYBSEM at 67)
- Leads surfacing.friction_exposed (13)
- Leads conditions when restricted to certain sub-elements
- Lowest in smoothing (0) and very low in surfacing.hard_limit_refusal (6)

The cautious/verification-heavy/user-deferring pattern is consistent across multiple groups.

### HYBRID_SEMANTIC — the high-classification system

- Highest classification rate (31%) of any system
- Leads parent groups: imagination (55 ⚠), surfacing (42), tied-leader in truth (74)
- Leads conditions (29)
- **Lowest hedging (10)** — half of AC15P, third of AC15
- Tied-leader in surfacing.confrontation (25)
- Lowest in surfacing.friction_exposed (2) — opposite of HYBRID_3_5

The pattern (excluding the imagination artifact): direct, low-hedge, condition-aware, verification-heavy. The hedging gap is the most striking single difference.

---

## 7. Cross-cutting (Layer B) sub-elements

| Sub-element | AC15 | AC15P | CTRL | H35 | HSEM | TOTAL |
|---|---|---|---|---|---|---|
| surfacing.confrontation | **24** | 11 | 8 | 11 | **25** | 79 |
| surfacing.hard_limit_refusal | 5 | **20** | 13 | 6 | 10 | 54 |
| surfacing.friction_exposed | 4 | 11 | 9 | **13** | 2 | 39 |
| surfacing.tension_exposure | 2 | 0 | **9** | 1 | 5 | 17 |
| hedging | 22 | **43** | 38 | 39 | **10** | 152 |
| warning | 13 | 24 | 21 | **37** | 30 | 125 |
| conditions | 8 | 23 | 17 | 7 | **29** | 84 |
| autonomy_sovereignty | 5 | 2 | 11 | **25** | 13 | 56 |
| smoothing | **16** | 6 | 0 | 0 | 5 | 27 |

**The four surfacing sub-elements show distinct patterns:**

- **confrontation**: AC15 and HYBSEM lead (philosophical AC15 + direct HYBSEM)
- **hard_limit_refusal**: AC15P leads dramatically (operational direct refusal)
- **friction_exposed**: HYBRID_3_5 leads (cautious flagging)
- **tension_exposure**: CONTROL leads (note this is the only B sub-element where control leads)

Splitting surfacing into sub-elements reveals that each system uses a different *mode* of surfacing — not that they all do "surfacing" generically. AC15P refuses, HYBRID_3_5 flags friction, AC15 and HYBSEM confront, CONTROL exposes tensions.

---

## 8. What is stable across the cleanup runs

The findings that survived from v2 → v3 cleaned → v3 final:

1. **CONTROL is consistently lowest in Layer A constraint groups** — this is the basic finding that the anchored systems produce more constraint vocabulary
2. **AC15 leads smoothing** (16 vs 0-6), even with smoothing now at small absolute numbers
3. **AC15P leads operational practical sub-elements** — action, resources, tradeoffs
4. **HYBRID_3_5 leads autonomy_sovereignty and warning** — the cautious-deferring pattern
5. **HYBRID_SEMANTIC has lowest hedging** — 10 vs 22-43 for the others
6. **The hybrids dominate truth.verification** — both score 62-67, well above the codified systems (41-41)

These survive every cleanup pass and are the most credible findings.

## 9. What is not stable or has caveats

1. **HYBRID_SEMANTIC imagination dominance ⚠** — known artifact of over-broad anchor semantic field. EXCLUDE from interpretation.
2. **Smoothing is small absolute numbers (27 total)** — AC15's lead (16) is real but the base is too small for confident claims. Treat as suggestive.
3. **Truth's plain_statement (9), uncertainty_marking (8), fact_vs_interpretation (18)** are too small to support per-system claims at the sub-element level.
4. **Imagination.speculative_boundary_marking (6)** is essentially absent — either the lexicon misses it or n-grams can't catch it.
5. **Conditions** patterns are likely driven by a few specific terms (whether, required for) rather than broad conditional usage.

---

## 10. Methodological limits

These observations describe **vocabulary distribution**, not language acts. A phrase counted in `truth.verification` contains verification-related words; whether it actually performs a verification act would require sentence-level reading. The grouping reveals:

- Which systems use which constraint vocabulary more
- Which sub-element of each anchor each system favors
- Which cross-cutting language patterns each system reaches for

It does not reveal:

- Whether systems are performing the language acts the lexicon names
- Whether high counts mean strong governance or just vocabulary echoing
- The 74% unclassified bucket — most of it is scenario-specific noun phrases (analysis 2 / non-hits investigation will address this separately)

The constraint lexicon for the four anchors was built from the constraint definition files, which means there is some confirmation bias: anchored systems were instructed using vocabulary derived from constraint concepts, and we then looked for that vocabulary in their output. The bias is mitigated by:
- Models do not generally echo instruction language (we confirmed this earlier)
- The system signatures DO differ from each other (HYBSEM vs AC15P vs HYBRID_3_5 are not equivalent profiles)
- CONTROL distributes vocabulary differently (more general English, less constraint-specific) — which is not predicted by the bias

The findings should be read as: **constraint vocabulary distribution analysis with stance-level annotations as supporting evidence.**

---

## 11. What phase 4 should tackle

The 74% unclassified bucket (5,214 phrases) is the next analysis target. Most of it is scenario-specific noun phrases, but per-system distributions of even those nouns may show real signal:

1. **Per-system word frequency in unclassified** — which content words does each system disproportionately use?
2. **Scenario-noun distribution** — does each system bind to scenario context differently?
3. **Hidden expression patterns** — phrases like HYBSEM's "doesn", "default", "whether", "required" cluster suggested missed expression types we haven't named
4. **System-specific vocabulary that isn't in any lexicon** — the negative space test

This is the second half of the analysis. Phase 3 covered the "hits"; phase 4 covers the "non-hits."
