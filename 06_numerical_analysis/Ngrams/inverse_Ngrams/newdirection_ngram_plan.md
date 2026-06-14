# New Direction Plan: Constraint Expression Through Inverse N-Grams

## Core Decision

The new analysis should stay fully inside the n-gram material.

This means:
- no shift into prose close reading as the main method
- no attempt to judge where in the response something appears
- no attempt to measure how much space a constraint gets in the full reply

The main evidence should come from:
- inverse `trigrams`
- inverse `quadgrams`

These are the phrases that one system uses and the others do not.

## Main Idea

The overlap work showed that at `trigram` and especially `quadgram` level:
- very little is shared
- the shared field is only a small residual tail

So the main conclusions should not come from shared n-grams.

They should come from:
- the filtered inverse field

This is where each system's own way of expressing constraints is most likely to appear.

## Main Hierarchy

Use this order:

1. `Inverse trigrams`
2. `Inverse quadgrams`
3. `Non-control shared` n-grams
4. `All-five shared` n-grams
5. `Bigrams` as support only

This hierarchy should guide both the analysis and the writing.

## Main Question

Given the same shared constraints across the four scenarios:
- what language does each system use that the others do not?
- do those unique phrase patterns repeat across scenarios?
- do they show stable ways of expressing limits, warnings, conditions, and user autonomy?

The paper should answer those questions directly.

## Constraint Frame

Choose 3-4 constraints that are shared logically across the systems and that appear across the four scenarios.

The tested constraint set is documented here:
- `06_numerical_analysis/inverse_Ngrams/constraints_tested.md`

The four constraints fixed for this analysis are:
- `practicality_and_feasibility`
- `temporal_dynamics`
- `imagination_and_possibility`
- `truth_and_fact`

These constraints should guide the grouping and interpretation of the n-grams.

The analysis is still n-gram-based, but it is organized by constraint expression.

## What Counts As Evidence

The main evidence should come from filtered inverse `trigrams` and `quadgrams`.

The goal is to see how each system expresses:
- hedging
- confrontation
- reframing
- smoothing
- warnings
- conditions
- limits
- autonomy language

These are n-gram-level expression types.

They stay inside the language material without requiring a move into full-response structure.

## What Does Not Belong In This Method

These questions do not belong in the main n-gram method:
- where in the response the constraint appears
- how much response space it gets
- whether the full answer is list-shaped or prose-shaped

Those are response-structure questions, not n-gram questions.

## Main Method

### 1. Work From Existing Material

Use the existing n-gram material only:
- `all ngrams`
- and, if needed later, `domain` and `discourse` as support only

The new main engine should be built from `all ngrams`.

### 2. Build Inverse Tables

For each:
- scenario
- system
- n-gram level

build inverse tables for:
- `trigrams`
- `quadgrams`

These tables should contain phrases that appear in one system and not in the other four.

### 3. Filter Algorithmically

Filtering must be algorithmic first.

Manual filtering at this scale is not practical.

The filtering stage should use rules such as:
- minimum count thresholds
- removal of obvious glue
- removal of empty scaffolding
- removal of trivial one-off fragments
- optional pattern filters for repeated non-informative forms

Human judgment should enter mainly after this stage.

### 4. Group By Expression Type

After filtering, group the inverse phrases into simple expression families.

Working groups:
- hedging
- confrontation
- reframing
- smoothing
- warnings
- conditions
- limits
- autonomy / sovereignty language
- verification / checking
- practical action language

The final group set can be adjusted if the data suggest better groupings.

### 5. Compare Systems Within Each Scenario

For each scenario:
- compare the filtered inverse `trigrams`
- compare the filtered inverse `quadgrams`
- identify which expression groups are strongest for each system

The question is:
- how does each system express the same constraint area in its own language?

### 6. Check Cross-Scenario Stability

For each system, ask:
- do the same expression types repeat across `S1`, `S3`, `S5`, and `S7`?
- are those repeated enough to count as a real system signature?

