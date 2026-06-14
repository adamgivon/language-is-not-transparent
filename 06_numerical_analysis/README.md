# Numerical Analysis

This folder contains the numerical and text-statistical materials used to support the experiment. The materials cover eight scenarios, five systems, and several analysis layers: prompt-response similarity, anchor-selection behavior, inter-system calculations, correlation checks, and inverse n-gram analysis.

The folder is supporting evidence for the paper, not a polished standalone statistical package. Some filenames preserve working names from the experiment.

## Relationship To The Paper

These files support the paper's numerical claims. The main paper uses the numerical results to show that applying the constraint systems methodically changes response behavior. The close-reading materials and architecture analysis, stored elsewhere, explain how the systems differ in quality, governance, expression, and user-facing behavior.

Not every file here is used directly in the paper. The core numerical evidence is in `embedding_sims/`. The n-gram and correlation materials in `Ngrams/` are included for transparency and support, but the inverse n-gram findings were not used as main paper evidence because their relevance and usability were limited.

## Quick Reading Order

For a quick review, start with:

1. `embedding_sims/Results_together.xlsx`
2. `embedding_sims/item_sims_no_separation/`
3. `embedding_sims/inter_system_calc/conclusions_8_scenarios.md`
4. `Ngrams/latest_matched_and_overall_correlations_18_4_2026/conclusions.md`
5. `Ngrams/inverse_Ngrams/newdirection_ngrams.md`

## Systems And Scenarios

The experiment compares four constraint systems against an unconstrained control:

- AC15
- AC15P
- Hybrid
- Hybsem / Hybrid Semantic
- Control: default model behavior without the added constraint system

The eight scenarios are:

1. Smart Traffic
2. Hospital Capacity
3. Autonomous Drones
4. Bootstrapped Entrepreneur
5. AI Context Continuity
6. Village Accident
7. Late Love
8. Bondi Beach

Most scenario runs contain 25 turns. Some source sessions contain extra or missing turns; the relevant notes and calculations document those cases.

## Folder Structure

The current folder is organized into two main parts:

```text
06_numerical_analysis/
├── embedding_sims/
│   ├── Results_together.xlsx
│   ├── item_sims_no_separation/
│   ├── itemAnchor_sims/
│   └── inter_system_calc/
└── Ngrams/
    ├── latest_matched_and_overall_correlations_18_4_2026/
    └── inverse_Ngrams/
```

## 1. `embedding_sims/`

This is the main numerical-analysis folder.

### `embedding_sims/Results_together.xlsx`

The main combined results workbook. It is the most useful single workbook for reviewing the numerical results in aggregate.

It includes summary sheets for:

- initial summary results, with averages calculated from item-level similarity files
- Control vs. scenario prompt-response results
- prompt-response ANOVA
- critical-turn comparisons
- raw anchor information
- turn-to-turn similarity deltas

Use this file first when checking the high-level numerical claims.

### `embedding_sims/item_sims_no_separation/`

Per-system, per-scenario workbooks for item-level similarity outputs without anchor separation. These files preserve prompt-response and related distance/similarity calculations at the scenario/session level.

Subfolders are organized by system:

- `AC15/`
- `AC15P/`
- `Hybrid/`
- `Hybsem/`
- `Control/`

The files in `embedding_sims/item_sims_no_separation/AC15/` were used as cross-system summary workbooks per scenario, not only as AC15-only files. For raw per-system similarity and per-system scenario results, use the system subfolders.

### `embedding_sims/itemAnchor_sims/`

Per-system, per-scenario workbooks for item-to-anchor similarity outputs. These files preserve the anchor-selection and anchor-similarity layer used in the analysis, as well as basic turn details including the prompt itself.

Subfolders are organized by system:

- `AC15/`
- `AC15P/`
- `Hybrid/`
- `Hybsem/`
- `Control/`

### `embedding_sims/inter_system_calc/`

Per-scenario inter-system calculation workbooks:

- `scen1_analaysis.xlsx`
- `scen2_analysis.xlsx`
- `scen3_analysis.xlsx`
- `scen4_analysis.xlsx`
- `scen5_analysis.xlsx`
- `scen6_analysis.xlsx`
- `scen7_analysis.xlsx`
- `scen8_analysis.xlsx`

These Excel files hold constraint-system details, including per-turn similarity data, pivot tables, and raw anchor-selection information for each scenario: turn number, anchor name, weight, and system.

The summary file:

- `embedding_sims/inter_system_calc/conclusions_8_scenarios.md`

also discusses the relationship to Control and states the main numerical conclusions across all eight scenarios:

- constrained systems differ strongly and consistently from Control
- constrained systems are not significantly different from one another on prompt-response similarity
- anchor-selection fingerprints appear in some scenarios
- divergence concentrates on pressure or commitment turns
- language and architecture shape the epistemic path even when final similarity scores converge

## 2. `Ngrams/`

This folder contains correlation support materials and exploratory inverse n-gram analysis.

### `Ngrams/latest_matched_and_overall_correlations_18_4_2026/`

Cross-system correlation and matched-run support materials. These were created during the inverse n-gram work and were also used to check response-shape correlation and inherent variability between responses to the same prompt.

Important files:

- `session_inventory.md`: maps sessions to scenarios and records excluded matched-runs and turn-count anomalies
- `overall_correlations_results.md`: full cross-system correlation and mean-difference results across eight scenarios
- `conclusions.md`: concise interpretation of the correlation analysis
- `results/`: detailed output files from the correlation and similarity checks

The main correlation conclusion is that anchored systems correlate with each other much more strongly than they correlate with Control. This supports the claim that the constraint systems create a shared architecture-level response shape while still differing in expression and local behavior.

These results are useful support material, but they are not used directly in the paper.

### `Ngrams/inverse_Ngrams/`

Exploratory text-statistical analysis of system-specific language patterns. The findings were eventually rejected as paper evidence due to limited relevance and usability in this experiment.

This folder contains raw n-gram materials, filtering rules, lexicons, grouped outputs, writeups, and model-assisted review phases. It investigates the language residue left by the systems: which expressions are shared, which are system-specific, and how inverse trigrams/quadgrams reveal different system signatures.

Important root files include:

- `newdirection_ngrams.md`: explains why the analysis moved from shared n-gram overlap toward system-specific inverse n-grams
- `inverse_filtering_rules.md`: defines the filtering workflow for inverse trigrams and quadgrams
- `constraints_tested.md`: lists the constraint categories used in the inverse n-gram analysis
- `inverse_filtering_constraint_lexicon.md`: lexicon used for constraint-relevance filtering
- `expression_type_lexicon_v3.md`: expression-type lexicon used in grouping and interpretation
- `agreed_filtering_lists.md`: filtering lists used to reduce scaffolding and noise
- `negative_space_word_bands.md`: support material for the negative-space vocabulary layer

Important subfolders:

- `raw_materials/`: raw bigram, trigram, and quadgram CSV files
- `codex/`: Codex-assisted filtering, grouping, review, scripts, summaries, and writeups
- `claude/`: Claude-assisted filtering, grouping, review, summaries, and writeups

## Method Caveats

- The experiment is exploratory.
- The main eight-scenario data uses one realized run per system/scenario.
- Matched-run checks are available only for a narrower subset and are stored separately.
- Prompt-response similarity can separate constrained systems from Control, but does not fully separate the constrained systems from each other.
- Close reading is required to evaluate governance quality, interpretation, structure, affective speech, and user-facing usefulness.
- The inverse n-gram analysis is exploratory and was not used as paper evidence.
