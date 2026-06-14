# Cross-system Correlation: AC15P vs CONTROL on Original 25-turn Runs

Scenario 1, single run per system (original experiment design).

- CONTROL: project `control`, session `scenario_v1_2`, 25 ASSISTANT items
- AC15P: project `ac15-plain`, session `scenario_1_v2`, 25 ASSISTANT items

## Per-turn vectors

| Turn | AC15P | CONTROL | Diff (AC15P − CTRL) |
|---|---|---|---|
| 1 | 0.8203 | 0.8432 | -0.0228 |
| 2 | 0.7602 | 0.4105 | +0.3497 |
| 3 | 0.7794 | 0.5580 | +0.2214 |
| 4 | 0.6555 | 0.6192 | +0.0363 |
| 5 | 0.6015 | 0.4040 | +0.1975 |
| 6 | 0.8026 | 0.5707 | +0.2319 |
| 7 | 0.6489 | 0.6116 | +0.0373 |
| 8 | 0.7526 | 0.5167 | +0.2359 |
| 9 | 0.7260 | 0.5191 | +0.2069 |
| 10 | 0.7068 | 0.6812 | +0.0256 |
| 11 | 0.6639 | 0.6651 | -0.0012 |
| 12 | 0.8087 | 0.6856 | +0.1231 |
| 13 | 0.6978 | 0.6511 | +0.0466 |
| 14 | 0.7496 | 0.6035 | +0.1462 |
| 15 | 0.7370 | 0.4981 | +0.2389 |
| 16 | 0.7641 | 0.6304 | +0.1337 |
| 17 | 0.7225 | 0.6579 | +0.0646 |
| 18 | 0.6852 | 0.5609 | +0.1243 |
| 19 | 0.5742 | 0.5021 | +0.0722 |
| 20 | 0.8628 | 0.4772 | +0.3856 |
| 21 | 0.7664 | 0.4907 | +0.2757 |
| 22 | 0.7572 | 0.3736 | +0.3836 |
| 23 | 0.7514 | 0.6564 | +0.0950 |
| 24 | 0.7836 | 0.5797 | +0.2038 |
| 25 | 0.6900 | 0.3003 | +0.3897 |

## Summary statistics

| Metric | AC15P | CONTROL |
|---|---|---|
| Mean p2r | 0.7307 | 0.5627 |
| Stdev across turns | 0.0679 | 0.1179 |

## Cross-system correlation

**Pearson r (n=25) = 0.1848**

Mean difference AC15P − CONTROL: **+0.1681**

## Comparison with prior measurements

| Measurement | Pearson r | Mean diff | n |
|---|---|---|---|
| Matched-runs 5-turn cross-system (9 pairs) | 0.4676 | +0.1662 | 5 |
| Matched-runs 5-turn mean-vector cross | 0.4801 | +0.1662 | 5 |
| **Original 25-turn single-run cross** | **0.1848** | **+0.1681** | **25** |

## Interpretation

If r on the 25-turn single runs is close to ~0.47 (the matched-runs result),
the finding — that AC15P and CONTROL follow different per-turn shapes — holds
up at a sample size (n=25) where Pearson r is much more reliable. With n=25,
an observed r of 0.185 has a meaningfully narrow confidence interval.

If r is notably higher than 0.47, the short-sample matched-runs result may have
overstated the architectural shape difference.

If r is lower than 0.47, the shape difference is even starker at scale.