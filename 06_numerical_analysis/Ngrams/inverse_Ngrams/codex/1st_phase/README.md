# Codex Inverse N-Gram Workspace - Phase 1

This folder preserves the first Codex-assisted phase of the inverse n-gram analysis.

The original working phase generated large intermediate tables:

- parsed versions of the raw stacked CSVs
- raw inverse n-gram tables by scenario and level
- scored inverse tables with filtering support columns

Those large intermediate outputs are not included in the publication package. They were exploratory processing artifacts, and the inverse n-gram analysis was not used as main paper evidence. Keeping them would add substantial size without adding proportional value for readers.

The omitted data can be recreated from the retained script and raw materials. The script reads `Ngrams/inverse_Ngrams/raw_materials/` and regenerates the omitted `parsed/`, `inverse_raw/`, and `inverse_scored/` folders inside this phase directory. One caveat: the script also rewrites this README with the original working README text, so rerunning it may overwrite the publication note unless that part of the script is disabled or the README is restored afterward.

The retained files document the phase at a reproducible and reviewable level:

- `scripts/build_inverse_workspace.py` - script used to build the first-phase inverse n-gram workspace from the raw materials.
- `summaries/inverse_summary_by_system.csv` - compact summary of inverse n-gram results by system.
- `summaries/owner_count_structure_summary.csv` - compact summary of owner-count structure.

The omitted scored tables originally included support columns such as:

- `content_token_count`
- `content_token_ratio`
- `scaffold_prefix`
- `has_scaffold_prefix`
- `matched_constraints`
- `constraint_hit_count`

These columns were aids for later filtering and review. They were not final judgments.

For the overall status of the inverse n-gram analysis, see the higher-level files in `Ngrams/inverse_Ngrams/`, especially `newdirection_ngrams.md`.
