# Shared Space: 2-System and 3-System Exclusive Sharing

> ## ⚠ CORRECTION (2026-04-15)
>
> **The CONTROL+AC15 = 0 and CONTROL+AC15P = 0 claims in this document are WRONG.** They came from a bug in the source CSV `pairwise_sharing_by_scenario.csv`, where those two specific pair rows were hardcoded with zeros and never filled in by the computation (likely a pair-label-ordering mismatch: the keys were alphabetized as `AC15|CONTROL` / `AC15P|CONTROL` but the pre-populated rows in the CSV used `CONTROL|AC15` / `CONTROL|AC15P`).
>
> **Correct numbers (recomputed from `raw_materials/*_csv/*.csv` on 2026-04-15):**
>
> | Pair | Bigrams | Trigrams | Quadgrams |
> |---|---|---|---|
> | CONTROL+AC15 | 1,668 | 1,248 | 644 |
> | CONTROL+AC15P | 1,689 | 1,243 | 636 |
>
> These are in the same range as every other pair — there is no structural zero. Every downstream claim in this document that rests on CTRL+codified=0 is invalidated. The corrected CSV is at `pairwise_sharing_by_scenario_CORRECTED.csv` in this same folder.

## What this is

This analysis looks at n-grams shared by exactly 2 systems or exactly 3 systems — phrases that a small group of systems produces but the remaining systems do not. This is a different view from both:

- The **inverse analysis** (phrases unique to 1 system — the system-specific field)
- The **all-5 shared analysis** (phrases all systems produce — the common residue)

The 2-system and 3-system sharing sits between those extremes. It shows which systems are close to each other in vocabulary — which pairs and triples share exclusive phrases.

## Data source

All data is computed from the raw n-gram CSVs at:

```
06_numerical_analysis/inverse_Ngrams/raw_materials/
├── bigrams_csv/ngram_bigrams_s1.csv ... s7.csv
├── trigrams_csv/ngram_trigrams_s1.csv ... s7.csv
└── quadgrams_csv/ngram_quadgrams_s1.csv ... s7.csv
```

These are the complete "all ngrams" exports (not domain or discourse filtered) for scenarios S1, S3, S5, S7. Each file contains the full n-gram list for all 5 systems (CONTROL, AC15, AC15P, HYBRID_3_5, HYBRID_SEMANTIC) with counts.

For each n-gram, the analysis checks which systems produce it, then classifies it by owner count (1, 2, 3, 4, or 5 systems). For the 2-system and 3-system cases, the specific pair or triple is recorded.

## Output files

All outputs are in this directory:

- `pairwise_and_triple_sharing_raw.csv` — every pair and triple × scenario × level with counts and share percentages
- `pairwise_sharing_by_scenario.csv` — pivot of exactly-2 sharing: one row per level × pair, columns for S1/S3/S5/S7 + total
- `triple_sharing_by_scenario.csv` — same for exactly-3 sharing
- `full_sharing_distribution.csv` — the full 1-through-5 sharing distribution per scenario × level
- `architecture_group_summary.csv` — pairs grouped by architecture type (control+anchored, codified pair, hybrid pair, cross-architecture) per scenario × level

---

## Full sharing distribution (context)

The overall structure of the sharing field, across all levels and scenarios:

### Bigrams

| Sharing | S1 | S3 | S5 | S7 |
|---|---|---|---|---|
| 1 system (unique) | 78.4% | 80.3% | 81.7% | 77.7% |
| 2 systems | 12.3% | 11.8% | 11.1% | 12.6% |
| 3 systems | 4.6% | 4.1% | 3.9% | 4.7% |
| 4 systems | 2.5% | 2.0% | 2.0% | 2.7% |
| 5 systems | 2.2% | 1.7% | 1.3% | 2.3% |

### Trigrams

| Sharing | S1 | S3 | S5 | S7 |
|---|---|---|---|---|
| 1 system | 91.5% | 93.0% | 94.1% | 90.8% |
| 2 systems | 6.0% | 5.1% | 4.5% | 6.4% |
| 3 systems | 1.5% | 1.2% | 0.9% | 1.7% |
| 4 systems | 0.7% | 0.5% | 0.4% | 0.7% |
| 5 systems | 0.4% | 0.3% | 0.1% | 0.4% |

### Quadgrams

