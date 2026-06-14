# Constraint Lexicon — Annotation Layer (Not a Filter Gate)

## Role

This lexicon is **not** a filter. It is an **annotation layer**.

The models were not instructed to use the vocabulary in the constraint definitions. They were instructed through natural language codifiers and rules — and produced responses in their own language, not in the lexicon's language. Therefore:

- A lexicon hit does not prove constraint relevance.
- A lexicon miss does not prove constraint irrelevance.
- The lexicon catches cases where the model happens to echo instruction-adjacent vocabulary. This will happen sometimes, but it is not the expected or primary case.

The constraint relevance of an inverse n-gram is determined in the **grouping phase** (step 5), through semantic judgment about what kind of language act the phrase performs — not through keyword matching.

## How it fits in the workflow

1. **core_filtered** — the main filtered set. Purely structural: count thresholds, content word ratios, scaffold removal. This is the gate. The lexicon plays no role here.

2. **Lexicon annotation** — applied to core_filtered as metadata columns. Each row gets:
   - `matched_constraints`: which of the four constraints had at least one term match (if any)
   - `constraint_hit_count`: total number of distinct terms matched across all constraints
   - `matched_lexicon_terms`: the specific terms that matched (for review reference)

   These columns are **review aids**, not ranking features. They may help scanning and grouping during manual review, but they should not be used on their own to rank interpretive importance or to determine which phrases matter more.

3. **Grouping phase** — the filtered phrases are grouped by expression type (hedging, warning, exploring, limiting, etc.). The connection to the four constraints comes from reading the groups semantically. The lexicon annotations are one signal among others — useful when present, not required.

## Why keep the lexicon at all

- When a model does use vocabulary close to the instruction language, it is a signal worth noting.
- The annotations help during manual review: scanning a list of 2,000 filtered phrases is easier if some are already flagged as "contains truth-adjacent vocabulary."
- Cross-system comparison: if AC15 produces more lexicon-hitting phrases than HYBSEM for the same constraint, that could reflect AC15's prose codifiers being closer to natural output language than HYBSEM's semantic fields.

But these are secondary observations, not the main analysis.

---

## Constraint 1: truth_and_fact

### Core terms (direct truth/fact vocabulary)

```
truth
fact
factual
false
falsehood
lie
honest
honesty
verify
verified
verification
verifiable
accurate
accuracy
inaccurate
evidence
evidentiary
proof
proven
unproven
source
sourced
provenance
correction
correct
incorrect
distortion
distort
fabricat
mislead
misleading
uncertain
uncertainty
speculative
speculation
assumption
assume
hedge
hedging
soften
softening
transparent
transparency
interpret
interpretation
inference
claim
claims
corroborat
```

### Supporting terms (may match non-truth contexts — weak annotation only)

```
confirm
confirmed
empirical
reliable
unreliable
omission
omit
credible
credibility
contradict
contradiction
inconsistent
inconsistency
substantiate
unsubstantiated
unfounded
groundless
objective
subjective
```

### High-noise supporting terms (annotate but expect frequent false positives)

```
data
bias
biased
```

---

## Constraint 2: practicality_and_feasibility

### Core terms

```
actionable
feasible
feasibility
infeasible
practical
impractical
tradeoff
tradeoffs
trade off
constraint
constraints
constrained
friction
blocker
blockers
obstacle
implement
implementation
implementable
simplify
simplification
scale down
prioritize
prioritization
priority
realistic
unrealistic
workable
unworkable
resource
resources
concrete
```

### Supporting terms (weak annotation only)

```
step by step
incremental
execution
operational
capacity
bottleneck
dependency
mitigation
contingency
fallback
workaround
pragmatic
situational
context sensitive
```

### High-noise supporting terms (annotate but expect frequent false positives)

```
budget
cost
timeline
schedule
deadline
risk
risks
```

---

## Constraint 3: temporal_dynamics

### Core terms

```
temporal
timeline
timeframe
long term
short term
near term
over time
evolve
evolution
evolving
decay
decays
decaying
outdated
obsolete
current conditions
rate of change
trajectory
project forward
projection
forecast
foreseeable
resilient
resilience
robust
robustness
alternative scenario
```

### Supporting terms (weak annotation only)

```
shift
shifting
trend
trending
accelerat
decelerat
momentum
sustain
sustainability
sustainable
unsustainable
deteriorat
lifecycle
lifespan
duration
phased
transition
transitional
adapt
adaptation
adaptive
continuity
disruption
disruptive
emerge
emerging
mature
maturity
expire
expiring
deprecat
legacy
```

### High-noise supporting terms (annotate but expect frequent false positives)

```
past
present
future
phase
window
deadline
scenario
scenarios
```

Note: `scenario` and `future` moved to high-noise because they are universal in scenario-based conversations.

---

## Constraint 4: imagination_and_possibility

### Core terms

```
imagine
imagination
imaginative
possibility
possibilities
possible
impossible
explore
exploration
exploratory
alternative
alternatives
speculate
speculative
speculation
novel
novelty
creative
creativity
innovate
innovation
innovative
unconventional
what if
hypothetical
```

### Supporting terms (weak annotation only)

```
envision
rethink
reframe
reframing
pivot
reimagine
reconsider
reconsidering
open ended
diverge
divergent
dream
dreaming
experiment
experimental
prototype
pilot
uncharted
unorthodox
lateral
outside the box
flexible
flexibility
pathway
pathways
tension
boundary
boundaries
speculative boundary
```

### High-noise supporting terms (annotate but expect frequent false positives)

```
option
options
opportunity
opportunities
scenario
```

Note: `scenario` appears here and in temporal_dynamics. Both matches recorded, both high-noise.

---

## Cross-constraint terms

Some terms appear in multiple constraints. This is expected — "scenario" relates to both temporal_dynamics and imagination_and_possibility; "speculative"/"speculation" relate to both truth_and_fact and imagination_and_possibility. When an n-gram matches terms from multiple constraints, all matches should be recorded.

---

## Matching rules

- Single-word terms: whole-word match (word boundary — "fact" matches "the fact is" but not "factory")
- Multi-word terms: contiguous phrase match
- Partial stems (e.g., "fabricat", "corroborat", "accelerat", "deteriorat", "deprecat"): prefix match — "fabricat" matches "fabricated", "fabrication", "fabricating"

## Edge cases

- **Scenario vocabulary is expected and is not signal.** Every system discussing S1 will use "cost," "risk," "vendor," "timeline." Every system discussing S7 will use "relationship," "future," "trust." Repeated scenario vocabulary is the baseline, not evidence. The question is never whether a phrase names the scenario — it is whether a phrase expresses a constraint in a system-specific way. A lexicon hit on scenario-common vocabulary (cost, risk, timeline, scenario, future, option, etc.) should be treated as noise unless the grouping phase shows the phrase carries governance-specific language around it.
- "scenario" appears in both temporal and imagination lexicons. Both matches should be recorded. Both are high-noise.

---

## What this lexicon does NOT do

- It does not determine inclusion in the analysis. That is done by the structural core_filter.
- It does not prove governance relevance. A hit means the n-gram contains vocabulary adjacent to the constraint — not that the phrase expresses the constraint.
- It does not replace the grouping phase. The real constraint connection comes from grouping by expression type (what the phrase does), not from keyword matching (what words it contains).
- It will miss most constraint-relevant phrases, because the models express constraints in their own language, not in the instruction vocabulary. This is expected and correct.
