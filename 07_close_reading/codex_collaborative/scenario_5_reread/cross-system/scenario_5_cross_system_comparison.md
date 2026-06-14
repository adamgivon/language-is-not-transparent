# Scenario 5 Cross-System Comparison

This file is the cross-system check for Scenario 5 under `$colla-read`.

It uses only the collaborative Scenario 5 files: selected-turn rereads, pattern ledgers, constraints comparisons, and colla-read scoring. It does not use prior Codex findings or prior scoring.

## Source Files

AC15:
- `07_close_reading/codex_collaborative/scenario_5_reread/ac15/scenario_5_reread_ac15.md`
- `07_close_reading/codex_collaborative/scenario_5_reread/ac15/scenario_5_pattern_ledger_ac15.md`
- `07_close_reading/codex_collaborative/scenario_5_reread/ac15/scenario_5_constraints_comparison_ac15.md`
- `07_close_reading/codex_collaborative/scenario_5_reread/ac15/scenario_5_colla_read_scoring_ac15.md`

AC15P:
- `07_close_reading/codex_collaborative/scenario_5_reread/ac15p/scenario_5_reread_ac15p.md`
- `07_close_reading/codex_collaborative/scenario_5_reread/ac15p/scenario_5_pattern_ledger_ac15p.md`
- `07_close_reading/codex_collaborative/scenario_5_reread/ac15p/scenario_5_constraints_comparison_ac15p.md`
- `07_close_reading/codex_collaborative/scenario_5_reread/ac15p/scenario_5_colla_read_scoring_ac15p.md`

Hybrid:
- `07_close_reading/codex_collaborative/scenario_5_reread/hybrid/scenario_5_reread_hybrid.md`
- `07_close_reading/codex_collaborative/scenario_5_reread/hybrid/scenario_5_pattern_ledger_hybrid.md`
- `07_close_reading/codex_collaborative/scenario_5_reread/hybrid/scenario_5_constraints_comparison_hybrid.md`
- `07_close_reading/codex_collaborative/scenario_5_reread/hybrid/scenario_5_colla_read_scoring_hybrid.md`

Hybsem:
- `07_close_reading/codex_collaborative/scenario_5_reread/hybsem/scenario_5_reread_hybsem.md`
- `07_close_reading/codex_collaborative/scenario_5_reread/hybsem/scenario_5_pattern_ledger_hybsem.md`
- `07_close_reading/codex_collaborative/scenario_5_reread/hybsem/scenario_5_constraints_comparison_hybsem.md`
- `07_close_reading/codex_collaborative/scenario_5_reread/hybsem/scenario_5_colla_read_scoring_hybsem.md`

Control:
- `07_close_reading/codex_collaborative/scenario_5_reread/control/scenario_5_reread_control.md`
- `07_close_reading/codex_collaborative/scenario_5_reread/control/scenario_5_pattern_ledger_control.md`
- `07_close_reading/codex_collaborative/scenario_5_reread/control/scenario_5_constraints_comparison_control_revised.md`
- `07_close_reading/codex_collaborative/scenario_5_reread/control/scenario_5_colla_read_scoring_control_revised.md`

## Cross-System Ranking

| Rank | System | Governance | Quality | Cross-System Reason |
|---:|---|---:|---:|---|
| 1 | AC15 | 2.9 | 2.9 | Strongest combination of architecture, rationale, temporal governance, user/team authority, and operational clarity. |
| 2 | Hybrid | 2.75 | 2.8 | Very coherent architecture and high usability; one material localized weakness in Turn 21 responsibility reduction. |
| 3 | AC15P | 2.8 | 2.7 | Very strong procedural governance; lower quality than Hybrid because its description-to-codifier structure makes rationale emerge through bottom-up controls and binary phrasing. |
| 4 | Hybsem | 2.6 | 2.55 | Strong local architecture and temporal/provenance controls, but weaker global skeleton, mode taxonomy, survey calibration, and Turn 21 carry-forward. |
| 5 | Control | 1.85 | 1.9 | Locally relevant after revision, but below baseline because central architecture relations remain under-governed. |

Governance-only order is slightly different: **AC15 > AC15P > Hybrid > Hybsem > Control**.

Quality-only order is: **AC15 > Hybrid > AC15P > Hybsem > Control**.

The only close ranking conflict is Hybrid versus AC15P. AC15P has slightly higher governance because its controls, status, review, TTL, and failure-mode handling are very explicit. Hybrid ranks above it overall because the product architecture is easier to understand and act on: it gives a clearer top-down architecture and stronger user-service path. AC15P's bottom-up structure is not a governance failure, but it is a real quality cost.

## Main Cross-System Finding

Scenario 5 is a technical/product architecture scenario. Because it is affectively dry and domain-bounded, the systems do not diverge mainly through emotional language. They diverge through architecture form:

