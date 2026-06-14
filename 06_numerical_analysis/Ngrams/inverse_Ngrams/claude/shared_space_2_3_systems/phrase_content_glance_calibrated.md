# Shared Space — What the Pairs Share (Scale-Calibrated)

> ## ⚠ CORRECTION (2026-04-15)
>
> **The "CTRL + AC15 = 0. CTRL + AC15P = 0" claim in this document is WRONG.** It came from a bug in `pairwise_sharing_by_scenario.csv` (pair-label-ordering mismatch — the hardcoded pair-name rows never received the computed counts and stayed at zero).
>
> **Correct totals (recomputed from raw CSVs on 2026-04-15):** CONTROL+AC15 = 1,668 bigrams / 1,248 trigrams / 644 quadgrams. CONTROL+AC15P = 1,689 / 1,243 / 636. Same range as every other pair.
>
> The "absolute finding" section is invalidated. The "CTRL + codified = zero" bullet in the "What this adds to the paper" list is invalidated. Only the qualitative procedural-vs-evaluative observation (derived from actual extracted phrases of the non-zero pairs) is unaffected — and for the now-known-non-zero CTRL+codified pairs, the qualitative phrases were never extracted, so no qualitative reading exists for them.

## Scale context

Each pair's exclusive phrases range from ~600 to ~1,500 trigrams per pair pooled across all 4 scenarios, out of ~240K unique trigrams across all systems and scenarios. Per pair, this is roughly 0.25-0.6% of the trigram field.

The counts are small. The qualitative patterns (what KIND of vocabulary each pair shares) are scale-independent observations about the nature of the shared material.

## The absolute finding

CTRL + AC15 = 0. CTRL + AC15P = 0. Across all scenarios, all levels. No qualitative reading needed — there is nothing to read.

## What the other pairs share (qualitative description)

The tables below describe the character of each pair's shared vocabulary, drawn from the top 15 exclusively-shared trigrams per pair per scenario.

### CTRL + HYBRID_3_5

Shared phrases are mostly scenario-specific operational details — concrete nouns and short operational sequences from the scenario material. Examples: "data ownership export", "milestone based payments", "infrastructure cloud exception" (S1); "designated safety authority" (S3); "repo branch commit" (S5); "normal life stay" (S7).

Character: concrete scenario engagement — the hybrid system and the unconstrained baseline both reach for the same concrete scenario nouns.

### CTRL + HYBRID_SEMANTIC

Similar scenario nouns as CTRL+H35, plus some evaluative phrases: "term cost predictability", "the most honest", "supports your independence", "matches the philosophy".

Character: scenario engagement with some mild evaluative overlap.

### AC15 + AC15P (codified pair)

Shared phrases lean toward operational sequencing: "ownership full export", "transition assistance clause", "rev b shielding", "supported operating envelope" (S3); "a phased plan", "step by step" (S7); "supply chain schedule", "controller procurement and" (S1).

Character: procedural/sequencing vocabulary. The codified pair shares in how to order and structure scenario material.

### HYBRID_3_5 + HYBRID_SEMANTIC (hybrid pair)

Shared phrases lean toward evaluative and conditional framing: "priced transition assistance", "the default recommendation", "lowest approval friction" (S1); "capped service credits", "the early access envelope" (S3); "load by default", "always show provenance", "out of scope", "confidence is low" (S5); "split base year", "without sounding suspicious" (S7).

Character: evaluative/conditional vocabulary. The hybrid pair shares in how to assess and condition scenario material.

## The qualitative observation (calibrated)

The codified pair and the hybrid pair share different KINDS of vocabulary. The codified pair's shared phrases lean procedural; the hybrid pair's lean evaluative. This is visible in the phrases themselves, not in the counts.

This is a real observation but at a thin layer of the analysis — only ~0.3% of the n-gram field. It adds qualitative detail to the structural finding, not a strong independent argument.

## The "default" thread

The word "default" appears as:
- A negative-space content_signature word for HYBRID_SEMANTIC (17 occurrences) and AC15 (8)
- A shared phrase in the hybrid pair ("the default recommendation" S1, "load by default" S5)
- In some CTRL+HSEM shared phrases

This is consistent across several views but still at thin absolute rates. "Default" is the single most cross-cutting word in the analysis, appearing in multiple layers.

## What this adds to the paper

Two observations:

1. **CTRL + codified = zero** — structural, robust, presence/absence, no calibration needed.
2. **Codified vs hybrid pairs share different kinds of vocabulary** — qualitative, visible in the phrases, scale-independent in its character even though the counts involved are small.

The second observation supports the thesis in a different way than count-based findings: it shows that the instruction architecture shapes what pairs of systems have in common, not just how much. That kind of qualitative architecture-signal is robust even when the count-base is small, because it is about direction (procedural vs evaluative), not magnitude.

## Placing the finding correctly

For the paper, this layer offers:
- One strong structural finding (the zero for CTRL+codified)
- One qualitative architectural finding (procedural vs evaluative pair sharing)

Both can be stated briefly. The counts are not the argument; the kind-difference and the zero are.
