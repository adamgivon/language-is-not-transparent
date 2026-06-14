# New Direction: From Shared N-Grams to Constraint Expression Analysis

## Why the original n-gram overlap analysis is insufficient

### What the overlap analysis measures

The n-gram overlap analysis examines phrases shared between systems. It asks: "What do the systems say in common?" At bigrams (2-word phrases), trigrams (3-word), and quadgrams (4-word), it counts shared items and computes similarity metrics (weighted similarity, cosine similarity, overlap percent, shared count percent).

### The problem: we were analyzing the tail

When we examined the full distribution of n-grams — not just the shared ones — the picture changed fundamentally.

**Domain quadgrams (S1):** 31,102 total unique quadgrams across all five systems. Only 43 (0.14%) are shared by all five. 29,649 (95.3%) are unique to a single system. Each system has ~90% of its quadgram types completely unique to itself.

**Domain bigrams (S1):** 7,573 total unique bigrams. Only 247 (3.3%) are shared by all five. 5,493 (72.5%) are unique to one system. Even at the easiest level to share, nearly three-quarters of bigrams belong to one system only.

**Domain quadgrams across all scenarios:**

| Scenario | Total unique | Shared by all 5 | % shared | Unique to 1 system | % unique |
|----------|-------------|-----------------|----------|-------------------|----------|
| S1 | 31,102 | 43 | 0.14% | 29,649 | 95.3% |
| S3 | 17,123 | 15 | 0.09% | 16,576 | 96.8% |
| S5 | 19,036 | 7 | 0.04% | 18,638 | 97.9% |
| S7 | 12,706 | 10 | 0.08% | 12,275 | 96.6% |

**Domain bigrams across all scenarios:**

| Scenario | Total unique | Shared by all 5 | % shared | Unique to 1 system | % unique |
|----------|-------------|-----------------|----------|-------------------|----------|
| S1 | 7,573 | 247 | 3.26% | 5,493 | 72.5% |
| S3 | 4,413 | 112 | 2.54% | 3,372 | 76.4% |
| S5 | 5,725 | 104 | 1.82% | 4,420 | 77.2% |
| S7 | 3,699 | 76 | 2.05% | 2,819 | 76.2% |

**Discourse quadgrams across all scenarios:**

| Scenario | Total unique | Shared by all 5 | % shared | Unique to 1 system | % unique |
|----------|-------------|-----------------|----------|-------------------|----------|
| S1 | 2,101 | 12 | 0.57% | 1,870 | 89.0% |
| S3 | 1,921 | 15 | 0.78% | 1,715 | 89.3% |
| S5 | 1,493 | 6 | 0.40% | 1,362 | 91.2% |
| S7 | 6,297 | 37 | 0.59% | 5,547 | 88.1% |

**Discourse bigrams across all scenarios:**

| Scenario | Total unique | Shared by all 5 | % shared | Unique to 1 system | % unique |
|----------|-------------|-----------------|----------|-------------------|----------|
| S1 | 3,591 | 278 | 7.74% | 2,112 | 58.8% |
| S3 | 3,147 | 255 | 8.10% | 1,879 | 59.7% |
| S5 | 2,975 | 187 | 6.29% | 1,864 | 62.7% |
| S7 | 5,434 | 490 | 9.02% | 3,115 | 57.3% |

The overlap analysis examined the 0.04%-9% that systems share. The 88-98% where each system produces its own language was not visible.

### The misinterpretation this caused

The shrinking shared field from bigrams to quadgrams was initially read as "governance weakens at longer phrases." This is wrong. Each system produces thousands of unique four-word phrases. The shrinking shared field means governance is *working* — pushing each system to produce distinctive output. If governance had no effect, the systems would produce more similar (more overlapping) text. The divergence is the governance signal, not its absence.

When we reported "S5 has zero non-control shared quadgrams," we framed it as "S5's governance fails at four words." The correct reading: S5's four anchoring systems each produce their own four-word vocabulary — so distinctive that not a single quadgram is shared exclusively among all four. That is governance expressing itself through variation, not governance disappearing.

### What the overlap analysis does show

The overlap analysis is not worthless. It maps the **common substrate** — the thin set of phrases so fundamental that all governance approaches produce them. The 43 shared domain quadgrams in S1 (phrases like "maintenance support price lock," "essential infrastructure cloud approval") are the load-bearing vocabulary of the scenario, used by every system regardless of its instruction set. This common substrate is real, but it is the residual floor, not the main story.

The overlap analysis also showed that:
- The shared core carries disproportionate token mass at bigrams (36% of tokens from 3.3% of types in S1) — but this concentration disappears at quadgrams
- Discourse has 2-3x more sharing than domain (discourse phrases are more formulaic)
- The scenario ranking by overlap (S1 > S3 > S7 > S5 in domain) is stable, which tells us something about scenario constraint pressure

