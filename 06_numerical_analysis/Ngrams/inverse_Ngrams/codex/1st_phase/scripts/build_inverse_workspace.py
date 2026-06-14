#!/usr/bin/env python3

from __future__ import annotations

import csv
import math
from collections import Counter, defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[3]
RAW_ROOT = ROOT / "raw_materials"
# Write outputs into the phase folder that contains this script.
OUT_ROOT = Path(__file__).resolve().parents[1]

LEVEL_DIRS = {
    "bigrams": RAW_ROOT / "bigrams_csv",
    "trigrams": RAW_ROOT / "trigrams_csv",
    "quadgrams": RAW_ROOT / "quadgrams_csv",
}

SYSTEMS = ["CONTROL", "AC15", "AC15P", "HYBRID_3_5", "HYBRID_SEMANTIC"]

STOPWORDS = {
    "a", "an", "and", "are", "as", "at", "be", "but", "by", "can", "do", "don", "for",
    "from", "if", "in", "into", "is", "it", "its", "me", "not", "of", "on", "only", "or",
    "s", "so", "t", "that", "the", "their", "them", "there", "this", "to", "us", "we",
    "what", "when", "which", "who", "why", "with", "would", "you", "your", "re", "ve",
}

SCAFFOLD_PREFIXES = (
    "if you",
    "you can",
    "i can",
    "you tell",
    "if i",
    "it s",
    "this is",
    "in the",
    "as a",
    "with the",
    "on the",
    "for the",
    "and the",
    "you don",
    "only if",
    "what to",
)

CONSTRAINT_LEXICONS = {
    "practicality_and_feasibility": {
        "action", "actionable", "blocker", "blockers", "budget", "concrete", "constraint",
        "constraints", "cost", "costs", "feasible", "feasibility", "friction", "implement",
        "implementation", "incremental", "plan", "plans", "practical", "prioritize",
        "prioritization", "resources", "scale", "simplify", "step", "steps", "tradeoff",
        "tradeoffs", "workable",
    },
    "temporal_dynamics": {
        "change", "changes", "current", "decay", "evolution", "future", "futureproof",
        "later", "long", "maintain", "month", "months", "past", "present", "rate", "rates",
        "review", "robust", "short", "term", "time", "timeline", "timing", "week", "weeks",
        "year", "years",
    },
    "imagination_and_possibility": {
        "alternative", "alternatives", "can", "could", "dream", "explore", "imagine",
        "maybe", "novel", "novelty", "option", "options", "path", "paths", "possibility",
        "possible", "speculative", "what", "would",
    },
    "truth_and_fact": {
        "assumption", "assumptions", "boundary", "boundaries", "check", "checks", "correct",
        "correction", "evidence", "fact", "facts", "prove", "provenance", "source", "sources",
        "true", "truth", "uncertain", "uncertainty", "validate", "verify", "wrong",
    },
}


def ensure_dirs() -> None:
    for rel in [
        "parsed/bigrams",
        "parsed/trigrams",
        "parsed/quadgrams",
        "inverse_raw/bigrams",
        "inverse_raw/trigrams",
        "inverse_raw/quadgrams",
        "inverse_scored/bigrams",
        "inverse_scored/trigrams",
        "inverse_scored/quadgrams",
        "summaries",
    ]:
        (OUT_ROOT / rel).mkdir(parents=True, exist_ok=True)


def parse_stacked_csv(path: Path, level: str) -> list[dict[str, object]]:
    rows = list(csv.reader(path.open(newline="", encoding="utf-8")))
    systems = [rows[1][i].strip() for i in range(0, 10, 2)]
    scenario_label = rows[0][0].strip()
    scenario = path.stem.rsplit("_", 1)[-1].upper()

    parsed: list[dict[str, object]] = []
    for row in rows[3:]:
        if not any(cell.strip() for cell in row):
            continue
        for idx, system in enumerate(systems):
            ngram = row[idx * 2].strip() if idx * 2 < len(row) else ""
            count_text = row[idx * 2 + 1].strip() if idx * 2 + 1 < len(row) else ""
            if not ngram:
                continue
            try:
                count = int(count_text)
            except ValueError:
                continue
            tokens = ngram.split()
            parsed.append(
                {
                    "scenario": scenario,
                    "scenario_label": scenario_label,
                    "level": level,
                    "system": system,
                    "ngram": ngram,
                    "count": count,
                    "token_len": len(tokens),
                }
            )
    return parsed


