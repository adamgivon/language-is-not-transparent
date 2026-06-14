# System Signatures Summary — Scale-Calibrated

> ## ⚠ CORRECTION (2026-04-15)
>
> **The "CTRL + AC15 = 0. CTRL + AC15P = 0" claim referenced in this document (around line 82) is WRONG.** Bug in source CSV `shared_space_2_3_systems/pairwise_sharing_by_scenario.csv` (pair-label-ordering mismatch).
>
> **Correct totals:** CONTROL+AC15 = 1,668 bi / 1,248 tri / 644 quad. CONTROL+AC15P = 1,689 / 1,243 / 636. Within-range with all other pairs — no structural zero exists.

## Scale context (essential reading)

Per-system text token totals across all 4 scenarios (S1, S3, S5, S7):

| System | Total tokens | Per scenario average |
|---|---|---|
| CONTROL | 52,190 | ~13,000 |
| AC15 | 60,788 | ~15,000 |
| AC15P | 62,682 | ~16,000 |
| HYBRID_3_5 | 56,938 | ~14,000 |
| HYBRID_SEMANTIC | 60,180 | ~15,000 |

All findings below are expressed relative to these volumes. A word appearing 20 times in 60,000 tokens is 0.033% of the system's output. Single-digit and low-two-digit occurrences are thin in absolute terms, visible only through comparative ratios and cross-scenario consistency.

## What the analysis shows at its actual scale

The thesis claim — same logic, different instructions, different outputs — is supported primarily by a **structural finding**, not by strong per-system vocabulary signatures:

**Structural finding (robust, scale-independent):**
At quadgrams, 95-98% of each system's unique phrases belong to that system only. Shared by all 5 systems: 0.04-0.14%. Shared by 4 anchored only: 0.02-0.32%. Even among the constrained systems alone, exclusive sharing is 4-41 phrases out of tens of thousands.

This structural separation is the main evidence for the thesis. It shows that four systems with the same logic but different instruction languages produce overwhelmingly different vocabularies.

**System-specific tendencies (thin, comparative, cross-scenario stable):**
The per-system vocabulary tendencies are visible but small. They are better described as *mild comparative patterns above a baseline* than as *defining characteristics*.

## Per-system calibrated descriptions

### CONTROL (52,190 total tokens)

The earlier "zero content_signature" reading reflected the constraint-shaped lens, not absence. Under a different lens — total phrase frequency — CONTROL produces recurring conversational scaffolds:

| Scaffold | Count | % of total tokens |
|---|---|---|
| if you | 220 | 0.42% |
| it s | 164 | 0.31% |
| you can | 156 | 0.30% |
| you re | 111 | 0.21% |
| don t | 107 | 0.20% |

These are small percentages in absolute terms. They are still the largest pattern counts in the analysis because they are 2-word scaffolds in frequent positions. Four-word templates like "i can help you" (19 occurrences, 0.036%) are much thinner.

**Calibrated claim:** CONTROL shows a mild but cross-scenario-stable tendency toward second-person scaffolds, conditional framing, negation templates, and offer-of-help phrases. These are consistent with an advisory register, but the absolute rate is low. This is a tendency, not a defining identity.

### AC15P (62,682 total tokens)

Negative space tendencies:
- vs (26, 0.041%), after (20, 0.032%), within (19, 0.030%), because (9, 0.014%)

**Calibrated claim:** AC15P shows mild comparative tendencies toward oppositional framing ("vs"), sequential markers ("after"), bounded scope ("within"), and causal reasoning ("because"), at low absolute rates (each < 0.05% of output) but consistent across all 4 scenarios.

### HYBRID_3_5 (56,938 total tokens)

Negative space tendencies:
- without (22, 0.039%), scope (11, 0.019%), explicit (8, 0.014%)

**Calibrated claim:** HYBRID_3_5 shows mild comparative tendencies toward exclusion-marking ("without"), scope-marking ("scope"), and directness-requirements ("explicit"), at very low absolute rates (0.01-0.04%) that are detectable comparatively and across scenarios.

