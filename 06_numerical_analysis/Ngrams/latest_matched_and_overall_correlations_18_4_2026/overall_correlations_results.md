# Cross-system Prompt-Response Correlation and Mean Difference — 8 Scenarios

**Date: 2026-04-18**

Data: per-turn `prompt_to_response` cosine similarity from `Item.distances` JSON,
pulled from `prisma/dev.db`. 40 conversations: 5 systems × 8 scenarios.

Per-scenario vector length: 25 turns for all scenarios except S3, which is 22 turns.
(S3 normalized to 22 because HYBRID's S3 session is missing a mid-conversation turn;
truncating to 22 avoids the gap without needing index-skip logic.)

The 3 matched-runs control sessions and 3 matched-runs AC15P sessions
(created 2026-04-14+) are EXCLUDED from this analysis. They are analyzed separately
in `not included in this publication set`.

## 1. Session mapping

| Scenario | CONTROL | AC15 | AC15P | HYBRID | HSEM |
|---|---|---|---|---|---|
| S1 | `scenario_v1_2` | `Scenario_1_v2_lights` | `scenario_1_v2` | `Scenario_1_v2` | `scenario_1_v2` |
| S2 | `Scenario_2_v3` | `Scenario_2_v3` | `Scenario_2_v3` | `Scenario_2_v3` | `Scenario_2_v3` |
| S3 | `test_3_chimera` | `scenario_3` | `scenario_3_drone` | `Scenario_3_drone` | `Scenario_3` |
| S4 | `scenario_4` | `scenario_4` | `Scenario_4` | `Scenario_4` | `Scenario_4` |
| S5 | `Scenario_5` | `scenario_5` | `scenario_5` | `Scenario_5` | `Scenario_5` |
| S6 | `Scenario_6` | `Scenario_6` | `Scenario_6` | `Scenario_6` | `Scenario_6` |
| S7 | `Scenario_7` | `Scenario_7` | `Scenario_7` | `Scenario_7` | `Scenario_7` |
| S8 | `Scenario_8` | `Scenario_8` | `Scenario_8` | `Scenario_8` | `Scenario_8` |

## 2. Per-scenario per-system mean prompt-response similarity

| Scenario | CONTROL | AC15 | AC15P | HYBRID | HSEM | Mean anchored − CONTROL |
|---|---|---|---|---|---|---|
| S1 | 0.5627 | 0.7171 | 0.7307 | 0.7306 | 0.7330 | +0.1652 |
| S2 | 0.5370 | 0.7513 | 0.7522 | 0.7524 | 0.7491 | +0.2142 |
| S3 | 0.6073 | 0.7144 | 0.7326 | 0.7219 | 0.7238 | +0.1159 |
| S4 | 0.6421 | 0.7238 | 0.7345 | 0.7277 | 0.7386 | +0.0891 |
| S5 | 0.6351 | 0.7370 | 0.7324 | 0.7324 | 0.7311 | +0.0982 |
| S6 | 0.5643 | 0.7248 | 0.7281 | 0.7360 | 0.7203 | +0.1630 |
| S7 | 0.5683 | 0.7131 | 0.7114 | 0.7223 | 0.7206 | +0.1486 |
| S8 | 0.6418 | 0.7406 | 0.7421 | 0.7441 | 0.7383 | +0.0995 |
| **Mean across 8 scenarios** | **0.5948** | **0.7278** | **0.7330** | **0.7334** | **0.7319** | **+0.1367** |

## 3. Per-scenario correlation matrices (Pearson r)

Each cell = Pearson r between row-system and column-system per-turn p2r vectors
within that scenario. Symmetric matrix (r(A,B) = r(B,A)).

### S1 (n=25)

| System | CONTROL | AC15 | AC15P | HYBRID | HSEM |
|---|---|---|---|---|---|
| CONTROL | — | 0.329 | 0.185 | 0.229 | 0.233 |
| AC15 | 0.329 | — | 0.904 | 0.799 | 0.797 |
| AC15P | 0.185 | 0.904 | — | 0.759 | 0.783 |
| HYBRID | 0.229 | 0.799 | 0.759 | — | 0.794 |
| HSEM | 0.233 | 0.797 | 0.783 | 0.794 | — |

### S2 (n=25)

| System | CONTROL | AC15 | AC15P | HYBRID | HSEM |
|---|---|---|---|---|---|
| CONTROL | — | 0.358 | 0.499 | 0.473 | 0.303 |
| AC15 | 0.358 | — | 0.865 | 0.698 | 0.764 |
| AC15P | 0.499 | 0.865 | — | 0.678 | 0.798 |
| HYBRID | 0.473 | 0.698 | 0.678 | — | 0.585 |
| HSEM | 0.303 | 0.764 | 0.798 | 0.585 | — |

