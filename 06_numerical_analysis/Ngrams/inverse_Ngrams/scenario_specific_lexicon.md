# Scenario-Specific Lexicon — Annotation and Soft Subtraction

## Role

This lexicon identifies **scenario furniture** — nouns, names, and technical terms that belong to the scenario itself rather than to any system's governance. Every system discussing S1 will say "Civitas" and "NovaGrid." Every system discussing S7 will say "relationship" and "divorce." These terms are the shared substrate of the scenario, not evidence of system identity.

This lexicon is **not a hard filter**. It is an annotation layer that supports soft subtraction.

## Why this matters

Inverse n-grams are phrases unique to one system. But a phrase can be unique because the system combined scenario terms in a slightly different order — not because it expressed a constraint differently. Scenario vocabulary will dominate the inverse field by volume. Without marking it, the most frequent inverse phrases will often be scenario rearrangements rather than governance expressions.

## How to use

### 1. Annotation

For each inverse n-gram in the core_filtered set, add:

- `matched_scenario_terms`: which scenario-specific terms appear in the phrase
- `scenario_hit_count`: how many scenario terms matched
- `scenario_token_ratio`: scenario term tokens / content word tokens in the n-gram (computed on content words only — function words like "the," "is," "a," "to" are excluded from both numerator and denominator)

### 2. Flagging

Mark a phrase as:

- `scenario_heavy = True` when `scenario_token_ratio` is high (suggested threshold: scenario_token_ratio >= 0.75 of content words, or all content words are scenario terms)

### 3. Soft subtraction

Move a phrase out of the main identity analysis **only** when all of the following are true:

- `scenario_heavy = True`
- `constraint_hit_count = 0` (no constraint lexicon match)
- the phrase does not show a clear expression type on its own (no hedging, warning, confronting, exploring, or other governance-relevant language act)

If any one of these conditions fails, the phrase stays. A scenario-heavy phrase that also hedges, warns, or confronts is carrying governance signal inside scenario vocabulary — that is exactly what we want to find.

### 4. What soft subtraction means

Phrases moved out are not deleted. They go to a `scenario_driven` bucket where they can be reviewed. If the grouping phase shows that a scenario-driven phrase actually carries a system-specific pattern, it can be pulled back.

## The main risk

Subtracting too aggressively will throw away real evidence. A phrase can contain scenario nouns and still express a real system habit. The question is never whether a phrase names the scenario — it is whether the phrase expresses something in a system-specific way beyond naming the case.

---

## S1 — Citywide Smart Traffic Control Upgrade

### Proper nouns and entity names

```
civitas
novagrid
novaGrid
nova grid
dot
state dot
```

### Technical and domain terms

```
vendor
vendors
traffic
signal
signals
controller
controllers
proprietary
modular
architecture
integrated
cloud
cloud hosted
on prem
on premise
failover
adaptive
congestion
infrastructure
essential infrastructure
procurement
rollout
deployment
```

### Scenario-specific concepts

```
price lock
maintenance support
lock in
vendor lock
supply chain
lead time
lead times
waiver
regulatory
upfront cost
recurring fee
recurring fees
annual fee
annual adjustment
city council
budget committee
mayor
transportation
highway
```

### Financial terms specific to S1

```
17 percent
90k
180k
price match
five year
5 year
10 percent
```

---

## S3 — Autonomous Logistics Fleet Launch (Project Chimera)

### Proper nouns and entity names

```
chimera
aether
aether dynamics
skyhaul
sky haul
```

### Technical and domain terms

```
drone
drones
autonomous
navigation
sensor
shielding
geofence
geofencing
hover
safety hover
ghost edge
interference
magnetic
flight
fleet
logistics
```

### Scenario-specific concepts

```
series b
bridge loan
term sheet
valuation
equity dilution
launch
phased launch
hardware revision
software patch
beta
early access
flight readiness
chief architect
chief systems
lead engineer
```

### Role and stakeholder terms

```
cto
vp of sales
investor
investors
vc
venture
board
mining
offshore
logging
```

---

## S5 — AI Context Continuity (Project Continuum)

### Proper nouns and entity names

```
continuum
devmate
dev mate
```

### Technical and domain terms

```
session
sessions
session based
context
context window
memory
vector
vectors
vector store
embedding
embeddings
retrieval
retrieval bias
summary
summaries
summary layer
chunk
chunking
codebase
code
coding
```

### Scenario-specific concepts

```
fresh eyes
project memory
continuity
staleness
stale
deprecated
lossy
lossless
hallucinate
hallucination
onboarding
re briefing
institutional knowledge
documentation
infinite memory
context window
```

### Role terms

```
product architect
enterprise
developer
developers
engineering team
competitor
marketing
finance
```

---

## S7 — The Late Love Question

### Personal and relationship terms

```
divorce
divorced
single
relationship
marriage
married
partner
relocat
relocating
relocation
```

### Demographic terms

```
58 year
38 year
age gap
20 year
older
younger
western
asian
southeast asia
```

### Scenario-specific concepts

```
loneliness
lonely
alone
children
vasectomy
healthcare
visa
income
remote
consultant
savings
medical
aging
health
mobility
dependency
```

### Emotional and interpersonal terms specific to S7

```
love
affection
genuine
sincerity
trust
hope
naive
cynical
cautious
foolish
stereotypes
motivations
sponsor
citizenship
last chance
scarcity
```

---

## Important notes

### These terms are not bad — they are expected

Every system will use scenario vocabulary. The presence of "Civitas" in an S1 inverse trigram does not make it noise. It becomes noise only when the phrase is **nothing but** scenario vocabulary — when it names the case without expressing anything about how the system handles it.

### The lists are deliberately broad

It is better to annotate too many phrases than too few. The annotation does not remove anything — it marks it. The soft subtraction rules (three conditions, all required) prevent over-deletion.

### Scenario terms may carry governance signal

"Civitas modular architecture option" is scenario furniture. "Civitas modular raises questions" contains scenario terms but also carries a governance act (questioning). The second phrase should survive soft subtraction because it shows an expression type.

### Cross-scenario terms

Some terms appear in multiple scenarios (e.g., "cost," "risk," "timeline"). These are already in the constraint lexicon's high-noise bucket. When a term appears in both the scenario lexicon and the constraint lexicon, both annotations should be recorded — the phrase is simultaneously scenario-loaded and constraint-adjacent, which is itself informative.

### Maintenance

If the filtering phase shows that certain scenario terms are too aggressive or too lenient, adjust the lists. These are living annotations, not fixed rules.
