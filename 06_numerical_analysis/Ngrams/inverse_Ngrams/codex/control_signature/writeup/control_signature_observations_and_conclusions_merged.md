# CONTROL Signature — Merged Observations And Conclusions

## Purpose

This note merges the stricter `codex` reading of `CONTROL` with the richer but looser `claude` reading.

The aim is to keep the stronger descriptive insight from the broader pass without overstating what the current n-gram evidence can carry.

## Materials Used

Primary `codex` materials:
- `control_disproportionate_words_main.csv`
- `control_disproportionate_word_contexts.csv`
- `control_top_total_phrases.csv`
- `control_top_phrase_starters.csv`

Comparison document:
- `claude/Control_signature/control_signature.md`

## Method Position

This report keeps two layers:

1. Word-level disproportion:
   what `CONTROL` uses more than the anchored systems across the experiment.

2. Phrase-level recurrence:
   the repeated trigram and quadgram shapes in `CONTROL`'s total output.

The word layer is useful, but the phrase layer is the stronger evidence. The word layer is partly scenario-sensitive. The phrase layer is where the cross-scenario regularity is clearest.

## Main Observations

### 1. CONTROL does have a recognizable signature

The earlier "no content-signature words" result was too narrow as a description of `CONTROL`.

Under the constraint-shaped hygiene used for the anchored systems, `CONTROL` did not yield a clean constraint-related signature. But when it is read outside those buckets, a pattern appears.

That pattern is not a sharp technical lexicon. It is a recurring advisory and explanatory style.

### 2. The strongest CONTROL signal is phrase shape

The most repeated total phrases are not distinctive technical formulations. They are recurring user-facing frames:

- `if you can`
- `if you want`
- `you can t`
- `you don t`
- `you tell me`
- `if you tell me`
- `i can help you`

The most repeated starters are even clearer:

- `if you`
- `it s`
- `you can`
- `you re`
- `don t`
- `what you`
- `i can`

This is the clearest cross-scenario pattern in the `codex` results. `CONTROL` repeatedly builds answers through second-person guidance, conditional framing, and generic explanation scaffolds.

Basic interpretation:
- `CONTROL` tends to speak in reusable answer templates.
- It often starts from user-facing conversational framing rather than from a narrow system-specific vocabulary.
- Its style is visible less in what special words it owns and more in how it repeatedly shapes an answer.

### 3. The word layer points in the same direction, but more loosely

The stricter `codex` word table surfaces broad evaluative and planning words such as:

- `prioritize`
- `consequence`
- `realistically`
- `probable`
- `intact`
- `recommend`
- `framework`
- `evaluate`

Some high-ranking words are also strongly scenario-colored, especially in `S7`:

- `people`
- `shared`
- `debt`

And some cluster around specific scenarios:

- `refresh`, `wide` in `S5`
- `consequence` in `S3`
- `intact`, `realistically`, `people`, `shared` in `S7`

So the stricter word layer does not show a single tight CONTROL vocabulary. It shows a looser lean toward:

- evaluation
- prioritization
- planning
- consequence language
- interpersonal framing in the relationship scenario

That is consistent with an advisory style, but on its own it is weaker than the phrase evidence.

### 4. The broader `claude` pass adds a richer lexical picture

The `claude` document uses a looser comparison and no hygiene subtraction. Because of that, it surfaces a broader set of lexical items, including:

- `forensics`
- `verbatim`
- `uncited`
- `receipts`
- `citations`
- `predictability`
- `curated`
- `commercial`
- `procure`
- `compete`
- `positioning`

These support a stronger reading: `CONTROL` often sounds like a general analytical or consultant-style system.

I would keep that reading, but at a basic level:
- this broader vocabulary is consistent with a generic analytical-consultant register
- it is not as cleanly cross-scenario as the phrase templates
- so it should support the interpretation, not carry it alone

### 5. CONTROL stays closer to generic advisory framing than the anchored systems do

This is the main comparative result.

The anchored systems are easier to identify through sharper recurring vocabulary:
- bounded phrases
- system-specific conditions
- repeated operational markers
- recurring constraint-shaped language

`CONTROL`, by contrast, is easier to identify through:
- user-facing scaffolds
- conditional framing
- generic explanation frames
- broad evaluative and planning language

So the difference is real, but it should be described carefully:
- the anchored systems show more constrained and system-specific recurring language
- `CONTROL` shows more generic conversational and advisory structure

## Merged Interpretation

The best balanced reading is this:

`CONTROL` is not style-less. It has a recognizable default style. That style looks less like a system with a sharp recurring vocabulary identity and more like a system with a strong recurring advisory frame.

At the basic interpretive level, that frame has four visible traits:

1. It is user-facing.
   `CONTROL` repeatedly builds around `if you`, `you can`, `you want`, `you tell me`.

2. It is conditional and explanatory.
   `CONTROL` repeatedly uses general frames like `it s`, `that s`, `this is`, `what you`.

3. It is evaluative and planning-oriented.
   Words like `prioritize`, `consequence`, `realistically`, `probable`, `recommend`, and `framework` fit that lean.

4. It stays relatively close to generic answer construction.
   Compared with the anchored systems, `CONTROL` appears to rely less on a sharply bounded recurring lexicon and more on reusable advisory phrasing.

This is where the `claude` phrase "default AI consultant voice" becomes useful.

I would keep it in a softened form:
- `CONTROL` is consistent with a default analytical-consultant style
- the strongest direct evidence for that claim is the phrase layer
- the broader lexical layer supports it, but does not prove it by itself

## Conclusions

### Conclusion 1

The earlier `CONTROL = no signature` reading was incomplete.

It was accurate only inside the narrower constraint-shaped filter. Outside that filter, `CONTROL` shows a recognizable style.

### Conclusion 2

`CONTROL`'s clearest style marker is repeated conversational and advisory framing, not a tight inverse vocabulary signature.

This is the strongest conclusion in the current evidence.

### Conclusion 3

The broader lexical comparison supports a secondary reading of `CONTROL` as more analytical-consultant in tone than the anchored systems.

This is a defensible interpretation, but it should remain secondary to the phrase-level result.

### Conclusion 4

The anchored systems and `CONTROL` differ not only in which recurring words survive, but in where their style becomes visible.

- anchored systems: clearer through sharper recurring vocabulary
- `CONTROL`: clearer through reusable answer framing

### Conclusion 5

Within this experiment, the anchored systems appear to replace more of the generic advisory frame with sharper recurring system-specific language.

That does not prove a full causal theory by itself, but it is consistent with the broader thesis that governance or anchoring does not just add vocabulary. It also changes the default style of answer construction.

## Limits

- This is still the same underlying n-gram dataset, not an independent source of evidence.
- The `claude` lexical pass is broader and therefore more interpretive.
- Several high-ranking `CONTROL` words are scenario-concentrated, especially in `S7`, so the word layer should not be overgeneralized.
- The phrase layer is stronger than the lexical layer.
- A second `CONTROL` run would be needed to test within-control stability directly.

## Bottom Line

The safest merged conclusion is:

`CONTROL` does have a signature. Its strongest signature is not a narrow identity lexicon, but a recurring advisory frame built from second-person guidance, conditional phrasing, and broad evaluative explanation. The broader lexical evidence is consistent with reading that frame as a default analytical-consultant style, while the anchored systems shift more of their recurrence into sharper system-specific language.`
