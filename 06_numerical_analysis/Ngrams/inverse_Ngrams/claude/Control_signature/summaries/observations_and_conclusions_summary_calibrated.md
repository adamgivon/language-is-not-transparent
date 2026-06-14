# CONTROL Signature — Observations and Conclusions (Scale-Calibrated)

## Scale context

CONTROL produced 52,190 text tokens across the 4 scenarios (S1 ~14,900; S3 ~10,300; S5 ~11,900; S7 ~15,200). All findings below are expressed as percentage of CONTROL's total corpus. Even the highest-count patterns are small fractions of output.

## What the analysis found

CONTROL does have a recognizable vocabulary tendency, detectable through total phrase frequency rather than through constraint-categorized hygiene. The earlier "zero content_signature" reading reflected the lens — the word-hygiene bands were designed for finding constraint-related vocabulary, which CONTROL does not have. Under a different lens (what scaffolds CONTROL reaches for most), a pattern appears — at thin absolute rates.

## Primary evidence: phrase scaffolds

Top phrase starters by count across all 4 scenarios:

| Starter | Count | % of CONTROL's tokens |
|---|---|---|
| if you | 220 | 0.42% |
| it s | 164 | 0.31% |
| you can | 156 | 0.30% |
| you re | 111 | 0.21% |
| don t | 107 | 0.20% |
| what you | 58 | 0.11% |
| you want | 57 | 0.11% |
| i can | 57 | 0.11% |
| that s | 50 | 0.10% |
| this is | 48 | 0.09% |

Top trigrams:

| Trigram | Count | % |
|---|---|---|
| if you want | 34 | 0.065% |
| if you can | 34 | 0.065% |
| you can t | 31 | 0.059% |
| you don t | 29 | 0.056% |
| you tell me | 24 | 0.046% |
| i can help | 19 | 0.036% |
| can help you | 19 | 0.036% |

Top quadgrams:

| Quadgram | Count | % |
|---|---|---|
| if you tell me | 23 | 0.044% |
| i can help you | 19 | 0.036% |
| if you can t | 17 | 0.033% |
| if you want i | 14 | 0.027% |
| you want i can | 14 | 0.027% |

The highest pattern in the analysis is "if you" at 0.42% of CONTROL's tokens. The four-word templates ("i can help you", "if you tell me") are at 0.03-0.04%. These are the strongest patterns in the entire CONTROL analysis, and they are small in absolute terms.

## What the pattern is

CONTROL shows a mild but cross-scenario-stable tendency toward:
- Second-person guidance ("if you", "you can", "you re")
- Conditional framing ("if you can", "if you want")
- Negation scaffolds ("don t", "you don t", "you can t")
- Offer-of-help templates ("i can help", "can help you", "i can help you")
- Direct-address invitations ("you tell me", "if you tell me")

These recur across all 4 scenarios, which is what gives them weight beyond random noise. But the absolute rates are low — the pattern is a tendency, not a dominant voice.

## Calibrated claim

CONTROL produces certain conversational scaffolds at higher rates than the anchored systems, consistently across scenarios, at low absolute rates (the highest scaffold is 0.42% of output; most are under 0.1%). These scaffolds fit a generic advisory register — second-person guidance, conditional templates, offers of help. Whether to call this "the default AI consultant voice" is interpretive.

What the data shows: CONTROL has a mild recurring advisory scaffold pattern. The scaffolds would not, in isolation, support a strong identity claim. They are suggestive of an advisory tendency.

## Supporting evidence (word-level, with caveats)

CONTROL uses certain words at comparatively higher rates than the anchored systems — after excluding scenario-bound terms that are colored by a single scenario. Remaining cross-scenario genuine tendencies include `prioritize`, `consequence`, `realistically`, `prudent`, and some analytical vocabulary like `forensics`, `citations`, `verbatim`, `restate`, `procure`. These appear at very low rates (typically 0.02-0.2% of output).

These are secondary evidence. The phrase-shape layer is more direct.

Scenario-bound words (memory, repo, home, health, commercial) were flagged as CONTROL-elevated in an earlier pass but are not cross-scenario stable — they are concentrated in individual scenarios and do not count as style markers.

## Placing the finding correctly

The CONTROL analysis adds to the textual analysis chapter:

- **Structural context:** CONTROL produces 52K tokens of largely unique vocabulary (same 95-98% unique pattern as the anchored systems). The system-specific quadgram field is overwhelming.
- **Thin tendency (comparative):** CONTROL's style, where it can be found at all, lives in conversational scaffolds at 0.1-0.4% of output. The anchored systems produce these scaffolds less frequently while producing more constraint-vocabulary.
- **The "substitution" observation:** calibrated version — the anchored systems appear to reach for generic advisory scaffolds at lower rates than CONTROL while reaching for constraint-related vocabulary at slightly higher rates. The effect is small but consistent.

## What this analysis supports (calibrated)

- CONTROL has a detectable vocabulary tendency visible through cross-scenario-stable phrase recurrence at low absolute rates
- The strongest CONTROL pattern (0.42% for "if you") is the largest pattern in the entire inverse analysis, yet it is still small
- The anchored systems differ from CONTROL both in producing less of these scaffolds and in producing more constraint-related words, at consistent but thin absolute rates

## What this analysis does not support (honest)

- No "default AI consultant voice" as a defining identity — that phrase is interpretive and implies more weight than 0.42% can carry
- No strong claim about what governance "does" based on these numbers alone
- Not statistically independent from the other analyses (same raw data, different cut)
- Not validated against within-CONTROL variance (single run per scenario)

## Honest bottom line for the paper

CONTROL shows a mild, cross-scenario-stable tendency toward second-person scaffolds, conditional templates, and offer-of-help phrases at low absolute rates (each 0.03-0.4% of output). The anchored systems produce these scaffolds at lower rates and produce more constraint-related vocabulary at slightly higher rates — each difference small, but consistent across scenarios. The pattern is suggestive of a comparative shift in vocabulary tendencies; it is not strong enough to claim a defining "style" for any system. The main evidence for the thesis remains the structural finding (95-98% of each system's vocabulary is unique). The per-system tendencies add color at thin absolute rates.
