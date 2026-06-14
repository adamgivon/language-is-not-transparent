#!/usr/bin/env python3

from __future__ import annotations

import csv
import re
from collections import Counter, defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[3]
PHASE1_ROOT = ROOT / "codex" / "1st_phase"
OUT_ROOT = Path(__file__).resolve().parents[1]

CONSTRAINT_LEXICON_PATH = ROOT / "inverse_filtering_constraint_lexicon.md"
SCENARIO_LEXICON_PATH = ROOT / "scenario_specific_lexicon.md"

LEVELS = ("trigrams", "quadgrams")
SYSTEMS = ("CONTROL", "AC15", "AC15P", "HYBRID_3_5", "HYBRID_SEMANTIC")
TOKEN_RE = re.compile(r"[a-z0-9]+")

STOPWORDS = {
    "a", "an", "and", "are", "as", "at", "be", "but", "by", "can", "do", "don", "for",
    "from", "if", "in", "into", "is", "it", "its", "me", "not", "of", "on", "only", "or",
    "s", "so", "t", "that", "the", "their", "them", "there", "this", "to", "us", "we",
    "what", "when", "which", "who", "why", "with", "would", "you", "your", "re", "ve",
}

COUNT_THRESHOLDS = {"trigrams": 2, "quadgrams": 2}
HIGH_COUNT_NO_HIT_THRESHOLDS = {"trigrams": 3, "quadgrams": 3}
CONTENT_TOKEN_MIN = {"trigrams": 2, "quadgrams": 2}

PREFIX_TERMS = {
    "fabricat",
    "corroborat",
    "accelerat",
    "deteriorat",
    "deprecat",
    "relocat",
}


def ensure_dirs() -> None:
    for rel in [
        "filtered/core_filtered/trigrams",
        "filtered/core_filtered/quadgrams",
        "filtered/constraint_candidates/trigrams",
        "filtered/constraint_candidates/quadgrams",
        "filtered/high_count_no_hit_review/trigrams",
        "filtered/high_count_no_hit_review/quadgrams",
        "filtered/scenario_driven_review/trigrams",
        "filtered/scenario_driven_review/quadgrams",
        "summaries",
        "scripts",
    ]:
        (OUT_ROOT / rel).mkdir(parents=True, exist_ok=True)


def normalize_tokens(text: str) -> list[str]:
    return TOKEN_RE.findall(text.lower())


def parse_constraint_lexicon(path: Path) -> dict[str, set[str]]:
    constraints: dict[str, set[str]] = defaultdict(set)
    current_constraint: str | None = None
    in_code = False
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if line.startswith("## Constraint"):
            _, rhs = line.split(":", 1)
            current_constraint = rhs.strip()
            continue
        if line.startswith("```"):
            in_code = not in_code
            continue
        if in_code and current_constraint and line:
            constraints[current_constraint].add(line.lower())
    return constraints


def parse_scenario_lexicon(path: Path) -> dict[str, set[str]]:
    scenarios: dict[str, set[str]] = defaultdict(set)
    current_scenario: str | None = None
    in_code = False
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if line.startswith("## S"):
            current_scenario = line.split("—", 1)[0].replace("##", "").strip()
            continue
        if line.startswith("```"):
            in_code = not in_code
            continue
        if in_code and current_scenario and line:
            scenarios[current_scenario].add(line.lower())
    return scenarios


def to_bool(value: str) -> bool:
    return value.strip().lower() in {"true", "1", "yes"}


def compile_terms(terms: set[str]) -> dict[str, object]:
    exact_terms: set[str] = set()
    prefix_terms: set[str] = set()
    multi_terms: list[tuple[str, list[str]]] = []
    for term in sorted(terms):
        term_tokens = normalize_tokens(term)
        if not term_tokens:
            continue
        if len(term_tokens) == 1:
            if term_tokens[0] in PREFIX_TERMS:
                prefix_terms.add(term_tokens[0])
            else:
                exact_terms.add(term_tokens[0])
        else:
            multi_terms.append((" ".join(term_tokens), term_tokens))
    return {
        "exact_terms": exact_terms,
        "prefix_terms": prefix_terms,
        "multi_terms": multi_terms,
    }


def compile_constraint_lexicon(raw: dict[str, set[str]]) -> dict[str, dict[str, object]]:
    return {name: compile_terms(terms) for name, terms in raw.items()}


def compile_scenario_lexicon(raw: dict[str, set[str]]) -> dict[str, dict[str, object]]:
    return {name: compile_terms(terms) for name, terms in raw.items()}