def write_csv(path: Path, rows: list[dict[str, object]], fieldnames: list[str]) -> None:
    with path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def scaffold_prefix(ngram: str) -> str:
    for prefix in SCAFFOLD_PREFIXES:
        if ngram.startswith(prefix):
            return prefix
    return ""


def content_metrics(ngram: str) -> tuple[int, float]:
    tokens = ngram.split()
    if not tokens:
        return 0, 0.0
    content_count = sum(1 for token in tokens if token not in STOPWORDS)
    return content_count, round(content_count / len(tokens), 4)


def constraint_hits(ngram: str) -> tuple[str, int]:
    tokens = set(ngram.split())
    hits: list[str] = []
    score = 0
    for name, lexicon in CONSTRAINT_LEXICONS.items():
        overlap = len(tokens & lexicon)
        if overlap:
            hits.append(name)
            score += overlap
    return ";".join(hits), score


def owner_maps(rows: list[dict[str, object]]) -> tuple[dict[str, set[str]], dict[str, int]]:
    owners: dict[str, set[str]] = defaultdict(set)
    total_counts: dict[str, int] = defaultdict(int)
    for row in rows:
        ngram = str(row["ngram"])
        owners[ngram].add(str(row["system"]))
        total_counts[ngram] += int(row["count"])
    return owners, total_counts


def rank_rows(rows: list[dict[str, object]]) -> list[dict[str, object]]:
    grouped: dict[tuple[str, str, str], list[dict[str, object]]] = defaultdict(list)
    for row in rows:
        grouped[(str(row["scenario"]), str(row["level"]), str(row["system"]))].append(row)

    ranked: list[dict[str, object]] = []
    for key, group in grouped.items():
        system_total = sum(int(row["count"]) for row in group)
        ordered = sorted(group, key=lambda row: (-int(row["count"]), str(row["ngram"])))
        for idx, row in enumerate(ordered, start=1):
            row = dict(row)
            row["rank_within_system"] = idx
            row["system_sum_count"] = system_total
            row["count_share_in_system"] = round(int(row["count"]) / system_total, 6) if system_total else 0.0
            ranked.append(row)
    return ranked


