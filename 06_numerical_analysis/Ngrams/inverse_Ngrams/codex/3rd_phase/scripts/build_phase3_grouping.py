#!/usr/bin/env python3

from __future__ import annotations

import csv
import re
from collections import defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[3]
PHASE2_ROOT = ROOT / "codex" / "2nd_phase"
OUT_ROOT = Path(__file__).resolve().parents[1]
LEXICON_PATH = ROOT / "expression_type_lexicon_v3.md"

LEVELS = ("trigrams", "quadgrams")
SYSTEMS = ("CONTROL", "AC15", "AC15P", "HYBRID_3_5", "HYBRID_SEMANTIC")
TOKEN_RE = re.compile(r"[a-z0-9]+")
GROUP_HEADER_RE = re.compile(r"^## Group \d+: ([a-z0-9_]+)\s*$", re.IGNORECASE)
STEM_LINE_RE = re.compile(r"^Stems(?: retained)?:\s*(.+)$", re.IGNORECASE)

LAYER_A_GROUPS = {
    "truth",
    "practical_considerations_and_execution",
    "temporal_projection",
    "imagination_and_possibility",
}
LAYER_B_GROUPS = {
    "surfacing",
    "smoothing",
    "hedging",
    "warning",
    "conditions",
    "autonomy_sovereignty",
}


def ensure_dirs() -> None:
    for rel in [
        "grouped/annotated_core_filtered/trigrams",
        "grouped/annotated_core_filtered/quadgrams",
        "grouped/exploded/trigrams",
        "grouped/exploded/quadgrams",
        "grouped/ungrouped_review/trigrams",
        "grouped/ungrouped_review/quadgrams",
        "grouped/scenario_heavy_with_groups/trigrams",
        "grouped/scenario_heavy_with_groups/quadgrams",
        "summaries",
        "scripts",
    ]:
        (OUT_ROOT / rel).mkdir(parents=True, exist_ok=True)


def normalize_tokens(text: str) -> list[str]:
    return TOKEN_RE.findall(text.lower())


def slugify(value: str) -> str:
    tokens = normalize_tokens(value)
    return "_".join(tokens) if tokens else "main"


def parse_expression_lexicon(path: Path) -> tuple[dict[str, dict[str, object]], dict[str, dict[str, object]]]:
    groups: dict[str, dict[str, object]] = {}
    subgroups: dict[str, dict[str, object]] = {}
    current_group: str | None = None
    current_subgroup_key: str | None = None
    in_fence = False
    fence_lines: list[str] = []
    current_fence_subgroup_key: str | None = None

    def ensure_subgroup(group_name: str, subgroup_name: str) -> str:
        subgroup_key = f"{group_name}:{subgroup_name}"
        if subgroup_key not in subgroups:
            subgroups[subgroup_key] = {
                "group": group_name,
                "subgroup": subgroup_name,
                "terms": set(),
                "prefix_terms": set(),
            }
        return subgroup_key

    for raw_line in path.read_text(encoding="utf-8").splitlines():
        stripped = raw_line.strip()

        if not in_fence:
            header_match = GROUP_HEADER_RE.match(stripped)
            if header_match:
                current_group = header_match.group(1)
                groups[current_group] = {
                    "terms": set(),
                    "prefix_terms": set(),
                }
                current_subgroup_key = None
                continue

            if current_group is None:
                continue

            if stripped.startswith("### "):
                title = stripped[4:].strip()
                if title.lower().startswith("sub-element ") and ":" in title:
                    title = title.split(":", 1)[1].strip()
                if "(" in title:
                    title = title.split("(", 1)[0].strip()
                subgroup_name = slugify(title)
                current_subgroup_key = ensure_subgroup(current_group, subgroup_name)
                continue

            stem_match = STEM_LINE_RE.match(stripped)
            if stem_match:
                if current_subgroup_key is None:
                    current_subgroup_key = ensure_subgroup(current_group, "main")
                parts = [part.strip().lower() for part in stem_match.group(1).split(",") if part.strip()]
                groups[current_group]["prefix_terms"].update(parts)
                subgroups[current_subgroup_key]["prefix_terms"].update(parts)
                continue

            if stripped.startswith("```"):
                in_fence = True
                if current_subgroup_key is None:
                    current_subgroup_key = ensure_subgroup(current_group, "main")
                current_fence_subgroup_key = current_subgroup_key
                fence_lines = []
                continue

        else:
            if stripped.startswith("```"):
                for fence_line in fence_lines:
                    if not fence_line:
                        continue
                    term = fence_line.lower()
                    groups[current_group]["terms"].add(term)
                    subgroups[current_fence_subgroup_key]["terms"].add(term)
                in_fence = False
                fence_lines = []
                current_fence_subgroup_key = None
                continue

            if stripped:
                fence_lines.append(stripped)

    for group_name, spec in groups.items():
        if group_name in LAYER_A_GROUPS:
            spec["layer"] = "constraint_aligned"
        elif group_name in LAYER_B_GROUPS:
            spec["layer"] = "cross_cutting"
        else:
            raise ValueError(f"Unexpected expression group in lexicon: {group_name}")

    for subgroup_key, spec in subgroups.items():
        group_name = str(spec["group"])
        spec["layer"] = str(groups[group_name]["layer"])

    return groups, subgroups


