# Agreed Filtering Lists

## Purpose

This file is the **single shared source** for the structural filtering lists used in the inverse n-gram pipeline. Any implementation (codex, claude, or other) should read these lists from here so the outputs match.

If a list needs to change, update this file first, then propagate.

---

## STOPWORDS

Used for `content_token_count` computation. A token is a content word if it is **not** in this list.

```
a
an
and
are
as
at
be
but
by
can
do
don
for
from
if
in
into
is
it
its
me
not
of
on
only
or
s
so
t
that
the
their
them
there
this
to
us
we
what
when
which
who
why
with
would
you
your
re
ve
```

**Count: 49 words.**

### What is intentionally NOT in the stopwords

- First and third person pronouns `i`, `he`, `she`, `they`, `him`, `her`, `his`, `my`, `our` (kept as content — they carry stance signal). Note: `you`, `your`, `we`, `us`, `me`, `them`, `their` ARE in the stopword list — this is asymmetric, inherited from the codex baseline. The asymmetry is preserved for compatibility.
- Modals like `will`, `may`, `might`, `should`, `could`, `have`, `has`, `had` (kept as content)
- Demonstratives `those`, `these` (kept as content)
- Subordinators `before`, `after`, `during`, `through`, `while`, `because`, `until` (kept as content)
- Question words `how`, `where` (kept as content)
- Quantifiers `all`, `any`, `each`, `few`, `more`, `most`, `some` (kept as content)
- Negation contractions `doesn`, `didn`, `couldn`, `wouldn`, `shouldn`, `isn`, `aren` (kept as content — `don` is included only because of the very common "don t" split)

The principle: when in doubt, **keep as content**. Modal verbs, pronouns, and demonstratives carry exactly the kind of small framing differences that governance shapes. Removing them would erase signal.

---

## SCAFFOLD_PREFIXES

Drop n-grams whose lowercased text **starts with** any of these prefixes.

```
if you
you can
i can
you tell
if i
it s
this is
in the
as a
with the
on the
for the
and the
you don
only if
what to
```

**Count: 16 prefixes.**

### What is intentionally NOT in the scaffold list

Conversational starters like `let me`, `i think`, `i would`, `i ll`, `you might`, `you may`, `there is/are`, `it is`, `that is`, `we can`, `we should`, `you should`, `i m`, `you re`, `they can/are/re`, `it would`, `that s`, `what is/are`, `here is/are` are **NOT** in this list.

Reason: these phrases can carry genuine system stance signal (a system that always begins with "i think" before opinions has a fingerprint). Cutting them would erase that signal.

---

## Other agreed parameters

### Count thresholds (for core_filter)

- Trigrams: `count >= 2`
- Quadgrams: `count >= 2`

History note: trigrams were initially set to `count >= 3` to keep the set tight. After review of the count=2 trigram material, many meaningful governance-relevant phrases were found at count=2 (e.g., "long term dependency", "supply chain fragility", "concrete critical path", "to preserve leverage"). The threshold was lowered to `count >= 2` to capture these. Scenario filtering as a hard core_filter rule was tested and rejected — it removed only ~20% of volume while risking the loss of mixed phrases that carry governance signal alongside scenario vocabulary. The scenario lexicon remains as soft annotation only.

### Content token floor

- All levels: `content_token_count >= 2`

### High-count threshold (for high_count_no_hit_review bucket)

- Trigrams: `count >= 3`
- Quadgrams: `count >= 3`

### Scenario heavy threshold

- `scenario_token_ratio >= 0.75` (computed on **content words only**, function words excluded from both numerator and denominator)

---

## Core filter rule

A row passes core_filter if **all** are true:

- it is inverse (only one system uses it)
- it is a trigram or quadgram
- `count >= min_count` for the level
- `content_token_count >= 2`
- `not starts_with_scaffold_prefix`
- `not is_pure_glue` (effectively enforced by `content_token_count >= 2`, which already requires at least two content words)

---

## Maintenance

When adding or removing items from these lists:

1. Update this file
2. Note the reason in commit/edit message
3. Re-run filtering for affected scenarios
4. Update both codex and claude pipelines to read from here

The lists are intentionally lean. Expand only when there is strong evidence that an item is dragging through systematic noise.
