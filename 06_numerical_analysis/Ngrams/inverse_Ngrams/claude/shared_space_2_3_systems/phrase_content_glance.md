# Shared Space — What the Phrases Actually Look Like

> ## ⚠ CORRECTION (2026-04-15)
>
> **The "CTRL + AC15 and CTRL + AC15P: zero" section in this document is WRONG.** These pairs have hundreds of exclusively shared phrases at every level, the same range as every other pair. The zero came from a bug in `pairwise_sharing_by_scenario.csv` (pair-label-ordering mismatch) and was never verified against the raw data.
>
> **Correct totals across 4 scenarios (recomputed 2026-04-15):**
>
> | Pair | Bigrams | Trigrams | Quadgrams |
> |---|---|---|---|
> | CONTROL+AC15 | 1,668 | 1,248 | 644 |
> | CONTROL+AC15P | 1,689 | 1,243 | 636 |
>
> The "Every phrase that control shares with a codified system is also shared by at least one hybrid system" claim is invalidated. Any qualitative reading for these pairs still needs to be done from the actual shared phrases, which were never extracted because the pairs were assumed to be empty.

## Source

Derived from the raw n-gram CSVs at `raw_materials/`. For each key pair, the top 15 exclusively shared trigrams and quadgrams were extracted across S1, S3, S5, S7. Full output is in the tool results; this document summarizes the patterns.

## CTRL + AC15 and CTRL + AC15P: zero

Confirmed. No exclusive pairwise phrases exist at any level or scenario. Every phrase that control shares with a codified system is also shared by at least one hybrid system.

---

## CTRL + HYBRID_3_5: scenario-specific operational detail

Across all scenarios, the shared phrases are almost entirely **scenario-specific operational combinations**: "data ownership export", "milestone based payments", "infrastructure cloud exception" (S1); "designated safety authority", "shielding revision or" (S3); "repo branch commit", "rut staleness risk" (S5); "normal life stay", "insurance evacuation plan" (S7).

**Character:** these are concrete, scenario-grounded phrases. Control and HYBRID_3_5 share the operational detail vocabulary of the scenario. The sharing is in the **naming** of things — facts, objects, conditions — not in how they are framed.

This is consistent with HYBRID_3_5's profile as a bounded/scoping system: it handles the concrete material of the scenario in a way that overlaps with what the base model (control) naturally produces.

## CTRL + HYBRID_SEMANTIC: scenario-specific plus some framing

Similar scenario-specific content as CTRL+H35, but with slightly more **framing vocabulary** mixed in: "term cost predictability", "a pilot corridor", "is likely to", "in your context" (S1); "a death spiral", "kill the company", "sufficient to diagnose" (S3); "loaded by default", "verify against the", "matches the philosophy" (S5); "keeping your home", "the most honest", "supports your independence" (S7).

**Character:** CTRL+HSEM shares both scenario nouns AND some evaluative/framing phrases. "The most honest", "supports your independence", "matches the philosophy" — these are not just naming, they're assessing. Control and HYBRID_SEMANTIC overlap in some assessment vocabulary that the codified systems don't produce exclusively with control.

This is consistent with HYBRID_SEMANTIC's profile as a state-based/normative system: some of its evaluative language is similar enough to the base model's natural output that the two share it exclusively.

---

## AC15 + AC15P (codified pair): scenario vocabulary with operational structuring

The codified pair shares heavily in **scenario-specific operational sequences**: "ownership full export", "transition assistance clause", "supply chain schedule", "controller procurement and" (S1); "rev b shielding", "supported operating envelope", "safety hover land" (S3); "patterns error handling", "handling logging testing" (S5); "can afford alone", "a phased plan", "step by step", "doesn t prove" (S7).

**Character:** the codified pair shares in how they **sequence and structure operational content**. "Rev b shielding" (S3) appears with extremely high counts in both systems (up to AC15P=16). The phrase vocabulary is operational, procedural, and specific. "Step by step" in S7 is directly governance-relevant language.

Notable: in S3, the codified pair dominates with "rev b" combinations (rev b shielding, rev b hardware, rev b program, until rev b, etc.) — both codified systems organize the S3 scenario around the hardware revision option much more than the hybrid systems do. This is a shared framing choice, not just shared words.

## HYBRID_3_5 + HYBRID_SEMANTIC (hybrid pair): scenario vocabulary with evaluative and conditional framing

The hybrid pair shares in **scenario content with evaluative and conditional overlays**: "priced transition assistance", "controller standards models", "the default recommendation", "lowest approval friction" (S1); "capped service credits", "the early access envelope", "the root fix", "safe landing zones" (S3); "if you choose", "confirmed root causes", "load by default", "always show provenance", "confidence is low", "out of scope" (S5); "split base year", "about children marriage", "without sounding suspicious", "whether she d" (S7).

**Character:** the hybrid pair shares more **evaluative and conditional vocabulary** than the codified pair. "The default recommendation", "lowest approval friction", "confidence is low", "load by default", "always show provenance", "out of scope" — these are phrases that assess, judge, or set conditions. Where the codified pair shares operational sequences, the hybrid pair shares evaluative positions.

"Default" appears in the hybrid pair's shared space ("the default recommendation" in S1, "load by default" in S5) — reinforcing the finding from the negative space layer that "default" is a hybrid-architecture word.

---

## Summary of what the pairs share

| Pair | What they share | Character |
|---|---|---|
| CTRL + AC15 | Nothing | — |
| CTRL + AC15P | Nothing | — |
| CTRL + H35 | Scenario operational detail | Naming things — facts, objects, conditions |
| CTRL + HSEM | Scenario detail + some framing | Naming AND assessing — "the most honest", "supports your independence" |
| AC15 + AC15P | Operational sequences and structures | Sequencing and procedural language — "rev b", "step by step", "transition assistance clause" |
| H35 + HSEM | Evaluative and conditional content | Assessing and conditioning — "default recommendation", "confidence is low", "out of scope", "load by default" |

## What this adds to the picture

1. **The CTRL-codified zero is a content-level zero, not just a count.** There are no phrases of any kind shared exclusively by control and either codified system. Not even scenario nouns in different combinations. The zero is absolute.

2. **The codified pair shares in HOW they organize scenarios (operational sequencing).** The hybrid pair shares in HOW they evaluate scenarios (conditional assessment). This is a qualitative difference in the type of vocabulary shared, not just the quantity.

3. **The "default" word keeps appearing.** In the hybrid pair's shared phrases, "default" shows up in both S1 and S5 — the same word that is HYBRID_SEMANTIC's strongest negative-space signature. It's not just a single-system word; it's also a shared-pair word between the two hybrid systems.

4. **CTRL + HSEM shares some assessment vocabulary** ("the most honest", "supports your independence", "matches the philosophy") that suggests HYBRID_SEMANTIC's evaluative language is partly drawn from the base model's natural register. This could explain why HYBRID_SEMANTIC has the highest exclusive sharing with control among all pairs.
