# Negative Space Word Bands

## Purpose

This file defines the three bands used to classify recurring words found in the negative space layer (the unclassified bucket from the lexicon-grouped phase). It is a reference vocabulary, parallel to:

- `expression_type_lexicon_v3.md` (for the lexicon-grouped phase)
- `inverse_filtering_constraint_lexicon.md` (for constraint annotation)
- `scenario_specific_lexicon.md` (for scenario subtraction)

## How it is used

When `claude/04_unclassified/cross_scenario_patterns/system_recurring_words.csv` is processed:

1. Each word is matched against these three lists
2. A new `band` column is added with values `content_signature`, `borderline`, or `function_residue`
3. Four output files are produced:
   - `system_recurring_words_with_band.csv` — full audit trail
   - `system_recurring_words_content.csv` — content_signature rows only (clean interpretation table)
   - `system_recurring_words_borderline.csv` — borderline rows only (review-only)
   - `system_recurring_words_residue.csv` — function_residue rows only (audit-only)

Interpretation uses only the content table. Borderline is consulted case-by-case.

## Default rule for unlisted words

**Any recurring word that is not in any of the three lists is assigned to `borderline` by default.** It does not silently fall into `content_signature`. An unreviewed word is never treated as signal until a human looks at it. Borderline is the safe holding place — preserves the word, marks it as needing review, keeps it out of interpretation.

If after a hygiene run the borderline bucket is large, this file should be expanded (adding clearly-signature words to content_signature and clearly-residue words to function_residue) and the cleanup re-run.

## Cross-layer consistency note

