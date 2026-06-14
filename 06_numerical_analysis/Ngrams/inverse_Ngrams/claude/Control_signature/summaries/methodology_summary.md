# CONTROL Signature — Methodology Summary

## Question

The constraint-based lexicon and hygiene used for the anchored systems were not designed to characterize CONTROL. CONTROL has no instruction set to derive a lexicon from, and its earlier classification ("zero content_signature words") rested on filters shaped by the anchored-system pipeline. The question was whether CONTROL has a recognizable pattern when read outside the constraint-shaped lens.

## Source data

All data comes from the raw n-gram CSVs at:

```
inverse-ngrams/raw_materials/
├── trigrams_csv/ngram_trigrams_{s1,s3,s5,s7}.csv
└── quadgrams_csv/ngram_quadgrams_{s1,s3,s5,s7}.csv
```

These are the complete per-system n-gram exports — total output, not filtered through the inverse or shared-space pipelines. Each file contains counts per system per scenario.

No expression-type lexicon, constraint-based hygiene, or scenario-noun subtraction was applied. The analysis used only per-system counts and cross-system comparison.

## Two analysis layers

### Layer 1 — Phrase-shape layer (primary evidence)

For each n-gram level, pool CONTROL's trigrams and quadgrams across all four scenarios and rank by total count. Separately, extract the 2-token starter of every phrase and rank starters by count.

This layer asks: **what phrase shapes does CONTROL reach for most, regardless of comparison?**

The point is to detect recurring conversational and advisory structures in CONTROL's output that appear stably across scenarios. These structures are visible through total frequency and do not depend on what other systems produce.

### Layer 2 — Disproportionate word layer (supporting evidence)

For each content word appearing in any system's trigrams, compute:
- per-system count
- per-system share of total tokens (count / system's total token volume)
- CONTROL's share divided by the anchored-systems average share (ratio)

A word is flagged as CONTROL-distinctive if CONTROL's share-ratio is high AND the word is not primarily scenario-bound (appears in most scenarios, not concentrated in one).

This layer asks: **which words does CONTROL use disproportionately more than the anchored systems?**

The point is to find vocabulary CONTROL leans on when the anchored systems don't. This layer is weaker than Layer 1 because word-level disproportionality can be sensitive to a single scenario's vocabulary. Words that look distinctive may be scenario-colored rather than cross-scenario stable. This is flagged explicitly in the results.

## Why phrase shape is the primary layer

The phrase layer shows what CONTROL **does most**. The word layer shows what CONTROL **does more than others**. These are different questions.

Phrase recurrence is stable across scenarios when the same scaffold appears in S1, S3, S5, and S7. Word disproportion can be driven by one scenario where CONTROL happens to name something more heavily. The phrase-shape layer is therefore better evidence of stable stylistic identity; the word layer supports but does not carry the argument.

## What the analysis does not do

- It does not apply a CONTROL-specific expression-type lexicon (none was built — no instruction text to derive one from)
- It does not measure within-CONTROL variance (only one CONTROL run per scenario)
- It does not claim independence from the other analyses — it uses the same raw n-gram data
- It does not compare CONTROL's style against models other than GPT-4.1-mini
- It does not read full response texts; all evidence is n-gram-level

## Thresholds used

- Phrase-shape layer: no thresholds; ranked by total count.
- Disproportionate word layer: `count >= 20`, `ratio >= 1.3`, present in at least 3 of 4 scenarios.
- Disproportionate phrases: `count >= 5` (trigrams) or `count >= 4` (quadgrams), `ratio >= 2`.

These thresholds filter for volume sufficient to count as "recurring" within this experiment's data; they are not validated against a second CONTROL run.

## Outputs

Located in `claude/Control_signature/`:

- `control_total_top_trigrams.csv` — top 50 CONTROL trigrams by total count
- `control_total_top_quadgrams.csv` — top 50 CONTROL quadgrams by total count
- `control_top_phrase_starters.csv` — top 30 2-token phrase starters by count
- `control_disproportionate_words.csv` — content words where CONTROL's ratio is high
- `control_disproportionate_trigrams.csv` — phrases CONTROL uses disproportionately
- `control_disproportionate_quadgrams.csv` — quadgram phrases CONTROL uses disproportionately

## Relationship to the anchored-system analysis

The anchored systems were analyzed through:
1. A lexicon-grouped phase (expression-type lexicon applied to inverse n-grams)
2. A negative-space phase (word-hygiene pass on unclassified recurring words)

CONTROL's signature cannot be measured the same way because it has no instruction-derived lexicon. This methodology is the **parallel analysis for CONTROL** — built to the same evidential standard (algorithmic, n-gram-based, no prose reading) but using a different detection method appropriate to an unconstrained system.

The results of the two analyses can be compared qualitatively (what kind of signature does each system have?) but not quantitatively in the same metric.