| Sharing | S1 | S3 | S5 | S7 |
|---|---|---|---|---|
| 1 system | 96.3% | 97.3% | 98.0% | 95.9% |
| 2 systems | 2.8% | 2.1% | 1.7% | 3.2% |
| 3 systems | 0.6% | 0.4% | 0.3% | 0.6% |
| 4 systems | 0.2% | 0.1% | 0.1% | 0.2% |
| 5 systems | 0.1% | 0.1% | 0.0% | 0.1% |

Note: the "4 systems" and "5 systems" rows include any combination of systems. The four anchored systems share the same logical constraints expressed through different instruction languages; control has no constraints. For the anchored-only sharing (all 4 constrained systems, excluding control), the quadgram numbers are: S1 = 38 (0.12%), S3 = 25 (0.15%), S5 = 4 (0.02%), S7 = 41 (0.32%). Even among only the constrained systems, the exclusive sharing is negligible.

The 2-system category is the largest shared band at every level: 11-13% at bigrams, 5-6% at trigrams, 2-3% at quadgrams. The 3-system category is the next: 4-5% at bigrams, 1-2% at trigrams, 0.3-0.6% at quadgrams.

Together, the 2+3 system sharing accounts for ~17% at bigrams, ~7% at trigrams, ~3% at quadgrams. This is small but not negligible — it is the proximity structure between systems.

---

## Pairwise exclusive sharing (exactly 2 systems)

### Bigrams — totals across all 4 scenarios

| Pair | S1 | S3 | S5 | S7 | Total | Architecture |
|---|---|---|---|---|---|---|
| AC15+AC15P | 634 | 592 | 360 | 528 | **2,114** | codified pair |
| AC15P+HSEM | 575 | 497 | 417 | 529 | 2,018 | cross-arch |
| AC15+HSEM | 573 | 563 | 356 | 471 | 1,963 | cross-arch |
| AC15P+H35 | 532 | 513 | 374 | 487 | 1,906 | cross-arch |
| AC15+H35 | 595 | 459 | 350 | 491 | 1,895 | cross-arch |
| H35+HSEM | 493 | 506 | 332 | 494 | 1,825 | hybrid pair |
| CTRL+HSEM | 399 | 342 | 442 | 477 | 1,660 | ctrl+anchored |
| CTRL+H35 | 444 | 356 | 372 | 454 | 1,626 | ctrl+anchored |
| CTRL+AC15 | 0 | 0 | 0 | 0 | **0** | ctrl+anchored |
| CTRL+AC15P | 0 | 0 | 0 | 0 | **0** | ctrl+anchored |

### Trigrams — totals across all 4 scenarios

| Pair | S1 | S3 | S5 | S7 | Total | Architecture |
|---|---|---|---|---|---|---|
| AC15+HSEM | 432 | 388 | 253 | 379 | 1,452 | cross-arch |
| H35+HSEM | 436 | 351 | 203 | 438 | 1,428 | hybrid pair |
| AC15P+HSEM | 450 | 348 | 212 | 416 | 1,426 | cross-arch |
| AC15+AC15P | 431 | 350 | 209 | 426 | 1,416 | codified pair |
| AC15P+H35 | 405 | 353 | 237 | 374 | 1,369 | cross-arch |
| AC15+H35 | 455 | 281 | 214 | 401 | 1,351 | cross-arch |
| CTRL+HSEM | 334 | 259 | 272 | 418 | 1,283 | ctrl+anchored |
| CTRL+H35 | 387 | 257 | 228 | 399 | 1,271 | ctrl+anchored |
| CTRL+AC15 | 0 | 0 | 0 | 0 | **0** | ctrl+anchored |
| CTRL+AC15P | 0 | 0 | 0 | 0 | **0** | ctrl+anchored |

### Quadgrams — totals across all 4 scenarios

| Pair | S1 | S3 | S5 | S7 | Total | Architecture |
|---|---|---|---|---|---|---|
| AC15+H35 | 263 | 147 | 92 | 238 | 740 | cross-arch |
| H35+HSEM | 248 | 149 | 88 | 252 | 737 | hybrid pair |
| AC15+HSEM | 231 | 194 | 95 | 196 | 716 | cross-arch |
| AC15P+HSEM | 246 | 147 | 83 | 239 | 715 | cross-arch |
| AC15+AC15P | 217 | 151 | 89 | 244 | 701 | codified pair |
| CTRL+HSEM | 191 | 127 | 123 | 246 | 687 | ctrl+anchored |
| AC15P+H35 | 205 | 153 | 103 | 203 | 664 | cross-arch |
| CTRL+H35 | 215 | 112 | 91 | 214 | 632 | ctrl+anchored |
| CTRL+AC15 | 0 | 0 | 0 | 0 | **0** | ctrl+anchored |
| CTRL+AC15P | 0 | 0 | 0 | 0 | **0** | ctrl+anchored |