def compile_terms(terms: set[str], prefix_terms: set[str]) -> dict[str, object]:
    exact_terms: set[str] = set()
    compiled_prefix_terms: set[str] = set()
    multi_terms: list[tuple[str, list[str]]] = []

    for term in sorted(terms):
        term_tokens = normalize_tokens(term)
        if not term_tokens:
            continue
        if len(term_tokens) == 1:
            exact_terms.add(term_tokens[0])
        else:
            multi_terms.append((" ".join(term_tokens), term_tokens))

    for term in sorted(prefix_terms):
        term_tokens = normalize_tokens(term)
        if not term_tokens:
            continue
        compiled_prefix_terms.add(term_tokens[0])

    return {
        "exact_terms": exact_terms,
        "prefix_terms": compiled_prefix_terms,
        "multi_terms": multi_terms,
    }


LEXICON_GROUPS, LEXICON_SUBGROUPS = parse_expression_lexicon(LEXICON_PATH)
GROUP_LAYERS = {name: str(spec["layer"]) for name, spec in LEXICON_GROUPS.items()}
COMPILED_SUBGROUPS = {
    name: compile_terms(spec["terms"], spec["prefix_terms"])
    for name, spec in LEXICON_SUBGROUPS.items()
}
SUBGROUP_GROUPS = {name: str(spec["group"]) for name, spec in LEXICON_SUBGROUPS.items()}
SUBGROUP_NAMES = {name: str(spec["subgroup"]) for name, spec in LEXICON_SUBGROUPS.items()}


def match_compiled_terms(
    compiled: dict[str, object], tokens: list[str], normalized_text: str
) -> set[str]:
    token_set = set(tokens)
    matched_terms: set[str] = set()

    for term in compiled["exact_terms"]:
        if term in token_set:
            matched_terms.add(term)

    for token in tokens:
        for prefix in compiled["prefix_terms"]:
            if token.startswith(prefix):
                matched_terms.add(prefix)

    for phrase_text, phrase_tokens in compiled["multi_terms"]:
        phrase_match = f" {phrase_text} "
        if phrase_match not in normalized_text:
            continue
        width = len(phrase_tokens)
        for idx in range(0, len(tokens) - width + 1):
            if tokens[idx : idx + width] == phrase_tokens:
                matched_terms.add(phrase_text)
                break

    return matched_terms