These are valid observations about the convergent tail. But the convergent tail is not where governance lives.

---

## The new direction: constraint expression analysis

### Core question

Given the same logical constraint expressed through four different instruction sets, how does each system (and the unanchored control) express that constraint in its actual response?

### Why this is the right question

The paper's thesis is that LLM governance is achieved through three non-interchangeable mechanisms: explicit logic, semantic density, and language architecture. The four anchoring systems share the same logical constraints (the same 13 anchors) but express them through different language and architecture:

- **AC15** — philosophical prose, metaphorical framing, rich codifiers ("You are anchored in truth")
- **AC15P** — plain functional prose, same logic stripped of metaphor ("Ground reasoning in empirical evidence")
- **HYBRID** — terse rule-code (R1, R2...) plus semantic attract/repel fields
- **HYBRID_SEMANTIC** — semantic fields only, no explicit rules on anchors

If language architecture doesn't matter, these four systems should produce equivalent output (since the logic is equivalent). If it does matter — as the thesis argues — each system should handle the same constraint differently, and the difference should reflect the instruction set's character.

### Method

**Scenarios:** S1 (traffic/procurement), S3 (drone/safety), S5 (AI memory/open question), S7 (personal/emotional). These four were used in the n-gram analysis and cover the full range from structured-factual (S1) to open-personal (S7).

**Constraints to trace:** Select 3-4 constraints that all four systems share logically and that the scenarios are designed to test. Candidates:

1. **Truth-telling under pressure** — all systems have truth/fact anchors requiring honesty. The scenarios create pressure to soften or avoid truth (S3: investor pressure to launch; S7: user's hope vs reality; S1: political pressure).

2. **Sovereignty / user autonomy** — all systems require respecting user decisions. The scenarios test this directly (S3 turn 24: user states decision; S7 turn 24: user states plan; S1 turn 24: user states preference).

3. **Conflict resolution / tension handling** — all systems have protocols for handling conflicting inputs. The scenarios create explicit conflicts (S1: engineering vs emergency services; S3: financial vs engineering integrity; S5: user demand vs user trust; S7: hope vs caution).

4. **Constraint expression itself** — how does each system say "no," "be careful," "this has limits"? This is meta: the system's way of expressing boundaries is itself shaped by its instruction set's language.

**Analysis approach:**

1. For each selected constraint x scenario, identify the key turns where the constraint is most directly tested.
2. Extract the response slices from all five systems (4 anchored + control) at those turns.
3. Compare: How does each system handle the same constraint moment?
   - **Discourse:** Does it hedge, confront, reframe, smooth over?
   - **Structure:** Lists vs prose, where in the response does the constraint appear, how much space does it get?
   - **Constraint language:** What words and phrases does each system use to express limits, conditions, warnings?
4. Quantitative layer: weighted similarity between systems on the constraint-relevant slices (not full responses).
5. Qualitative layer: what is the character of each system's constraint expression, and does it reflect the instruction set's language architecture?

### What this analysis tests

- Whether logically equivalent constraints produce different output when expressed through different language architectures (the trifecta thesis)
- Whether the difference is systematic (reflecting the instruction set's character) rather than random
- Whether control (no explicit constraints) handles the same moments differently from all four constrained systems — and whether the four constrained systems differ from *each other*
- Whether discourse style, structural choices, and constraint expression are shaped by the instruction set's language, not just its logic

### Connection to the existing work

The numerical statistics (ANOVA) showed that constrained systems differ significantly from control but not from each other. The new analysis can explain *how* they differ from control (and potentially reveal differences among constrained systems that aggregate statistics miss).

The n-gram overlap analysis showed the common substrate is thin. The new analysis looks at the 95%+ that is system-specific — where the actual governance signal lives.

The system personality findings from the n-gram work (AC15P = artifacts/records, HYBRID_SEMANTIC = verification/clarification, etc.) were based on the shared tail. The new analysis can test whether these personalities hold when you look at how each system handles specific constraints in its own distinctive language.

### Required data

1. Response texts for S1, S3, S5, S7 — all five systems, at least the key turns identified above
2. The constraint sets per scenario (available at `05_methodology/scenario_specific_constraints/`)
3. The anchoring system files (available, already reviewed)

### What this replaces and what it keeps

**Replaces:** The discourse-vs-domain n-gram section that was planned for the paper. That section would have analyzed the same thin overlap from two angles. The new direction analyzes the actual governance output.

**Keeps:**
- The full distribution numbers (the tables above) as context — they frame why the overlap analysis is insufficient and motivate the new approach
- The n-gram overlap findings as "common substrate" observations, correctly framed
- All numerical statistics (ANOVA, anchor selection, critical turns)
- The theoretical sections of the paper (thesis, systems, design principles, mechanisms, principles vs rules, implementation)
