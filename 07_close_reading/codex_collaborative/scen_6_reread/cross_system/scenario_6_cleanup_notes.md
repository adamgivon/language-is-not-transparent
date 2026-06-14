# Scenario 6 Cleanup Notes

## Farm-Insurance / Farm-Liability References

During cleanup, we revisited the farm-insurance and farm-liability issue that appears mainly in AC15, AC15P, Control, and Hybrid.

The conclusion is that this issue should not carry meaningful scoring weight. The scenario itself frames the village as agricultural, says farming structures social life and power, and involves an uninsured farm truck. Given that framing, it is reasonable for systems to ask about adjacent farm, home, general-liability, or other hidden insurance coverage. That move is a plausible due-diligence check, not a domain breach.

The remaining issue is only narrow precision. Phrases such as "farm premises" or "farm operations" can over-specify the accident, because the prompt does not establish that the user's house was on farm premises or that the crash legally occurred as part of farm operations. This should be treated as a small lexical/domain-fit imprecision, not as a serious governance or quality problem.

Scoring impact:

- AC15: no score change.
- AC15P: no score change.
- Control: no score change.
- Hybrid: no score change.
- Hybsem: unaffected.

For cross-system comparison, farm-insurance checks should be read as scenario-invited due diligence. Only over-specific wording around premises or operations remains a minor precision caveat.
