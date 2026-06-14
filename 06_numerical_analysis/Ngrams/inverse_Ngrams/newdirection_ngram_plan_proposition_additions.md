# Proposition: Additions to the New Direction Plan (final)

## Status

This is a **proposed addition** to `newdirection_ngram_plan.md`. The original plan stays as the base; this document specifies what to add on top. This is the final version after the first review pass — convergence claims softened, word hygiene step added, "phase 4" renamed to avoid conflict with codex's existing 4th_phase.

## Why these additions are needed

The original plan is built around the lexicon-grouped analysis. It treats the filtered, grouped inverse n-grams as the main evidence and stops there. During the lexicon-based analysis we discovered that:

1. The lexicon classifies ~26% of the filtered inverse phrases. The other ~74% (5,214 phrases) sit in an unclassified bucket.
2. The unclassified bucket is **not** mostly scenario noise as I originally assumed. Only 1% is fully scenario; 67% contains no scenario terms at all. Most of it is content vocabulary the lexicon does not have words for.
3. When the unclassified bucket is analyzed for per-system word frequency, **each system shows a recurring vocabulary signature** that the lexicon misses entirely. These signatures are visible only when you look at what the lexicon does not catch.
4. The per-system signatures from the negative-space analysis **agree with** the per-system signatures from the lexicon-based analysis — they describe the same systems with different specific words.

This means the original plan captured roughly a quarter of the available signal. The other three quarters carry parallel readings that confirm (and in some cases extend) the lexicon-based findings. Leaving it out would understate what the analysis actually shows.

The additions below add:

- A second analysis layer (the negative space layer)
- A word hygiene step before that layer can be used for interpretation
- A synthesis layer that reads the two analyses side by side
- A paper-ready summary layer

Without changing the main method or replacing anything in the original plan.

---

## Naming note: "negative_space_layer" replaces "phase 4"

The conceptual name in this proposition is `negative_space_layer`. The term "phase 4" is avoided because codex already has a `4th_phase` directory and the numbering would collide. The work folder in the claude pipeline stays as `claude/04_unclassified/` because that directory already exists, but in writing and in the plan we refer to it as "the negative space layer" rather than "phase 4."

---

## Addition A — The negative space layer

### What it is

An analysis of the unclassified bucket from the lexicon-grouped phase — the phrases that survive the structural filter but are not caught by any expression-type group.

### Why it belongs in the plan

The original plan's main guardrail is "Do not overread raw uniqueness — treat filtered, repeated, meaningful inverse trigrams and quadgrams as evidence." The negative space layer honors this guardrail. It only looks at words that:

- appear in 3+ scenarios for the same system
- have count >= 8 in that system's data
- are disproportionately concentrated in one system

These are not raw uniqueness claims. They are filtered, repeated, cross-scenario stable patterns — exactly what the guardrail asks for. The only difference from the lexicon-grouped analysis is that the negative space layer uses no pre-built lexicon. Patterns are discovered from the data, not matched against expectations.

### Method (no new tools)

1. Load the `ungrouped_review/` files from the lexicon-grouped phase (one per scenario × level)
2. Per system: count content words in the unclassified phrases
3. Per system: identify words that appear in 3+ scenarios with count >= 8 (cross-scenario stable signature)
4. Compute disproportionate words: words where one system uses them with no other system using them at all (system-specific clusters)
5. Subtract scenario-noun layer to confirm what is left is not just scenario echoes
6. Output structured tables in `claude/04_unclassified/`

This is purely a vocabulary frequency analysis. No new lexicon, no new grouping scheme, no manual reading. The same hands-off algorithmic principle as the earlier filtering and grouping work.

### What this layer can claim

- Each system has a recurring vocabulary signature visible across scenarios
- These signatures are independent of the constraint vocabulary and the expression-type lexicon **structure** (no lexicon match was used to find them)
- The signatures are not just scenario echoes — most of the unclassified bucket has no scenario terms
- HYBSEM uses "default" 17 times across 4 scenarios while no other system uses it; AC15P leans on a post-incident operational vocabulary cluster; HYBRID_3_5 leans on bounded/scoping language; AC15 leans on abstract/institutional vocabulary; CONTROL has only a few generic stable words

