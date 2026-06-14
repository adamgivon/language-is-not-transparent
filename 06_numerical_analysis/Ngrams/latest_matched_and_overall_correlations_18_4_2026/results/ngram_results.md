# N-gram Analysis: 3 Matched AC15P Runs vs 3 Matched CONTROL Runs

Scenario 1, matched config (same model, same API). AC15P = 7 turns, CONTROL = 5 turns. 
Turn markers stripped before tokenization to avoid spurious 'turn N' overlap.

## Within-AC15P (full 7 turns)

### Per-run counts

| Run | Tokens | Total bigrams | Total trigrams | Total quadgrams | Unique bigrams | Unique trigrams | Unique quadgrams |
|---|---|---|---|---|---|---|---|
| AC15P_R1 | 4,414 | 4,413 | 4,412 | 4,411 | 3,552 | 4,156 | 4,307 |
| AC15P_R2 | 4,651 | 4,650 | 4,649 | 4,648 | 3,886 | 4,476 | 4,594 |
| AC15P_R3 | 4,119 | 4,118 | 4,117 | 4,116 | 3,339 | 3,911 | 4,034 |

### Pairwise Jaccard

| Pair | Bigrams | Trigrams | Quadgrams |
|---|---|---|---|
| AC15P_R1 ↔ AC15P_R2 | 9.30% | 2.87% | 1.27% |
| AC15P_R1 ↔ AC15P_R3 | 10.03% | 3.04% | 1.18% |
| AC15P_R2 ↔ AC15P_R3 | 10.15% | 3.58% | 1.64% |

### Pairwise containment (% of ROW's phrases in COLUMN)

- AC15P_R1 → AC15P_R2: bi 17.82%, tri 5.80%, quad 2.60%
- AC15P_R1 → AC15P_R3: bi 17.68%, tri 5.73%, quad 2.25%
- AC15P_R2 → AC15P_R1: bi 16.29%, tri 5.38%, quad 2.44%
- AC15P_R2 → AC15P_R3: bi 17.14%, tri 6.48%, quad 3.03%
- AC15P_R3 → AC15P_R1: bi 18.81%, tri 6.09%, quad 2.40%
- AC15P_R3 → AC15P_R2: bi 19.95%, tri 7.41%, quad 3.45%

### Triple intersection (AC15P: phrases appearing in all 3 runs)

| Level | Count | % of average single-run size |
|---|---|---|
| Bigrams | 342 | 9.52% |
| Trigrams | 109 | 2.61% |
| Quadgrams | 43 | 1.00% |

### Triple union (AC15P: total distinct phrases across 3 runs)

| Level | Count | × average single-run size |
|---|---|---|
| Bigrams | 9,192 | 2.56× |
| Trigrams | 11,883 | 2.84× |
| Quadgrams | 12,630 | 2.93× |

### Distribution (AC15P: # quadgrams in exactly 1, 2, or all 3 runs)

| Bucket | Count | % |
|---|---|---|
| In exactly 1 run | 12,368 | 97.9% |
| In exactly 2 runs | 219 | 1.7% |
| In all 3 runs | 43 | 0.3% |

## Within-CONTROL (full 5 turns)

### Per-run counts

| Run | Tokens | Total bigrams | Total trigrams | Total quadgrams | Unique bigrams | Unique trigrams | Unique quadgrams |
|---|---|---|---|---|---|---|---|
| CTRL_R1 | 2,477 | 2,476 | 2,475 | 2,474 | 2,115 | 2,388 | 2,445 |
| CTRL_R2 | 2,650 | 2,649 | 2,648 | 2,647 | 2,245 | 2,539 | 2,614 |
| CTRL_R3 | 3,095 | 3,094 | 3,093 | 3,092 | 2,534 | 2,932 | 3,043 |

### Pairwise Jaccard

