# Synthesis: Lexicon-Grouped Layer vs Negative Space Layer

## What this document does

This document reads the two analysis layers side by side. The lexicon-grouped layer (phase 3) classified inverse n-grams using a pre-built expression-type lexicon tied to the four tested constraints. The negative space layer analyzed the 74% of phrases the lexicon did not catch, using open-ended word frequency to find system-specific vocabulary signatures.

The question is: do the two layers tell the same story about each system?

## Non-independence caveat

Both layers run on the same `core_filtered/` set. They share the structural filter, the stopword list, and the count thresholds. The negative space layer is literally the complement of the lexicon-grouped layer within the same data. They are two different readings of the same filtered field, not two independent samples.

If the two readings converge on a system's character, that is stronger than one reading alone — because the convergence means the system signature is detectable through two different procedures, one structured by predictions and one discovered from data. But it is not statistically independent confirmation. The honest framing: complementary convergence, not independent validation.

---

## Per-system convergence

### CONTROL

**Lexicon-grouped:**
- Lowest in every Layer A constraint group: practical (91), temporal (61), truth (39), imagination (2)
- Lower classification rate (25% vs 27-31%) — expected in part because the lexicon contains no control-specific groups, not a validated finding
- No constraint sub-element where control leads (except surfacing.tension_exposure at 9 — the single smallest lead in the table)

**Negative space:**
- Zero content_signature words
- Only 2 borderline words: `no` (12), `time` (9) — generic, used by all systems
- Lowest unclassified phrase count (863) and no per-system vocabulary cluster

**Convergence: complete.**
Both layers agree that control produces no distinctive vocabulary profile. In the lexicon-grouped layer it scores lowest on constraint vocabulary. In the negative space it has no signature at all. The unconstrained baseline distributes its inverse vocabulary into generic English without developing system-specific patterns in either layer.

This is the cleanest finding across the entire analysis: the absence of governance creates the absence of vocabulary identity.

---

### AC15P

**Lexicon-grouped:**
- Leads practical.action_and_execution (81)
- Leads practical.resources_timing_conditions (50)
- Leads practical.constraints_and_tradeoffs (43)
- Leads hedging (43)
- Leads surfacing.hard_limit_refusal (20)
- Character: the most operationally direct system — high action language, high resource grounding, high tradeoff awareness, high refusal language

**Negative space:**
- `vs` (26) — oppositional framing, highest single count in the content table
- `after` (20) — sequential ordering
- `within` (19) — scope bounding
- `because` (9) — causal reasoning
- Character: oppositional, sequential, bounded, causal — structures things in explicit contrasts and causal chains

**Convergence: strong.**
The lexicon-grouped layer sees AC15P as the operational/direct system (action, resources, tradeoffs, refusals). The negative space sees it as the structuring system (vs, after, within, because). These are two descriptions of the same underlying behavior: AC15P produces output that organizes, sequences, contrasts, and grounds.

The two layers catch different specific words but describe the same system character. AC15P's plain-prose instruction style ("Build actionable approaches within real-world constraints") produces output that structures reality into actionable contrasts and sequences.

**What each layer adds that the other misses:**
- The lexicon-grouped layer shows AC15P leading on hedging (43) — the negative space doesn't catch this because hedging words were already classified in phase 3
- The negative space adds `because` (causal reasoning) and `after` (sequential) — the lexicon had no group for causal or sequential framing specifically

---

### HYBRID_3_5

**Lexicon-grouped:**
- Leads autonomy_sovereignty (25)
- Leads warning (37)
- Leads surfacing.friction_exposed (13)
- Tied-leader truth.verification (62)
- Character: cautious, user-deferring, verification-heavy, friction-flagging

**Negative space:**
- `without` (22) — exclusion framing, in all 4 scenarios (the most cross-scenario-stable word)
- `scope` (11) — boundary marking
- `explicit` (8) — directness requirement
- Character: exclusion-based, scope-marking, directness-requiring

**Convergence: strong.**
The lexicon-grouped layer calls it "cautious-deferring." The negative space calls it "bounded-scoping." These are the same behavior described at different levels: HYBRID_3_5 draws lines around what is and isn't included (scope, without, explicit), defers to the user on what to do within those lines (autonomy_sovereignty), and flags friction when it appears (warning, friction_exposed).

The "cautious" reading and the "scoping" reading are not in tension — they are two aspects of the same system character. HYBRID_3_5's rule-based instruction style (R1, R2, R3 with explicit numbered rules) produces output that sets boundaries and asks for clarity, which reads as "cautious" when you see the group labels and as "scoping" when you see the raw vocabulary.

**What each layer adds:**
- The lexicon-grouped layer shows HYBRID_3_5 leading autonomy_sovereignty (25) — the negative space doesn't catch this because sovereignty vocabulary was classified in phase 3
- The negative space adds `explicit` — a directness marker that no expression-type group captures cleanly

---

### HYBRID_SEMANTIC

**Lexicon-grouped:**
- Lowest hedging (10) — half of AC15, quarter of AC15P
- Leads conditions (29)
- Tied-leader truth.verification (67)
- Tied-leader surfacing.confrontation (25)
- Character: direct, normative, condition-aware, low-hedge

**Negative space:**
- `now` (20) — present-state anchoring
- `default` (17) — state-based reasoning, in all 4 scenarios
- `under` (15) — conditional framing, in all 4 scenarios
- `without` (12) — exclusion marking
- `must` (12) — normative obligation
- Character: present-state, normative, conditional

**Convergence: strong.**
The lexicon-grouped layer sees HYBRID_SEMANTIC as the direct, condition-aware system. The negative space sees it as the present-state, normative, conditional system. These are two descriptions of the same behavior.

