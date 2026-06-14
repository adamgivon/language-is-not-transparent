# CONTROL Signature — Observations and Conclusions Summary

## Headline

CONTROL does have a recognizable signature. It is not a tight technical vocabulary like the anchored systems'. It is a recurring advisory frame — repeated conversational scaffolds, second-person guidance, conditional templates — that appears stably across all four scenarios.

The earlier reading that CONTROL has "zero content_signature words" was accurate only inside the constraint-shaped filter used for the anchored systems. When CONTROL is read without that filter, a signature appears.

---

## Primary evidence: phrase shape

CONTROL's most-repeated trigrams and quadgrams across all four scenarios are conversational scaffolds, not scenario content:

**Top CONTROL trigrams (pooled across scenarios):**

| Phrase | Count |
|---|---|
| if you want | 34 |
| if you can | 34 |
| you can t | 31 |
| you don t | 29 |
| you tell me | 24 |
| if you tell | 23 |
| you re not | 20 |
| i can help | 19 |
| can help you | 19 |
| it s a | 18 |
| if it s | 16 |
| your home base | 16 |
| you want i | 14 |
| want i can | 14 |
| you may be | 13 |

**Top CONTROL quadgrams:**

| Phrase | Count |
|---|---|
| if you tell me | 23 |
| i can help you | 19 |
| if you can t | 17 |
| if you want i | 14 |
| you want i can | 14 |
| keep your home base | 11 |
| you tell me what | 8 |
| if you want tell | 7 |
| you want tell me | 7 |
| can help you draft | 7 |
| what did we try | 7 |

**Top CONTROL phrase starters (first 2 tokens, by count):**

| Starter | Count |
|---|---|
| if you | 220 |
| it s | 164 |
| you can | 156 |
| you re | 111 |
| don t | 107 |
| what you | 58 |
| you want | 57 |
| i can | 57 |
| doesn t | 52 |
| isn t | 51 |
| that s | 50 |
| if the | 50 |
| this is | 48 |

These numbers describe a stable pattern:

1. **Second-person guidance is the dominant frame.** `if you` (220), `you can` (156), `you re` (111), `what you` (58), `you want` (57), `i can` (57) — CONTROL builds responses around the user's position and the system's offer of help.

2. **Conditional framing is constant.** `if you` (220), `if you want` (34), `if you can` (34), `if the` (50), `if it s` (16), `if you tell me` (23) — CONTROL structures responses with "if X, then" templates.

3. **Negation is heavy.** `don t` (107), `doesn t` (52), `isn t` (51), `you don t` (29), `you can t` (31), `if you can t` (17), `you re not` (20) — CONTROL uses negative framing as a recurring scaffold.

4. **Offer-of-help templates recur.** `i can help` (19), `can help you` (19), `i can help you` (19), `can help you draft` (7) — CONTROL repeatedly offers assistance in the same phrase structure.

5. **Direct-address templates recur.** `you tell me` (24), `if you tell me` (23), `if you tell` (23), `you want i` (14), `want i can` (14), `if you want i` (14), `you want i can` (14) — a recurring invitation-to-specify pattern.

This is the clearest evidence of CONTROL's style. The pattern is visible in total frequency and is stable across all four scenarios.

---

## Supporting evidence: disproportionate vocabulary

Words CONTROL uses disproportionately more than the anchored systems (ratio >= 1.3, count >= 20), after excluding scenario-bound terms:

**Evaluative and planning vocabulary:**
- `prioritize`, `consequence`, `realistically`, `probable`, `intact`
- `predictability`, `curated`, `commercial` (used across multiple scenarios)
- `citations`, `receipts`, `restate`, `verbatim`
- `prudent`, `unconditional`, `unqualified`, `wide`, `severe`

**Caveat on scenario contamination:** some high-ranking disproportionate words are concentrated in specific scenarios and should not be read as cross-scenario signatures:
- `people`, `shared`, `debt`, `home`, `health` — heavily S7-colored
- `memory`, `repo`, `vector` — heavily S5-colored
- `controllers`, `hardware`, `commercial` — heavily S1/S3-colored

These are kept in the data for audit but are not claimed as stable style markers.