### S3 (n=22)

| System | CONTROL | AC15 | AC15P | HYBRID | HSEM |
|---|---|---|---|---|---|
| CONTROL | — | 0.290 | 0.397 | 0.412 | 0.362 |
| AC15 | 0.290 | — | 0.832 | 0.814 | 0.840 |
| AC15P | 0.397 | 0.832 | — | 0.933 | 0.932 |
| HYBRID | 0.412 | 0.814 | 0.933 | — | 0.923 |
| HSEM | 0.362 | 0.840 | 0.932 | 0.923 | — |

### S4 (n=25)

| System | CONTROL | AC15 | AC15P | HYBRID | HSEM |
|---|---|---|---|---|---|
| CONTROL | — | 0.035 | -0.043 | 0.105 | 0.149 |
| AC15 | 0.035 | — | 0.831 | 0.885 | 0.797 |
| AC15P | -0.043 | 0.831 | — | 0.741 | 0.818 |
| HYBRID | 0.105 | 0.885 | 0.741 | — | 0.806 |
| HSEM | 0.149 | 0.797 | 0.818 | 0.806 | — |

### S5 (n=25)

| System | CONTROL | AC15 | AC15P | HYBRID | HSEM |
|---|---|---|---|---|---|
| CONTROL | — | 0.120 | 0.309 | 0.231 | 0.143 |
| AC15 | 0.120 | — | 0.589 | 0.805 | 0.627 |
| AC15P | 0.309 | 0.589 | — | 0.614 | 0.772 |
| HYBRID | 0.231 | 0.805 | 0.614 | — | 0.676 |
| HSEM | 0.143 | 0.627 | 0.772 | 0.676 | — |

### S6 (n=25)

| System | CONTROL | AC15 | AC15P | HYBRID | HSEM |
|---|---|---|---|---|---|
| CONTROL | — | 0.572 | 0.393 | 0.522 | 0.432 |
| AC15 | 0.572 | — | 0.755 | 0.787 | 0.743 |
| AC15P | 0.393 | 0.755 | — | 0.811 | 0.834 |
| HYBRID | 0.522 | 0.787 | 0.811 | — | 0.831 |
| HSEM | 0.432 | 0.743 | 0.834 | 0.831 | — |

### S7 (n=25)

| System | CONTROL | AC15 | AC15P | HYBRID | HSEM |
|---|---|---|---|---|---|
| CONTROL | — | 0.481 | 0.566 | 0.470 | 0.472 |
| AC15 | 0.481 | — | 0.797 | 0.831 | 0.779 |
| AC15P | 0.566 | 0.797 | — | 0.639 | 0.763 |
| HYBRID | 0.470 | 0.831 | 0.639 | — | 0.631 |
| HSEM | 0.472 | 0.779 | 0.763 | 0.631 | — |

### S8 (n=25)

| System | CONTROL | AC15 | AC15P | HYBRID | HSEM |
|---|---|---|---|---|---|
| CONTROL | — | 0.235 | 0.467 | 0.406 | 0.294 |
| AC15 | 0.235 | — | 0.811 | 0.793 | 0.798 |
| AC15P | 0.467 | 0.811 | — | 0.887 | 0.822 |
| HYBRID | 0.406 | 0.793 | 0.887 | — | 0.881 |
| HSEM | 0.294 | 0.798 | 0.822 | 0.881 | — |

## 4. Per-scenario mean-difference matrices (row − column)

Each cell = mean(row-system) − mean(column-system) across that scenario's turns.
Positive = row higher than column. Antisymmetric matrix.

### S1 (n=25)

| Row − Col | CONTROL | AC15 | AC15P | HYBRID | HSEM |
|---|---|---|---|---|---|
| CONTROL | — | -0.1544 | -0.1681 | -0.1679 | -0.1704 |
| AC15 | +0.1544 | — | -0.0136 | -0.0135 | -0.0160 |
| AC15P | +0.1681 | +0.0136 | — | +0.0002 | -0.0023 |
| HYBRID | +0.1679 | +0.0135 | -0.0002 | — | -0.0025 |
| HSEM | +0.1704 | +0.0160 | +0.0023 | +0.0025 | — |

### S2 (n=25)

| Row − Col | CONTROL | AC15 | AC15P | HYBRID | HSEM |
|---|---|---|---|---|---|
| CONTROL | — | -0.2143 | -0.2152 | -0.2154 | -0.2121 |
| AC15 | +0.2143 | — | -0.0009 | -0.0012 | +0.0022 |
| AC15P | +0.2152 | +0.0009 | — | -0.0002 | +0.0031 |
| HYBRID | +0.2154 | +0.0012 | +0.0002 | — | +0.0034 |
| HSEM | +0.2121 | -0.0022 | -0.0031 | -0.0034 | — |

