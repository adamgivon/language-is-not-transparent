# Shared Space: 2-System and 3-System Exclusive Sharing (Scale-Calibrated)

> ## ⚠ CORRECTION (2026-04-15)
>
> **The "CTRL + AC15 = 0" and "CTRL + AC15P = 0" claims throughout this document are WRONG.** The entire "robust structural finding" section is based on a bug in the source CSV `pairwise_sharing_by_scenario.csv` (likely a pair-label-ordering mismatch — the computed keys were `AC15|CONTROL` / `AC15P|CONTROL` but the pre-populated rows used `CONTROL|AC15` / `CONTROL|AC15P`, so the hardcoded zeros were never overwritten).
>
> **Correct numbers recomputed from `raw_materials/*_csv/*.csv` on 2026-04-15:**
>
> | Pair | Bigrams | Trigrams | Quadgrams |
> |---|---|---|---|
> | CONTROL+AC15 | 1,668 | 1,248 | 644 |
> | CONTROL+AC15P | 1,689 | 1,243 | 636 |
> | CONTROL+HYBRID_3_5 | 1,626 | 1,271 | 632 |
> | CONTROL+HYBRID_SEMANTIC | 1,660 | 1,283 | 687 |
> | AC15+AC15P | 2,114 | 1,416 | 701 |
> | HYBRID_3_5+HYBRID_SEMANTIC | 1,825 | 1,428 | 737 |
>
> **There is no structural zero.** CTRL+codified pairs share quadgrams at 636–644, well within the same range as other pairs. The "12 cells all zero" claim, the "presence/absence finding," and "the cleanest architectural finding in the pairwise data" — all invalidated.
>
> Corrected CSV: `pairwise_sharing_by_scenario_CORRECTED.csv` in this same folder.

## Scale context

Per-scenario n-gram field volumes (unique types, not token instances):

| Level | S1 | S3 | S5 | S7 |
|---|---|---|---|---|
| Bigrams | 42,172 | 38,338 | 33,914 | 38,538 |
| Trigrams | 68,312 | 60,282 | 50,724 | 62,928 |
| Quadgrams | 78,020 | 67,716 | 55,430 | 72,161 |

The shared field in absolute terms is small. The 2-system sharing is 11-13% of unique bigrams, 5-6% of unique trigrams, 2-3% of unique quadgrams. The 3-system sharing is another 4-5% / 1-2% / 0.3-0.6%. These are small portions of the field — but within that small portion, architectural patterns appear.

## Source

Data computed from the raw n-gram CSVs at `inverse-ngrams/raw_materials/`. For each n-gram, the analysis records which systems produce it and groups by the specific pair or triple.

## The robust structural finding (scale-independent)

**CTRL + AC15 = zero exclusive sharing. CTRL + AC15P = zero. Across all 4 scenarios, all 3 levels (12 cells).**

Not a single bigram, trigram, or quadgram is shared exclusively by control and either codified system. This is a presence/absence finding — it does not depend on percentage.

CTRL + HYBRID_3_5 and CTRL + HYBRID_SEMANTIC have substantial exclusive sharing (hundreds to thousands of phrases). The codified systems never produce vocabulary that only they and control share; the hybrid systems do.

This is the cleanest architectural finding in the pairwise data. It does not require calibration.

## The per-pair counts (calibrated to share of total field)

Exclusively 2-shared phrases as percentage of total unique n-grams:

### Quadgrams (typical scenario: ~70K total unique)

| Pair | S1 | S3 | S5 | S7 | Total | % of field |
|---|---|---|---|---|---|---|
| AC15+H35 | 263 | 147 | 92 | 238 | 740 | 0.26% |
| H35+HSEM | 248 | 149 | 88 | 252 | 737 | 0.26% |
| AC15+HSEM | 231 | 194 | 95 | 196 | 716 | 0.26% |
| AC15P+HSEM | 246 | 147 | 83 | 239 | 715 | 0.26% |
| AC15+AC15P | 217 | 151 | 89 | 244 | 701 | 0.25% |
| CTRL+HSEM | 191 | 127 | 123 | 246 | 687 | 0.24% |
| AC15P+H35 | 205 | 153 | 103 | 203 | 664 | 0.23% |
| CTRL+H35 | 215 | 112 | 91 | 214 | 632 | 0.22% |
| CTRL+AC15 | 0 | 0 | 0 | 0 | **0** | **0%** |
| CTRL+AC15P | 0 | 0 | 0 | 0 | **0** | **0%** |

At quadgrams, the anchored pairs all cluster around 0.22-0.26% of field — very close to each other. The codified pair's lead at bigrams (2,114 vs 1,825 for hybrid pair) flattens at quadgrams (701 vs 737). The architectural distinction in pairwise counts largely flattens at the longer n-gram levels.

### The zeros are not small — they are absolute

The CTRL+codified zeros are structurally different from the low-percentage non-zeros. "CTRL+HYBRID_3_5 = 632 shared quadgrams" is a thin tendency; "CTRL+AC15 = 0" is a categorical absence. That distinction is the finding.

## Qualitative finding (supporting, thin)

The **kind** of vocabulary each pair shares differs by architecture:

- **Codified pair (AC15+AC15P)** tends to share operational/procedural phrases ("rev b shielding", "transition assistance clause", "step by step", "supply chain schedule")
- **Hybrid pair (H35+HSEM)** tends to share evaluative/conditional phrases ("the default recommendation", "load by default", "out of scope", "always show provenance", "confidence is low")
- **CTRL + hybrid systems** tend to share scenario-specific concrete nouns and some evaluative vocabulary

This qualitative finding is scale-independent — it describes what kind of vocabulary, not how much. The amounts are small (a few hundred phrases per pair), but within that small amount, the kind of vocabulary differs by architecture.

## Calibrated observations

### What is robust
- CTRL + AC15 = 0, CTRL + AC15P = 0 at every level, every scenario (presence/absence)
- Architectural difference in what kinds of vocabulary pairs share (procedural vs evaluative) — observed in the phrases themselves, not in the counts

### What is thin but visible
- Architecture-group averages (codified pair 0.25%, hybrid pair 0.26%, cross-arch 0.25% at quadgrams — differences are small)
- HYBRID_SEMANTIC appears in more top-pair positions than other systems (bridge-node tendency), but again at thin rates

### What does not support strong claims
- "Codified pair shares the most" — true at bigrams (2,114 vs 1,825 for hybrid pair), not robust at trigrams/quadgrams where all anchored pairs converge to similar rates
- "HYBRID_SEMANTIC is the most connected system" — visible in rankings but the differences between pairs at trigram/quadgram level are small (2-4% between highest and lowest anchored-only pair)

## What this layer adds to the paper

The 2-3 system shared space analysis contributes:

1. **The CTRL + codified = zero structural finding** (robust, absolute)
2. **The qualitative difference in kind of shared vocabulary** (supporting, real but thin)

It does not contribute strong per-architecture count comparisons. Those counts are too close at the longer n-gram levels to support strong claims. The absolute numbers (typically 600-740 exclusively-shared quadgrams per pair) are small and comparable across pairs.

## Placement in the textual analysis chapter

This section supports the main structural finding (95-98% unique). It shows that within the small shared space, architectural signatures are visible qualitatively — and that the CTRL-codified zero is a clean structural gap. The section should be brief in the paper: the structural zero is the highlight; the qualitative procedural-vs-evaluative finding is supporting detail.
