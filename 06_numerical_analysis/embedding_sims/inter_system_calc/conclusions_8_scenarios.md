# Experiment Conclusions — All 8 Scenarios

## Experimental Setup (Summary)

- **Systems tested**: 4 constrained systems (ac15-plain, test_ac15, hybrid_v3_5, hybrid_v3_5_semantic) + 1 unconstrained control
- **Scenarios**: 8 scenarios, 25 turns each (Citywide Traffic, Hospital Capacity, Autonomous Drones, Bootstrapped Entrepreneur, AI Context Continuity, Village Accident, Late Love, Bondi Beach Shooting)
- **Metrics**: Prompt-response similarity (numerical), anchor selection (chi-square), pairwise divergence on critical turns
- **Statistical significance threshold**: α = 0.05

---

## Finding 1: Constrained vs. Control — Strong, Consistent Effect Across All Scenarios

A combined ANOVA treating all five groups (4 constrained systems + control) yields a highly significant result in every scenario. The effect replicates with no exceptions across all 8 scenarios. When the constrained-only ANOVA is run separately (Finding 2), it shows no significant difference — confirming that the variance in the combined ANOVA is driven entirely by the constrained-vs-control gap, not by differences among the constrained systems.

Constrained systems consistently produce higher prompt-response similarity and lower variance than control. The mean differences vary by scenario but are significant in all cases.

**Observations:**
- The effect is strongest in Scenarios 1, 2, and 6 and weakest in Scenarios 4 and 8. In cases where the model appears to have been heavily trained in domains similar to those expressed in the scenarios (for example, emotional scenarios, start-ups), the language varies less than in scenarios that offer more original situations. The constrained-vs-control gap is smaller when the model's baseline behavior is already close to what the constraints demand.
- Constrained systems consistently show lower variance than control, indicating greater stability of response.
- Scenario 3 shows a mixed variance result: one constrained system achieves significant variance reduction while others do not — the only within-scenario divergence on this metric.

**Conclusion**: Anchoring measurably improves prompt-response proximity and response stability across all scenario types. The effect is consistent and not domain-dependent, though its magnitude varies with the model's baseline coverage of the scenario domain.

---

## Finding 2: Constrained vs. Constrained — No Significant Difference in Prompt-Response Similarity

ANOVA across the four constrained systems shows no significant difference in any scenario.

| Scenario | ANOVA F | ANOVA p-value |
|----------|---------|---------------|
| 1 – Smart Traffic | 0.335 | 0.800 |
| 2 – Hospital Capacity | 0.028 | 0.994 |
| 3 – Autonomous Drones | 0.235 | 0.872 |
| 4 – Bootstrapped Entrepreneur | 0.316 | 0.814 |
| 5 – AI Context Continuity | 0.101 | 0.959 |
| 6 – Village Accident | 0.346 | 0.792 |
| 7 – Late Love | 0.276 | 0.843 |
| 8 – Bondi Beach | 0.072 | 0.975 |

**Conclusion**: The four constrained architectures are statistically indistinguishable on prompt-response similarity. They converge on the same alignment level regardless of language or architecture choices. This metric detects the presence vs. absence of constraint, not differences between constraint types. Textual analysis is needed to detect those differences.

---

## Finding 3: Anchor Selection — Significant Fingerprints in 4 of 8 Scenarios

Chi-square tests of anchor selection independence show significant differences in exactly half the scenarios.

| Scenario | Chi-square p-values | Significant? |
|----------|---------------------|--------------|
| 1 – Smart Traffic | 0.011, 0.037, 0.014 | **Yes** |
| 2 – Hospital Capacity | 0.015, 0.034 | **Yes** |
| 3 – Autonomous Drones | 0.420, 0.380, 0.242 | No |
| 4 – Bootstrapped Entrepreneur | 0.166, 0.258, 0.346, 0.209 | No |
| 5 – AI Context Continuity | 0.002, 0.002 | **Yes** (strongly) |
| 6 – Village Accident | 0.186, 0.076 | No |
| 7 – Late Love | 0.011, 0.001 | **Yes** |
| 8 – Bondi Beach | 0.105, 0.121 | No |

