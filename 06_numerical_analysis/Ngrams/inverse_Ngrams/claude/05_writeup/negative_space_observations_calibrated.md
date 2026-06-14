# Negative Space Layer — Observations (Scale-Calibrated)

## Scale context

Per-system total text tokens across all 4 scenarios: CONTROL 52,190; AC15 60,788; AC15P 62,682; HYBRID_3_5 56,938; HYBRID_SEMANTIC 60,180.

All word counts below are expressed as percentage of that system's total corpus. The absolute numbers are small. The findings are tendencies, not defining signatures.

## What the negative space layer does

The lexicon-grouped phase classified ~26% of the filtered inverse n-grams into expression-type groups. The remaining ~74% (5,214 phrases) sat unclassified. This layer reads the unclassified bucket without a constraint-based categorization — pure word frequency on content that the lexicon doesn't recognize — to see whether per-system vocabulary tendencies are visible outside the lexicon.

## The content_signature table (after hygiene cleanup)

15 words survived the hygiene pass as content_signature (appearing in 3+ scenarios, count ≥ 8, not flagged as function residue or scenario-bound). Shown with their percentage of each system's total corpus:

| System | Word | Count | % of system's tokens |
|---|---|---|---|
| AC15 | vs | 11 | 0.018% |
| AC15 | must | 11 | 0.018% |
| AC15 | default | 8 | 0.013% |
| AC15P | vs | 26 | 0.041% |
| AC15P | after | 20 | 0.032% |
| AC15P | within | 19 | 0.030% |
| AC15P | because | 9 | 0.014% |
| HYBRID_3_5 | without | 22 | 0.039% |
| HYBRID_3_5 | scope | 11 | 0.019% |
| HYBRID_3_5 | explicit | 8 | 0.014% |
| HYBRID_SEMANTIC | now | 20 | 0.033% |
| HYBRID_SEMANTIC | default | 17 | 0.028% |
| HYBRID_SEMANTIC | under | 15 | 0.025% |
| HYBRID_SEMANTIC | without | 12 | 0.020% |
| HYBRID_SEMANTIC | must | 12 | 0.020% |

Every finding is under 0.05% of the system's total output. These are thin tendencies that are detectable only because they cluster comparatively (each system uses certain words at higher rates than the others) and because the same words recur across all 4 scenarios.

CONTROL had zero words survive the hygiene filter. The constraint-shaped hygiene was designed to find constraint-related vocabulary; CONTROL's style lives in generic conversational scaffolds that the hygiene classifies as function residue. This does not mean CONTROL has no pattern — see the dedicated CONTROL chapter.

## What these tendencies suggest (calibrated claims)

**AC15P** (total 0.117% of tokens in its cluster): mild tendency toward oppositional, sequential, bounded, and causal framing markers.

**HYBRID_3_5** (total 0.072% of tokens in its cluster): mild tendency toward exclusion and scope vocabulary.

**HYBRID_SEMANTIC** (total 0.126% of tokens in its cluster): mild tendency toward present-state, conditional, and normative markers. This is the largest negative-space cluster by percentage but still under 0.15% of output.

**AC15** (total 0.049% of tokens in its cluster): sparse — its negative-space pattern is too thin to support a robust description.

## What the finding is

Each anchored system shows a small, cross-scenario-stable vocabulary tendency that the lexicon doesn't catch. These tendencies point in different directions for different systems, consistent with the instruction style each system received. The tendencies are thin (all under 0.15% of total output) but consistent across the 4 scenarios — which is what gives them any weight beyond noise.

## What the finding is not

- Not a definitive system signature. The absolute rates are too low to support identity claims.
- Not independent confirmation of the lexicon-grouped findings. Both layers run on the same filtered field.
- Not evidence of language acts. It is vocabulary frequency at the n-gram level.

## What this layer adds

A second reading of the same filtered material, using no pre-built categorization, produces mild per-system vocabulary tendencies that point in the same direction as the lexicon-grouped layer. The two layers agreeing is complementary, not statistically independent. The agreement at this thin level is better evidence than either reading alone, but the strength of the evidence is still modest.

## The finding placed correctly

The negative space layer adds supporting detail to the robust structural finding: 95-98% of each system's quadgrams are unique. The tendencies show, at very thin rates, that the unique vocabulary has small recurring directional biases — not that each system has a strong fingerprint. The structural separation is the primary evidence; the tendency directions are a small additional layer.
