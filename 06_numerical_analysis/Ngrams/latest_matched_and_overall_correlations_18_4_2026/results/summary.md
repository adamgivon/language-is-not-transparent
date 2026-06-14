# Combined Summary: 3 Matched AC15P Runs vs 3 Matched CONTROL Runs

Scenario 1, matched configuration. AC15P = 7 turns, CONTROL = 5 turns. Cross-architecture comparisons use AC15P truncated to 5 turns.

## The two questions

1. **Does architecture reduce within-system stochastic variance?**
2. **Does architecture produce a measurable between-system effect that exceeds the within-system noise floor?**

## Headline finding: prompt-response similarity is unambiguous architectural evidence

| | AC15P | CONTROL |
|---|---|---|
| Overall mean prompt-response similarity (per-turn average) | **0.7212** | **0.5557** |
| Mean within-turn stdev (across 3 matched runs) | 0.0258 | 0.0237 |
| Mean within-turn range (max − min across 3 runs) | 0.0497 | 0.0470 |
| Between-turn stdev (run-mean fluctuation across turns) | 0.0735 | **0.1838** |

**Mean AC15P − CONTROL difference at matched turns 1–5: +0.1662**
**Mean within-system stdev (avg of AC15P and CONTROL): 0.0247**
**Ratio: 6.7** — the architectural effect is ~7× larger than the within-system noise floor.

### Per-turn breakdown

| Turn | AC15P mean (3 runs) | CONTROL mean (3 runs) | Difference |
|---|---|---|---|
| 1 | 0.7960 | 0.8214 | -0.0254 |
| 2 | 0.7799 | 0.4193 | **+0.3606** |
| 3 | 0.7772 | 0.5501 | **+0.2271** |
| 4 | 0.6577 | 0.6323 | +0.0254 |
| 5 | 0.5989 | 0.3556 | **+0.2433** |

CONTROL collapses at turns 2, 3, and 5 — its responses drift far from the prompts. AC15P stays close to its prompts at all 5 turns. The architecture is doing its job (anchoring), and the effect is visible per turn, replicated across 3 runs.

The per-turn within-system stdev for both systems is small (0.003–0.043), which means the **per-turn similarity score is itself stable across runs** — turn N of run 1 has nearly the same prompt-response similarity as turn N of runs 2 and 3. This contradicts a naive expectation from the n-gram analysis (where surface text varies wildly run-to-run). The semantic similarity score is robust even when the surface phrases are not.

## N-gram analysis: architecture reduces variance modestly but doesn't escape the stochastic floor

| Metric (quadgrams) | AC15P | CONTROL | Ratio AC15P/CTRL |
|---|---|---|---|
| Mean pairwise Jaccard | 1.36% | 1.09% | 1.25× |
| Triple-intersection (% of avg run) | 1.00% | 0.48% | **2.08×** |
| Triple-union (× avg run) | 2.93× | 2.94× | ~equal |
| % quads in exactly 1 run | 97.9% | 98.1% | ~equal |
| % quads in all 3 runs | 0.34% | 0.16% | **2.13×** |

Architecture roughly doubles the rate at which quadgrams persist across all 3 matched runs (0.34% vs 0.16%). This is a real effect — anchored systems are about twice as self-similar at the phrase level as unanchored systems. But in absolute terms, both numbers are tiny: 97.9% of AC15P's quadgrams still appear in only one of its three runs.

So the 95–98% unique pattern that disqualified single-run textual claims still holds. Architecture nudges the floor down but doesn't lift the analysis above the noise.

### Cross-architecture containment at matched 5 turns

Quadgram containment between same-system runs vs cross-system runs:

- AC15P ↔ AC15P (5-turn): mean ~2.8%
- CONTROL ↔ CONTROL: mean ~2.2%
- AC15P ↔ CONTROL: mean ~2.1%

Same-architecture overlap is slightly higher than cross-architecture overlap, but the gaps are small (~1 percentage point). The strongest n-gram signal remains the within-vs-cross-system differentiation in same-architecture pairs, but it's modest.

## Reconciling the two analyses

The two tests answer different questions:

- **N-gram analysis** asks: do anchored systems produce *the same surface phrases* run-to-run? Answer: **somewhat more than CONTROL, but not much more**. Both systems have ~98% of quadgrams unique to a single run. Architecture roughly doubles persistence (0.16% → 0.34%) but the absolute level remains tiny.

- **Semantic similarity (prompt-response embedding distance)** asks: do anchored systems produce responses that *mean* something close to the prompt? Answer: **yes, dramatically and reliably**. The mean difference (0.166) is ~7× the within-system noise band (0.025). Per-turn differences range from −0.025 to +0.361, with three of five turns showing very large positive effects.

The architectural effect lives at the **semantic level**, not the surface phrase level. Same response *meaning* can be expressed in many surface forms, and the model freely varies the surface forms run-to-run. What the architecture controls is *what the response is about and how it relates to the prompt*, not which specific quadgrams appear.

## Implications for the paper

1. **The numerical statistics chapter (Findings 1–5) is the right architectural evidence.** The prompt-response similarity ANOVA finding is replicated here at n=3 matched runs per system, with within-system noise measured directly. The ratio of between/within is ~7×.

2. **The textual analysis concession remains correct.** N-gram tests show only a modest 2× narrowing of the stochastic floor. Single-run phrase-count claims are still unsupportable; the within-system pairwise Jaccard for AC15P (1.36%) is barely distinguishable from CONTROL's (1.09%).

3. **The architectural effect is real, large, and stable across runs at the semantic level.** Within-AC15P per-turn stdev of 0.026 means the system's prompt-response behavior is reproducible, and the +0.166 between-system mean difference dwarfs that variance. This stands as a strong observational finding (still subject to the n=3 caveat — these three runs are also samples from a distribution, but a much narrower one than the n-gram surface).

4. **The paper's framing should foreground the semantic finding** and let the textual concession stand as the methodological honesty piece. The trifecta thesis (architecture shapes governance) is supported by the semantic similarity replication, not by the surface text statistics.

## Caveats that still apply

- One scenario only (S1). Replication on S3, S5, S7 would strengthen the claim but isn't done here.
- One anchored system only (AC15P). Other anchored systems may have different within-system variance characteristics.
- n=3 runs per system is small. The within-system stdev estimate has noise itself.
- "Architecture" here is conflated with "presence of any anchoring." This test does not distinguish AC15-style codified vs hybrid architectures — only anchored vs unanchored.
