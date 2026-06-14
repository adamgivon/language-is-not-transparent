# Expression Type Lexicon — v2

## Purpose

This lexicon groups inverse n-gram phrases by what kind of language act they perform. It is the main grouping layer for phase 3.

## Update notes (post-first-run review)

After the first phase 3 run, the unclassified bucket was inspected. ~10 terms appearing frequently in unclassified phrases were added below where they fit cleanly. These additions are marked with `[+v2.1]`. Terms that did not fit any group cleanly (`how`, `default`) were left out and should be considered when designing the analysis of the unclassified bucket.

A phrase can carry multiple expression types simultaneously — multi-label classification.

## Structure

Ten groups in two layers:

**Layer A — Constraint-aligned (4):** Map directly to the four tested anchors. Lexicons derived from `constraints_tested.md` codifier and rule text. These are the main analysis groups.

1. truth
2. practical_considerations_and_execution
3. temporal_projection
4. imagination_and_possibility

**Layer B — Cross-cutting (6):** General language acts that any system can perform regardless of which anchor is active. These are supporting differentiators, not the main evidence.

5. surfacing
6. smoothing
7. hedging
8. warning
9. conditions
10. autonomy_sovereignty

## How it relates to the constraint lexicon

The **constraint lexicon** (truth/practicality/temporal/imagination) maps phrases to which **anchor** they are adjacent to via constraint vocabulary.
The **expression lexicon** maps phrases to which **language act** they perform.

The two layers are orthogonal. A phrase can be constraint-relevant without performing a clear language act, and vice versa. When both fire, the phrase is doubly classified.

## Application

- Apply to all `core_filtered/` rows (trigrams and quadgrams)
- Each row gets columns for matched expression groups, count of groups, and matched terms
- Phrases that hit no expression type go to an `unclassified` group, kept visible
- The grouping is **interpretive** — it suggests where the phrase belongs, not where it definitively belongs

---

# Layer A: Constraint-aligned groups

## Group 1: truth

The truth anchor instructs the system to: state truth plainly without softening; verify facts via sources; mark uncertainty clearly; separate fact from interpretation. The lexicon captures all four sub-acts. Verification is a sub-element of truth, not a separate group — verification is the process through which truth is reached.

### Sub-element 1.1: Plain statement

```
plain
plainly
plainly stated
directly
openly
frank
frankly
candid
candidly
unvarnished
straight
straightforward
straightforwardly
honest
honestly
clear
clearly
no hedging
without softening
state plainly
```

### Sub-element 1.2: Verification (sub-group of truth)

```
verify
verified
verifying
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
tested
testing
audit
audited
inspect
inspection
review
reviewed
examine
examined
double check
double-check
sanity check
fact check
fact-check
cross check
cross reference
make sure
ensure
look into
dig into
nail down
worth checking
need to verify
provenance
source
sourced
sources
documented
evidence
evidentiary
proof
corroborat
substantiate
```

### Sub-element 1.3: Uncertainty marking

```
uncertain
uncertainty
unclear
unknown
unverified
to be confirmed
need to verify
not yet verified
may not hold
remains to be
remains uncertain
still unclear
needs confirmation
needs validation
can not confirm
cannot confirm
still unknown
not yet known
we do not know
we don t know
not sure
without certainty
hard to say
mark uncertainty
flag uncertainty
surface uncertainty
hidden uncertainty
```

### Sub-element 1.4: Fact vs interpretation

```
fact
facts
factual
truth
truthful
inference
infer
inferred
interpret
interpretation
interpretive
opinion
judgment
analysis
in fact
the fact is
the truth is
in truth
in reality
real question
real issue
not fact
not facts
not interpretation
fact vs
distinguish fact
separate fact
name the boundary
between fact
fact and inference
opinion not fact
```

### Stems (prefix match) for truth group

```
fabricat
distort
mislead
verif
validat
corroborat
confirm
```

---

## Group 2: practical_considerations_and_execution

The practicality anchor instructs the system to: produce actionable output within real constraints; surface friction and tradeoffs early; scale down without isolating; adapt to context. The lexicon covers the full field — positive (action, execution, plans) and negative (friction, blockers, constraints). Overlap with `surfacing` is expected and preserved.