### HYBRID_SEMANTIC (60,180 total tokens)

Negative space tendencies:
- now (20, 0.033%), default (17, 0.028%), under (15, 0.025%), without (12, 0.020%), must (12, 0.020%)

**Calibrated claim:** HYBRID_SEMANTIC shows mild comparative tendencies toward present-state markers ("now"), default-reasoning vocabulary ("default"), and conditional framing ("under", "must"), at low absolute rates (0.02-0.03%) that are detectable comparatively and consistent across all 4 scenarios.

The "default" cluster (17 + 15 + 12 + 12 = 56 occurrences of state/condition markers in 60K tokens = 0.09%) is the largest anchored-system cluster, but still under 0.1% of output.

### AC15 (60,788 total tokens)

Negative space tendencies (sparse):
- vs (11, 0.018%), must (11, 0.018%), default (8, 0.013%)

**Calibrated claim:** AC15's negative-space tendencies are too thin to support a robust character description. Its more identifiable tendency is in the grouped phase — leading the (also small) smoothing category (16 hits) and tying for surfacing confrontation. Even these are thin. AC15's style may be distributed across many low-frequency words rather than concentrating in a detectable cluster.

## Architecture-pair qualitative finding (supporting, lower evidence weight than the structural finding)

The 2-3 system shared-space analysis shows qualitative differences in what pairs share:
- **Codified pair (AC15 + AC15P)** shares in procedural sequences
- **Hybrid pair (H35 + HSEM)** shares in evaluative/conditional assessment
- **CTRL + AC15 = 0. CTRL + AC15P = 0** (across all scenarios, all levels)

The absolute counts here are also modest (pair-exclusive trigrams: 1,400-2,100 total per pair across 4 scenarios, which is 2-4% of total trigrams). But the **kind** of vocabulary shared differs by architecture, and the zero-sharing for codified-with-control is absolute.

## The stronger vs softer claims

**What the data supports strongly:**
- 95-98% of each system's quadgrams are unique to that system (structural, scale-independent)
- Control does not share exclusive vocabulary with the codified systems at any level (presence/absence, scale-independent)
- Each anchored system's tendency-words recur stably across 4 different scenarios (cross-scenario stability, the main evidence for thin patterns)

**What the data supports weakly (and should be framed as such):**
- Per-system character descriptions — these are tendencies at 0.01-0.5% of output, not identity-defining features
- The "substitution" claim — governance appears to shift vocabulary tendencies, but the shift is detectable in low-frequency markers
- Any claim that each system has a "sharp signature" — the signatures are thin

## The thesis at the right strength

The trifecta thesis (logic + semantic density + language architecture) remains supported by the analysis. The primary support is:

1. **The structural separation** — four systems with the same logic produce overwhelmingly different vocabularies (0.04-0.14% exclusive sharing at quadgrams is as close to zero as cross-system sharing gets)
2. **Cross-scenario stability of thin tendencies** — the same tendency-words appear in all 4 scenarios for each system, which is evidence of real pattern rather than random noise, even at thin absolute rates
3. **Architecture-based pair sharing** — the kind of vocabulary two systems share is shaped by whether they share instruction architecture

What the analysis does NOT support:
- "Each system has a strong, defining signature" — the tendencies are thin
- "Governance creates distinctive system identity" — it creates mild detectable tendencies
- "The signatures are robust" — they are visible comparatively but small in absolute terms

## Honest paper-ready claim

The n-gram analysis shows that the four anchored systems, despite sharing the same logical constraints, produce overwhelmingly different vocabularies (95-98% unique at quadgrams). Within the thin shared space, comparative tendencies are visible at low absolute rates — each system reaches for a small cluster of distinctive words more than the other systems do, consistently across scenarios. These tendencies are suggestive of language-architecture effects but are thin in absolute terms. The strongest evidence for the thesis is the structural finding, not the specific word signatures. Close reading is needed to assess whether these vocabulary tendencies carry governance-relevant meaning at sentence level.