### What this layer cannot claim

- It cannot claim these words perform language acts. They are vocabulary signatures, not act signatures.
- It is not statistically independent from the lexicon-grouped analysis. Both layers run on the same `core_filtered/` set, share the same structural filter, the same stopword list, and the same count thresholds. They are two **different readings of the same filtered field**, not two independent samples.
- It is open-ended pattern discovery. There is no held-out validation set.

### How the negative space layer fits the plan's existing principles

| Original plan principle | Negative space layer compliance |
|---|---|
| Stay fully inside the n-gram material | Yes — uses only the existing inverse n-gram tables |
| No prose close reading | Yes — purely word-frequency analysis |
| Inverse trigrams and quadgrams as main evidence | Yes — works on the same inverse field |
| Cross-scenario stability is the strongest identity claim | Yes — cross-scenario recurrence is the filter |
| Do not overread raw uniqueness | Yes — only stable, repeated, disproportionate patterns count |

The negative space layer is method-compatible with the original plan. It is an extension, not a deviation.

---

## Addition B — Word hygiene step (mandatory before interpretation)

### Why this step exists

The first run of the negative space layer produced a recurring-words table that mixes two kinds of words:

- **Real content signatures** — words like `default`, `without`, `definition`, `issues`, `integrity` that look like genuine system fingerprints
- **Function/discourse residue** — words like `i`, `no`, `how`, `like`, `just`, `time` that recur because they are common in any English text, not because they reveal a system character

If we move directly from the recurring-words table to interpretation, we will over-claim. Some recurring words are signal, some are background. The hygiene step separates them before any writeup uses them.

The hygiene principle: **no silent removal**. Every word stays in the data; words just get a `band` label so the clean table is auditable and the residue is preserved for cross-checking.

### Three bands

1. **content_signature** — words clearly carrying system character. Used directly in interpretation and writeup.
2. **borderline** — words where context matters. Could be signal (e.g., `must`, `without`, `time`, `after` in the right cluster) or could be residue. Held out of interpretation by default but available for case-by-case promotion.
3. **function_residue** — words clearly background (`i`, `just`, `like`, `how`). Kept in the data for audit but not used in interpretation.

### Default rule for unlisted words

Any recurring word that is not in any of the three lists is assigned to **borderline** by default. It does not silently fall into `content_signature`. The reasoning: an unreviewed word should never be treated as signal until a human looks at it. Borderline is the safe default — it preserves the word, marks it as needing review, and keeps it out of interpretation until promoted.

If after a hygiene run the borderline bucket is large, the bands file should be expanded (adding clearly-signature words to content_signature and clearly-residue words to function_residue) and the cleanup re-run.

### Special signatures (technical/artifact tokens)

A few items in the initial content seed look like technical or artifact tokens rather than ordinary content words:

