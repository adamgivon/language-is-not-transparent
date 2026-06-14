# Per-turn Prompt-Response Similarity: Correlation Across Matched Runs

For each system, Pearson correlation between each pair of runs treating
per-turn similarity as a vector. High r = the turn-to-turn pattern is
reproducible across runs.

Sample size: AC15P has 7 points per vector (turns 1–7), CONTROL has 5.
With n=5 or n=7, Pearson r has wide confidence intervals — interpret as
directional, not as statistically precise.

## AC15P per-run vectors (raw)

| Run | T1 | T2 | T3 | T4 | T5 | T6 | T7 |
|---|---|---|---|---|---|---|---|
| AC15P_R1 | 0.7816 | 0.7941 | 0.7723 | 0.7025 | 0.6001 | 0.7409 | 0.6550 |
| AC15P_R2 | 0.8054 | 0.7759 | 0.8225 | 0.6353 | 0.5907 | 0.7182 | 0.6962 |
| AC15P_R3 | 0.8009 | 0.7699 | 0.7369 | 0.6354 | 0.6059 | 0.7733 | 0.7315 |

## CONTROL per-run vectors (raw)

| Run | T1 | T2 | T3 | T4 | T5 |
|---|---|---|---|---|---|
| CTRL_R1 | 0.8259 | 0.4201 | 0.5470 | 0.6007 | 0.3828 |
| CTRL_R2 | 0.8025 | 0.4220 | 0.5124 | 0.6297 | 0.3525 |
| CTRL_R3 | 0.8357 | 0.4159 | 0.5910 | 0.6664 | 0.3314 |

## AC15P pairwise correlations (n=7)

| Pair | Pearson r |
|---|---|
| AC15P_R1 ↔ AC15P_R2 | 0.8816 |
| AC15P_R1 ↔ AC15P_R3 | 0.7864 |
| AC15P_R2 ↔ AC15P_R3 | 0.8591 |
| **Mean** | **0.8423** |

## CONTROL pairwise correlations (n=5)

| Pair | Pearson r |
|---|---|
| CTRL_R1 ↔ CTRL_R2 | 0.9887 |
| CTRL_R1 ↔ CTRL_R3 | 0.9798 |
| CTRL_R2 ↔ CTRL_R3 | 0.9856 |
| **Mean** | **0.9847** |

## Interpretation

- AC15P mean correlation across runs: **0.842**
- CONTROL mean correlation across runs: **0.985**

If both correlations are high (say, > 0.85), the per-turn pattern of prompt-response
similarity is a reproducible property of the conversation — turn 2's value depends
on turn 2's prompt/position, not on random sampling. This means:

1. The turn-to-turn variability I previously reported (between-turn stdev)
   reflects conversational dynamics, not noise.
2. CONTROL's collapses on turns 2, 3, 5 are systematic — not unlucky draws.
3. AC15P's stability across turns is also systematic.

If correlations are low, the per-turn pattern is run-specific and we can't claim
turn-level architectural behavior from matched-run means alone.