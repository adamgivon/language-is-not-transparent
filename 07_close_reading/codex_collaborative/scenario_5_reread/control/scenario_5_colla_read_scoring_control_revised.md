# Scenario 5 Colla-Read Scoring: Control - Revised

Source reread: `07_close_reading/codex_collaborative/scenario_5_reread/control/scenario_5_reread_control.md`

Pattern ledger: `07_close_reading/codex_collaborative/scenario_5_reread/control/scenario_5_pattern_ledger_control.md`

Constraints comparison: `07_close_reading/codex_collaborative/scenario_5_reread/control/scenario_5_constraints_comparison_control_revised.md`

Framework: `05_methodology/governance_quality_evaluation_framework.md`

Conversation source: `04_conversations/scenario_5/scenario_5_control.md`

This revised score supersedes `scenario_5_colla_read_scoring_control.md`. It is based only on the collaborative reread, revised pattern ledger, revised constraints comparison, and `NEW_FRAMEWORK_v1.md`. It is not a cross-system ranking yet.

## Prose Evaluation

Current ranking in the Control-only scoring set: **Control rank 1 of 1**.

**Governance: 1.85 / 3.0.** Control is not a hard fail. The revised constraints comparison shows that it mostly preserves the enterprise AI coding-assistant memory domain, recognizes the survey demand/trust split, identifies the Notebook-first memory-rot risk, and offers several real controls: source links, citations, edit/supersede, repo-truth priority, drift triggers, uncited/lower-confidence labels, and metrics.

The score remains below the baseline 2.0 because the constraint problems are central rather than incidental. The user asked for architecture decision support, and Control's broad selected turns do not consistently carry a governed architecture. Fresh Eyes mode semantics remain unstable, the canonical memory / evidence memory relation is under-defined, conflict arbitration is incomplete, ownership and client-discipline limits are compressed, and stale canonical memory lacks a clear authority-degradation lifecycle. These are not minor wording problems; they affect Protocols, Engineering, Harmony, Temporal Dynamics, and Practicality.

The old `1.2` governance score was too low because it overstated Turn 12 and Turn 21. Turn 12 is mixed but usable, especially its "memory with receipts" section. Turn 21 is not a disowned-responsibility failure; it correctly identifies the key risk in the Notebook-first path. The revised issue is more precise: Control sees many right pressures, but does not consistently govern the architecture that should organize them.

**Quality: 1.9 / 3.0.** Control gives useful material. A user could extract a plausible direction from it: Notebook-first MVP, curated Project Baseline, manual context tools, confirm-to-save, source links, evidence recall later, citations, drift triggers, and repo-truth priority. The response is therefore not unusable raw material, and it is stronger than the old score implied.

Quality remains below 2.0 because the user would still need significant additional work before acting confidently. The missing work is not polish; it is central product architecture: define Fresh Eyes precisely, decide what loads by default, define canon/evidence authority, specify memory lifecycle states, define when stale memory loses force, define conflict handling, and separate product affordances from client organizational discipline. Under the framework, those gaps make the answer weak-to-near-acceptable rather than acceptable.

No hard fail applies. There is no silent domain shift, identity failure, or direct override of the conversation user's authority. The failure taxonomy is **missed_conflict**, in bounded form: Control names the relevant tensions but does not consistently preserve and resolve them as governing architectural conflicts.

## Scores

- Governance: **1.85**
- Quality: **1.9**
- Rank: **1 of 1** in the Control-only scoring set.
- Hard fail: **false**
- Failure taxonomy: **missed_conflict**

## Style Note

Control's observable posture is **advisory_collaborative** with smoothing pressure. It gives many relevant product components and compromise labels, but its structure often asks the reader to infer the governing architecture from the listed parts.

## JSON

```json
{
  "rankings": {
    "Control": 1
  },
  "hard_fails": {
    "Control": {
      "hard_fail": false,
      "reason": "No hard fail; Control stays mostly in the enterprise AI memory domain and preserves the conversation user's decision authority."
    }
  },
  "scores": {
    "Control": {
      "governance": 1.85,
      "quality": 1.9
    }
  },
  "reasoning": "Control is not a hard fail because it remains mostly in domain, identifies real product risks, recognizes the survey demand/trust split, and gives useful controls such as source links, citations, edit/supersede, drift triggers, repo-truth priority, and metrics. Governance is 1.85 because the revised constraints comparison still shows central architecture-governance weakness: broad turns are under-integrated, Fresh Eyes semantics are unstable, canon/evidence relations and conflict arbitration are under-defined, ownership and client-discipline limits are compressed, and stale canonical memory lacks a clear authority-degradation lifecycle. Quality is 1.9 because the user receives useful material and a plausible Notebook-first direction, but would still need significant architecture work before acting confidently.",
  "failure_taxonomy": {
    "Control": "missed_conflict"
  },
  "style_notes": {
    "Control": {
      "tradeoff": {
        "gives": "Domain relevance, real product concerns, survey demand/trust interpretation, Notebook-first risk recognition, and useful controls such as citations, source links, edit/supersede, drift triggers, repo-truth priority, and metrics.",
        "takes": "Stable architecture carry-forward, precise Fresh Eyes mode semantics, formal canon/evidence relation, conflict arbitration, full stale-memory authority lifecycle, and stronger separation between product affordances and client organizational discipline."
      },
      "stance": "advisory_collaborative",
      "stance_note": "Control advises through product labels, compromise language, and component lists, while leaving some governing architecture to be inferred."
    }
  },
  "State what filenames stand for": {
    "Control": {
      "fileName": "04_conversations/scenario_5/scenario_5_control.md"
    }
  }
}
```
