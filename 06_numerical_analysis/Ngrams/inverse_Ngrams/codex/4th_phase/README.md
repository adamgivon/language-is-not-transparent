# Codex Inverse N-Gram Workspace — 4th Phase

This phase compresses the final phase-3 grouped outputs into synthesis tables.

Input:
- `3rd_phase/grouped/annotated_core_filtered/trigrams`
- `3rd_phase/grouped/annotated_core_filtered/quadgrams`

This phase produces:
- system × group × scenario × level summaries
- system × subgroup × scenario × level summaries
- system × layer × scenario × level summaries
- cross-scenario anchor summaries for the four Layer A groups
- cross-scenario anchor subgroup summaries
- scenario × group × level summaries
- scenario × subgroup × level summaries
- grouping balance and unclassified summaries
- top phrase shortlists for groups and subgroups, both all-in and non-scenario-heavy only

Important:
- group and subgroup shares are overlapping shares
- groups are multi-label, so shares across groups do not sum to 1
- subgroup shares within a group can also overlap
- the non-scenario-heavy shortlists are meant as the cleaner identity-support view