The genuinely cross-scenario disproportionate vocabulary (`prioritize`, `consequence`, `realistically`, `prudent`, `curated`, `forensics`, `citations`, `verbatim`, `procure`, `compete`, `positioning`, `restate`) points to a generic analytical-advisory register. This layer supports the phrase-shape finding but does not carry its own claim.

---

## Conclusions

### 1. CONTROL has a signature

The earlier "zero content_signature words" reading was incomplete. It reflected the limits of the constraint-shaped filter, not an absence of CONTROL's style. Under a different lens — total phrase recurrence — CONTROL produces a clear, stable pattern.

### 2. The signature is an advisory frame, not a vocabulary fingerprint

CONTROL's signature is visible in how it structures answers, not in what specialized words it uses. Its characteristic markers are:

- second-person guidance ("if you...", "you can...", "you re...")
- conditional templates ("if you want X, I can Y")
- offer-of-help phrases ("I can help you...")
- negative framing ("don t", "you don t", "you can t")
- direct-address invitation ("you tell me...", "if you tell me what...")

This is a recurring advisory structure, not a specialized lexicon.

### 3. The vocabulary layer supports a secondary interpretation

CONTROL's disproportionate use of evaluative-planning vocabulary (`prioritize`, `consequence`, `realistically`, `prudent`, `curated`, `citations`, `forensics`, `verbatim`) is consistent with a generic analytical-advisory register — what might be called a default AI-consultant voice. This is a plausible interpretation but should remain secondary. The phrase-shape evidence is the primary support.

### 4. CONTROL differs from the anchored systems in where its style lives

The anchored systems show their identity through **sharper recurring vocabulary** — bounded, system-specific words that appear across scenarios:

- AC15P: after, within, because, vs
- HYBRID_3_5: without, scope, explicit
- HYBRID_SEMANTIC: now, default, under, without, must
- AC15: vs, must, default (sparse)

CONTROL shows its identity through **recurring conversational scaffolds** — generic templates that appear across scenarios:

- if you, you can, you re, don t, i can help, if you tell me

Both are signatures. They live in different places in the language. The anchored systems compress their style into sharper recurring words; CONTROL's style is in the phrase shapes.

### 5. Governance does two things, not one

This finding supports a stronger reading of what governance accomplishes than the earlier "absent baseline" framing allowed.

Governance does not **create** distinctiveness from nothing. It **substitutes** distinctiveness:

- CONTROL already has a recurring style — the default advisory frame
- The anchored systems produce less of this generic scaffolding and more constraint-specific vocabulary
- Governance replaces the default style with constraint-shaped language

This is a richer claim than "anchored systems are more distinctive than control." It is: governance changes the default answer-construction style, not just the word choice.

### 6. The finding is comparative, not causal

The phrase-shape evidence shows that CONTROL produces these scaffolds stably across scenarios and that the anchored systems produce them less. It does not prove that the instruction sets caused the shift. What it shows is consistent with the thesis — same model, different instructions, different output styles — but causation depends on the experimental design (one model, varied instructions), not on this analysis alone.

---

## Limits

1. **Single CONTROL run per scenario.** Within-CONTROL variance is not measured. The phrase-shape patterns are stable across four different scenarios, which is some evidence of stability, but a second CONTROL run would be needed to establish baseline variance.

2. **Same raw data as the other analyses.** This is not statistically independent evidence. It is a different reading of the same n-gram field.

3. **N-gram-level only.** The analysis does not read full response texts. Whether CONTROL's conversational scaffolds actually carry the advisory work (or appear in contexts that would change the reading) would require sentence-level analysis.

4. **Interpretation is interpretive.** Calling CONTROL's style a "default AI-consultant voice" is a framing, not a finding. What the data shows is advisory framing; the naming belongs to the paper, not the analysis.

5. **Asymmetric methodology.** The anchored systems were analyzed through a constraint-based lexicon; CONTROL through total phrase frequency. These two methods are not directly comparable in the same metric. The comparison is qualitative: "what kind of signature does each system have?" — not quantitative.

---

## Bottom line for the paper

CONTROL has a recognizable style: a recurring advisory frame built from second-person guidance, conditional templates, and generic offer-of-help phrasing, visible across all four scenarios through high-frequency phrase scaffolds. The anchored systems produce less of this generic scaffolding and more constraint-specific vocabulary. The difference is not that governance creates identity where there was none — it is that governance replaces the default advisory style with constraint-shaped language.
