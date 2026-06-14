# Negative Space Layer — Observations from Cleaned Recurring Words

## What was done

This document reports the cleaned negative space layer. The input was the recurring-word table built from the unclassified bucket:

- `claude/04_unclassified/cross_scenario_patterns/system_recurring_words.csv`

These recurring words come only from phrases that:
- survived the inverse n-gram structural filter
- were not caught by the expression-type lexicon
- recurred in `3+` scenarios for the same system
- had `count >= 8` in that system

The recurring-word table was then passed through the word-bands cleanup in:

- `negative_space_word_bands.md`

This produced four outputs:

- `system_recurring_words_with_band.csv`
- `system_recurring_words_content.csv`
- `system_recurring_words_borderline.csv`
- `system_recurring_words_residue.csv`

This document uses only the cleaned `content_signature` table. Borderline and residue stay available for audit, but are not used here as evidence.

## 1. Why this layer matters

The grouped phase classified only part of the filtered inverse field. A large remainder stayed unclassified. That remainder is not mostly scenario spillover.

From the unclassified overview:

- total unclassified phrases: `5,214`
- fully scenario phrases: `74`
- partly scenario phrases: `1,670`
- no scenario terms: `3,470`

So the negative space layer is not just leftover case vocabulary. Most of it contains no scenario terms at all.

## 2. Hygiene split

The cleaned recurring-word table contains `53` stable recurring words across systems.

After the band split:

| Band | Rows | Sum count | Row share | Sum share |
|---|---:|---:|---:|---:|
| content_signature | 15 | 221 | 28% | 29% |
| borderline | 27 | 401 | 51% | 52% |
| function_residue | 11 | 143 | 21% | 19% |

This is a usable split.

- The content table is no longer trivial.
- The borderline table is still larger, which is expected.
- The residue table is now small enough to keep out of interpretation.

The point of this step is not to force every recurring word into signal. The point is to create a small clean set that can support written observation without pretending that all recurrence is meaningful.

## 3. Clean recurring words by system

### AC15

Content-signature words:

- `vs` (`11`)
- `must` (`11`)
- `default` (`8`)

This is a small but usable set. The pattern is contrastive and normative: opposition (`vs`), force (`must`), and fallback/default framing (`default`).

### AC15P

Content-signature words:

- `vs` (`26`)
- `after` (`20`)
- `within` (`19`)
- `because` (`9`)

This is the clearest codified signature in the cleaned table. The pattern is sequential, bounded, and causal:

- `after`
- `within`
- `because`
- plus strong oppositional framing through `vs`

### CONTROL

Content-signature words:

- none

This is a result, not a failure. CONTROL still has recurring words, but after cleanup they remain in `borderline` or `function_residue`, not in the clean content-signature set.

So in this layer, CONTROL does not show a distinctive recurring vocabulary fingerprint. Its recurring words are more generic than those of the anchored systems.
This should be read carefully: it means no clean content-signature words survive **under the current thresholds and bands**, not that CONTROL has no language pattern at all.

### HYBRID_3_5

Content-signature words:

- `without` (`22`)
- `scope` (`11`)
- `explicit` (`8`)

This is a strong boundedness signature:

- exclusion (`without`)
- scoping (`scope`)
- direct marking (`explicit`)

The set is small but coherent. It describes a system that keeps language inside explicit bounds and keeps exclusions visible.

### HYBRID_SEMANTIC

Content-signature words:

- `now` (`20`)
- `default` (`17`)
- `under` (`15`)
- `without` (`12`)
- `must` (`12`)

This is the largest cleaned signature set. The pattern is present-state and condition-heavy:

- `now`
- `under`
- `must`
- `without`
- `default`

This gives HYBRID_SEMANTIC the strongest negative-space signature after cleanup.

## 4. Cross-system patterns

Some words are useful partly because of their pairing:

- `vs` appears only in the two codified systems:
  - `AC15`
  - `AC15P`
- `without` appears only in the two hybrid systems:
  - `HYBRID_3_5`
  - `HYBRID_SEMANTIC`
- `must` appears in:
  - `AC15`
  - `HYBRID_SEMANTIC`
- `default` appears in:
  - `AC15`
  - `HYBRID_SEMANTIC`

These are small but interpretable overlaps. Some of the systems also cluster by family in the negative space layer.

The clearest family pairings are:

- codified systems: `vs`
- hybrid systems: `without`

## 5. Per-system balance

Within each system's recurring-word table, the content-signature share is:

| System | Content rows | Content sum share |
|---|---:|---:|
| AC15 | 3 | 17% |
| AC15P | 4 | 29% |
| CONTROL | 0 | 0% |
| HYBRID_3_5 | 3 | 30% |
| HYBRID_SEMANTIC | 5 | 47% |

Two things stand out:

1. `HYBRID_SEMANTIC` has the strongest cleaned negative-space signature.
2. `CONTROL` has none at this level.

So the negative space layer does not just recover extra words. It separates systems by how much distinctive recurring vocabulary survives cleanup.
This comparison is only inside the recurring-word table, not inside the full inverse field.

## 6. What this layer supports

This layer supports these claims:

- the unclassified field contains real recurring system signatures
- those signatures are not mostly scenario echoes
- anchored systems retain clearer recurring content words than CONTROL
- the systems differ not only by grouped expression types, but also by their leftover vocabulary fingerprints
- some pairings line up by family, especially:
  - codified systems through `vs`
  - hybrid systems through `without`

## 7. What this layer does not support

This layer does not support these claims:

- that these words are language acts
- that this is independent confirmation in a statistical sense
- that every recurring word in the unclassified field is meaningful
- that borderline words are irrelevant

This is still a reading of the same filtered inverse field used in the grouped phase. It is a second procedure, not a second sample.

## 8. Main observation

The grouped phase showed system differences through expression types. The negative space layer shows that even where the lexicon does not classify the phrases, the systems still leave recurring vocabulary fingerprints.

The strongest clean findings after hygiene are:

- `AC15P`: `after / within / because / vs`
- `HYBRID_3_5`: `without / scope / explicit`
- `HYBRID_SEMANTIC`: `now / under / must / without / default`
- `AC15`: `vs / must / default`
- `CONTROL`: no cleaned content-signature words

That is enough to justify the next step: a synthesis document that reads the grouped phase and the negative space layer side by side.