def annotate_groups(ngram: str) -> tuple[str, int, str, str, int, int, str, int]:
    tokens = normalize_tokens(ngram)
    normalized_text = f" {' '.join(tokens)} "
    matched_groups: set[str] = set()
    matched_subgroups: set[str] = set()
    matched_terms: set[str] = set()
    matched_layers: set[str] = set()

    for subgroup_key, compiled in COMPILED_SUBGROUPS.items():
        subgroup_terms = match_compiled_terms(compiled, tokens, normalized_text)
        if not subgroup_terms:
            continue
        matched_subgroups.add(subgroup_key)
        matched_terms.update(subgroup_terms)
        group_name = SUBGROUP_GROUPS[subgroup_key]
        matched_groups.add(group_name)
        matched_layers.add(GROUP_LAYERS[group_name])

    layer_a_count = sum(1 for group_name in matched_groups if GROUP_LAYERS[group_name] == "constraint_aligned")
    layer_b_count = sum(1 for group_name in matched_groups if GROUP_LAYERS[group_name] == "cross_cutting")

    return (
        ";".join(sorted(matched_groups)),
        len(matched_groups),
        ";".join(sorted(matched_terms)),
        ";".join(sorted(matched_layers)),
        layer_a_count,
        layer_b_count,
        ";".join(sorted(matched_subgroups)),
        len(matched_subgroups),
    )


