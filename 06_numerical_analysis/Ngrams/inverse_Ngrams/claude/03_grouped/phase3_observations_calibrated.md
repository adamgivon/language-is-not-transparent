# Phase 3 Observations — Lexicon-Grouped Layer (Scale-Calibrated)

## Scale context

Per-system total text tokens across 4 scenarios: CONTROL 52,190; AC15 60,788; AC15P 62,682; HYBRID_3_5 56,938; HYBRID_SEMANTIC 60,180.

The lexicon-grouped phase classifies filtered inverse n-grams (core_filtered = 7,091 rows total) into expression-type groups. Classification rates are around 25-30% per system. The counts reported are small fractions of each system's total corpus.

## What was done

Filtered inverse trigrams and quadgrams were annotated using the expression-type lexicon v3 (10 parent groups, split into 26 first-class sub-elements). Each row received group labels based on whether its vocabulary matched the lexicon terms. 74% of rows hit no group and went to the unclassified bucket (analyzed separately in the negative-space layer).

## Classification rate

| System | Classified | % of its filtered rows |
|---|---|---|
| CONTROL | 25% | (lower partly because no control-specific groups in lexicon; not validated) |
| AC15 | 27% | |
| AC15P | 27% | |
| HYBRID_3_5 | 28% | |
| HYBRID_SEMANTIC | 31% | |

Classification rate differences are small (25-31%). CONTROL's lower rate is expected in part because the lexicon is constraint-shaped.

## Group totals as % of system corpus

Rather than raw counts, here are the per-system Layer A (constraint-aligned) group hits as % of each system's total tokens:

**HYBRID_SEMANTIC (60,180 tokens):**
- practical_considerations_and_execution: 161 hits = 0.27%
- temporal_projection: 81 = 0.13%
- truth: 74 = 0.12%
- imagination_and_possibility: 55 = 0.09% ⚠ CALIBRATION ARTIFACT — excluded from system claims

**AC15P (62,682 tokens):**
- practical: 170 = 0.27%
- temporal: 102 = 0.16%
- truth: 48 = 0.08%
- imagination: 30 = 0.05%

**AC15 (60,788 tokens):**
- practical: 149 = 0.25%
- temporal: 93 = 0.15%
- truth: 50 = 0.08%
- imagination: 10 = 0.016%

**HYBRID_3_5 (56,938 tokens):**
- practical: 118 = 0.21%
- temporal: 66 = 0.12%
- truth: 65 = 0.11%
- imagination: 10 = 0.018%

**CONTROL (52,190 tokens):**
- practical: 91 = 0.17%
- temporal: 61 = 0.12%
- truth: 39 = 0.07%
- imagination: 2 = 0.004%

The largest group is practical, at 0.17-0.27% of any system's output. Every finding in the lexicon-grouped layer is under 0.3% of output. These are thin rates.

## Layer B cross-cutting groups (smaller still)

- hedging: 10-43 per system (0.017-0.069%)
- warning: 13-37 (0.022-0.065%)
- surfacing: 31-42 (0.054-0.068%)
- autonomy_sovereignty: 2-25 (0.003-0.044%)
- smoothing: 0-16 (0-0.026%)
- conditions: 7-29 (0.012-0.048%)

Smoothing at its highest (AC15 at 16 hits) is 0.026% of output. That is the highest "lead" any system has on a Layer B group.

## Calibrated reading

The lexicon-grouped layer shows mild per-system comparative tendencies visible at low absolute rates. The tendencies are:

**AC15P**: comparatively elevated on practical-action and resources vocabulary. Mild tendency.

**HYBRID_3_5**: comparatively elevated on autonomy, warning, and friction-exposure vocabulary. Mild tendency.

**HYBRID_SEMANTIC**: comparatively elevated on conditions and truth-verification vocabulary; lowest hedging. Mild tendencies. Imagination numbers excluded (artifact).

**AC15**: comparatively elevated on smoothing and temporal-decay vocabulary. Sparser tendencies — absolute counts below 30 per relevant group.

**CONTROL**: lower on constraint-aligned groups than anchored systems. Lower classification rate partly a lexicon-fit artifact. Pattern visible in different layer (see dedicated CONTROL chapter).

## What the layer supports

- CONTROL-vs-anchored gap in constraint-related vocabulary: visible but thin (each system within 0.1% of CONTROL on any specific group, which is already thin)
- Per-system directional tendencies: visible comparatively, thin absolutely, consistent across scenarios
- HYBSEM's hedging floor (10 hits, 0.017%): the lowest absolute rate of any anchored system on this group — suggestive of reduced hedging tendency

## What the layer does not support

- Strong per-system character descriptions
- Signature claims beyond "mild directional tendencies"
- Any claim that a system has a dominant voice in its constraint-related vocabulary

## Placement in the analysis chapter

The lexicon-grouped layer is one of three readings of the same filtered field (with negative space and 2-3 system sharing). It contributes mild comparative tendencies. The primary evidence for the thesis is the structural distribution finding (95-98% unique at quadgrams), not the group tendencies.

## Cross-scenario stability

The tendency directions are consistent across S1, S3, S5, S7 — which is what gives thin patterns any weight. The same systems lead the same groups in most scenarios. This is necessary evidence that the tendencies are real rather than random variation, but it does not make them strong in absolute terms.

## Methodological caveats

- CONTROL's classification rate gap is partly a lexicon-design artifact; no control-specific groups exist because control has no instruction set
- HYBSEM's imagination_and_possibility numbers reflect a known over-broad anchor calibration; excluded
- The lexicon was built from constraint definitions (the anchor codifiers and rules); there is some confirmation bias in finding constraint vocabulary in systems instructed with that vocabulary
- Single CONTROL run per scenario; within-CONTROL variance not measured
