# Final Review Note

## Scope reviewed

The review covered these three codex writeup documents:

- `codex/6th_phase/writeup/negative_space_observations.md`
- `codex/7th_phase/writeup/synthesis_lexicon_vs_negative_space.md`
- `codex/8th_phase/writeup/system_signatures_summary.md`

The review checked four things:

1. whether any claim depended on uncleaned negative-space data
2. whether any claim overstated independence between the two readings
3. whether scale language was clear enough
4. whether the wording stayed inside what the data can actually support

## Findings

### 1. CONTROL needed a threshold caveat

In the negative-space observations and the summary, `CONTROL` was described as having no cleaned content-signature words. That was true, but the wording could be read too absolutely.

Problem:

- the result is threshold-dependent
- it means no content-signature words survive under the current cleanup rules
- it does **not** mean CONTROL has no language pattern at all

Fix:

- added explicit threshold wording in the negative-space observations
- added the same caution in the paper-ready summary

### 2. A few convergence lines were slightly too strong

In the synthesis, phrases like “stronger final claim” were directionally right, but a bit too assertive given that both readings come from the same filtered field.

Problem:

- the convergence is real
- but the two layers are still not independent

Fix:

- changed `stronger` to `more defensible` in the synthesis
- kept the non-independence caveat explicit
- added `within this experiment` where needed

### 3. Family pairings needed slightly softer wording

The negative-space observations treated the family-level pairings as fully robust. They are useful, but still small.

Problem:

- `vs` and `without` are interpretable
- but the pairings are still built from a small cleaned content table

Fix:

- changed the wording from stronger phrasing to:
  - `small but interpretable overlaps`
  - `small family pairings`

### 4. One scale distinction was implicit but should be explicit

The per-system content shares in the negative-space observations are shares **inside the recurring-word table**, not shares inside the whole inverse field.

Problem:

- the comparison is still useful
- but the denominator matters

Fix:

- added one sentence making this explicit in the negative-space observations

### 5. The top-level paper claim needed a small softening

The summary originally said the system differences “match” instruction-language character.

Problem:

- `match` is slightly stronger than the current evidence warrants

Fix:

- changed `match` to `are consistent with`
- made the same change in the final line for the paper
- kept the broader thesis phrasing as:
  - `within this experiment, the findings support the claim`

## Changes made

### `codex/6th_phase/writeup/negative_space_observations.md`

Changed:

- added a threshold caveat after the CONTROL section
- softened family-pairing language
- clarified that per-system content shares are within the recurring-word table, not the full inverse field

### `codex/7th_phase/writeup/synthesis_lexicon_vs_negative_space.md`

Changed:

- softened `stronger` to `more defensible`
- added threshold wording to the CONTROL synthesis
- softened family-pairing language
- added `within this experiment` to the synthesis support claim

### `codex/8th_phase/writeup/system_signatures_summary.md`

Changed:

- softened `match` to `are consistent with`
- added threshold wording to the CONTROL summary
- softened the top-level CONTROL bullet
- changed the architecture claim to:
  - `within this experiment, the findings support the claim`

## Review outcome

The three documents are now aligned enough to use as the finished codex writeup set for this branch.

The main results remain unchanged:

- anchored systems are more distinctive than CONTROL
- AC15P is the clearest operational system
- HYBRID_3_5 is the clearest bounded and caution-oriented system
- HYBRID_SEMANTIC is the clearest direct and condition-heavy system
- AC15 is real but weaker in the negative-space layer than in the grouped layer

What changed is not the argument, but its precision:

- cleaner threshold language
- clearer scale language
- less risk of overstating convergence
- better fit between the claims and the actual evidence