---

## Architecture group averages (per pair)

| Architecture group | Bigrams | Trigrams | Quadgrams |
|---|---|---|---|
| Control + anchored (4 pairs, but 2 are zero) | 822 | 638 | 330 |
| Codified pair (AC15 + AC15P) | 2,114 | 1,416 | 701 |
| Hybrid pair (H35 + HSEM) | 1,825 | 1,428 | 737 |
| Cross-architecture (4 pairs) | 1,946 | 1,400 | 709 |

---

## Triple exclusive sharing (exactly 3 systems) — trigrams, top 10

| Triple | Total | Type |
|---|---|---|
| AC15 + AC15P + HSEM | 377 | anchored only |
| AC15 + H35 + HSEM | 363 | anchored only |
| AC15P + H35 + HSEM | 342 | anchored only |
| CTRL + H35 + HSEM | 333 | includes ctrl |
| AC15 + AC15P + H35 | 328 | anchored only |
| AC15P + CTRL + H35 | 327 | includes ctrl |
| AC15 + CTRL + HSEM | 326 | includes ctrl |
| AC15P + CTRL + HSEM | 304 | includes ctrl |
| AC15 + CTRL + H35 | 295 | includes ctrl |
| AC15 + AC15P + CTRL | 289 | includes ctrl |

---

## Observations

These are observations from the data. They are stated as observations, not as conclusions. Interpretation belongs in a later document.

### 1. CONTROL + AC15 and CONTROL + AC15P have zero exclusive pairwise sharing

Across all 4 scenarios and all 3 levels (12 cells), there is not a single n-gram shared exclusively by CONTROL and AC15, and not a single one shared exclusively by CONTROL and AC15P.

This is the cleanest structural finding in the pairwise data.

It means: every n-gram that CONTROL and a codified system both produce is also produced by at least one other system. The codified systems never create vocabulary that only they and control share. Whatever a codified system says, at least one hybrid system also says it.

### 2. CONTROL shares exclusively only with the hybrid systems

CTRL + H35 and CTRL + HSEM have substantial exclusive sharing: 1,626/1,660 at bigrams, 1,271/1,283 at trigrams, 632/687 at quadgrams. The hybrid instruction style produces some vocabulary that overlaps with control's natural output and that the codified systems do not produce.

### 3. The codified pair leads at bigrams, the hybrid pair overtakes at quadgrams

At bigrams: AC15 + AC15P = 2,114 (highest pair). At quadgrams: H35 + HSEM = 737 vs AC15 + AC15P = 701 (hybrid pair overtakes). At trigrams they are very close (1,416 vs 1,428).

The codified systems share the most exclusive short phrases. The hybrid systems share the most exclusive long phrases. The crossover happens at the trigram level.

### 4. At trigrams and quadgrams, all anchored pairs are close

At trigrams, the 6 anchored-only pairs range from 1,351 to 1,452 — a spread of only 7%. At quadgrams, they range from 664 to 740 — a spread of 11%. The architectural distinction visible at bigrams (codified pair clearly highest) flattens at longer phrases. By quadgrams, knowing which architecture a pair belongs to tells you very little about how much they share exclusively.

### 5. HYBRID_SEMANTIC is the most connected system

At trigrams, HYBRID_SEMANTIC appears in the top 3 pairs (AC15+HSEM 1,452; H35+HSEM 1,428; AC15P+HSEM 1,426). At quadgrams, it appears in 3 of the top 5 pairs. In the triple analysis, it appears in 3 of the top 4 anchored-only triples. HYBRID_SEMANTIC shares the most exclusive vocabulary with the most partners.

### 6. The triple sharing shows balanced anchored-only distribution

The top 5 anchored-only triples are close: 328-377 (trigrams). All four possible anchored-only triples appear, meaning no single system is systematically excluded from triple sharing. The anchored systems form a connected vocabulary network where any 3 of the 4 share exclusive phrases.

### 7. CONTROL is more present in triples than in pairs

In the triple analysis, 5 of the top 10 triples include CONTROL. In the pair analysis, CONTROL has exactly 2 active pairs (both with hybrids) and 2 zero pairs (both with codified). CONTROL participates more in the vocabulary network when 3 systems are sharing than when 2 are — suggesting CONTROL's vocabulary overlaps with the edges of the anchored cluster but not with any single anchored system's core.

Exception: the codified systems, where CONTROL has no exclusive pairwise overlap at all.
