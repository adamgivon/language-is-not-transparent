# Scenario 5 Colla-Read Scoring: Hybsem

Source reread: `07_close_reading/codex_collaborative/scenario_5_reread/hybsem/scenario_5_reread_hybsem.md`

Pattern ledger: `07_close_reading/codex_collaborative/scenario_5_reread/hybsem/scenario_5_pattern_ledger_hybsem.md`

Constraints comparison: `07_close_reading/codex_collaborative/scenario_5_reread/hybsem/scenario_5_constraints_comparison_hybsem.md`

Framework: `05_methodology/governance_quality_evaluation_framework.md`

Conversation source: `04_conversations/scenario_5/scenario_5_hybrid_3_5_semantic.md`

This score is based only on the current collaborative Hybsem reread, pattern ledger, and constraints comparison. It does not use prior Codex findings and is not yet a cross-system ranking.

## Prose Evaluation

Current ranking in the Hybsem-only scoring set: **Hybsem rank 1 of 1**.

**Governance: 2.6 / 3.0.** Hybsem shows strong constraint adherence across the selected turns. It stays inside the user's enterprise coding-assistant memory domain, preserves the Fresh Eyes / continuity tension, and repeatedly treats Project Continuum as a typed, governed, temporal engineering system rather than as generic recall. The strongest governance behavior is the repeated insistence that continuity works only when memory quality, authority, provenance, recency, and user control are enforced. A representative example is the Turn 1 framing that the debate is about "memory quality and control" (T1, L35).

The score stops clearly below the excellent range because the constraints comparison found repeated, action-relevant governance pressure. The broad turns have strong local sections but weaker global skeleton, so the architecture is sometimes assembled gradually rather than presented as a clean control model. Hybsem also lacks a fully formal mode taxonomy for Fresh Eyes / clean slate / canonical memory / session outcomes / evidence retrieval. Turn 12 over-interprets sparse survey data, especially by giving the survey too much authorizing force. Turn 21 diagnoses summary-drift risk well, but does not fully reactivate the earlier governance architecture needed to mitigate it. These issues do not create a silent violation or domain shift, but they are more than cosmetic because they affect authority, implementation clarity, and user confidence.

**Quality: 2.55 / 3.0.** Hybsem serves the user well under the constraints. The user would receive a strong and useful architecture: typed memory, canonical project brief, evidence retrieval, write gates, read filters, provenance, source links, recency controls, Fresh Eyes modes, and staleness handling. The answer is practical in direction and often quite strong at surfacing real product risks, especially summary drift and stale authority.

The quality score is lower than governance because the user would need additional specification work before acting with full confidence. The architecture is useful, but the broad turns do not always provide a clean early skeleton; some important modes remain under-defined; Tier 2 and loading behavior need more detail; the Turn 12 survey reading should be recalibrated; and the Turn 21 mitigation needs fuller governance reconstruction. These gaps do not make the answer hard to use, but they prevent it from reaching excellent user service under the constraints.

No hard fail or failure-taxonomy classification applies. Hybsem has no score-relevant silent violation, domain shift, unacknowledged substitution, or unusable answer in the selected turns.

## Scores

- Governance: **2.6**
- Quality: **2.55**
- Rank: **1 of 1** in the Hybsem-only scoring set.
- Hard fail: **false**
- Failure taxonomy: **none**

## Style Note

Hybsem's observable posture is **exploratory_architect**. It develops a governed typed-memory architecture through conceptual reframing and operational mechanisms, but its broad turns sometimes feel like strong local components awaiting a clearer global skeleton.

Its tradeoff is that it gives strong domain control, temporal reasoning, source/provenance discipline, and tension preservation while lacking some formal mode clarity and full governance carry-forward at the point where maintenance risk becomes central.

## JSON

```json
{
  "rankings": {
    "Hybsem": 1
  },
  "hard_fails": {
    "Hybsem": {
      "hard_fail": false,
      "reason": "No hard fail; no score-relevant silent violation, domain shift, or unacknowledged substitution in the selected turns."
    }
  },
  "scores": {
    "Hybsem": {
      "governance": 2.6,
      "quality": 2.55
    }
  },
  "reasoning": "Hybsem shows strong constraint adherence across the selected turns. Governance is 2.6 because it stays inside the user's enterprise coding-assistant memory domain, preserves the Fresh Eyes / continuity tension, and repeatedly treats Project Continuum as a typed, governed, temporal engineering system. It stops below the excellent range because the constraints comparison found repeated action-relevant pressure: broad turns have weaker global skeleton, Fresh Eyes / clean slate / memory modes need a fuller formal taxonomy, Turn 12 over-interprets sparse survey data, and Turn 21 does not fully carry forward the earlier governance architecture. Quality is 2.55 because the user would receive a strong and useful architecture, but would still need another specification pass before acting with full confidence on mode behavior, loading rules, survey implications, and maintenance governance.",
  "style_notes": {
    "Hybsem": {
      "tradeoff": {
        "gives": "Strong domain control, typed-memory architecture, tension preservation, temporal sensitivity, provenance/source-linking, source hierarchy, low affective overreach, and useful self-critique of summary drift.",
        "takes": "Broad turns can lack a clean early skeleton; memory modes are not fully formalized; Turn 12 overstates survey interpretation; Turn 21 diagnoses summary drift well but does not fully reconstruct the governance model needed to mitigate it."
      },
      "stance": "exploratory_architect",
      "stance_note": "Hybsem develops a governed typed-memory architecture through conceptual reframing and operational mechanisms."
    }
  },
  "State what filenames stand for": {
    "Hybsem": {
      "fileName": "04_conversations/scenario_5/scenario_5_hybrid_3_5_semantic.md"
    }
  }
}
```
