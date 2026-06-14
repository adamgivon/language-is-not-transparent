# Negative Space Summary With Proportions

## What this summary does

This note rewrites the negative-space findings with explicit scale.

The main correction is:
- the cleaned recurring-word signatures are useful
- but they are extremely small against total output
- so they should be treated as supporting markers, not defining evidence

This layer also does not revise the main n-gram result:
- the systems remain overwhelmingly different
- the shared field remains negligible for substantive interpretation
- the negative-space layer only adds a small residual vocabulary signal that can sharpen, but not replace, the grouped reading

## Scale first

The cleaned `content_signature` band occupies only a tiny share of total trigram + quadgram token windows:

- `AC15`: `30` counts = `0.0247%` of total tri+quad windows (`2.468` per `10k`)
- `AC15P`: `74` counts = `0.0590%` (`5.903` per `10k`)
- `HYBRID_3_5`: `41` counts = `0.0360%` (`3.601` per `10k`)
- `HYBRID_SEMANTIC`: `76` counts = `0.0631%` (`6.315` per `10k`)
- `CONTROL`: `0` cleaned content-signature counts under the current bands

Even where the content-signature band is strongest, it remains well under `0.1%` of total tri+quad output.

So the negative-space layer is far too small to define a system on its own.

## What the negative-space layer still shows

The layer remains useful because the words that survive cleanup are:

- cross-scenario
- system-skewed
- not just scenario furniture

But they are still residual markers.

## Per-system read

### AC15

`AC15` has the thinnest anchored negative-space signal: only `30` cleaned counts, `0.0247%` of total tri+quad windows.

The words that survive, such as `vs`, `must`, and `default`, are still consistent with a contrastive or normative tendency. But the scale is too small to treat them as a full vocabulary profile.

So the safe reading is:
- the negative space does not define `AC15`
- it only weakly supports the grouped-layer reading

### AC15P

`AC15P` has `74` cleaned counts, `0.0590%` of total tri+quad windows.

The surviving words, such as `after`, `within`, `because`, and `vs`, are coherent. They support sequence, scope, cause, and contrast.

This is enough to say:
- the negative-space layer supports the grouped operational reading of `AC15P`
- but the support is still residual, not dominant

### HYBRID_3_5

`HYBRID_3_5` has `41` cleaned counts, `0.0360%` of total tri+quad windows.

The surviving words, especially `without`, `scope`, and `explicit`, do support a bounded or line-drawing tendency. But they do not justify a strong claim such as "the system is exclusion-based."

The right phrasing is:
- these are supporting markers of a broader boundedness profile already visible in the grouped layer

### HYBRID_SEMANTIC

`HYBRID_SEMANTIC` has the strongest cleaned content-signature band: `76` counts, `0.0631%` of total tri+quad windows.

The surviving words, such as `now`, `under`, `must`, `without`, and `default`, are coherent and are the strongest negative-space support in the set.

Even here, though, the signal remains residual. It is strong for this layer, but still small in absolute scale.

### CONTROL

`CONTROL` has no cleaned content-signature words under the current bands.

That should not be read as "no pattern." It should be read narrowly:
- no cleaned residual content-signature words survive under the current negative-space cleanup

The `CONTROL` profile is better seen through the separate control-signature analysis, not through this layer.

## What the negative-space layer supports

The negative-space layer supports claims of this kind:

- a small set of recurring words survives cleanup for some systems
- those words are compatible with the grouped-layer readings
- some systems are more recoverable in cleaned residual vocabulary than others

## What the negative-space layer does not support

The negative-space layer does not support claims of this kind:

- one or two words define a whole system
- these words represent a large part of total output
- the negative-space layer can carry system-character claims by itself

## Bottom line

The negative-space layer is a support layer. Its cleaned signatures are real, but they are tiny against total output. Their proper use is to support the grouped analysis where the recurring residual words line up with the grouped tendencies.
