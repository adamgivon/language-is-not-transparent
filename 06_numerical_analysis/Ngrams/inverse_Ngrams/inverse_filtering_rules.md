# Inverse N-Gram Filtering Rules

## Purpose

These rules define the first real filtering pass for the inverse n-gram analysis.

The goal is:
- to keep the method fully inside the n-gram material
- to reduce noise at scale
- to keep the main analysis tied to the tested constraints

The main evidence layer is:
- inverse `trigrams`
- inverse `quadgrams`

`Bigrams` are not part of the main filtering workflow.

## Main Logic

Use a two-step filter:

1. `core_filtered`
- the broad usable inverse set

2. `constraint_candidates`
- the narrower set used for the main analysis

Also keep one small backup bucket:

3. `high_count_no_hit_review`
- rows that look important but do not hit the current constraint lexicon

## Scope

Work only on:
- inverse `trigrams`
- inverse `quadgrams`

Do not use:
- shared n-grams as the main evidence
- `bigrams` as the main evidence

## Step 1: Core Filter

Keep a row only if all of the following are true:

- it is inverse
- it is a `trigram` or `quadgram`
- it is not caught by the scaffold-prefix list
- it is not a pure glue fragment
- it passes the minimum count threshold
- it has enough content words

### Count Thresholds

- `trigrams`: `count >= 3`
- `quadgrams`: `count >= 2`

Reason:
- for `trigrams`, `2` is still too noisy
- for `quadgrams`, `2` already shows recurrence and is worth keeping

### Content Thresholds

- `trigrams`: `content_token_count >= 2`
- `quadgrams`: `content_token_count >= 2`

This is the minimum content floor.

`content_token_ratio` should be kept as a ranking aid, but not used as the main hard cutoff.

### Hard Exclusions

Drop rows with:
- known scaffold prefixes such as:
  - `if you`
  - `you can`
  - `i can`
  - `you tell`
  - `it s`
  - `this is`
  - `what to`
  - `with the`
  - `on the`
  - `for the`
- obvious empty fragments
- `count = 1`

Important clarification:
- the scaffold rule applies only when the n-gram **starts with** one of these prefixes
- it does **not** apply when the same words appear later inside the phrase

Examples:
- `if you want to` -> drop
- `you can try to` -> drop
- `risk if you delay` -> keep
- `costs if you wait` -> keep

## Step 2: Constraint-Candidate Filter

From the `core_filtered` set, keep rows where:

- `constraint_hit_count >= 1`

This uses the fixed constraint file:
- [constraints_tested.md](06_numerical_analysis/inverse_Ngrams/constraints_tested.md)

The four fixed constraints are:
- `practicality_and_feasibility`
- `temporal_dynamics`
- `imagination_and_possibility`
- `truth_and_fact`

This `constraint_candidates` set is the main analysis set.

## Step 3: Backup Review Bucket

To avoid losing good phrases because the current lexicon is incomplete, keep a small backup set:

- rows that pass the `core_filtered` rules
- but have `constraint_hit_count = 0`
- and still have relatively high count

Thresholds:
- `trigrams`: `count >= 4`
- `quadgrams`: `count >= 3`

This bucket is only for:
- catching lexicon misses

It is not the main analysis set.

## Ranking Rule

Within each filtered output, sort by:

1. `count` descending
2. `constraint_hit_count` descending
3. `content_token_ratio` descending

This is enough for the first filtering pass.

## Outputs To Produce

The filtering phase should produce three outputs:

### 1. `core_filtered`

The broad usable inverse set.

### 2. `constraint_candidates`

The main analysis set.

### 3. `high_count_no_hit_review`

The backup review set for possible lexicon misses.

## Why These Rules

These rules aim to keep a balance:

- they are programmatic
- they reduce noise
- they do not rely on manual filtering at scale
- they keep the analysis tied to the tested constraints
- they leave a controlled path for catching missed phrases

## Working Principle

Do not treat raw uniqueness as evidence.

Treat as evidence:
- filtered
- meaningful
- repeated
- constraint-relevant inverse `trigrams` and `quadgrams`

That is the rule for the next phase.