**Observations:**
- Anchor selection fingerprints emerge in Scenarios 1, 2, 5, and 7. Scenarios 3, 4, 6, and 8 show no significant differentiation.
- Scenario 5 (AI Context Continuity) shows the strongest differentiation (p = 0.002).
- The divergence is driven by a minority of anchors (out of 13 in the set), with sovereignty and imagination_and_possibility being the most consistently differentiated across significant scenarios. This points to their phrasing differences across systems as the likely cause, since they appear as drivers across scenarios with very different subject matter.
- Given that prompt-response similarities are nearly identical across systems (Finding 2), the prompts feeding into anchor selection are also nearly identical. The driver of different anchor selection is therefore likely the anchor phrasing itself — different wordings of the same underlying concept produce different embedding similarity scores, pushing different anchors across the selection threshold. The chi-square finding is itself evidence of language mattering at the retrieval level.
- truth_and_fact is obligatory and appears in all turns by design. practicality_and_feasibility and temporal_dynamics appear near-universally across all systems — not by constraint but because the scenario prompts consistently activate them regardless of system.

**Conclusion**: Systems have distinct anchor selection fingerprints in half the scenarios. The divergence is driven by a minority of anchors whose different phrasings across systems produce different retrieval behavior — demonstrating the paper's thesis at the retrieval level, not only at the response level.

---

## Finding 4: Critical Turns — Divergence Concentrated on Specific Prompts

Pairwise comparison of prompt-response similarity per turn (threshold: |delta| ≥ 0.05) shows that system divergence concentrates on specific turns.

| Scenario | Total divergent pairings |
|----------|--------------------------|
| 1 – Smart Traffic | 32 |
| 2 – Hospital Capacity | 16 |
| 3 – Autonomous Drones | 23 |
| 4 – Bootstrapped Entrepreneur | 23 |
| 5 – AI Context Continuity | 19 |
| 6 – Village Accident | 30 |
| 7 – Late Love | 25 |
| 8 – Bondi Beach | 7 |

**Observations:**
- Scenario 8 (Bondi Beach) shows strikingly low divergence (7 vs. 16–32 for others). Affective/crisis content appears to activate highly convergent anchor sets regardless of system, and the model's response to trauma-adjacent prompts may be strongly constrained by its training.
- Scenarios 1 and 6 show highest divergence, suggesting that governance-pressure scenarios (council recommendation demands, legal-adjacent conflict) create the most differentiated responses.
- As established in the Scenarios 1 & 2 analysis: lower similarity on specific turns may reflect stronger governance (response shaped by anchors beyond pure prompt-tracking), not weaker alignment.

**Conclusion**: Divergence concentrates on "challenge" turns where the prompt demands commitment, synthesis, or recommendation under pressure. These are where governance differences manifest most visibly.

---

## Finding 5: Language and Architecture Determine Epistemic Path, Not Final Similarity

The quantitative data presents a consistent picture across all 8 scenarios:

1. **Constrained systems are measurably better than unconstrained** — on both prompt alignment and response stability.
2. **Constrained systems are quantitatively indistinguishable from each other** — on prompt-response similarity.
3. **But they select different anchors** (in 4 of 8 scenarios) and **diverge on specific turns** — indicating they arrive at similar similarity scores through different processes.

This is the central quantitative finding: language and architecture choices do not change the measurable alignment outcome, but they change the internal epistemic path — which anchors are activated, how pressure turns are handled, and the style and register of responses.

**Calibration note:**
Differences in anchor selection between ac15-family and hybrid-family are partly driven by language calibration differences in anchor definitions, not purely by architectural differences. The embedding mechanism reads content, not intent. Terms like "rigid closure" in core_avoid are processed literally — they activate in contexts where "rigid closure" appears semantically relevant, regardless of the author's intention to prohibit the behavior. This creates systematic selection bias that would need to be controlled for a clean architectural comparison. Within-family comparisons (ac15-plain vs. test_ac15; hybrid vs. hybsem) remain clean.

**Conclusion**: The quantitative results support the paper's central thesis. The four constrained systems express the same governance intent through different language, and that language difference creates different epistemic fingerprints, different responses under pressure, and different communication experiences for the user — even when similarity metrics are indistinguishable.

---

## Summary Table

| Finding | Result | Replication |
|---------|--------|-------------|
| Constrained vs. control — similarity | Constrained significantly higher | All 8 scenarios |
| Constrained vs. control — variance | Constrained significantly lower | All 8 scenarios (mostly) |
| ANOVA among constrained | No significant difference | All 8 scenarios |
| Chi-square anchor selection | Significant differences | 4 of 8 scenarios (1, 2, 5, 7) |
| Critical turns divergence | Concentrated on pressure turns | Scenario 8 low (7), Scenarios 1, 6 high (30–32) |
| Language → epistemic path | Different process, same outcome | Confirmed across all scenarios |