def build_outputs() -> None:
    ensure_dirs()

    all_rows: list[dict[str, object]] = []
    parsed_rows_by_level: dict[str, list[dict[str, object]]] = defaultdict(list)

    for level, level_dir in LEVEL_DIRS.items():
        for path in sorted(level_dir.glob("*.csv")):
            parsed = parse_stacked_csv(path, level)
            all_rows.extend(parsed)
            parsed_rows_by_level[level].extend(parsed)
            out_path = OUT_ROOT / "parsed" / level / f"{path.stem}_tidy.csv"
            fieldnames = ["scenario", "scenario_label", "level", "system", "ngram", "count", "token_len"]
            write_csv(out_path, parsed, fieldnames)

    write_csv(
        OUT_ROOT / "parsed" / "all_levels_tidy.csv",
        all_rows,
        ["scenario", "scenario_label", "level", "system", "ngram", "count", "token_len"],
    )

    summary_rows: list[dict[str, object]] = []
    overlap_rows: list[dict[str, object]] = []

    grouped_rows: dict[tuple[str, str], list[dict[str, object]]] = defaultdict(list)
    for row in all_rows:
        grouped_rows[(str(row["scenario"]), str(row["level"]))].append(row)

    for (scenario, level), rows in sorted(grouped_rows.items()):
        owners, total_counts = owner_maps(rows)
        ranked_rows = rank_rows(rows)

        owner_count_totals = Counter(len(owner_set) for owner_set in owners.values())
        total_unique = len(owners)
        for owner_count in sorted(owner_count_totals):
            overlap_rows.append(
                {
                    "scenario": scenario,
                    "level": level,
                    "owner_count": owner_count,
                    "type_count": owner_count_totals[owner_count],
                    "type_share": round(owner_count_totals[owner_count] / total_unique, 6) if total_unique else 0.0,
                }
            )

        inverse_raw: list[dict[str, object]] = []
        inverse_scored: list[dict[str, object]] = []
        per_system_type_total = Counter()
        per_system_count_total = Counter()
        per_system_inverse_types = Counter()
        per_system_inverse_count = Counter()

        for row in ranked_rows:
            system = str(row["system"])
            per_system_type_total[system] += 1
            per_system_count_total[system] += int(row["count"])

        for row in ranked_rows:
            ngram = str(row["ngram"])
            system = str(row["system"])
            owner_count = len(owners[ngram])
            if owner_count != 1:
                continue

            content_count, content_ratio = content_metrics(ngram)
            prefix = scaffold_prefix(ngram)
            matched_constraints, constraint_hit_count = constraint_hits(ngram)

            raw_row = {
                **row,
                "owner_count": owner_count,
                "owner_systems": system,
                "global_ngram_count": total_counts[ngram],
            }
            scored_row = {
                **raw_row,
                "content_token_count": content_count,
                "content_token_ratio": content_ratio,
                "scaffold_prefix": prefix,
                "has_scaffold_prefix": bool(prefix),
                "matched_constraints": matched_constraints,
                "constraint_hit_count": constraint_hit_count,
            }

            inverse_raw.append(raw_row)
            inverse_scored.append(scored_row)
            per_system_inverse_types[system] += 1
            per_system_inverse_count[system] += int(row["count"])

        raw_fields = [
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
        ]
        scored_fields = raw_fields + [
            "content_token_count",
            "content_token_ratio",
            "scaffold_prefix",
            "has_scaffold_prefix",
            "matched_constraints",
            "constraint_hit_count",
        ]

        write_csv(
            OUT_ROOT / "inverse_raw" / level / f"{scenario.lower()}_{level}_inverse_raw.csv",
            inverse_raw,
            raw_fields,
        )
        write_csv(
            OUT_ROOT / "inverse_scored" / level / f"{scenario.lower()}_{level}_inverse_scored.csv",
            inverse_scored,
            scored_fields,
        )

        for system in SYSTEMS:
            summary_rows.append(
                {
                    "scenario": scenario,
                    "level": level,
                    "system": system,
                    "system_total_types": per_system_type_total[system],
                    "system_total_sum_count": per_system_count_total[system],
                    "inverse_types": per_system_inverse_types[system],
                    "inverse_sum_count": per_system_inverse_count[system],
                    "inverse_type_share": round(
                        per_system_inverse_types[system] / per_system_type_total[system], 6
                    )
                    if per_system_type_total[system]
                    else 0.0,
                    "inverse_sum_share": round(
                        per_system_inverse_count[system] / per_system_count_total[system], 6
                    )
                    if per_system_count_total[system]
                    else 0.0,
                }
            )

    write_csv(
        OUT_ROOT / "summaries" / "inverse_summary_by_system.csv",
        summary_rows,
        [
            "scenario",
            "level",
            "system",
            "system_total_types",
            "system_total_sum_count",
            "inverse_types",
            "inverse_sum_count",
            "inverse_type_share",
            "inverse_sum_share",
        ],
    )
    write_csv(
        OUT_ROOT / "summaries" / "owner_count_structure_summary.csv",
        overlap_rows,
        ["scenario", "level", "owner_count", "type_count", "type_share"],
    )


def write_readme() -> None:
    readme = OUT_ROOT / "README.md"
    readme.write_text(
        """# Codex Inverse N-Gram Workspace

This folder holds the working outputs for the inverse n-gram direction.

Current stage:
- raw stacked CSVs parsed into tidy tables
- inverse n-gram tables generated for all scenarios and levels
- scored inverse tables generated for filter-ready review
- compact summaries generated for owner-count structure and inverse shares

Folder layout:
- `scripts/`
  - generation scripts
- `parsed/`
  - tidy exports of the raw stacked CSVs
- `inverse_raw/`
  - raw inverse tables by scenario and level
- `inverse_scored/`
  - inverse tables with support columns for filtering
- `summaries/`
  - compact summaries for review

Current support columns in `inverse_scored/`:
- `content_token_count`
- `content_token_ratio`
- `scaffold_prefix`
- `has_scaffold_prefix`
- `matched_constraints`
- `constraint_hit_count`

These support columns are not final judgments. They are there to make the next filtering step easier and more transparent.
""",
        encoding="utf-8",
    )


if __name__ == "__main__":
    build_outputs()
    write_readme()
