# Cross-system Correlation: AC15P vs CONTROL (per-turn similarity)

AC15P runs truncated to first 5 turns to match CONTROL. Pearson correlation
on 5-element per-turn similarity vectors.

High r => AC15P and CONTROL follow the SAME per-turn pattern (same turns are
harder/easier), just at different baseline levels. Architecture shifts the mean
but doesn't change which turns stress the system.

Low r => the two architectures handle different turns differently — turns
where CONTROL collapses are not the same turns where AC15P dips.

## Vectors (first 5 turns)

| Run | T1 | T2 | T3 | T4 | T5 |
|---|---|---|---|---|---|
| AC15P_R1 | 0.7816 | 0.7941 | 0.7723 | 0.7025 | 0.6001 |
| AC15P_R2 | 0.8054 | 0.7759 | 0.8225 | 0.6353 | 0.5907 |
| AC15P_R3 | 0.8009 | 0.7699 | 0.7369 | 0.6354 | 0.6059 |
| CTRL_R1 | 0.8259 | 0.4201 | 0.5470 | 0.6007 | 0.3828 |
| CTRL_R2 | 0.8025 | 0.4220 | 0.5124 | 0.6297 | 0.3525 |
| CTRL_R3 | 0.8357 | 0.4159 | 0.5910 | 0.6664 | 0.3314 |
| **AC15P mean** | 0.7960 | 0.7799 | 0.7772 | 0.6577 | 0.5989 |
| **CTRL mean** | 0.8214 | 0.4193 | 0.5501 | 0.6323 | 0.3556 |

## 9 Cross-system pairwise correlations

| AC15P run | CONTROL run | Pearson r |
|---|---|---|
| AC15P_R1 | CTRL_R1 | 0.4593 |
| AC15P_R1 | CTRL_R2 | 0.4635 |
| AC15P_R1 | CTRL_R3 | 0.5091 |
| AC15P_R2 | CTRL_R1 | 0.4469 |
| AC15P_R2 | CTRL_R2 | 0.3925 |
| AC15P_R2 | CTRL_R3 | 0.4596 |
| AC15P_R3 | CTRL_R1 | 0.5161 |
| AC15P_R3 | CTRL_R2 | 0.4767 |
| AC15P_R3 | CTRL_R3 | 0.4850 |
| **Mean of 9 cross-pairs** | | **0.4676** |

## Mean-vector correlation

Pearson r between AC15P's per-turn mean vector (averaged across 3 runs)
and CONTROL's per-turn mean vector: **r = 0.4801**

## Comparison with within-system correlations

| Comparison | Mean Pearson r |
|---|---|
| Within-CONTROL (3 pairs) | 0.9847 |
| Within-AC15P (3 pairs, first 5 turns) | 0.9239 |
| Cross-system AC15P↔CONTROL (9 pairs) | 0.4676 |
| Mean-vector AC15P↔CONTROL | 0.4801 |

## Interpretation

- Within-CONTROL: r ≈ 0.98 (essentially deterministic shape)
- Within-AC15P (5-turn): r ≈ 0.92 (reproducible shape)
- Cross-system: r ≈ 0.47

If cross-system r is notably lower than within-system r, that means the per-turn
pattern DIFFERS between architectures — the turns that stress CONTROL are not
identically the turns that stress AC15P. Architecture is changing WHAT HAPPENS at
each turn, not just shifting a uniform curve up or down.

If cross-system r is comparable to within-system r, the two architectures have
the same prompt-driven per-turn shape, just at different heights.