A word can be excluded from the expression-type lexicon (because it doesn't reliably perform a language act at n-gram level) and still be included here in content_signature (because it functions as a vocabulary fingerprint for a specific system). Example: `judgment` was removed from the `truth` group in the expression lexicon, but it is in content_signature here. The two layers measure different things — language acts vs vocabulary signatures — and use different inclusion rules. This is consistent.

## Provenance note for de-duplicated words

The lists below are used as flat membership checks. Because of that, a word only needs to appear once in a band to function correctly. Some words were intentionally de-duplicated even though they conceptually belong to more than one sub-list.

Current examples:

- `two` fits both numerals and generic counters
- `any` fits both quantifier logic and generic broadening language
- `each` fits both counters and distribution language
- `overrides` functions both as a `HYBRID_SEMANTIC` signature and as a broader content-signature seed

In those cases, the word is listed once for matching, and this note preserves the fact that it has more than one conceptual source.

---

## Band 1: function_residue (hard deny)

Words that are clearly background. These are common English function words, generic verbs, generic adverbs, and pronouns that recur in any text regardless of system identity. Marking them as residue keeps them in the audit trail without polluting interpretation.

### Pronouns

```
i
you
he
she
we
they
him
her
them
us
my
your
his
our
their
me
```

### Generic discourse markers

```
just
like
maybe
sure
yes
```

### Question / wh-words

```
how
why
where
when
what
```

### Generic verbs (do/be/make/take/get/go family)

```
get
got
gets
getting
take
took
taken
taking
make
made
makes
making
do
did
does
doing
done
go
goes
gone
going
have
has
had
having
be
been
being
am
was
were
say
said
saying
says
see
saw
seen
seeing
know
knew
known
knowing
think
thought
thinking
```

### Quantifiers

```
some
any
more
most
other
another
many
several
few
much
```

### Generic intensifiers / adverbs

```
also
even
still
only
very
much
rather
quite
really
actually
basically
essentially
literally
```

### Spatial / pointing words

```
back
here
there
again
that
this
these
those
```

### Common contractions / fragments

```
re
ve
ll
d
m
ain
t
s
```

---

## Band 2: borderline (default for unlisted words)

Words where context matters. They could be signal or could be residue depending on the cluster they appear in. Held out of interpretation by default but available for case-by-case promotion to content_signature.

**Default rule:** any recurring word not in `function_residue` and not in `content_signature` lands here automatically.

### Initial seed (already known to be borderline from review)

#### Negation and limit-adjacent

```
no
not
should
need
needs
needed
```

Promoted to content_signature: `without`, `must` (cross-system signatures)

#### Temporal generics

```
time
times
before
during
until
since
while
already
later
sooner
soon
day
days
week
weeks
month
months
year
years
date
dates
end
beginning
start
```

Promoted to content_signature: `after` (AC15P), `within` (AC15P)

#### Numerals and counters

```
one
two
three
four
five
both
each
single
double
half
all
every
either
neither
```

#### Generic process / state nouns

```
mode
modes
way
ways
thing
things
point
points
state
states
case
cases
fact
issue
matter
matters
problem
problems
work
working
worked
works
model
models
type
types
kind
kinds
line
lines
form
forms
```

#### Generic operational nouns

```
sign
mark
brief
project
service
services
system
systems
process
processes
step
steps
result
results
outcome
outcomes
input
output
data
detail
details
plan
plans
```

#### Other borderline

```
high
low
big
small
short
long
new
old
right
wrong
true
false
real
simple
hard
easy
clear
heavy
light
strong
weak
```

---

## Band 3: content_signature

Words that look like genuine system fingerprints — distinctive vocabulary that carries character even in isolation. These are the words used directly in interpretation.

### From the existing recurring-words table (per-system seeds)

#### CONTROL distinctive vocabulary

```
unconditional
eligibility
procure
interoperability
separation
```

#### AC15 distinctive vocabulary

```
definition
commissioning
records
legal
judgment
advice
certified
reputational
stabilization
containment
equivalents
```

#### AC15P distinctive vocabulary

```
postmortems
issues
approve
loans
readiness
substitutes
mutually
avoidance
forks
after
within
because
```

#### HYBRID_3_5 distinctive vocabulary

```
spine
panel
version
sample
proximity
licensed
attend
delivering
stalling
scope
explicit
```

#### HYBRID_SEMANTIC distinctive vocabulary

```
default
integrity
overrides
remedies
aborts
caregiver
ticket
tickets
hopes
certainly
now
under
```

### Cross-system content signatures (used by 2 systems, pairing itself is meaningful)

```
vs
without
must
```

### Generic content_signature seeds (cross-system distinctive vocabulary)

```
exclusions
acceptance
override
sanitize
canonical
provenance
attribution
```

---

## Sub-category inside content_signature: technical_artifact_signature

A few content_signature words are technical/artifact tokens rather than ordinary content words. They suggest the system is producing structured/coded output (variable names, hash references, annotation tokens) rather than just distinctive natural-language vocabulary.

These are still real signal — they are part of a system's distinctive output — but they should be flagged when written up so the reader knows they come from structured output, not from natural-language word choice.

### Initial seeds

```
p_event_total
p_hi
sha
sha_256
md5
arr
de
emi
rev
evp
```

When the hygiene cleanup script runs, words in this sub-list should get the band `content_signature` AND a secondary tag `technical_artifact`.

---

## Maintenance

After the first hygiene run, review:

1. **Borderline bucket size** — if it is large (more than ~30% of recurring words), expand the explicit lists to push clear cases out of borderline
2. **Content table readability** — if the content table has obvious residue words leaking through, add them to function_residue
3. **Function residue bucket** — confirm nothing there is actually a real signal

The bands file is meant to evolve. The goal is a stable content table that an interpretation can rest on, not a perfectly-classified vocabulary.

## Open questions

1. **`no` and `must` placement.** Currently in borderline. They appear in cluster contexts (HYBSEM "default/must/now/under", AC15P heavy "no" usage) where they may carry signal. Whether to promote them to content_signature based on per-system clustering is a judgment call after the first cleanup.
2. **Numerals (`one`, `two`, `three`).** Currently borderline. Likely most are residue but `single`/`double` could be signal in some contexts.
3. **`time`.** Currently borderline. Used heavily by all systems but with different per-system frequencies. Borderline is the safe call but it might deserve content if per-system distribution is sharply skewed.

These can be settled after seeing the first cleanup output.
