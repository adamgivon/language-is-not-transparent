# Similarity Analysis: 3 Matched AC15P Runs vs 3 Matched CONTROL Runs

Per-turn `prompt_to_response` similarity from `Item.distances` JSON.
Within-system: variance across 3 matched runs at the same turn position.
Between-system: AC15P mean vs CONTROL mean at matched turn positions (1–5).

## AC15P per-turn prompt-response similarity (3 runs)

| Turn | R1 | R2 | R3 | Mean | StDev | Range |
|---|---|---|---|---|---|---|
| 1 | 0.7816 | 0.8054 | 0.8009 | 0.7960 | 0.0126 | 0.0237 |
| 2 | 0.7941 | 0.7759 | 0.7699 | 0.7799 | 0.0126 | 0.0242 |
| 3 | 0.7723 | 0.8225 | 0.7369 | 0.7772 | 0.0430 | 0.0857 |
| 4 | 0.7025 | 0.6353 | 0.6354 | 0.6577 | 0.0388 | 0.0672 |
| 5 | 0.6001 | 0.5907 | 0.6059 | 0.5989 | 0.0077 | 0.0152 |
| 6 | 0.7409 | 0.7182 | 0.7733 | 0.7441 | 0.0277 | 0.0551 |
| 7 | 0.6550 | 0.6962 | 0.7315 | 0.6942 | 0.0383 | 0.0765 |

## CONTROL per-turn prompt-response similarity (3 runs)

| Turn | R1 | R2 | R3 | Mean | StDev | Range |
|---|---|---|---|---|---|---|
| 1 | 0.8259 | 0.8025 | 0.8357 | 0.8214 | 0.0170 | 0.0332 |
| 2 | 0.4201 | 0.4220 | 0.4159 | 0.4193 | 0.0031 | 0.0061 |
| 3 | 0.5470 | 0.5124 | 0.5910 | 0.5501 | 0.0394 | 0.0786 |
| 4 | 0.6007 | 0.6297 | 0.6664 | 0.6323 | 0.0330 | 0.0658 |
| 5 | 0.3828 | 0.3525 | 0.3314 | 0.3556 | 0.0258 | 0.0513 |

## Within-system variance summary

| Metric | AC15P | CONTROL |
|---|---|---|
| Overall mean p2r | 0.7212 | 0.5557 |
| Mean within-turn stdev (across 3 runs) | 0.0258 | 0.0237 |
| Mean within-turn range (max-min across 3 runs) | 0.0497 | 0.0470 |
| Between-turn stdev (run-mean varies by turn) | 0.0735 | 0.1838 |

## AC15P vs CONTROL at matched turns 1–5

| Turn | AC15P mean (3 runs) | CONTROL mean (3 runs) | Difference |
|---|---|---|---|
| 1 | 0.7960 | 0.8214 | -0.0254 |
| 2 | 0.7799 | 0.4193 | +0.3606 |
| 3 | 0.7772 | 0.5501 | +0.2271 |
| 4 | 0.6577 | 0.6323 | +0.0254 |
| 5 | 0.5989 | 0.3556 | +0.2433 |
| **Mean** | **0.7220** | **0.5557** | **+0.1662** |

## Headline interpretation

- Within-system stdev measures stochastic variance: how much does the SAME system fluctuate across 3 matched runs at the same turn?
- Between-system difference measures architectural effect at matched turns.
- If between-system difference > within-system stdev, architecture moves the metric above noise.

Overall AC15P–CONTROL mean difference (turns 1–5): 0.1662
Overall mean within-system stdev (avg of AC15P and CONTROL): 0.0247
Ratio (between/within): 6.72

- Ratio > 2: clear architectural signal above noise.
- Ratio 1–2: signal exists but within noise band.
- Ratio < 1: indistinguishable from noise.