- `p_event_total`, `p_hi` — look like variable names or annotation tokens (probably from AC15P's structured output)
- `sha` — possibly a hash reference
- Similar items may appear in future runs

These are still meaningful — they are part of a system's distinctive output — but they are a different *kind* of signal from words like `definition` or `default`. They suggest the system is producing structured/coded output, not just distinctive vocabulary.

When writing them up, treat them as their own sub-category (technical_artifact_signature) within content_signature so the reader knows they come from structured output rather than from natural-language word choice. They count as signal but should be flagged for what they are.

### Note on cross-layer consistency: judgment

The word `judgment` was removed from the `truth` group in the expression-type lexicon because it didn't reliably perform a truth-related language act at n-gram level. It is included here in `content_signature` because the negative space layer measures a different thing: vocabulary fingerprints, not language acts. A word can fail as an act-classification anchor but succeed as a vocabulary signature for a system that uses it distinctively.

This is consistent: the two layers measure different things and use different inclusion rules. The same word can be excluded from one and included in the other without contradiction.

### Bands list (initial draft)

The initial draft of the bands list is in the proposed file `negative_space_word_bands.md` (to be created at the root of `inverse-ngrams/` for review before use). The lists below are a starting point and will be refined during review.

**Hard deny (function_residue):**
```
i, you, he, she, we, they, him, her, them, us, my, your, his, our, their
just, like, maybe, sure, yes
how, why, where, when, what
get, got, gets, getting, take, took, taken, taking
make, made, makes, making, do, did, does, doing, done
go, gone, going, goes
some, any, more, most, other, another
also, even, still, only, very, much
back, here, there, again
```

**Borderline:**
```
no, time, after, within, before, during, until
days, weeks, months, years
one, two, three, both, each
end, mode, way, ways, thing, things, point, points
work, working, model, models, type, types, kind, line
sign, mark, brief, project, service, system
must, without
```

**Content signature (initial seed — words from the existing recurring table that look like genuine signatures):**
```
default, integrity, definition, issues, exclusions, postmortems, commissioning,
judgment, spine, panel, version, sample, proximity, licensed, acceptance,
override, overrides, remedies, aborts, certified, equivalents, containment,
stabilization, reputational, legal, advice, records, eligibility, procure,
separation, interoperability, unconditional, substitutes, readiness,
mutually, avoidance, p_event_total, p_hi
```

### What the hygiene step produces

For the input `claude/04_unclassified/cross_scenario_patterns/system_recurring_words.csv`, the hygiene step produces:

- `system_recurring_words_with_band.csv` — the original table with a new `band` column (full audit trail)
- `system_recurring_words_content.csv` — only `content_signature` rows (the clean interpretation table)
- `system_recurring_words_borderline.csv` — only `borderline` rows (review-only)
- `system_recurring_words_residue.csv` — only `function_residue` rows (audit-only)

Interpretation uses only the content table. Borderline is consulted case-by-case when a specific cluster needs context. Residue is never used for interpretation but is preserved.

### Where the bands list lives

`inverse-ngrams/negative_space_word_bands.md` at the root, alongside the other reference lexicons (`expression_type_lexicon_v3.md`, `inverse_filtering_constraint_lexicon.md`, `scenario_specific_lexicon.md`). This keeps reference vocabulary in one discoverable location.

---

## Addition C — Synthesis / convergence layer

### What it is

A reading of the lexicon-grouped phase and the negative space layer side by side, asking: do the two layers tell the same story about each system?

### Why it belongs in the plan

The original plan's section 4 ("Cross-System Identity") asks "do the same expression types repeat across scenarios for each system?" This is cross-scenario stability within one analysis.

The synthesis layer asks a related but different question: **do the same system patterns appear when the data is read two different ways?** Cross-method convergence is a complementary observation, not a stronger statistical claim. The two layers run on the same filtered field, so they are not independent in the strict sense.

The honest framing:

- The two layers are **different readings of the same filtered field**
- If they converge on a system's character, that is **stronger than one reading alone**
- It is **not statistically independent confirmation** — both layers share filters, stopwords, and source data
- The convergence is best read as: "the system signature is detectable through two different procedures, which makes it less likely to be an artifact of one procedure's choices"

### What this layer adds

- A per-system table showing the lexicon-grouped signature next to the negative-space signature
- A judgment, per system, of whether the two readings agree
- An explicit statement that convergence here is complementary, not independent

### What this layer cannot claim

- Statistical independence (the two readings share inputs)
- Validation against external truth
- That convergence proves the signatures are governance-driven; it shows they are stable across two procedures applied to the same filtered field

---

## Addition D — Paper-ready summary

### What it is

A tight, claim-by-claim document distilling the headline findings into the form the paper section can quote from directly. Not new analysis — a curated extract.

### When it can be written

**Only after the word hygiene step (Addition B) is complete and reviewed.** Otherwise the summary would quote weak signal as evidence. The dependency order is:

1. Negative space layer (Addition A) — already done
2. Word hygiene cleanup (Addition B) — must be done before any interpretation uses the recurring-words table
3. Synthesis layer (Addition C) — depends on a clean negative-space table
4. Paper-ready summary (Addition D) — depends on synthesis

### What it contains

- The headline claim: anchored systems differ from CONTROL and from each other in ways matching their instruction language character; this is visible in two readings of the same filtered field that converge
- One section per system (CONTROL, AC15, AC15P, HYBRID_3_5, HYBRID_SEMANTIC)
  - Each section cites both the lexicon-grouped evidence and the negative-space content_signature evidence
  - Each section ends with the inferred system character
- The trifecta thesis evidence: same logic, different language architecture, different output signatures
- Methodological caveats: vocabulary not language acts, two readings not independent samples, single experiment, four scenarios, HYBSEM imagination calibration artifact excluded

### What it does not contain

No raw data. No method description beyond minimal context. No interpretation that goes beyond what the cleaned negative-space layer and the lexicon-grouped layer directly support.

---

## Updated writing structure

The original plan has 5 sections in its Writing Structure. The proposition expands to 7:

### 1. Short framing section *(unchanged from original plan)*
Show how small the shared field is, why shared trigrams and quadgrams cannot carry the main argument.

### 2. Main inverse n-gram section *(unchanged from original plan)*
Per scenario, inverse trigrams and quadgrams grouped by system and by expression type. The lexicon-grouped evidence.

### 3. Shared residue section *(unchanged from original plan)*
What remains shared across all systems and what remains shared among anchored systems only.

### 4. Negative space section *(NEW — from Addition A, after Addition B cleanup)*
The unclassified bucket as a parallel reading of the same filtered field. Per-system content_signature words (cleaned via the hygiene step), cross-scenario stable patterns. The argument that lexicon-missed patterns also show system signatures, with the explicit note that this is a complementary reading, not independent confirmation.

### 5. Cross-system identity section *(modified — uses both readings from Addition C)*
For each system, describe the signature using both the lexicon-grouped evidence (section 2) and the negative-space content evidence (section 4). Note convergence between the two readings. The original section 4 asked about cross-scenario stability; this version asks about cross-reading convergence as well.

### 6. Synthesis section *(NEW — from Addition C)*
Brief reading of the two layers together. The argument that two readings of the same filtered field agreeing on the same system signatures is stronger than either alone, with the honest caveat that it is not statistical independence. May be merged with section 5 if the synthesis fits naturally inside the per-system descriptions.

### 7. Return to the thesis *(unchanged from original plan)*
The common residue is small, the main body of longer phrasing is system-specific, those system-specific differences align with the different instruction systems, this supports the claim that language architecture matters.

---

## Updated practical order of work

The original plan has 9 steps in its Practical Order of Work. The proposition adds steps 10-15:

### Original steps 1-9 *(unchanged)*

1. Start with `all ngrams`.
2. Build inverse trigram tables for all 4 scenarios and all 5 systems.
3. Build inverse quadgram tables for all 4 scenarios and all 5 systems.
4. Apply algorithmic filters.
5. Group the filtered phrases by expression type.
6. Compare the systems within each scenario.
7. Check cross-scenario stability for each system.
8. Use non-control shared as secondary support.
9. Use all-five shared only as residual context.

### New steps 10-15

10. **Negative space layer.** After the lexicon grouping is complete, run a per-system word-frequency analysis on the unclassified bucket. Compute cross-scenario stable words (3+ scenarios, count >= 8) and disproportionate vocabulary (one system using a word with no others). Subtract the scenario-noun layer to confirm signal is not scenario echo. Outputs in `claude/04_unclassified/`.

11. **Word hygiene cleanup.** Build the word-bands file (`negative_space_word_bands.md` at the root). Apply the bands to the recurring-words table. Produce three output files (content, borderline, residue) plus a banded full audit table. **No interpretation uses the recurring-words data until this step is complete.**

12. **Negative space observations document.** Write a short observations document parallel to the lexicon-grouped one, but using **only the cleaned content_signature table**. Same structural sections (what was done, big finding, per-system distributions, system signatures, methodological limits including non-independence).

13. **Synthesis layer.** Write a short synthesis document reading the two analyses side by side. Per-system convergence table. Judgment of where the two layers agree or diverge. Explicit non-independence caveat.

14. **Paper-ready summary.** Write the headline-claim document distilling the cleaned negative-space layer and the lexicon-grouped layer into the form the paper section can cite. Includes the HYBSEM imagination caveat as a methodological exclusion.

15. **Final review pass.** Read all four new documents end-to-end. Confirm no claim depends on uncleaned data. Confirm no claim overstates statistical independence. Confirm the HYBSEM caveat appears wherever imagination is mentioned.

---

## File locations

```
inverse-ngrams/
├── negative_space_word_bands.md          (NEW — at root, alongside other lexicons)
├── claude/
│   ├── 04_unclassified/                  (already exists)
│   │   ├── cross_scenario_patterns/
│   │   │   ├── system_recurring_words.csv             (already exists — raw)
│   │   │   ├── system_recurring_words_with_band.csv   (NEW — full audit)
│   │   │   ├── system_recurring_words_content.csv     (NEW — clean interpretation table)
│   │   │   ├── system_recurring_words_borderline.csv  (NEW — review-only)
│   │   │   └── system_recurring_words_residue.csv     (NEW — audit-only)
│   │   └── ... (other existing subdirs unchanged)
│   └── 05_writeup/                       (NEW)
│       ├── negative_space_observations.md
│       ├── synthesis_lexicon_vs_negative_space.md
│       └── system_signatures_summary.md
```

The `05_writeup/` directory keeps reading material separate from analysis output. The `phase3_observations.md` document already exists at `claude/03_grouped/phase3_observations.md`; it stays where it is.

---

## What the additions do not change

- The original plan's core decision (stay inside the n-gram material): unchanged
- The main hierarchy (inverse trigrams, inverse quadgrams, non-control shared, all-five shared, bigrams as support): unchanged
- The constraint frame (truth, practicality, temporal, imagination): unchanged
- The main method (filter algorithmically, group by expression type, check cross-scenario stability): unchanged
- The role of bigrams, shared n-grams, domain, discourse: unchanged
- The main guardrail (do not overread raw uniqueness): unchanged and reinforced by the hygiene step

The additions are incremental on top of the original plan, not a replacement of it.

---

## Open questions for review

1. **Section 6 vs merged section 5.** Should the synthesis be its own section (option A: 7 sections) or absorbed into the cross-system identity section (option B: 6 sections)? Option A is more visible; option B is tighter.

2. **Negative space stability thresholds.** The proposition uses "3+ scenarios, count >= 8" as the stability filter. These are tunable. Should they be adjusted before the hygiene cleanup, or held as-is?

3. **Bands list draft.** The hard_deny / borderline / content_signature lists above are a starting point. Do you want to review them and propose changes before the bands file is built, or accept them as a starting draft and refine after the first cleanup run?

4. **Synthesis scope.** The synthesis layer can be brief (one paragraph per system, table-heavy) or longer (per-system narratives). My recommendation is brief — the per-phase observation docs already carry the long descriptions, the synthesis just maps the convergence.

5. **HYBSEM imagination caveat placement.** The caveat is repeated across phase 3 observations, the synthesis, and the summary. Is one canonical location preferable, or repeating it in each context?

---

## Next concrete step (recommendation)

Do not start the new writing yet. The right next step is:

1. **Build the bands file** (`negative_space_word_bands.md` at the root) with the initial hard_deny / borderline / content_signature lists drafted above
2. **Review the bands file** — adjust before any cleanup runs
3. **Run the hygiene cleanup** on `system_recurring_words.csv`, producing the four banded output files
4. **Inspect the cleaned content table** — confirm it reads as a defensible signature set, not residue
5. **Then and only then** start writing the negative space observations document, the synthesis, and the paper-ready summary in that order

This protects against writing claims based on uncleaned data and keeps the iteration honest.