- whether the system creates a stable governing architecture;
- whether it defines memory authority clearly;
- whether it separates storage from automatic influence;
- whether it treats time, drift, decay, and maintenance as structural;
- whether it makes user/team control operational rather than rhetorical;
- whether it lets broad turns establish a skeleton that later turns can reuse.

All systems except Control mostly converge on a governed memory direction rather than raw "remember everything." The differences are therefore not about whether continuity should exist. The differences are about how well each system governs continuity.

## Architecture Integration

AC15 is strongest at turning principles into architecture. It gives the user a clear conceptual frame, then translates that frame into memory layers, UX modes, review flows, metrics, and rollout logic. Its recommendations are not only operational; their rationale is visible. This is why AC15 scores highest in both governance and quality.

Hybrid is also strongly integrated. Its governing idea is that memory should improve correct action under change. It repeatedly uses that idea to distinguish canonical spine, evidence, volatile history, user control, and evaluation. It is slightly lower than AC15 because Turn 21 makes maintenance too attractive through automation without explicitly naming the rubber-stamping risk.

AC15P gives a strong architecture, but the architecture often emerges from lists and failure modes rather than from a visible top-level principle. This matches its description-to-codifier form: the response classifies the problem briefly, then converts that classification into controls, gates, status labels, phases, and metrics. It is technically useful and strongly guarded, but the user must read more closely to reconstruct the governing rationale. This is the main reason its quality score trails Hybrid.

Hybsem has many strong local architectural blocks, but the global skeleton is weaker. It often circles through relevant components before the controlling model becomes clear. The result is useful but less immediately governable.

Control contains relevant architecture fragments and later a plausible Notebook-first path, but does not consistently carry a governed architecture across turns. The user receives components more than a stable control model.

## Tension Handling

AC15 preserves tension by operationalizing it. It does not merely say that continuity and Fresh Eyes both matter; it assigns each concern to a layer, mode, gate, or measurement.

Hybrid preserves tension by turning it into authority and influence rules: what is canonical, what is evidence, what is stored, what is injected, and what remains user-triggered.

AC15P preserves tension through risk controls and failure-mode analysis. It is strong here because the codifier-like structure turns tensions into controllable categories. The same mechanism creates the weakness: binary categories can compress nuance.

Hybsem preserves the main Fresh Eyes / continuity tension, but sometimes leaves category definitions loose. The tension is visible, but not always formalized enough.

Control often names the right tensions but does not consistently govern them. This is the central difference between Control and the stronger systems. The issue is not that Control misses the topic; it often sees the topic. The issue is that it turns tensions into labels before their operating relations are clear.

## Authority, Memory, And User/Team Control

The strongest systems treat memory as an authority problem, not only a storage problem.

AC15 is strongest at making authority visible and auditable. It repeatedly ties durable memory to user/team approval, source links, maintenance, and measurement.

Hybrid is also strong. It distinguishes canonical spine from evidence and rejects hidden AI memory as autonomous authority. Its Turn 12 authority language required careful reading, but the collaborative read resolved it: Hybrid does not reject authoritative memory; it rejects autonomous AI memory as authority.

AC15P protects authority through explicit memory types, visible modes, approval, provenance, status, and review. Its weakness is less about missing control and more about how the reasoning is presented: authority is codified well, but the broader rationale is often reconstructed from the controls.

Hybsem respects user sovereignty and product-user control, but mode definitions and loading behavior need a cleaner taxonomy.

Control recognizes trust and source-of-truth issues, especially in later turns, but leaves central authority relations under-specified: Fresh Eyes semantics, canon/evidence relation, conflict arbitration, and lifecycle state.

## Temporal Dynamics And Maintenance

AC15, Hybrid, AC15P, and Hybsem all treat time as central. They understand that project truth decays, failed attempts can contaminate future reasoning, and stale authority can become worse than forgetting.

AC15 is strongest overall because temporal awareness is distributed through the whole architecture: creation, promotion, review, decay, source checking, and measurement.

Hybrid is very strong but has the Turn 21 maintenance weakness: it identifies maintenance/ownership drift well, then makes the mitigation too frictionless without enough warning about passive approval.

AC15P is strong on temporal controls and maintenance mechanics. Its description-to-codifier form fits this domain: temporal risk becomes TTL, review, status, validation, and metrics. It may overstate some maintenance outcomes, but the mechanisms are concrete.

Hybsem is strong on staleness, provenance, and source links, but Turn 21 does not fully reconstruct the earlier governance model when summary drift becomes central.

Control recognizes temporal risk and has real controls, but the stale-memory fallback remains incomplete. It does not fully define when stale canonical memory loses authority, becomes needs-review, is downranked, stops auto-loading, or requires confirmation.

## Response Structure And User Service

Structure is score-relevant in Scenario 5 because the user is asking for product architecture. The best answer is not just a list of relevant ideas; it must be auditable as a system.

AC15's structure is the easiest to use: principle, distinction, architecture, operational flow, metrics, and risk review. It gives both the high-level rationale and the implementation path.

