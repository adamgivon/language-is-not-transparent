# Session Inventory (Pre-analysis)

Projects scanned: control, test_ac15, ac15-plain, hybrid_v3_5, hybrid_v3_5_semantic
Total sessions in projects: 46
Excluded (matched-runs, 2026-04-14+): 6
Remaining: 40

## Coverage matrix (5 projects × 8 scenarios)

| Scenario | CONTROL | AC15 | AC15P | HYBRID | HSEM |
|---|---|---|---|---|---|
| S1 | `scenario_v1_2` (25) | `Scenario_1_v2_lights` (25) | `scenario_1_v2` (25) | `Scenario_1_v2` (25) | `scenario_1_v2` (25) |
| S2 | `Scenario_2_v3` (25) | `Scenario_2_v3` (25) | `Scenario_2_v3` (26) | `Scenario_2_v3` (25) | `Scenario_2_v3` (26) |
| S3 | **MISSING** | `scenario_3` (25) | `scenario_3_drone` (25) | `Scenario_3_drone` (24) | `Scenario_3` (25) |
| S4 | `scenario_4` (27) | `scenario_4` (25) | `Scenario_4` (25) | `Scenario_4` (25) | `Scenario_4` (25) |
| S5 | `Scenario_5` (25) | `scenario_5` (25) | `scenario_5` (25) | `Scenario_5` (25) | `Scenario_5` (25) |
| S6 | `Scenario_6` (25) | `Scenario_6` (27) | `Scenario_6` (25) | `Scenario_6` (25) | `Scenario_6` (28) |
| S7 | `Scenario_7` (25) | `Scenario_7` (25) | `Scenario_7` (25) | `Scenario_7` (25) | `Scenario_7` (25) |
| S8 | `Scenario_8` (25) | `Scenario_8` (25) | `Scenario_8` (25) | `Scenario_8` (25) | `Scenario_8` (25) |

## Excluded (matched-runs)

- `ac15-plain / scen1_newtest_1` (7 items)
- `ac15-plain / scen1_newtest_run2` (7 items)
- `ac15-plain / scen1_newtest_run3` (7 items)
- `control / scen_1_2nd_test` (5 items)
- `control / scen_1_3rd_test` (5 items)
- `control / scen1_4th_test` (5 items)

## Unclassified (couldn't assign scenario)

- `control / test_3_chimera` (25 items)

## Seq-pattern anomalies

| Project | Scenario | Session | N assistants | Issues |
|---|---|---|---|---|
| control | S4 | `scenario_4` | 27 | seq gaps: [3] (expected all 2s) |
| ac15-plain | S2 | `Scenario_2_v3` | 26 | first seq = 3 (unusual) |
| hybrid_v3_5 | S2 | `Scenario_2_v3` | 25 | seq gaps: [3] (expected all 2s) |
| hybrid_v3_5_semantic | S2 | `Scenario_2_v3` | 26 | seq gaps: [6] (expected all 2s) |

## Turn-count consistency per scenario

| Scenario | CONTROL | AC15 | AC15P | HYBRID | HSEM | Min | Max | Range |
|---|---|---|---|---|---|---|---|---|
| S1 | 25 | 25 | 25 | 25 | 25 | 25 | 25 | 0 |
| S2 | 25 | 25 | 26 | 25 | 26 | 25 | 26 | 1 |
| S3 | — | 25 | 25 | 24 | 25 | 24 | 25 | 1 |
| S4 | 27 | 25 | 25 | 25 | 25 | 25 | 27 | 2 |
| S5 | 25 | 25 | 25 | 25 | 25 | 25 | 25 | 0 |
| S6 | 25 | 27 | 25 | 25 | 28 | 25 | 28 | 3 |
| S7 | 25 | 25 | 25 | 25 | 25 | 25 | 25 | 0 |
| S8 | 25 | 25 | 25 | 25 | 25 | 25 | 25 | 0 |
