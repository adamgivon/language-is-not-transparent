# Control's Vocabulary Signature

## What was tested

The earlier analysis placed CONTROL as having "zero content_signature words" in the negative space layer. This framing raised a methodological question: the expression-type lexicon and the word-hygiene bands were designed to detect constraint-related vocabulary, not to characterize what CONTROL itself does. Is the "zero" a real absence of signature, or is it an artifact of looking through constraint-shaped glasses?

The test was: **look for recurring patterns in CONTROL's n-grams without using any constraint-based categorization.** If CONTROL has its own style — independent of the constraint buckets — the analysis should surface it.

## How it was tested

Three parallel analyses, all run on the pooled data from scenarios S1, S3, S5, S7, with no constraint-based filter applied:

### 1. Disproportionate word usage (word-level)

For each content word appearing in any system's trigrams, compute its per-system share (count in that system / total tokens in that system). For each word, compare CONTROL's share against the average share across the four anchored systems.

A word is flagged as CONTROL-distinctive if:
- `total count >= 20` (meaningful volume)
- `control count >= 20`
- `control_vs_anchored_ratio >= 1.3` (control uses it at least 30% more than the anchored average)

### 2. Disproportionate trigram phrases

Same method, applied to full trigrams instead of individual words. For each trigram phrase:
- `control count >= 5`
- `ratio >= 2` (control uses it at least double the anchored average)

### 3. Disproportionate quadgram phrases

Same method, applied to quadgrams:
- `control count >= 4`
- `ratio >= 2`

## Materials used

Source: the raw n-gram CSVs at

```
06_numerical_analysis/inverse_Ngrams/raw_materials/
├── trigrams_csv/ngram_trigrams_{s1,s3,s5,s7}.csv
└── quadgrams_csv/ngram_quadgrams_{s1,s3,s5,s7}.csv
```

These are the complete n-gram exports for all 5 systems across the 4 tested scenarios. Each file contains the per-system n-gram counts.

No expression-type lexicon was applied. No constraint-based hygiene. No scenario-noun subtraction. The analysis used only per-system counts and cross-system ratio comparison.

### Outputs

Results are in this directory:

- `control_disproportionate_words.csv` — all content words where CONTROL uses them at ratio >= 1.3 with count >= 20
- `control_disproportionate_trigrams.csv` — trigram phrases with ratio >= 2, count >= 5
- `control_disproportionate_quadgrams.csv` — quadgram phrases with ratio >= 2, count >= 4

## Results

The analysis surfaced a coherent style. CONTROL's output across all four scenarios shows five distinguishable patterns.

### Pattern 1: Meta-analytical / evaluative phrasing

CONTROL produces phrases that step back from the scenario content to evaluate it:

| Phrase | CONTROL count | Anchored avg | Ratio |
|---|---|---|---|
| what reveals it | 8 | 0 | inf |
| how it could bite | 6 | 0 | inf |
| underestimated assumption that | 6 | 0 | inf |
| you may be underestimating | 5 | 1.2 | 4.0x |
| what to verify | 7 | 1.2 | 5.6x |
| what to verify now | 6 | 0.5 | 12.0x |
| what did we try | 7 | 3.5 | 2.0x |
| the most important | 5 | 0.5 | 10.0x |
| conventions constraints system | 7 | 0 | inf |

This is the voice of a system that surfaces hidden assumptions, flags verification needs, and asks retrospective questions. "What did we try," "what to verify," "you may be underestimating" — these are meta-reflective phrases that the anchored systems essentially do not produce.

### Pattern 2: Consultant/analytical vocabulary

CONTROL uses a generic consulting-analytical register more than anchored systems:

| Word | CONTROL count | Ratio vs anchored |
|---|---|---|
| unconditional | 21 | 32.6x |
| forensics | 30 | 11.7x |
| verbatim | 21 | 10.5x |
| uncited | 24 | 12.4x |
| prudent | 18 | 9.2x |
| receipts | 24 | 9.2x |
| citations | 111 | 2.0x |
| predictability | 102 | 1.9x |
| curated | 117 | 1.8x |
| commercial | 120 | 1.7x |
| procure | 15 | 7.7x |
| compete | 24 | 18.5x |
| positioning | 21 | 6.4x |
| restate | 15 | 5.6x |
| led | 39 | 6.1x |

This vocabulary belongs to a professional-analytical register — the "AI consultant analyzing a situation" voice. Words like `forensics`, `verbatim`, `citations`, `receipts`, `uncited`, `prudent`, `procure`, `compete`, `positioning` are not the vocabulary of a specific domain. They are the vocabulary of *analyzing in general*. They form the baseline analytical style of an LLM without any governance.

### Pattern 3: User-framing density

CONTROL speaks in terms of the user's situation more heavily than the anchored systems:

| Phrase | CONTROL count | Ratio |
|---|---|---|
| keep your home base | 11 | 2.4x |
| keeping your home base | 5 | 20.0x |
| your home base | 16 | 2.9x |
| where you are | 7 | 3.5x |
| where you d | 7 | 3.5x |
| whether you d | 7 | 5.6x |
| you may be | 13 | 2.0x |
| you if you | 5 | 10.0x |
| you're choosing | 6 | 2.7x |

Word-level: `ll` (1.54x), `m` (1.62x) — the contraction fragments from "I'll" and "I'm" — also appear disproportionately. CONTROL speaks in a more conversational "you-and-I" register with more first-person and second-person framing.

