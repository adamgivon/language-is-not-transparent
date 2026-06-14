# Two-Systems Summary With Proportions

## What this summary does

This note rewrites the exact 2-system and exact 3-system sharing branch with denominator framing.

It uses the recomputed exact-sharing mass tables in this phase, not only the older type-count tables.

That matters because raw phrase counts alone make the pairwise field look larger and sharper than it is in actual token mass.

This branch does not compete with the main inverse result:
- the systems are still overwhelmingly separated in the phrase field
- exact 2-system and 3-system sharing remain small support spaces
- their value is only to show mild proximity structure after the main separation has already been established

## Scale first

The exact 2-system shared field is visible, but it is still small.

By phrase-type share, it occupies:

- about `11%` to `13%` of bigram types
- about `4.5%` to `6.4%` of trigram types
- about `1.7%` to `3.2%` of quadgram types

By combined token mass, it is smaller:

- bigrams: about `3.5%` to `4.3%` of the combined pair output
- trigrams: about `2.5%` to `2.8%`
- quadgrams: about `1.2%` to `1.35%`

The exact 3-system field is smaller again in token mass:

- trigrams: about `0.68%` to `0.80%` of combined triple output
- quadgrams: about `0.21%` to `0.35%`

So the pairwise and triple fields are real, but they remain minor slices of total output.

## What the pairwise field still shows

The pairwise field still maps proximity. But once denominator framing is added, the differences between pairs are narrower than the older raw tables made them appear.

Examples:

- exact trigram token mass:
  - `AC15|HYBRID_SEMANTIC`: `2.7925%`
  - `HYBRID_3_5|HYBRID_SEMANTIC`: `2.7775%`
  - `AC15|AC15P`: `2.6743%`
  - `CONTROL|HYBRID_3_5`: `2.6290%`
  - `CONTROL|HYBRID_SEMANTIC`: `2.5576%`
  - `CONTROL|AC15`: `2.4810%`
  - `CONTROL|AC15P`: `2.4654%`

- exact quadgram token mass:
  - `HYBRID_3_5|HYBRID_SEMANTIC`: `1.3534%`
  - `AC15|HYBRID_3_5`: `1.3405%`
  - `CONTROL|HYBRID_SEMANTIC`: `1.3305%`
  - `AC15|HYBRID_SEMANTIC`: `1.3095%`
  - `AC15|AC15P`: `1.2368%`
  - `CONTROL|AC15P`: `1.2066%`

These spreads are real, but modest.

## What this changes in interpretation

The two-systems field should still be read as a proximity map.

But it should not be read as if:

- one pair has a massive exclusive shared core
- zero vs nonzero differences automatically define a deep architectural divide
- pairwise sharing competes with the inverse field as the main evidence base

The proportion-aware read is narrower:

- some pairs are slightly closer than others
- those closeness differences are stable enough to be worth noting
- but they remain small in token mass

## What the triple field still shows

The exact 3-system field is even smaller.

Its token mass is usually under `1%` at trigrams and well under `0.5%` at quadgrams.

That makes it useful only for light structural observations, not for strong substantive claims.

## Best use of this branch

The two-systems and three-systems branch is best used as:

- a support layer on proximity
- a way to show that the systems do not separate into totally isolated vocabularies
- a way to see whether architecture leaves a light shared trace across some pairs

It is not strong enough to define the systems.

## Bottom line

The exact 2-system and 3-system sharing fields are real, but small in mass. They are useful for showing mild proximity structure between systems and families, but they should remain a secondary support layer beneath the inverse-field and `CONTROL` analyses.