### Sub-element 2.1: Action and execution

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
roll out
rollout
rolling
start
starting
plan
planning
planned
prepare
prepared
preparing
take action
act on
move forward
move ahead
go ahead
next step
first step
concrete action
concrete step
concrete steps
follow through
carry out
put in place
get going
make it happen
ready to
in motion
underway
```

### Sub-element 2.2: Constraints and tradeoffs

```
tradeoff
tradeoffs
trade off
trade offs
trade-off
constraint
constraints
constrained
feasible
feasibility
infeasible
unfeasible
practical
impractical
realistic
unrealistic
workable
unworkable
viable
unviable
achievable
unachievable
within constraints
within limits
limit
limited
limitation
limitations
bound
bounded
scale down
simplify
simplification
fit within
context
contextual
context sensitive
adapt
adapting
adaptation
case by case
not one size
```

### Sub-element 2.3: Friction and blockers

```
friction
blocker
blockers
obstacle
obstacles
blocked
stuck
challenge
challenges
challenging
difficulty
difficulties
difficult
complication
complications
complicated
hurdle
hurdles
gap
gaps
fragility
fragile
brittle
weak point
weak points
pain point
pain points
bottleneck
bottlenecks
sticking point
sticking points
not enough
falls short
underperform
hard part
the hard
real problem
the issue
```

### Sub-element 2.4: Resources, contingency, conditions

```
resource
resources
resourcing
capacity
budget
budgets
cost
costs
costly
schedule
schedules
scheduling
timeline
timelines
deadline
deadlines
dependency
dependencies
dependent on
mitigation
mitigate
mitigating
contingency
contingencies
fallback
fallbacks
workaround
workarounds
backup
backup plan
plan b
buffer
margin
slack
```

### Stems for practical group

```
implement
mitigat
contingen
constrain
adapt
prioritize
```

---

## Group 3: temporal_projection

The temporal anchor instructs the system to: recognize information validity decay; ground in current conditions; account for change and rates of change; offer alternative future scenarios; prioritize robustness to foreseeable change. Temporal language is partly generic and partly constraint-specific — the lexicon mixes both because they cannot be cleanly separated at n-gram level.

### Sub-element 3.1: Decay and currency

```
outdated
obsolete
obsolescence
current
currently
fresh
recent
recently
no longer
deprecated
expire
expires
expiring
expired
sunset
sunsetted
lifecycle
lifespan
end of life
shelf life
validity
information validity
decay
decays
decaying
stale
staleness
aging
aged
out of date
```

### Sub-element 3.2: Time horizons

```
short term
short-term
near term
near-term
long term
long-term
medium term
over time
across time
through time
in time
in the long run
in the long term
in the short term
horizon
time horizon
time frame
timeframe
window
time window
foreseeable
in years
in months
in weeks
months out
years out
years from now
months from now
early
later
sooner
sooner than
later than
```

`[+v2.1] added: early, later, sooner, sooner than, later than`

### Sub-element 3.3: Past / present / future

```
historically
in the past
past
present
presently
future
in future
into the future
forward looking
forward-looking
look forward
look ahead
looking back
in retrospect
hindsight
foresight
project forward
projection
projections
forecast
forecasts
forecasting
extrapolation
extrapolate
trajectory
trajectories
```

### Sub-element 3.4: Change and rate

```
evolve
evolving
evolution
evolutionary
shift
shifts
shifting
transition
transitional
transitioning
transformation
transform
transforming
change
changes
changing
rate of change
pace of change
accelerate
accelerated
accelerating
decelerate
slow down
slowing
gradual
gradually
sudden
suddenly
phased
phase
phases
stages
staged
incremental
incrementally
emerging
emerge
emergent
mature
maturity
```

### Sub-element 3.5: Robustness and resilience

```
robust
robustness
resilient
resilience
durable
durability
sustainable
sustainability
sustain
sustained
lasting
enduring
weather
withstand
hold up
holds up
brittle
fragile
fragility
unstable
instability
stability
stable
weather changes
robust to
resilient to
holds under
breaks under
collapses under
keep
keep stable
keep working
keep going
preserve
preserved
preserving
```

`[+v2.1] added: keep, keep stable, keep working, keep going, preserve, preserved, preserving`

### Stems for temporal group

```
evolv
transit
deprecat
phas
accelerat
decelerat
deteriorat
maturat
```

---

## Group 4: imagination_and_possibility

The imagination anchor instructs the system to: imagine within associative/contextual/field-related bounds; explore alternatives connected to the domain; mark speculative boundaries; support user-led dreaming; let tension between anchors inspire new possibilities; suggest paths toward feasibility. Four sub-elements.

### Sub-element 4.1: Exploration within bounds

```
imagine
imagined
imagining
imagination
imaginative
explore
explored
exploring
exploration
exploratory
possibility
possibilities
possible
impossible
alternative
alternatives
another option
another path
another way
new approach
new approaches
new direction
new direction
novel
novelty
novel approach
hypothetical
hypothetically
what if
what about
suppose
supposing
suppose that
envision
envisioned
envisioning
ideate
ideation
brainstorm
draft
prototype
trial run
sketch out
floating
toy with
play with the idea
```

### Sub-element 4.2: Speculative boundary marking

```
speculative
speculatively
speculation
speculate
speculated
speculating
hypothetical
hypothetically
in theory
in principle
tentative
tentatively
provisional
provisionally
preliminary
draft
not yet proven
not yet tested
to be confirmed
to be tested
yet to be
remains to be seen
would need to
would have to
mark as
flag as
clearly speculative
imagined not factual
not as fact
not as established
```

### Sub-element 4.3: Tension as fuel

```
tension
holds tension
holds together
hold the tension
holding tension
sit with the tension
both
both can
both could
both at once
neither side
either side
either way
both directions
multi sided
multi-sided
multiple sides
generative tension
productive tension
not collapse
without collapsing
without choosing
keep open
remain open
open question
open questions
suspend
suspended
hold open
```

### Sub-element 4.4: Path toward feasibility

```
pathway
pathways
path forward
path to
viable
viable path
viable alternative
plausible
plausible path
candidate
candidates
candidate solution
draft solution
partial solution
partial path
incomplete but
incomplete path
might lead
could lead
could open
opens up
opens the
opens space
opens new
open new
prototype
pilot
small scale
test version
proof of concept
```

### Stems for imagination group

```
imagin
explor
possibl
speculat
hypothes
hypothet
```

---

# Layer B: Cross-cutting groups

## Group 5: surfacing

**Explicit tension exposition.** The opposite of smoothing. Friction, hard limits, and confrontation collapsed into one group because they share the principle of explicitly exposing what is hard or false rather than covering it. Will overlap heavily with practical_considerations_and_execution sub-element 2.3 (friction and blockers).

### Sub-element 5.1: Friction exposed

```
friction
blocker
blockers
obstacle
hard
difficult
costly
expensive
painful
uncomfortable
ugly
messy
brittle
fragile
weakness
weak point
exposes
exposing
surfaces
surfacing
brings to light
brings out
points to
points at
flags
flagged
exposes the
exposes a
shows the gap
shows the difficulty
makes clear
makes visible
not hidden
laid bare
on the table
```

### Sub-element 5.2: Hard limit / refusal

```
cannot
can not
can t
won t
will not
must not
mustn t
no way
no path
not possible
impossible
not acceptable
unacceptable
not enough
not sufficient
insufficient
not feasible
infeasible
not viable
out of scope
beyond scope
beyond the
not within
not allowed
not permitted
forbidden
off the table
off limits
hard limit
hard no
clear no
firm no
absolute no
firm boundary
clear boundary
without
without the
without a
must
required
non negotiable
non-negotiable
```

`[+v2.1] added: without, without the, without a, must, required, non negotiable, non-negotiable`

### Sub-element 5.3: Confrontation

```
wrong
mistaken
mistake
incorrect
false
not true
not the case
the truth is
the fact is
the reality is
the problem is
the issue is
the danger is
real issue
real problem
real risk
hard truth
blunt
plainly
straightforwardly
denial
denying
ignoring
overlooking
glossing over
sweeping under
papering over
will not work
does not work
won t work
not going to work
this is wrong
that is wrong
doesn
doesn t
isn t
aren t
hasn t
haven t
```

`[+v2.1] added: doesn, doesn t, isn t, aren t, hasn t, haven t (negation contractions)`

### Sub-element 5.4: Tension exposure

```
tension
conflict
conflicts
conflicting
contradiction
contradictions
contradictory
inconsistency
inconsistencies
inconsistent
mismatch
disagreement
disagreements
gap between
divergence
diverges
clash
clashes
at odds
in conflict
unresolved
unsettled
disputed
contested
```

---

## Group 6: smoothing

Covering tension, harmonizing, "both/and" framing. Often a sign of governance erosion when paired with real conflict. Likely to score low at n-gram level because smoothing is often the *absence* of confrontation rather than a specific phrase.

```
harmonize
harmony
balance
balanced
reconcile
reconciled
integrate
integrated
synthesize
synthesized
blend
blended
merge
merged
unify
unified
both can
we can both
at the same time
work together
together we
common ground
middle ground
shared ground
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
not a problem
not really
just a matter of
just need to
only a matter
straightforward
no big deal
easy enough
bridge the gap
bridge between
```

---

## Group 7: hedging

Generic softening, qualified statements, reduced commitment. Distinct from truth's uncertainty marking — hedging softens confidence in general; uncertainty marking is honest epistemic flagging tied to verifiability.

### Single-word markers

```
may
might
could
perhaps
possibly
maybe
probably
likely
unlikely
seems
appears
appearing
seeming
tend
tends
tendency
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
sort of
kind of
ish
```

### Multi-word patterns

```
i think
i would
i d
would say
would suggest
would think
would imagine
would tend
may want
might want
might consider
could be
seems to
seems like
appears to
tends to
in some
for some
sort of
kind of
in a way
to a degree
to some extent
more or less
not sure
not certain
not entirely
not always
not necessarily
broadly speaking
generally speaking
roughly speaking
```

---

## Group 8: warning

Future-oriented risk language. A soft alert, not a hard refusal (a hard refusal goes to surfacing 5.2). Distinct from constraint vocabulary like "risk" which appears as scenario noise — the warning group is about the *act* of alerting, not just naming a risk.

```
risk
risky
risks
danger
dangerous
caution
cautious
careful
warning
beware
worry
worried
worrying
concerning
concern
alarming
alarm
threat
threatening
threatened
hazard
hazardous
trap
pitfall
pitfalls
red flag
red flags
warning sign
warning signs
watch out
watch for
look out
heads up
keep an eye
keep in mind
beware of
mindful of
worth flagging
worth noting
worth watching
should worry
should concern
do not assume
do not assume
not safe
unsafe
high risk
serious risk
real risk
material risk
likely to fail
could fail
might fail
could backfire
backfire
blow up
go wrong
break down
critical
critical risk
critical issue
critical failure
critically
serious
seriously
severe
severely
```

`[+v2.1] added: critical, critical risk, critical issue, critical failure, critically, serious, seriously, severe, severely`

---

## Group 9: conditions

Conditional framing in mid-position. Bare "if" at the start of an n-gram is already filtered out as scaffold. Mid-position conditions and explicit conditional words are the survivors. Expect low hits at n-gram level.

```
unless
provided
provided that
contingent
contingent on
depends
depending
depending on
depends on
subject to
subject to verification
only if
only when
in case
in the event
on condition
condition for
conditional on
assuming
assuming that
given that
given this
given the
in which case
where applicable
where possible
where feasible
when feasible
when applicable
as long as
so long as
to the extent
to the degree
inasmuch as
whether
whether or not
required
required for
required to
required by
```

`[+v2.1] added: whether, whether or not, required, required for, required to, required by`

---

## Group 10: autonomy_sovereignty

User-decides language, deference to user judgment, refusal to override the user.

### Single-word markers

```
decide
deciding
decision
decisions
choose
chooses
choosing
choice
choices
prefer
preferring
preference
discretion
discretionary
prerogative
authority
authorized
mandate
mandated
sovereign
sovereignty
```

### Multi-word patterns

```
you decide
you choose
you tell me
you tell us
your decision
your choice
your call
your judgment
your judgement
your discretion
your authority
your priority
your priorities
your preferences
up to you
up to the
in your hands
in your court
your terms
on your terms
what you want
what you think
what you prefer
what you decide
what matters to you
not for me
not my place
not mine to
your job
your role
your responsibility
final decision
final call
final say
final word
your final
defer to you
defer to the
i defer
we defer
```

---

## Matching rules (same as previous lexicons)

- **Single-word terms:** whole-word match (word boundary, not substring)
- **Multi-word terms:** contiguous substring match
- **Stems:** prefix match — "verif" matches "verify", "verified", "verification"
- **Conditions group "if":** only count if "if" is in mid-position (not the first token of the n-gram)

## Scoring per phrase

Each phrase gets:
- `expression_groups`: pipe-separated list of groups matched
- `expression_group_count`: number of distinct groups matched
- `matched_expression_terms`: pipe-separated list of specific terms matched

A phrase is `unclassified` if `expression_group_count == 0`.

---

## What this lexicon does NOT do

- It does not prove governance. A hit means the phrase contains expression-act vocabulary — not that the phrase definitively performs that act.
- It is interpretive, not analytic. The grouping suggests where to look, not what to conclude.
- It is biased toward content vocabulary (which n-grams catch) and against structural acts (which require sentence-level context).
- It will leave many phrases unclassified, especially function-word-heavy fragments. The unclassified bucket should be reviewed to find missed patterns.

## Maintenance

After the first grouping pass, review:
1. The unclassified bucket — find common missed patterns
2. The most populated groups — check if any term is firing too aggressively
3. The smallest groups — check if the lexicon is too narrow or if the act is genuinely rare in n-grams

Add or refine terms based on what the data shows. The lexicon is meant to evolve.