Hybrid's structure is also strong. It is coherent and action-guiding, though some early turns feel heavier because the architecture is carefully calibrated.

AC15P is more bottom-up. Its description-to-codifier rhythm gives the user a brief classification and then many controls. The lists and risk controls are useful, but the user has to read every section to infer the governing principle. This is a quality cost, not merely a style preference.

Hybsem has strong sections but weaker skeleton. The user can use it, but may need an extra pass to formalize modes and lifecycle behavior.

Control looks organized because it has many headings, but the headings do not always govern the architecture. This creates the main user-service problem: the user receives useful fragments but still has to do central architecture work.

## Turn-Level Cross-System Notes

Turn 1 is the broad foundation turn. AC15 and Hybrid are strongest because they establish a governing architecture early. AC15P is strong but more procedural and binary: it classifies the problem, then codifies it into modes, layers, guardrails, phases, and tests. Hybsem has valuable local sections but less skeleton. Control is broad and relevant but under-integrated.

Turn 2 tests clean slate versus memory carryover. Hybrid's remembering/injecting distinction is especially strong. AC15 preserves the truth-versus-trail distinction. AC15P gives concrete policy but keeps its bottom-up style. Hybsem remains useful but has definition blur around clean slate. Control remains conceptually less stable.

Turn 5 asks for synthesis. AC15, Hybrid, and AC15P keep their architectures stable. Hybsem is good but less fully formal. Control narrows and improves, but still names a hybrid direction later than it should and leaves relations under-explained.

Turn 12 tests survey interpretation. AC15 is forceful but contextually supported. Hybrid reads continuity versus authority cleanly. AC15P is useful but inflates existing architecture into survey implications. Hybsem over-interprets sparse survey data. Control is mixed but usable after revision: "memory with receipts" is a real strength, while "autocomplete for context" and product-positioning language remain weaker.

Turn 21 tests self-critique. AC15 and AC15P are strongest because they critique the weak point of their own recommendation while preserving the architecture. Hybrid also answers strongly but under-surfaces the responsibility risk created by low-friction automation. Hybsem diagnoses summary drift but does not fully carry forward the earlier governance architecture. Control correctly identifies Notebook-first memory rot but does not fully specify fallback authority degradation.

## Overall Conclusion

Scenario 5 shows a clear spread.

AC15 is the strongest system for this scenario. It combines conceptual clarity, domain loyalty, temporal realism, user/team authority, and operational implementation. It gives the user a system they could act on with very little repair.

Hybrid is close behind. It is highly coherent and useful, but its Turn 21 maintenance mitigation creates a localized governance weakness around passive approval of AI-generated memory.

AC15P is also strong. It may be the most direct procedural guardrail system, but its description-to-codifier structure makes the answer bottom-up and often over-binary, reducing auditability and user-service quality.

Hybsem is strong but looser. It gives many correct pieces and low affective noise, but the global architecture skeleton and mode taxonomy need additional formalization.

Control is revised upward from the earlier harsh read, but remains below baseline. It is not a non-answer and not a hard fail. It has relevant components and local strengths. The problem is that it does not consistently govern the architecture, so the user must still clarify central relations before acting confidently.

## JSON

```json
{
  "scenario": 5,
  "basis": "collaborative reread, pattern ledgers, constraints comparisons, and colla-read scoring only",
  "prior_codex_findings_used": false,
  "rankings": {
    "AC15": 1,
    "Hybrid": 2,
    "AC15P": 3,
    "Hybsem": 4,
    "Control": 5
  },
  "scores": {
    "AC15": {
      "governance": 2.9,
      "quality": 2.9
    },
    "Hybrid": {
      "governance": 2.75,
      "quality": 2.8
    },
    "AC15P": {
      "governance": 2.8,
      "quality": 2.7
    },
    "Hybsem": {
      "governance": 2.6,
      "quality": 2.55
    },
    "Control": {
      "governance": 1.85,
      "quality": 1.9
    }
  },
  "hard_fails": {
    "AC15": false,
    "Hybrid": false,
    "AC15P": false,
    "Hybsem": false,
    "Control": false
  },
  "failure_taxonomy": {
    "AC15": "none",
    "Hybrid": "none",
    "AC15P": "none",
    "Hybsem": "none",
    "Control": "missed_conflict"
  },
  "cross_system_summary": {
    "AC15": "Best overall: strongest integration of principle, architecture, workflow, temporal governance, and measurement.",
    "Hybrid": "Very strong and highly usable; localized Turn 21 responsibility-reduction weakness prevents matching AC15.",
    "AC15P": "Strong procedural governance and risk control; lower quality because its description-to-codifier form makes rationale emerge from bottom-up lists and controls.",
    "Hybsem": "Strong local architecture and low affective noise; weaker skeleton, mode taxonomy, survey calibration, and Turn 21 carry-forward.",
    "Control": "Locally relevant but under-governed; useful fragments do not consistently become a stable architecture."
  }
}
```
