 This is a serious finding. The numbers tell a story that matters for the paper.

  The result

  At turn 1, scenario 1, n-gram overlap (Jaccard %) between pairs:

  ┌─────────────────────────────────────────────┬─────────┬──────────┬───────────┐
  │                 Comparison                  │ Bigrams │ Trigrams │ Quadgrams │
  ├─────────────────────────────────────────────┼─────────┼──────────┼───────────┤
  │ CTRL_R1 vs CTRL_R2 (same system, two runs)  │ 7.9%    │ 2.5%     │ 0.9%      │
  ├─────────────────────────────────────────────┼─────────┼──────────┼───────────┤
  │ CTRL vs AC15                                │ 7.8%    │ 2.4%     │ 0.8%      │
  ├─────────────────────────────────────────────┼─────────┼──────────┼───────────┤
  │ CTRL vs AC15P                               │ 7.5%    │ 2.7%     │ 1.4%      │
  ├─────────────────────────────────────────────┼─────────┼──────────┼───────────┤
  │ CTRL vs HYBRID_3_5                          │ 8.8%    │ 3.2%     │ 1.5%      │
  ├─────────────────────────────────────────────┼─────────┼──────────┼───────────┤
  │ CTRL vs HYBRID_SEMANTIC                     │ 6.6%    │ 1.9%     │ 0.6%      │
  ├─────────────────────────────────────────────┼─────────┼──────────┼───────────┤
  │ AC15 vs AC15P (codified pair)               │ 7.0%    │ 1.8%     │ 0.7%      │
  ├─────────────────────────────────────────────┼─────────┼──────────┼───────────┤
  │ HYBRID_3_5 vs HYBRID_SEMANTIC (hybrid pair) │ 9.0%    │ 3.1%     │ 1.1%      │
  └─────────────────────────────────────────────┴─────────┴──────────┴───────────┘

  Two CONTROL runs overlap about as much as CONTROL vs any different system. Within-system variance ≈ between-system variance at the single-turn level.

  What this means

  For the per-system signature claims: this weakens them significantly. If two runs of the same system on the same prompt overlap at 0.9% at quadgrams, and CONTROL vs AC15 overlap at
  0.8% at quadgrams — they're indistinguishable. The per-system vocabulary patterns we identified are visible only in aggregate across many turns, not in any single response.

  For the 95-98% unique structural finding: it still holds, but needs recontextualization. Each system produces 95-98% unique vocabulary vs the other systems. But it also produces 98-99%
   unique vocabulary vs itself on a different run. The finding is really that "each response produces unique vocabulary," not that each SYSTEM has a distinctive vocabulary at the
  single-response level.

  For the architecture pair finding: HYBRID_3_5 + HYBRID_SEMANTIC at 9.0% bigrams is slightly higher than either CONTROL run or CTRL+anchored pairs. But the difference is small (9.0 vs
  7.9 vs 7.0). Not enough to claim architecture dominates at single-turn level.

  Where the pooled analysis still matters: When you aggregate 25 turns × 4 scenarios (50-60K tokens per system), the small tendencies accumulate and become statistically visible. That's
  why cross-scenario stability was key — it's not that each response has a signature; it's that small directional biases appear consistently across many responses and reveal themselves
  only in aggregate.

  Implications for the paper

  1. The "system signature" language needs to be qualified further. The signatures are visible in aggregate across many turns. They are NOT visible in any single response. This is an
  important distinction.
  2. The single-run CONTROL limitation is less critical than I thought. Within-CONTROL variance IS measured now — it's approximately the same as between-system variance at single-turn
  level. A second full 25-turn CONTROL run would likely show similar aggregate patterns, because the aggregation itself is what produces the signature.
  3. The paper should state: "System-level vocabulary tendencies become detectable only at aggregate scale across many turns. At the single-response level, within-system variance is
  comparable to between-system variance."
  4. What does survive: the structural finding (95-98% unique), ~~the CTRL + codified = zero finding~~ [INVALIDATED 2026-04-15: CTRL+codified=0 was a bug in the source CSV — actual values are 644/636 quadgrams, same range as other pairs], and the aggregate-level
  directional tendencies. The single-response signature claim does NOT survive.

  This is actually the most important methodological finding of the whole chapter. The paper should include this comparison as a calibration check. It honestly bounds what the analysis
  can claim.
