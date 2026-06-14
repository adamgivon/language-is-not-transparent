# Three Matched CONTROL Runs — 5 Turns, Same Config — Within-System Variance Measurement

## Purpose

The earlier turn-1 pilot (see `new_control_check.md` in this folder) suggested that within-CONTROL variance might be comparable to between-system variance, but used mismatched configurations. This test uses **three matched CONTROL runs** (same model, same API config, same 5-turn prompt sequence, stochastic draws only) to produce a clean measurement of within-system variance at full conversation scale.

## The three runs

All three cover Scenario 1, all 5 turns, same prompt sequence, matched config.

### Total n-gram counts (positions in the sequence, with repeats)

For a run of N tokens: bigram positions = N − 1, trigram positions = N − 2, quadgram positions = N − 3. Totals drop by 1 at each step because the sliding window loses one valid starting position.

| File | Tokens | Total bigrams | Total trigrams | Total quadgrams |
|---|---|---|---|---|
| `scen1_2nd_test_1.md` (R1) | 2,487 | 2,486 | 2,485 | 2,484 |
| `scen1_2nd_test_2.md` (R2) | 2,660 | 2,659 | 2,658 | 2,657 |
| `scen1_2nd_test_3.md` (R3) | 3,105 | 3,104 | 3,103 | 3,102 |

### Unique n-gram counts (distinct types, repeats collapsed)

Shorter n-grams repeat more ("of the", "you can") so unique counts are much lower than totals. Longer n-grams are nearly all one-offs, so unique counts approach the totals.

| File | Tokens | Unique bigrams | Unique trigrams | Unique quadgrams |
|---|---|---|---|---|
| `scen1_2nd_test_1.md` (R1) | 2,487 | 2,123 | 2,398 | 2,455 |
| `scen1_2nd_test_2.md` (R2) | 2,660 | 2,255 | 2,549 | 2,624 |
| `scen1_2nd_test_3.md` (R3) | 3,105 | 2,544 | 2,942 | 3,053 |

### Average repetition per n-gram (total ÷ unique) for R1

- Bigram: 2,486 / 2,123 ≈ **1.17** occurrences per unique bigram
- Trigram: 2,485 / 2,398 ≈ **1.04**
- Quadgram: 2,484 / 2,455 ≈ **1.01** — essentially every quadgram is unique within the run

All overlap numbers in this document are computed on unique-type sets (the standard method for Jaccard / containment / intersection analysis).

## Pairwise overlap (Jaccard)

| Pair | Bigrams | Trigrams | Quadgrams |
|---|---|---|---|
| R1 ↔ R2 | 9.01% | 2.59% | 0.81% |
| R1 ↔ R3 | 9.71% | 3.09% | 1.19% |
| R2 ↔ R3 | 9.12% | 3.00% | 1.38% |
| **Mean** | **9.28%** | **2.89%** | **1.13%** |

## Pairwise containment

| Pair | Bigrams | Trigrams | Quadgrams |
|---|---|---|---|
| R1 phrases in R2 | 17.05% | 5.21% | 1.67% |
| R1 phrases in R3 | 19.45% | 6.67% | 2.65% |
| R2 phrases in R3 | 17.78% | 6.28% | 2.93% |

## Triple intersection — phrases appearing in all three runs

| n-gram level | Count | % of average single-run size |
|---|---|---|
| Bigrams | 197 | 8.54% |
| Trigrams | 50 | 1.90% |
| Quadgrams | **13** | **0.48%** |

## Triple union — total distinct phrases across three runs

| n-gram level | Count | Multiple of average single-run size |
|---|---|---|
| Bigrams | 5,943 | 2.58× |
| Trigrams | 7,494 | 2.85× |
| Quadgrams | 7,962 | **2.94×** |

Each additional run contributes ~95% new quadgrams to the pool.

## Distribution — quadgrams by number of runs they appear in

| Bucket | Count | % |
|---|---|---|
| In exactly 1 run | 7,805 | **98.0%** |
| In exactly 2 runs | 144 | 1.8% |
| In all 3 runs | 13 | 0.2% |

## What this measures

The same system — same model, same config, same prompts, same 5-turn sequence — produces three near-disjoint phrase fields when run three times. Only 13 four-word sequences survive across all three runs out of ~2,700 per run. 98% of each run's quadgrams are unique to that run even within-system.

## Comparison to between-system numbers from the main analysis

- **Within-CONTROL pairwise Jaccard (quadgrams):** 0.81% – 1.38% (mean 1.13%)
- **Between-system pairwise Jaccard (quadgrams), same scenario:** typically 1–2% range

The within-system floor is approximately the same magnitude as the between-system signal at this sample size.

## What this invalidates in the textual analysis chapter

1. **Per-system phrase-count claims.** Any claim that rests on counts from a single run of each system is noise-dominated. The mild lexicon-group tendencies (0.05–0.27% of corpus) cannot be cleanly separated from this stochastic floor.

2. **The "95–98% unique" framing as architecture evidence.** Same pattern emerges within-system. The uniqueness is primarily the stochastic texture of how LLMs generate text at 5-turn scale, not evidence that architecture shapes vocabulary.

3. **Single-run "system signature" claims.** A single draw from a distribution this wide cannot characterize a system's voice.

## What survives

1. ~~**CTRL + codified = 0 exclusive shared phrases.**~~ **INVALIDATED 2026-04-15.** On re-verification against the raw n-gram CSVs, CONTROL+AC15 has 644 exclusively shared quadgrams (1,668 bigrams, 1,248 trigrams) and CONTROL+AC15P has 636 quadgrams (1,689 bigrams, 1,243 trigrams) — same magnitude range as every other pair. The original zero came from a bug in `pairwise_sharing_by_scenario.csv` (pair-label-ordering mismatch). There is no structural zero.

2. **Cross-scenario ranking consistency (if verified).** If a system leads on a group across S1, S3, S5, S7, that's four independent draws pointing the same direction — stronger evidence than any single count.

3. **Qualitative kind-of-vocabulary differences** (codified pair shares procedural phrases; hybrid pair shares evaluative phrases). Direction, not magnitude, visible in the phrases themselves.

## Decision for the paper

The textual analysis chapter as a standalone quantitative argument is being discarded. In its place, a concession note will identify:

- What was attempted (inverse n-gram analysis looking for architectural signatures).
- What the replication test showed (within-system variance ≈ between-system signal at phrase level with n=1 per condition).
- The implication (the experimental design is not sampled densely enough to separate architecture signal from base-model stochasticity in surface text).
- The redesign future work would need (multiple runs per system per scenario — perhaps 5–10 — to measure and subtract the within-system baseline).

The few findings that seemed to survive this stress test (qualitative kind-of-vocabulary, cross-scenario direction consistency) may be retained briefly as observations, but will not carry the architecture thesis. (The CTRL+codified=0 observation was also listed here originally, but was invalidated on 2026-04-15 when the claim was traced back to a CSV bug — see correction above. Nothing count-based from the inverse-ngram analysis survives independent verification at this sample size.)

The architecture-shapes-output argument will instead rest on the close reading chapter, which analyzes stance, framing, and semantic structure — dimensions that are likely more robust to phrase-level stochasticity than surface word choice.

## Methodological note

This is the single most important methodological finding of the whole textual analysis effort. At n=1 run per system per scenario, the experiment cannot discriminate architectural vocabulary effects from base-model stochastic variance at the phrase level. Acknowledging this openly strengthens the paper's credibility more than attempting to salvage findings that can't bear the weight.