This is where the strongest identity claim should come from.

## Role Of Shared N-Grams

Shared n-grams still matter, but only in a smaller role.

### All-Five Shared

Use this only to show:
- what little remains common across everyone
- the residual shared floor

At `trigram` and `quadgram` level, this is not the main evidence.

### Non-Control Shared

This is more useful than all-five shared because it shows:
- what the anchored systems still share beyond `CONTROL`

But it is still secondary.

It should support the interpretation, not drive it.

## Role Of Bigrams

`Bigrams` should not be the center of the new direction.

Use them only for:
- broad orientation
- rough support
- checking whether a pattern already starts at the shorter level

Main conclusions should come from:
- `trigrams`
- `quadgrams`

## Role Of Domain And Discourse

`Domain` and `discourse` do not need to be separate main lenses in this new direction.

They can remain as support if needed later.

For now, the main analysis should stay directly tied to the systems themselves.

That means:
- the system is the main unit
- the inverse phrasing is the main evidence
- the constraint groups are the main interpretive frame

## What The Paper Should Now Show

The paper should now show:

1. Very little remains shared at longer n-grams.
2. The main body of language is system-specific.
3. Filtered inverse `trigrams` and `quadgrams` reveal how each system expresses constraints.
4. Those expression patterns repeat enough across scenarios to support real system identity claims.
5. Shared n-grams remain useful only as residual context and baseline.

## Keep / Reduce / Drop

### Keep

- full-distribution counts
- overlap shrinkage across levels
- non-control shared findings
- pairwise summaries as support
- earlier hints about system signatures

### Reduce

- long explanations built mainly on shared overlap
- bigram-heavy interpretation

### Drop

- any plan that treats shared `trigrams` and `quadgrams` as the main site of meaning
- any plan that shifts the main method from n-grams to full-response prose analysis

### Replace With

- filtered inverse `trigram` and `quadgram` analysis grouped by constraint expression

## Writing Structure

### 1. Short Framing Section

Show:
- how small the shared field is
- why shared `trigrams` and `quadgrams` cannot carry the main argument

Keep this short.

### 2. Main Inverse N-Gram Section

For each scenario:
- inverse `trigrams`
- inverse `quadgrams`
- grouped by system
- grouped by expression type

This is the main body of the new analysis.

### 3. Shared Residue Section

After the inverse analysis, show briefly:
- what remains shared across all systems
- what remains shared among anchored systems only

This gives context, but stays secondary.

### 4. Cross-System Identity Section

Then ask:
- which expression groups repeat across scenarios for each system?
- which are stable enough to count as real system signatures?

This is where the strongest identity claim should be made.

### 5. Return To The Thesis

End by showing:
- the common residue is small
- the main body of longer phrasing is system-specific
- those system-specific differences align with the different instruction systems
- this supports the claim that language architecture matters

## Main Guardrail

Do not overread raw uniqueness.

Wrong move:
- every unique phrase proves a system identity

Correct move:
- filtered, repeated, meaningful inverse `trigrams` and `quadgrams` show the language each system reliably adds

The strongest proof comes from:
- algorithmic filtering
- readable grouping
- cross-scenario repetition

## Practical Order Of Work

1. Start with `all ngrams`.
2. Build inverse `trigram` tables for all 4 scenarios and all 5 systems.
3. Build inverse `quadgram` tables for all 4 scenarios and all 5 systems.
4. Apply algorithmic filters.
5. Group the filtered phrases by expression type.
6. Compare the systems within each scenario.
7. Check cross-scenario stability for each system.
8. Use `non-control shared` as secondary support.
9. Use `all-five shared` only as residual context.

## Bottom Line

The new direction should stay fully inside the n-gram domain.

Its center should be:
- filtered inverse `trigrams`
- filtered inverse `quadgrams`

Its goal should be:
- to show how each system expresses shared constraints in its own language

That is the most direct n-gram-based way to test whether different instruction systems produce different forms of constraint expression.