def match_compiled_terms(
    compiled: dict[str, object], tokens: list[str], normalized_text: str
) -> tuple[set[str], set[int]]:
    token_set = set(tokens)
    matched_terms: set[str] = set()
    matched_positions: set[int] = set()

    for term in compiled["exact_terms"]:
        if term in token_set:
            matched_terms.add(term)
            for idx, token in enumerate(tokens):
                if token == term:
                    matched_positions.add(idx)

    prefix_terms = compiled["prefix_terms"]
    if prefix_terms:
        for idx, token in enumerate(tokens):
            for prefix in prefix_terms:
                if token.startswith(prefix):
                    matched_terms.add(prefix)
                    matched_positions.add(idx)

    for phrase_text, phrase_tokens in compiled["multi_terms"]:
        phrase_match = f" {phrase_text} "
        if phrase_match not in normalized_text:
            continue
        width = len(phrase_tokens)
        for idx in range(0, len(tokens) - width + 1):
            if tokens[idx : idx + width] == phrase_tokens:
                matched_terms.add(phrase_text)
                matched_positions.update(range(idx, idx + width))

    return matched_terms, matched_positions


def annotate_constraints(
    tokens: list[str], normalized_text: str, compiled_constraints: dict[str, dict[str, object]]
) -> tuple[str, int, str]:
    matched_constraints: set[str] = set()
    matched_terms: set[str] = set()
    for constraint_name, compiled in compiled_constraints.items():
        constraint_terms, _ = match_compiled_terms(compiled, tokens, normalized_text)
        if constraint_terms:
            matched_constraints.add(constraint_name)
            matched_terms.update(constraint_terms)
    return ";".join(sorted(matched_constraints)), len(matched_terms), ";".join(sorted(matched_terms))


def annotate_scenario(
    scenario: str,
    tokens: list[str],
    normalized_text: str,
    compiled_scenarios: dict[str, dict[str, object]],
) -> tuple[str, int, float, bool]:
    content_positions = {idx for idx, token in enumerate(tokens) if token not in STOPWORDS}
    compiled = compiled_scenarios.get(scenario)
    if not compiled:
        return "", 0, 0.0, False
    matched_terms, matched_positions = match_compiled_terms(compiled, tokens, normalized_text)
    matched_positions = matched_positions & content_positions
    content_count = len(content_positions)
    scenario_ratio = round(len(matched_positions) / content_count, 6) if content_count else 0.0
    scenario_heavy = content_count > 0 and scenario_ratio >= 0.75
    return ";".join(sorted(matched_terms)), len(matched_terms), scenario_ratio, scenario_heavy


def read_phase1_rows(level: str) -> list[dict[str, object]]:
    rows: list[dict[str, object]] = []
    for path in sorted((PHASE1_ROOT / "inverse_scored" / level).glob("*.csv")):
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
                        "has_scaffold_prefix": to_bool(row["has_scaffold_prefix"]),
                    }
                )
    return rows


def core_filter(row: dict[str, object]) -> bool:
    level = str(row["level"])
    return (
        not bool(row["has_scaffold_prefix"])
        and int(row["count"]) >= COUNT_THRESHOLDS[level]
        and int(row["content_token_count"]) >= CONTENT_TOKEN_MIN[level]
    )


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
            -int(row["constraint_hit_count"]),
            -float(row["content_token_ratio"]),
            str(row["ngram"]),
        ),
    )


