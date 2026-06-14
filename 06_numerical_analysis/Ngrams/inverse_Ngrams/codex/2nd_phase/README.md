# Codex Inverse N-Gram Workspace — 2nd Phase

This phase applies the first real filtering pass to the inverse n-gram workspace.

Input:
- `1st_phase/inverse_scored/trigrams`
- `1st_phase/inverse_scored/quadgrams`

This phase does:
- core filtering
- constraint lexicon annotation
- scenario lexicon annotation
- scenario-heavy flagging
- four review buckets

Output buckets:
- `filtered/core_filtered`
- `filtered/constraint_candidates`
- `filtered/high_count_no_hit_review`
- `filtered/scenario_driven_review`

Important note:
- `constraint_candidates` is a useful narrowed view, not the whole analysis
- `scenario_driven_review` is a review bucket, not a deletion bucket
