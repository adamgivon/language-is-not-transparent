# 11th Phase

This phase rewrites the main inverse-ngram summaries with denominator framing.

The purpose is to stop small recurrent signals from reading as if they define whole systems.

The summaries in this phase state scale at three levels where possible:

- share inside the local layer
- share inside the filtered inverse field
- share against total trigram + quadgram token windows

Files:

- `summaries/system_total_ngram_windows.csv`
- `summaries/grouped_system_overall_scale.csv`
- `summaries/grouped_anchor_scale_by_system_level.csv`
- `summaries/grouped_anchor_scale_by_system_overall.csv`
- `summaries/negative_space_scale_by_system.csv`
- `summaries/control_disproportionate_words_with_scale.csv`
- `summaries/control_phrase_starters_with_scale.csv`
- `summaries/pairwise_exact_sharing_mass.csv`
- `summaries/triple_exact_sharing_mass.csv`

Writeups:

- `writeup/grouped_summary_with_proportions.md`
- `writeup/negative_space_summary_with_proportions.md`
- `writeup/control_signature_summary_with_proportions.md`
- `writeup/two_systems_summary_with_proportions.md`
- `writeup/general_proportional_conclusion.md`