| Pair | Bigrams | Trigrams | Quadgrams |
|---|---|---|---|
| CTRL_R1 ↔ CTRL_R2 | 8.84% | 2.50% | 0.74% |
| CTRL_R1 ↔ CTRL_R3 | 9.57% | 3.08% | 1.20% |
| CTRL_R2 ↔ CTRL_R3 | 8.99% | 2.95% | 1.34% |

### Pairwise containment (% of ROW's phrases in COLUMN)

- CTRL_R1 → CTRL_R2: bi 16.74%, tri 5.03%, quad 1.51%
- CTRL_R1 → CTRL_R3: bi 19.20%, tri 6.66%, quad 2.66%
- CTRL_R2 → CTRL_R1: bi 15.77%, tri 4.73%, quad 1.42%
- CTRL_R2 → CTRL_R3: bi 17.55%, tri 6.18%, quad 2.87%
- CTRL_R3 → CTRL_R1: bi 16.02%, tri 5.42%, quad 2.14%
- CTRL_R3 → CTRL_R2: bi 15.55%, tri 5.35%, quad 2.46%

### Triple intersection (CONTROL: phrases appearing in all 3 runs)

| Level | Count | % of average single-run size |
|---|---|---|
| Bigrams | 190 | 8.27% |
| Trigrams | 49 | 1.87% |
| Quadgrams | 13 | 0.48% |

### Triple union (CONTROL: total distinct phrases across 3 runs)

| Level | Count | × average single-run size |
|---|---|---|
| Bigrams | 5,930 | 2.58× |
| Trigrams | 7,472 | 2.85× |
| Quadgrams | 7,938 | 2.94× |

### Distribution (CONTROL: # quadgrams in exactly 1, 2, or all 3 runs)

| Bucket | Count | % |
|---|---|---|
| In exactly 1 run | 7,787 | 98.1% |
| In exactly 2 runs | 138 | 1.7% |
| In all 3 runs | 13 | 0.2% |

## Cross-architecture: AC15P vs CONTROL at matched 5 turns

AC15P runs truncated to first 5 turns to match CONTROL run length.

### AC15P 5-turn token counts

| Run | Tokens | Total bigrams | Total trigrams | Total quadgrams | Unique bigrams | Unique trigrams | Unique quadgrams |
|---|---|---|---|---|---|---|---|
| AC15P_R1_5turn | 3,177 | 3,176 | 3,175 | 3,174 | 2,593 | 2,982 | 3,095 |
| AC15P_R2_5turn | 3,396 | 3,395 | 3,394 | 3,393 | 2,854 | 3,262 | 3,352 |
| AC15P_R3_5turn | 2,971 | 2,970 | 2,969 | 2,968 | 2,421 | 2,812 | 2,899 |

### Cross-architecture containment at matched 5 turns

Each cell = % of ROW's quadgrams that also appear in COLUMN.

| Source ↓ \ Target → | CTRL_R1 | CTRL_R2 | CTRL_R3 | AC15P_R1_5turn | AC15P_R2_5turn | AC15P_R3_5turn |
|---|---|---|---|---|---|---|
| CTRL_R1 | — | 1.51% | 2.66% | 2.09% | 2.33% | 2.25% |
| CTRL_R2 | 1.42% | — | 2.87% | 2.10% | 2.30% | 1.87% |
| CTRL_R3 | 2.14% | 2.46% | — | 2.14% | 2.56% | 2.40% |
| AC15P_R1_5turn | 1.65% | 1.78% | 2.10% | — | 2.65% | 2.29% |
| AC15P_R2_5turn | 1.70% | 1.79% | 2.33% | 2.45% | — | 3.28% |
| AC15P_R3_5turn | 1.90% | 1.69% | 2.52% | 2.45% | 3.79% | — |

## Headline comparison

| Metric (quadgrams) | AC15P | CONTROL |
|---|---|---|
| Mean pairwise Jaccard | 1.36% | 1.09% |
| Triple-intersection % | 1.00% | 0.48% |
| Triple-union × single | 2.93× | 2.94× |
| % quads in exactly 1 run | 97.9% | 98.1% |
| % quads in all 3 runs | 0.34% | 0.16% |