### S3 (n=22)

| Row − Col | CONTROL | AC15 | AC15P | HYBRID | HSEM |
|---|---|---|---|---|---|
| CONTROL | — | -0.1071 | -0.1253 | -0.1145 | -0.1165 |
| AC15 | +0.1071 | — | -0.0182 | -0.0074 | -0.0094 |
| AC15P | +0.1253 | +0.0182 | — | +0.0107 | +0.0088 |
| HYBRID | +0.1145 | +0.0074 | -0.0107 | — | -0.0020 |
| HSEM | +0.1165 | +0.0094 | -0.0088 | +0.0020 | — |

### S4 (n=25)

| Row − Col | CONTROL | AC15 | AC15P | HYBRID | HSEM |
|---|---|---|---|---|---|
| CONTROL | — | -0.0817 | -0.0924 | -0.0857 | -0.0965 |
| AC15 | +0.0817 | — | -0.0107 | -0.0039 | -0.0148 |
| AC15P | +0.0924 | +0.0107 | — | +0.0068 | -0.0041 |
| HYBRID | +0.0857 | +0.0039 | -0.0068 | — | -0.0109 |
| HSEM | +0.0965 | +0.0148 | +0.0041 | +0.0109 | — |

### S5 (n=25)

| Row − Col | CONTROL | AC15 | AC15P | HYBRID | HSEM |
|---|---|---|---|---|---|
| CONTROL | — | -0.1020 | -0.0973 | -0.0973 | -0.0961 |
| AC15 | +0.1020 | — | +0.0047 | +0.0047 | +0.0059 |
| AC15P | +0.0973 | -0.0047 | — | -0.0000 | +0.0013 |
| HYBRID | +0.0973 | -0.0047 | +0.0000 | — | +0.0013 |
| HSEM | +0.0961 | -0.0059 | -0.0013 | -0.0013 | — |

### S6 (n=25)

| Row − Col | CONTROL | AC15 | AC15P | HYBRID | HSEM |
|---|---|---|---|---|---|
| CONTROL | — | -0.1605 | -0.1637 | -0.1717 | -0.1560 |
| AC15 | +0.1605 | — | -0.0032 | -0.0112 | +0.0045 |
| AC15P | +0.1637 | +0.0032 | — | -0.0080 | +0.0077 |
| HYBRID | +0.1717 | +0.0112 | +0.0080 | — | +0.0157 |
| HSEM | +0.1560 | -0.0045 | -0.0077 | -0.0157 | — |

### S7 (n=25)

| Row − Col | CONTROL | AC15 | AC15P | HYBRID | HSEM |
|---|---|---|---|---|---|
| CONTROL | — | -0.1448 | -0.1432 | -0.1540 | -0.1524 |
| AC15 | +0.1448 | — | +0.0017 | -0.0092 | -0.0075 |
| AC15P | +0.1432 | -0.0017 | — | -0.0109 | -0.0092 |
| HYBRID | +0.1540 | +0.0092 | +0.0109 | — | +0.0017 |
| HSEM | +0.1524 | +0.0075 | +0.0092 | -0.0017 | — |

### S8 (n=25)

| Row − Col | CONTROL | AC15 | AC15P | HYBRID | HSEM |
|---|---|---|---|---|---|
| CONTROL | — | -0.0988 | -0.1003 | -0.1023 | -0.0966 |
| AC15 | +0.0988 | — | -0.0015 | -0.0035 | +0.0022 |
| AC15P | +0.1003 | +0.0015 | — | -0.0020 | +0.0037 |
| HYBRID | +0.1023 | +0.0035 | +0.0020 | — | +0.0057 |
| HSEM | +0.0966 | -0.0022 | -0.0037 | -0.0057 | — |

## 5. Aggregate across 8 scenarios

Mean of the per-scenario matrices, one cell per system-pair.

### 5a. Mean correlation across 8 scenarios

| System | CONTROL | AC15 | AC15P | HYBRID | HSEM |
|---|---|---|---|---|---|
| CONTROL | — | 0.302 | 0.347 | 0.356 | 0.299 |
| AC15 | 0.302 | — | 0.798 | 0.802 | 0.768 |
| AC15P | 0.347 | 0.798 | — | 0.758 | 0.815 |
| HYBRID | 0.356 | 0.802 | 0.758 | — | 0.766 |
| HSEM | 0.299 | 0.768 | 0.815 | 0.766 | — |

### 5b. Mean mean-difference across 8 scenarios (row − col)