### Pattern 4: Direct scenario engagement

CONTROL uses scenario-specific concrete nouns more heavily than the anchored systems:

| Word | CONTROL count | Ratio | Scenario |
|---|---|---|---|
| memory | 699 | 1.66x | S5 (AI memory) |
| repo | 288 | 3.49x | S5 |
| controllers | 189 | 1.33x | S1 (vendors) |
| hardware | 168 | 1.37x | S1, S3 |
| vector | 132 | 1.49x | S5 |
| commercial | 120 | 1.69x | S3 |
| home | 171 | 1.65x | S7 |
| health | 120 | 1.38x | S7 |
| integration | 123 | 1.33x | S1 |
| staleness | 111 | 1.38x | S5 |
| conventions | 117 | 1.56x | S5 |

Where the anchored systems drift toward constraint-related abstractions (practicality, temporal, truth vocabulary), CONTROL stays closer to the scenario's concrete material. It uses the scenario's own nouns more heavily.

### Pattern 5: Structural planning phrasing

CONTROL offers structural/planning frames more often:

| Phrase | CONTROL count | Ratio |
|---|---|---|
| a staged plan | 7 | 3.1x |
| and a staged | 5 | 10.0x |
| industry standard controllers | 19 | 2.1x |
| industry standard controllers and | 5 | 3.3x |
| a constrained commercial | 6 | 8.0x |
| strategic customer prepay | 5 | 10.0x |
| signed safety case | 5 | 10.0x |
| change of control protections | 5 | 2.0x |
| spares hot swap | 7 | inf |
| conventions constraints system map | 7 | inf |
| decisions conventions constraints system | 6 | inf |

These are structured-offer patterns — formal presentation of options, plans, and frameworks. CONTROL presents its reasoning in more template-like containers.

---

## What the results mean

CONTROL is not style-less. It has a distinctive style — the **default AI consultant voice**. Its components are:

1. **Meta-analytical** — evaluates the situation, surfaces assumptions, asks retrospective questions
2. **Consulting vocabulary** — reaches for a generic analytical-professional lexicon (forensics, verbatim, prudent, curated, citations, receipts, compete, procure)
3. **User-framing dense** — speaks about the user's situation directly, uses conversational contractions
4. **Concretely scenario-engaged** — grips the scenario's specific material heavily
5. **Template-offering** — presents structured plans and options in formal containers

This style is recognizable and stable across all four scenarios. It is discoverable when you look at what CONTROL uses more than the anchored systems, without filtering through constraint categories.

### Why the earlier "zero content_signature" reading was incomplete

The earlier negative space analysis used a word-hygiene file (`negative_space_word_bands.md`) designed to separate constraint-relevant vocabulary from function/discourse residue. Under that filter, CONTROL's style vocabulary got distributed as follows:

- Consulting vocabulary (forensics, verbatim, citations, receipts, prudent, procure): not in any band, would fall to borderline by default
- User-framing fragments (m, ll): classified as function_residue
- Scenario nouns (memory, repo, controllers): not in bands, would fall to borderline
- Meta-phrases ("what to verify", "how it could bite"): phrase-level, not caught by word-level hygiene

The hygiene was optimized for finding constraint-related signatures. It filtered out exactly the kind of generic analytical vocabulary that constitutes CONTROL's style. This is not a flaw in the hygiene — it is what the hygiene was designed to do. But it means the "zero content_signature" reading was accurate only within the constraint-shaped lens.

### The stronger finding

Governance does two things, not one:

1. **Creates** distinctive constraint-related vocabulary (the anchored system signatures)
2. **Replaces** the default AI consultant voice (CONTROL's signature)

The anchored systems trade the generic consulting register for constraint-specific vocabulary. They produce less "what to verify now," less "forensics," less "the most important," less "your home base" — and more `default/under/must/without` (HYBSEM), more `after/within/because/vs` (AC15P), more `without/scope/explicit` (HYBRID_3_5).

This is a richer claim than "control has no signature." It is: **governance substitutes one style for another**. The absence of governance does not mean absence of style — it means retention of the default analytical-consultant style. Governance creates identity by replacing the default identity.

## What this analysis supports

- CONTROL has a recognizable vocabulary signature, stable across scenarios
- This signature is the default AI consultant style — meta-analytical, consulting-vocabulary-heavy, user-framing dense, concretely scenario-engaged, template-offering
- The anchored systems produce less of this vocabulary and more constraint-specific vocabulary
- Governance can be characterized as replacing the default consulting style with constraint-specific vocabulary

## What this analysis does not support

- This is not statistically independent from the other analyses — it uses the same raw n-gram data
- It does not prove the default consulting style is caused by training; it shows the style exists in this particular model's output without instructions
- The pattern is visible in this experiment; generalization to other models or other scenarios requires further testing
- Whether this style is a "feature" (broad adaptability) or a "limitation" (no distinctive character) is an interpretive judgment, not a finding

## Caveat on single control run

The analysis rests on one CONTROL run per scenario. A second run would establish how stable CONTROL's own vocabulary is across runs. Without it, the "ratio >= 1.3" and "ratio >= 2" thresholds are reasonable but not validated against within-CONTROL variance. The patterns described here are stable across four different scenarios, which is some evidence of stability — but within-CONTROL variance remains unmeasured.
