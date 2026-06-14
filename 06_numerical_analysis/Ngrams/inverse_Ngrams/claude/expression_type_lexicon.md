# Expression Type Lexicon

## Purpose

This lexicon groups inverse n-gram phrases by **what kind of language act they perform**, not by what topic they reference. It is the main grouping layer for phase 3.

A phrase can carry multiple expression types simultaneously — "may want to verify" is hedging + verification + practical_action. Classification is multi-label.

## How it relates to the constraint lexicon

The constraint lexicon (truth/practicality/temporal/imagination) maps phrases to which **anchor** they are adjacent to. The expression lexicon maps phrases to which **language act** they perform. A phrase can be constraint-relevant without performing a clear language act, and vice versa. The two layers are orthogonal.

## How it should be used

- Apply to `core_filtered/` rows (all of them, both trigrams and quadgrams)
- Each row gets columns for each expression type (multi-label)
- Phrases that hit no expression type go to an `unclassified` group, visible for review
- The grouping is **interpretive** — it suggests where the phrase belongs, not where it definitively belongs

---

## Expression Type 1: Hedging

Softening, marking uncertainty, qualified statements. Reduces commitment.

### Core terms

```
may
might
could
perhaps
possibly
seems
appears
tend
tends
likely
probably
somewhat
slightly
roughly
arguably
broadly
mostly
largely
mainly
sometimes
often
typically
generally
usually
```

### Multi-word patterns

```
i think
would say
would suggest
may want
might consider
might want
could be
seems to
appears to
tends to
in some
for some
kind of
sort of
in a way
to a degree
to some extent
```

---

## Expression Type 2: Confrontation

Direct opposition, calling out, refusing to soften. Increases commitment to a hard position.

### Core terms

```
must
cannot
won
mustn
wrong
mistake
mistaken
incorrect
unacceptable
false
denial
denying
refuse
refusing
ignoring
overlooking
```

### Multi-word patterns

```
the truth is
the fact is
the reality is
the problem is
the issue is
the danger is
not true
not the case
not enough
not sufficient
no doubt
no question
no way
will not
have to
will need
need to face
hard truth
blunt
plainly
straightforwardly
```

---

## Expression Type 3: Reframing

Alternative perspectives, redirection, "look at it differently."

### Core terms

```
instead
rather
alternatively
differently
otherwise
actually
```

### Multi-word patterns

```
rather than
another way
in fact
in reality
the real
real question
real issue
what matters
matters is
on the other hand
other side
different angle
different lens
look at it
view it
frame it
consider this
think of it
think about it
recast
flip it
reverse
```

---

## Expression Type 4: Smoothing

Covering tension, harmonizing, "both/and" framing. Often a sign of governance erosion when paired with real conflict.

### Core terms

```
harmonize
balance
integrate
reconcile
synthesize
blend
merge
unify
```

### Multi-word patterns

```
both can
we can both
at the same time
work together
common ground
middle ground
both perspectives
both sides
all sides
each side
in harmony
in alignment
not necessarily
doesn t have to be
need not be
no real conflict
no real tension
nothing to worry
just a matter
```

---

## Expression Type 5: Warnings

Risk, caution, alarm, alert language.

### Core terms

```
risk
risks
risky
danger
dangerous
caution
careful
cautious
warning
beware
concerning
concern
worry
worried
alarming
alarm
threat
threatened
threatening
hazard
hazardous
red
flag
flags
flagged
trap
pitfall
```

### Multi-word patterns

```
watch out
be careful
be aware
be mindful
look out
heads up
red flag
warning sign
warning signs
worth noting
worth flagging
should worry
should concern
keep in mind
do not assume
not safe
unsafe
high risk
serious risk
real risk
```

---

## Expression Type 6: Conditions

Conditional framing, contingencies, "if/then" structure.

### Core terms

```
unless
provided
contingent
depends
depending
contingent
```

### Multi-word patterns

```
as long as
only if
only when
in case
in the event
if and only if
on condition
condition for
conditional on
depends on
depending on
provided that
assuming that
subject to
given that
in which case
```

Note: bare "if" appears in many trigrams but is also a scaffold prefix. Look for "if" in mid-position (not start of n-gram).

---

## Expression Type 7: Limits

Bounded scope, restrictions, "this far and no further."

### Core terms

```
limit
limits
limited
limitation
limitations
boundary
boundaries
bounded
restrict
restriction
restricted
constrain
constrained
constraint
constraints
narrow
narrower
narrowing
beyond
outside
scope
extent
threshold
ceiling
floor
cap
capped
maximum
minimum
```

### Multi-word patterns

```
beyond the
outside the
within the
no further
no more than
at most
at least
not beyond
not outside
within scope
out of scope
out of bounds
inside the
under the
above the
below the
```

---

## Expression Type 8: Autonomy / Sovereignty

User-decides language, deference to user judgment.

### Core terms

```
decide
deciding
decision
choose
chooses
choosing
choice
discretion
prerogative
authority
```

### Multi-word patterns

```
you decide
you decide what
your decision
your choice
your call
your judgment
your discretion
your authority
up to you
up to the
your priority
your priorities
what you want
what you think
what you prefer
you tell me
you tell us
you set
you define
you determine
your job
your role
not for me
not my place
your terms
on your terms
```

---

## Expression Type 9: Verification / Checking

Collaborative validation, fact-checking, confirmation language.

### Core terms

```
verify
verified
verification
verifiable
check
checks
checked
checking
confirm
confirmed
confirming
confirmation
validate
validated
validation
test
tests
testing
tested
audit
audited
inspect
inspection
review
reviewed
examine
examined
recheck
double
```

### Multi-word patterns

```
make sure
ensure
ensuring
double check
double-check
sanity check
gut check
look into
dig into
find out
get clarity
get confirmation
clear up
clarify
clarified
nail down
pin down
sound out
fact check
cross check
cross reference
worth checking
worth verifying
need to verify
need to check
```

---

## Expression Type 10: Practical Action

Execution, building, doing language.

### Core terms

```
implement
implementing
implementation
build
building
built
create
creating
created
deploy
deployed
deploying
execute
executing
execution
launch
launching
launched
ship
shipping
shipped
roll
rollout
rolling
start
starting
started
plan
planning
planned
prepare
prepared
preparing
```

### Multi-word patterns

```
take action
act on
move forward
move ahead
go ahead
next step
first step
last step
concrete action
concrete step
concrete steps
plan to
ready to
prepared to
in motion
underway
follow through
carry out
put in place
get going
do this
do that
make it happen
```

---

## Unclassified

Phrases that hit no expression type are kept in an `unclassified` group. The unclassified set should be reviewed to:

- Find missed patterns that should be added to existing groups
- Find new expression types worth adding
- Identify phrases that are simply scenario furniture or fragments

The size of the unclassified group is itself a quality signal: if more than ~50% of core_filtered ends up unclassified, the lexicon is too narrow.

---

## Matching rules

- Single-word terms: whole-word match
- Multi-word patterns: contiguous substring match
- For "if": only count as condition if it appears in mid-position (not start of n-gram), since starting "if" is a scaffold prefix already filtered

## Scoring

Each phrase gets:
- `expression_types`: pipe-separated list of expression types matched
- `expression_type_count`: number of distinct types matched
- `matched_expression_terms`: pipe-separated list of specific terms matched

A phrase is `unclassified` if `expression_type_count == 0`.

## Maintenance

This lexicon is meant to evolve. After running the first grouping pass, review the unclassified bucket and the most common missed patterns, then add or refine terms.