def read_phase2_rows(level: str) -> list[dict[str, object]]:
    rows: list[dict[str, object]] = []
    for path in sorted((PHASE2_ROOT / "filtered" / "core_filtered" / level).glob("*.csv")):
        with path.open(newline="", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                rows.append(
                    {
                        "scenario": row["scenario"],
                        "scenario_label": row["scenario_label"],
                        "level": row["level"],
                        "system": row["system"],
                        "ngram": row["ngram"],
                        "count": int(row["count"]),
                        "token_len": int(row["token_len"]),
                        "rank_within_system": int(row["rank_within_system"]),
                        "system_sum_count": int(row["system_sum_count"]),
                        "count_share_in_system": float(row["count_share_in_system"]),
                        "owner_count": int(row["owner_count"]),
                        "owner_systems": row["owner_systems"],
                        "global_ngram_count": int(row["global_ngram_count"]),
                        "content_token_count": int(row["content_token_count"]),
                        "content_token_ratio": float(row["content_token_ratio"]),
                        "scaffold_prefix": row["scaffold_prefix"],
                        "has_scaffold_prefix": row["has_scaffold_prefix"],
                        "matched_constraints": row["matched_constraints"],
                        "constraint_hit_count": int(row["constraint_hit_count"]),
                        "matched_lexicon_terms": row["matched_lexicon_terms"],
                        "matched_scenario_terms": row["matched_scenario_terms"],
                        "scenario_hit_count": int(row["scenario_hit_count"]),
                        "scenario_token_ratio": float(row["scenario_token_ratio"]),
                        "scenario_heavy": row["scenario_heavy"],
                    }
                )
    return rows


def write_csv(path: Path, rows: list[dict[str, object]], fieldnames: list[str]) -> None:
    with path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def sort_rows(rows: list[dict[str, object]]) -> list[dict[str, object]]:
    return sorted(
        rows,
        key=lambda row: (
            str(row["system"]),
            -int(row["count"]),
            -int(row["constraint_aligned_group_count"]),
            -int(row["cross_cutting_group_count"]),
            -int(row["expression_subgroup_count"]),
            -int(row["constraint_hit_count"]),
            str(row["ngram"]),
        ),
    )


def build_phase3() -> None:
    ensure_dirs()
    output_fields = [
        "scenario",
        "scenario_label",
        "level",
        "system",
        "ngram",
        "count",
        "token_len",
        "rank_within_system",
        "system_sum_count",
        "count_share_in_system",
        "owner_count",
        "owner_systems",
        "global_ngram_count",
        "content_token_count",
        "content_token_ratio",
        "scaffold_prefix",
        "has_scaffold_prefix",
        "matched_constraints",
        "constraint_hit_count",
        "matched_lexicon_terms",
        "matched_scenario_terms",
        "scenario_hit_count",
        "scenario_token_ratio",
        "scenario_heavy",
        "matched_expression_groups",
        "expression_group_count",
        "matched_expression_terms",
        "matched_expression_layers",
        "constraint_aligned_group_count",
        "cross_cutting_group_count",
        "matched_expression_subgroups",
        "expression_subgroup_count",
    ]

    exploded_fields = output_fields + ["expression_group", "expression_group_layer", "expression_subgroup"]

    grouped_summary_rows: list[dict[str, object]] = []
    subgroup_summary_rows: list[dict[str, object]] = []
    grouped_vs_ungrouped_rows: list[dict[str, object]] = []
    layer_summary_rows: list[dict[str, object]] = []
    top_phrase_rows: list[dict[str, object]] = []
    top_subgroup_phrase_rows: list[dict[str, object]] = []

    for level in LEVELS:
        rows = read_phase2_rows(level)
        by_scenario: dict[str, list[dict[str, object]]] = defaultdict(list)

        for row in rows:
            (
                groups,
                group_count,
                terms,
                layers,
                layer_a_count,
                layer_b_count,
                subgroup_keys,
                subgroup_count,
            ) = annotate_groups(str(row["ngram"]))
            row = {
                **row,
                "matched_expression_groups": groups,
                "expression_group_count": group_count,
                "matched_expression_terms": terms,
                "matched_expression_layers": layers,
                "constraint_aligned_group_count": layer_a_count,
                "cross_cutting_group_count": layer_b_count,
                "matched_expression_subgroups": subgroup_keys,
                "expression_subgroup_count": subgroup_count,
            }
            by_scenario[str(row["scenario"])].append(row)

        for scenario, scenario_rows in sorted(by_scenario.items()):
            annotated_rows = sort_rows(scenario_rows)
            ungrouped_rows = [row for row in annotated_rows if int(row["expression_group_count"]) == 0]
            scenario_heavy_grouped = [
                row
                for row in annotated_rows
                if str(row["scenario_heavy"]).lower() == "true" and int(row["expression_group_count"]) > 0
            ]

            write_csv(
                OUT_ROOT
                / "grouped"
                / "annotated_core_filtered"
                / level
                / f"{scenario.lower()}_{level}_annotated_core_filtered.csv",
                annotated_rows,
                output_fields,
            )
            write_csv(
                OUT_ROOT
                / "grouped"
                / "ungrouped_review"
                / level
                / f"{scenario.lower()}_{level}_ungrouped_review.csv",
                ungrouped_rows,
                output_fields,
            )
            write_csv(
                OUT_ROOT
                / "grouped"
                / "scenario_heavy_with_groups"
                / level
                / f"{scenario.lower()}_{level}_scenario_heavy_with_groups.csv",
                scenario_heavy_grouped,
                output_fields,
            )

            exploded_rows: list[dict[str, object]] = []
            per_group: dict[tuple[str, str], dict[str, int]] = defaultdict(lambda: {"rows": 0, "sum": 0})
            per_subgroup: dict[tuple[str, str, str], dict[str, int]] = defaultdict(lambda: {"rows": 0, "sum": 0})
            per_layer: dict[tuple[str, str], dict[str, int]] = defaultdict(lambda: {"rows": 0, "sum": 0})

            for row in annotated_rows:
                groups = [g for g in str(row["matched_expression_groups"]).split(";") if g]
                subgroup_keys = [g for g in str(row["matched_expression_subgroups"]).split(";") if g]
                layers = [g for g in str(row["matched_expression_layers"]).split(";") if g]

                for group in groups:
                    per_group[(str(row["system"]), group)]["rows"] += 1
                    per_group[(str(row["system"]), group)]["sum"] += int(row["count"])

                for layer in layers:
                    per_layer[(str(row["system"]), layer)]["rows"] += 1
                    per_layer[(str(row["system"]), layer)]["sum"] += int(row["count"])

                for subgroup_key in subgroup_keys:
                    group = SUBGROUP_GROUPS[subgroup_key]
                    subgroup = SUBGROUP_NAMES[subgroup_key]
                    layer = GROUP_LAYERS[group]
                    exploded_rows.append(
                        {
                            **row,
                            "expression_group": group,
                            "expression_group_layer": layer,
                            "expression_subgroup": subgroup,
                        }
                    )
                    per_subgroup[(str(row["system"]), group, subgroup)]["rows"] += 1
                    per_subgroup[(str(row["system"]), group, subgroup)]["sum"] += int(row["count"])

            write_csv(
                OUT_ROOT / "grouped" / "exploded" / level / f"{scenario.lower()}_{level}_exploded.csv",
                exploded_rows,
                exploded_fields,
            )

            for system in SYSTEMS:
                system_rows = [row for row in annotated_rows if str(row["system"]) == system]
                grouped_rows = [row for row in system_rows if int(row["expression_group_count"]) > 0]
                ungrouped_system_rows = [row for row in system_rows if int(row["expression_group_count"]) == 0]
                grouped_vs_ungrouped_rows.append(
                    {
                        "scenario": scenario,
                        "level": level,
                        "system": system,
                        "grouped_rows": len(grouped_rows),
                        "grouped_sum_count": sum(int(row["count"]) for row in grouped_rows),
                        "ungrouped_rows": len(ungrouped_system_rows),
                        "ungrouped_sum_count": sum(int(row["count"]) for row in ungrouped_system_rows),
                        "scenario_heavy_grouped_rows": sum(
                            1
                            for row in grouped_rows
                            if str(row["scenario_heavy"]).lower() == "true"
                        ),
                        "scenario_heavy_grouped_sum_count": sum(
                            int(row["count"])
                            for row in grouped_rows
                            if str(row["scenario_heavy"]).lower() == "true"
                        ),
                        "constraint_aligned_grouped_rows": sum(
                            1 for row in grouped_rows if int(row["constraint_aligned_group_count"]) > 0
                        ),
                        "constraint_aligned_grouped_sum_count": sum(
                            int(row["count"])
                            for row in grouped_rows
                            if int(row["constraint_aligned_group_count"]) > 0
                        ),
                        "cross_cutting_grouped_rows": sum(
                            1 for row in grouped_rows if int(row["cross_cutting_group_count"]) > 0
                        ),
                        "cross_cutting_grouped_sum_count": sum(
                            int(row["count"])
                            for row in grouped_rows
                            if int(row["cross_cutting_group_count"]) > 0
                        ),
                    }
                )

            for (system, group), stats in sorted(per_group.items()):
                grouped_summary_rows.append(
                    {
                        "scenario": scenario,
                        "level": level,
                        "system": system,
                        "expression_group": group,
                        "expression_group_layer": GROUP_LAYERS[group],
                        "row_count": stats["rows"],
                        "sum_count": stats["sum"],
                    }
                )

            for (system, group, subgroup), stats in sorted(per_subgroup.items()):
                subgroup_summary_rows.append(
                    {
                        "scenario": scenario,
                        "level": level,
                        "system": system,
                        "expression_group": group,
                        "expression_group_layer": GROUP_LAYERS[group],
                        "expression_subgroup": subgroup,
                        "row_count": stats["rows"],
                        "sum_count": stats["sum"],
                    }
                )

            for (system, layer), stats in sorted(per_layer.items()):
                layer_summary_rows.append(
                    {
                        "scenario": scenario,
                        "level": level,
                        "system": system,
                        "expression_group_layer": layer,
                        "row_count": stats["rows"],
                        "sum_count": stats["sum"],
                    }
                )

            top_bucket: dict[tuple[str, str], list[dict[str, object]]] = defaultdict(list)
            top_subgroup_bucket: dict[tuple[str, str, str], list[dict[str, object]]] = defaultdict(list)

            for row in annotated_rows:
                groups = [g for g in str(row["matched_expression_groups"]).split(";") if g]
                for group in groups:
                    top_bucket[(str(row["system"]), group)].append(
                        {
                            **row,
                            "expression_group": group,
                            "expression_group_layer": GROUP_LAYERS[group],
                        }
                    )

            for row in exploded_rows:
                top_subgroup_bucket[
                    (
                        str(row["system"]),
                        str(row["expression_group"]),
                        str(row["expression_subgroup"]),
                    )
                ].append(row)

            for (system, group), items in top_bucket.items():
                ordered = sorted(items, key=lambda row: (-int(row["count"]), str(row["ngram"])))[:10]
                for row in ordered:
                    top_phrase_rows.append(
                        {
                            "scenario": scenario,
                            "level": level,
                            "system": system,
                            "expression_group": group,
                            "expression_group_layer": GROUP_LAYERS[group],
                            "ngram": row["ngram"],
                            "count": row["count"],
                            "matched_constraints": row["matched_constraints"],
                            "constraint_hit_count": row["constraint_hit_count"],
                            "scenario_heavy": row["scenario_heavy"],
                        }
                    )

            for (system, group, subgroup), items in top_subgroup_bucket.items():
                ordered = sorted(items, key=lambda row: (-int(row["count"]), str(row["ngram"])))[:10]
                for row in ordered:
                    top_subgroup_phrase_rows.append(
                        {
                            "scenario": scenario,
                            "level": level,
                            "system": system,
                            "expression_group": group,
                            "expression_group_layer": GROUP_LAYERS[group],
                            "expression_subgroup": subgroup,
                            "ngram": row["ngram"],
                            "count": row["count"],
                            "matched_constraints": row["matched_constraints"],
                            "constraint_hit_count": row["constraint_hit_count"],
                            "scenario_heavy": row["scenario_heavy"],
                        }
                    )

    write_csv(
        OUT_ROOT / "summaries" / "phase3_expression_summary.csv",
        grouped_summary_rows,
        [
            "scenario",
            "level",
            "system",
            "expression_group",
            "expression_group_layer",
            "row_count",
            "sum_count",
        ],
    )
    write_csv(
        OUT_ROOT / "summaries" / "phase3_subgroup_summary.csv",
        subgroup_summary_rows,
        [
            "scenario",
            "level",
            "system",
            "expression_group",
            "expression_group_layer",
            "expression_subgroup",
            "row_count",
            "sum_count",
        ],
    )
    write_csv(
        OUT_ROOT / "summaries" / "phase3_layer_summary.csv",
        layer_summary_rows,
        [
            "scenario",
            "level",
            "system",
            "expression_group_layer",
            "row_count",
            "sum_count",
        ],
    )
    write_csv(
        OUT_ROOT / "summaries" / "phase3_grouped_vs_ungrouped_summary.csv",
        grouped_vs_ungrouped_rows,
        [
            "scenario",
            "level",
            "system",
            "grouped_rows",
            "grouped_sum_count",
            "ungrouped_rows",
            "ungrouped_sum_count",
            "scenario_heavy_grouped_rows",
            "scenario_heavy_grouped_sum_count",
            "constraint_aligned_grouped_rows",
            "constraint_aligned_grouped_sum_count",
            "cross_cutting_grouped_rows",
            "cross_cutting_grouped_sum_count",
        ],
    )
    write_csv(
        OUT_ROOT / "summaries" / "phase3_top_group_phrases.csv",
        top_phrase_rows,
        [
            "scenario",
            "level",
            "system",
            "expression_group",
            "expression_group_layer",
            "ngram",
            "count",
            "matched_constraints",
            "constraint_hit_count",
            "scenario_heavy",
        ],
    )
    write_csv(
        OUT_ROOT / "summaries" / "phase3_top_subgroup_phrases.csv",
        top_subgroup_phrase_rows,
        [
            "scenario",
            "level",
            "system",
            "expression_group",
            "expression_group_layer",
            "expression_subgroup",
            "ngram",
            "count",
            "matched_constraints",
            "constraint_hit_count",
            "scenario_heavy",
        ],
    )


def write_readme() -> None:
    (OUT_ROOT / "README.md").write_text(
        f"""# Codex Inverse N-Gram Workspace — 3rd Phase

This phase is the grouping pass on top of the phase-2 filtered core sets.

Input:
- `2nd_phase/filtered/core_filtered/trigrams`
- `2nd_phase/filtered/core_filtered/quadgrams`

Grouping source:
- `{LEXICON_PATH}`

This phase does:
- annotate every row with one or more expression groups
- annotate every row with subgroup hits from the lexicon sub-elements
- keep a review bucket for rows with no current group
- keep scenario-heavy grouped rows visible
- produce group summaries, subgroup summaries, layer summaries, and top-phrase summaries

Layer A — main evidence:
- truth
- practical_considerations_and_execution
- temporal_projection
- imagination_and_possibility

Layer B — supporting differentiators:
- surfacing
- smoothing
- hedging
- warning
- conditions
- autonomy_sovereignty

This is a grouping pass, not a final interpretation.
""",
        encoding="utf-8",
    )


if __name__ == "__main__":
    build_phase3()
    write_readme()