| Row − Col | CONTROL | AC15 | AC15P | HYBRID | HSEM |
|---|---|---|---|---|---|
| CONTROL | — | -0.1330 | -0.1382 | -0.1386 | -0.1371 |
| AC15 | +0.1330 | — | -0.0052 | -0.0057 | -0.0041 |
| AC15P | +0.1382 | +0.0052 | — | -0.0004 | +0.0011 |
| HYBRID | +0.1386 | +0.0057 | +0.0004 | — | +0.0016 |
| HSEM | +0.1371 | +0.0041 | -0.0011 | -0.0016 | — |

## 6. Key observations

### 6a. Anchored-vs-CONTROL correlations (does architecture shift the SHAPE?)

Low r = anchored systems follow a different per-turn shape than CONTROL
(architecture changes which turns are hard/easy, not just the baseline).

| Scenario | AC15↔CTRL | AC15P↔CTRL | HYBRID↔CTRL | HSEM↔CTRL | Mean |
|---|---|---|---|---|---|
| S1 | 0.329 | 0.185 | 0.229 | 0.233 | 0.244 |
| S2 | 0.358 | 0.499 | 0.473 | 0.303 | 0.408 |
| S3 | 0.290 | 0.397 | 0.412 | 0.362 | 0.365 |
| S4 | 0.035 | -0.043 | 0.105 | 0.149 | 0.061 |
| S5 | 0.120 | 0.309 | 0.231 | 0.143 | 0.200 |
| S6 | 0.572 | 0.393 | 0.522 | 0.432 | 0.480 |
| S7 | 0.481 | 0.566 | 0.470 | 0.472 | 0.497 |
| S8 | 0.235 | 0.467 | 0.406 | 0.294 | 0.351 |
| **Mean** | **0.302** | **0.347** | **0.356** | **0.299** | **0.326** |

### 6b. Anchored-vs-anchored correlations (do anchored systems share a per-turn shape?)

High r = anchored architectures follow the same per-turn pattern
(anchoring-as-architecture is the dominant effect, specific codification style is secondary).

| Scenario | AC15↔AC15P | AC15↔HYB | AC15↔HSEM | AC15P↔HYB | AC15P↔HSEM | HYB↔HSEM | Mean |
|---|---|---|---|---|---|---|---|
| S1 | 0.904 | 0.799 | 0.797 | 0.759 | 0.783 | 0.794 | 0.806 |
| S2 | 0.865 | 0.698 | 0.764 | 0.678 | 0.798 | 0.585 | 0.732 |
| S3 | 0.832 | 0.814 | 0.840 | 0.933 | 0.932 | 0.923 | 0.879 |
| S4 | 0.831 | 0.885 | 0.797 | 0.741 | 0.818 | 0.806 | 0.813 |
| S5 | 0.589 | 0.805 | 0.627 | 0.614 | 0.772 | 0.676 | 0.680 |
| S6 | 0.755 | 0.787 | 0.743 | 0.811 | 0.834 | 0.831 | 0.794 |
| S7 | 0.797 | 0.831 | 0.779 | 0.639 | 0.763 | 0.631 | 0.740 |
| S8 | 0.811 | 0.793 | 0.798 | 0.887 | 0.822 | 0.881 | 0.832 |
| **Mean** | **0.798** | **0.802** | **0.768** | **0.758** | **0.815** | **0.766** | **0.784** |

### 6c. Headline numbers

| Metric | Value |
|---|---|
| Mean anchored-vs-CONTROL correlation (4 pairs × 8 scenarios = 32) | **0.326** |
| Mean anchored-vs-anchored correlation (6 pairs × 8 scenarios = 48) | **0.784** |
| Mean anchored-vs-CONTROL p2r difference (4 pairs × 8 scenarios = 32) | **+0.1367** |

## 7. Integration with today's earlier findings

Today's matched-runs test (3 AC15P + 3 CONTROL, S1, n=5 truncated; then 25-turn single runs) found:

- Matched-runs AC15P↔CTRL cross-correlation (n=5): r = 0.47
- Original 25-turn AC15P↔CTRL cross-correlation (n=25): r = 0.18
- Original 25-turn AC15P−CTRL mean difference: +0.168

Compare to this 8-scenario aggregate:

- Mean anchored-vs-CONTROL correlation across 8 scenarios: 0.326
- Mean anchored-vs-CONTROL p2r difference across 8 scenarios: +0.1367

Interpret by comparing the aggregate to the matched-runs numbers:
- If the 8-scenario AC15P↔CTRL correlation is close to 0.18, the S1 25-turn finding replicates.
- If the 8-scenario mean difference is close to +0.168, the mean-shift replicates.
- If anchored-vs-anchored correlation is high (>> anchored-vs-CONTROL), anchoring-as-architecture is shared.
