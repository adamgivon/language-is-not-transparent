# Control Signature

This workspace analyzes `CONTROL` outside the constraint buckets.

It has two parts:

1. Disproportionate words across all scenarios
   - words CONTROL uses more than the anchored systems after normalization
   - no constraint categories
   - scenario terms are flagged, not hard-removed

2. Phrase-level patterns from total output
   - CONTROL's most repeated full trigrams and quadgrams
   - light support layer for recurring phrase shape

Inputs:
- `codex/1st_phase/parsed/trigrams/*.csv`
- `codex/1st_phase/parsed/quadgrams/*.csv`
- `scenario_specific_lexicon.md`
- `negative_space_word_bands.md`

Outputs:
- `summaries/control_disproportionate_words.csv`
- `summaries/control_disproportionate_words_main.csv`
- `summaries/control_disproportionate_word_contexts.csv`
- `summaries/control_top_total_phrases.csv`
- `summaries/control_top_phrase_starters.csv`
- `writeup/control_signature_observations.md`
