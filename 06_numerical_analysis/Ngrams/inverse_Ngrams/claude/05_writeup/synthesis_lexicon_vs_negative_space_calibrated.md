# Synthesis: Lexicon-Grouped vs Negative Space (Scale-Calibrated)

## Scale context

Per-system total text tokens: CONTROL 52,190; AC15 60,788; AC15P 62,682; HYBRID_3_5 56,938; HYBRID_SEMANTIC 60,180.

All findings below are thin in absolute terms (single-digit to low-two-digit percentages at most, usually under 1%). They are presented as mild comparative tendencies, not defining signatures.

## What this document does

Reads the two readings of the filtered inverse field — the lexicon-grouped phase and the negative space layer — side by side. Checks whether they agree on per-system tendencies.

The two readings are not statistically independent. Both run on the same `core_filtered/` set. They share the structural filter, stopword list, and count thresholds. When they converge on a system's tendencies, that is complementary convergence, not independent confirmation.

## What the structural evidence actually is

Before per-system tendency descriptions, the main finding:

**95-98% of each system's quadgrams are unique to that system.** Shared by all 5: 0.04-0.14%. Shared by 4 anchored only: 0.02-0.32%.

This is the robust, scale-independent evidence for the thesis. The per-system tendency descriptions below are supporting detail at much thinner rates.

## Per-system reading (both layers, calibrated)

### CONTROL

Lexicon-grouped: lower scores on constraint-aligned groups than anchored systems. Lower classification rate (25% vs 27-31%), partly expected because the lexicon has no control-specific groups.

Negative space: zero words survived hygiene. The constraint-shaped hygiene was not designed to detect CONTROL's style. See the dedicated CONTROL chapter for what CONTROL actually produces (recurring conversational scaffolds).

**Calibrated read:** both layers using a constraint-shaped frame find CONTROL "absent" in that frame. That absence is real at the level of constraint vocabulary, but it is not CONTROL having no pattern — CONTROL's pattern requires a different lens.

### AC15P

Lexicon-grouped: above the other systems on practical.action_execution, resources_timing_conditions, constraints_tradeoffs, hedging, hard_limit_refusal. Still tens of hits per group (not hundreds), but higher comparatively.

Negative space: vs (26, 0.041%), after (20, 0.032%), within (19, 0.030%), because (9, 0.014%). Total cluster: 0.117% of its tokens.

**Calibrated read:** AC15P shows a mild but cross-scenario-stable tendency toward operational/sequential/causal framing vocabulary, visible in both readings at thin absolute rates (well under 1% of output).

### HYBRID_3_5

Lexicon-grouped: above others on autonomy_sovereignty, warning, surfacing.friction_exposed; tied on truth.verification; lowest smoothing (0 hits).

Negative space: without (22, 0.039%), scope (11, 0.019%), explicit (8, 0.014%). Total cluster: 0.072% of its tokens.

**Calibrated read:** HYBRID_3_5 shows a mild tendency toward exclusion-marking and scope-marking vocabulary, consistent across scenarios but at very low absolute rates.

### HYBRID_SEMANTIC

Lexicon-grouped: lowest hedging (10 hits, 0.017%), higher on conditions, truth.verification tied-highest. Imagination numbers excluded as anchor calibration artifact.

Negative space: now (20, 0.033%), default (17, 0.028%), under (15, 0.025%), without (12, 0.020%), must (12, 0.020%). Total cluster: 0.126% of its tokens — the largest negative-space cluster by percentage, but still under 0.15%.

**Calibrated read:** HYBRID_SEMANTIC shows a mild tendency toward present-state, conditional, and normative markers, visible in both readings. The tendencies are thin but consistent.

### AC15

Lexicon-grouped: highest on smoothing (16 hits, 0.026%) — still tiny. Tied on confrontation. Mid-pack on most groups.

Negative space: vs (11, 0.018%), must (11, 0.018%), default (8, 0.013%). Total cluster: 0.049% of its tokens. Sparse.

**Calibrated read:** AC15's tendencies are the thinnest in the analysis. Its pattern may be distributed across many low-count words rather than concentrated in a detectable cluster. The evidence for AC15's character is the weakest of the five systems.

## What the convergence means (at the right strength)

The two readings agree on the direction of each anchored system's tendencies. This is some evidence that the tendencies are real rather than artifacts of one procedure. But:

- Both readings use the same underlying data
- The tendencies are thin (all under 0.15% of output)
- The agreement is qualitative (same direction), not quantitative (different metrics in each layer)

What this supports: each anchored system produces slightly more of certain vocabulary types than the other systems, at low absolute rates but consistently across 4 scenarios and visible in two different analytical procedures.

What this does not support: strong per-system identity claims, robust signatures, or any "character" description that implies the tendency is dominant in the output.

## The finding in perspective

The inverse n-gram work shows:

1. **Structural separation (robust):** 95-98% of each system's vocabulary is unique. This is the main evidence.
2. **Thin comparative tendencies (supporting):** each anchored system has a small directional bias in its vocabulary, consistent across scenarios. These tendencies are detectable but do not dominate any system's output.
3. **Qualitative convergence across two readings (weak independent support):** both procedures point in the same direction for each system, which is better than one reading alone but is not statistical independence.

The paper should lead with (1). The tendencies from (2) and (3) add color but do not carry the argument.