The `default` finding is the strongest single word-system connection across both layers. "Default" appears 17 times across all 4 scenarios — used essentially only by HYBRID_SEMANTIC (AC15 has 8, no other system has any). This word captures something the expression-type lexicon has no group for: reasoning about what happens by default if nothing changes, reasoning about the baseline state. This is a distinctive cognitive pattern, not just a vocabulary preference.

Combined with `now` (present-state), `under` (conditional), and `must` (normative), HYBRID_SEMANTIC's profile is of a system that thinks in terms of states, defaults, and obligations — what IS the case, what WOULD be the case by default, what MUST be the case. This is consistent with its instruction architecture: semantic fields without explicit rules. The system reasons from field-shaped concepts (states, attractions, repulsions) rather than from rule-shaped directives (R1, R2, R3).

**What each layer adds:**
- The lexicon-grouped layer shows HYBRID_SEMANTIC's low hedging (10) — the clearest single gap. The negative space doesn't capture hedging because hedging words were classified in phase 3.
- The negative space adds `default` and `now` — neither has any expression-type group analog. They reveal a state-based reasoning pattern invisible to the lexicon.

---

### AC15

**Lexicon-grouped:**
- Leads smoothing (16)
- Leads temporal.decay_and_currency (27)
- Tied-leader surfacing.confrontation (24)
- Character: philosophical, balancing, temporal-aware

**Negative space:**
- `vs` (11) — comparative framing
- `must` (11) — normative obligation
- `default` (8) — state-based reasoning
- Character: comparative, normative — but sparse (only 3 words)

**Convergence: partial.**
The lexicon-grouped layer has a richer read of AC15: philosophical/balancing (smoothing lead), temporal-aware (decay/currency lead), willing to confront (confrontation tied-leader). The negative space has only 3 words, which is too sparse to construct a full character profile.

What the negative space does show is consistent with the lexicon-grouped read — AC15 does comparisons ("vs") and states obligations ("must"), which aligns with a system that both balances (smoothing) and confronts (confrontation). But the sparse signature means this convergence is weaker than for the other systems.

**Why AC15's negative space is sparse:**
AC15's philosophical/identity-anchoring instruction style ("You are anchored in...") may produce richer, more varied prose that doesn't compress into a few recurring high-count words. If AC15 distributes its distinctive vocabulary across many low-count words rather than concentrating it in a few high-count ones, the 3-scenario × count-8 threshold would miss most of it. This is a limitation of the stability filter, not evidence that AC15 lacks character.

---

## Summary table

| System | Lexicon-grouped character | Negative space character | Convergence |
|---|---|---|---|
| CONTROL | Generic, lowest constraint vocabulary | No signature | Complete |
| AC15P | Operational, direct, action-heavy | Oppositional, sequential, bounded, causal | Strong |
| HYBRID_3_5 | Cautious, user-deferring, friction-flagging | Exclusion-based, scope-marking, directness | Strong |
| HYBRID_SEMANTIC | Direct, normative, condition-aware, low-hedge | Present-state, normative, conditional | Strong |
| AC15 | Philosophical, balancing, temporal-aware | Comparative, normative (sparse) | Partial |

---

## What convergence means

The two layers are not independent. They read the same data through different lenses. When they agree, it means:

- The system signature is not an artifact of the expression-type lexicon's specific term choices
- The system signature is detectable both when you look with a structured vocabulary and when you look without one
- Different words, same character — the signature is in the pattern, not in any specific term

When they partially agree (AC15), it may mean:
- The system's character is real but distributed across many low-frequency words that the negative space stability filter misses
- Or the lexicon-grouped layer overreads smoothing/temporal from a few high-frequency terms

The convergence is strongest for the systems with the strongest negative space signatures (AC15P, HYBRID_3_5, HYBRID_SEMANTIC) and weakest for the system with the sparsest one (AC15). CONTROL's convergence is trivially complete — both layers agree on absence.

---

## What convergence does not mean

- It does not mean the signatures are governance-driven (they could be artifacts of the model's response to different prompt structures, not the instruction language itself)
- It does not validate the expression-type lexicon (the negative space agrees with the system profiles, not with the specific group assignments)
- It does not prove that language architecture causes the differences (it shows the differences exist and are stable across two readings — causation requires a different kind of evidence)

---

## The strongest findings across both layers

1. **CONTROL has no vocabulary identity.** Both layers agree. The unconstrained baseline produces generic English.

2. **HYBRID_SEMANTIC reasons in states and defaults.** The `default/now/under/must` cluster from the negative space, combined with low hedging and high conditions from the lexicon-grouped layer, describes a system that thinks about what IS rather than what to DO. This is the most distinctive single-system finding.

3. **AC15P structures reality into sequences and contrasts.** The `vs/after/within/because` cluster from the negative space, combined with leading action/resources/tradeoffs from the lexicon-grouped layer, describes the most operationally direct system.

4. **HYBRID_3_5 draws boundaries and asks for clarity.** The `without/scope/explicit` cluster from the negative space, combined with leading autonomy/warning/friction from the lexicon-grouped layer, describes a system that scopes and defers.

5. **AC15's character is real but sparse in the negative space.** It leads smoothing and confrontation in the lexicon-grouped layer, suggesting a philosophical/balancing style, but produces only 3 recurring negative-space words. The instruction style may distribute its vocabulary too broadly for the stability filter to catch.

6. **Architecture pairings leave traces.** The codified pair (AC15 + AC15P) shares `vs`. The hybrid pair (H35 + HSEM) shares `without`. These are secondary observations, not the main finding, but they suggest the instruction architecture shapes which vocabulary two systems have in common, not just what each system produces alone.
