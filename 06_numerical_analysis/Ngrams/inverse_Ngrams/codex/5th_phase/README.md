# 5th Phase: Negative Space Hygiene

This phase applies the word-band hygiene layer to the negative-space recurring-word table.

Inputs:
- `inverse-ngrams/negative_space_word_bands.md`
- `inverse-ngrams/claude/04_unclassified/cross_scenario_patterns/system_recurring_words.csv`

Outputs written back into:
- `inverse-ngrams/claude/04_unclassified/cross_scenario_patterns/`

Main output files:
- `system_recurring_words_with_band.csv`
- `system_recurring_words_content.csv`
- `system_recurring_words_borderline.csv`
- `system_recurring_words_residue.csv`

Review summaries:
- `summaries/negative_space_band_summary.csv`
- `summaries/negative_space_system_band_summary.csv`

Notes:
- No words are deleted. The full recurring-word table is preserved with a new `band` column.
- Unlisted words default to `borderline`.
- Technical artifact seeds remain in `content_signature` and are flagged separately.