def build_phase2() -> None:
    ensure_dirs()
    constraint_terms = compile_constraint_lexicon(parse_constraint_lexicon(CONSTRAINT_LEXICON_PATH))
    scenario_terms = compile_scenario_lexicon(parse_scenario_lexicon(SCENARIO_LEXICON_PATH))

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
    ]

    bucket_summary_rows: list[dict[str, object]] = []
    constraint_summary_rows: list[dict[str, object]] = []

    for level in LEVELS:
        rows = read_phase1_rows(level)
        by_scenario: dict[str, list[dict[str, object]]] = defaultdict(list)
        for row in rows:
            tokens = normalize_tokens(str(row["ngram"]))
            normalized_text = f" {' '.join(tokens)} "
            matched_constraints, constraint_hit_count, matched_lexicon_terms = annotate_constraints(
                tokens, normalized_text, constraint_terms
            )
            (
                matched_scenario_terms,
                scenario_hit_count,
                scenario_token_ratio,
                scenario_heavy,
            ) = annotate_scenario(str(row["scenario"]), tokens, normalized_text, scenario_terms)

            row = {
                **row,
                "matched_constraints": matched_constraints,
                "constraint_hit_count": constraint_hit_count,
                "matched_lexicon_terms": matched_lexicon_terms,
                "matched_scenario_terms": matched_scenario_terms,
                "scenario_hit_count": scenario_hit_count,
                "scenario_token_ratio": scenario_token_ratio,
                "scenario_heavy": scenario_heavy,
            }
            by_scenario[str(row["scenario"])].append(row)

        for scenario, scenario_rows in sorted(by_scenario.items()):
            core_rows = sort_rows([row for row in scenario_rows if core_filter(row)])
            constraint_rows = sort_rows(
                [row for row in core_rows if int(row["constraint_hit_count"]) >= 1]
            )
            high_no_hit_rows = sort_rows(
                [
                    row
                    for row in core_rows
                    if int(row["constraint_hit_count"]) == 0
                    and int(row["count"]) >= HIGH_COUNT_NO_HIT_THRESHOLDS[level]
                ]
            )
            scenario_driven_rows = sort_rows(
                [
                    row
                    for row in core_rows
                    if bool(row["scenario_heavy"]) and int(row["constraint_hit_count"]) == 0
                ]
            )

            write_csv(
                OUT_ROOT / "filtered" / "core_filtered" / level / f"{scenario.lower()}_{level}_core_filtered.csv",
                core_rows,
                output_fields,
            )
            write_csv(
                OUT_ROOT
                / "filtered"
                / "constraint_candidates"
                / level
                / f"{scenario.lower()}_{level}_constraint_candidates.csv",
                constraint_rows,
                output_fields,
            )
            write_csv(
                OUT_ROOT
                / "filtered"
                / "high_count_no_hit_review"
                / level
                / f"{scenario.lower()}_{level}_high_count_no_hit_review.csv",
                high_no_hit_rows,
                output_fields,
            )
            write_csv(
                OUT_ROOT
                / "filtered"
                / "scenario_driven_review"
                / level
                / f"{scenario.lower()}_{level}_scenario_driven_review.csv",
                scenario_driven_rows,
                output_fields,
            )

            summary_by_system: dict[str, dict[str, object]] = {}
            for system in SYSTEMS:
                system_core = [row for row in core_rows if str(row["system"]) == system]
                system_constraint = [row for row in constraint_rows if str(row["system"]) == system]
                system_high_no_hit = [row for row in high_no_hit_rows if str(row["system"]) == system]
                system_scenario_driven = [row for row in scenario_driven_rows if str(row["system"]) == system]
                summary_by_system[system] = {
                    "scenario": scenario,
                    "level": level,
                    "system": system,
                    "core_rows": len(system_core),
                    "core_sum_count": sum(int(row["count"]) for row in system_core),
                    "constraint_candidate_rows": len(system_constraint),
                    "constraint_candidate_sum_count": sum(int(row["count"]) for row in system_constraint),
                    "high_count_no_hit_rows": len(system_high_no_hit),
                    "high_count_no_hit_sum_count": sum(int(row["count"]) for row in system_high_no_hit),
                    "scenario_driven_rows": len(system_scenario_driven),
                    "scenario_driven_sum_count": sum(int(row["count"]) for row in system_scenario_driven),
                }
                bucket_summary_rows.append(summary_by_system[system])

            per_constraint_counter: dict[tuple[str, str], Counter] = defaultdict(Counter)
            per_constraint_sum: dict[tuple[str, str], Counter] = defaultdict(Counter)
            for row in constraint_rows:
                constraints = [c for c in str(row["matched_constraints"]).split(";") if c]
                system = str(row["system"])
                for constraint_name in constraints:
                    per_constraint_counter[(scenario, system)][constraint_name] += 1
                    per_constraint_sum[(scenario, system)][constraint_name] += int(row["count"])
            for (scenario_name, system), counter in per_constraint_counter.items():
                for constraint_name, row_count in sorted(counter.items()):
                    constraint_summary_rows.append(
                        {
                            "scenario": scenario_name,
                            "level": level,
                            "system": system,
                            "constraint_name": constraint_name,
                            "row_count": row_count,
                            "sum_count": per_constraint_sum[(scenario_name, system)][constraint_name],
                        }
                    )

    write_csv(
        OUT_ROOT / "summaries" / "phase2_bucket_summary.csv",
        bucket_summary_rows,
        [
            "scenario",
            "level",
            "system",
            "core_rows",
            "core_sum_count",
            "constraint_candidate_rows",
            "constraint_candidate_sum_count",
            "high_count_no_hit_rows",
            "high_count_no_hit_sum_count",
            "scenario_driven_rows",
            "scenario_driven_sum_count",
        ],
    )
    write_csv(
        OUT_ROOT / "summaries" / "phase2_constraint_summary.csv",
        constraint_summary_rows,
        ["scenario", "level", "system", "constraint_name", "row_count", "sum_count"],
    )


def write_readme() -> None:
    readme = OUT_ROOT / "README.md"
    readme.write_text(
        """# Codex Inverse N-Gram Workspace — 2nd Phase

This phase applies the first real filtering pass to the inverse n-gram workspace.

Input:
- `1st_phase/inverse_scored/trigrams`
- `1st_phase/inverse_scored/quadgrams`

This phase does:
- core filtering
- constraint lexicon annotation
- scenario lexicon annotation
- scenario-heavy flagging
- four review buckets

Output buckets:
- `filtered/core_filtered`
- `filtered/constraint_candidates`
- `filtered/high_count_no_hit_review`
- `filtered/scenario_driven_review`

Important note:
- `constraint_candidates` is a useful narrowed view, not the whole analysis
- `scenario_driven_review` is a review bucket, not a deletion bucket
""",
        encoding="utf-8",
    )


if __name__ == "__main__":
    build_phase2()
    write_readme()
