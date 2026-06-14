#!/usr/bin/env python3

from __future__ import annotations

import csv
from collections import Counter
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2] / "1st_phase" / "inverse_scored" / "trigrams"


def to_bool(value: str) -> bool:
    return str(value).strip().lower() in {"true", "1", "yes"}


def load_rows() -> list[dict[str, str]]:
    rows: list[dict[str, str]] = []
    for path in sorted(ROOT.glob("*.csv")):
        with path.open(newline="", encoding="utf-8") as f:
            rows.extend(csv.DictReader(f))
    return rows


def main() -> None:
    rows = load_rows()

    base = [
        row
        for row in rows
        if not to_bool(row["has_scaffold_prefix"]) and int(row["content_token_count"]) >= 2
    ]

    core_ge3 = [row for row in base if int(row["count"]) >= 3]
    core_ge2 = [row for row in base if int(row["count"]) >= 2]
    added = [row for row in base if int(row["count"]) == 2]

    print("base_non_scaffold_content>=2", len(base))
    print("core_ge3", len(core_ge3))
    print("core_ge2", len(core_ge2))
    print("added_by_lowering_to_2", len(added))
    print("added_by_scenario", Counter(row["scenario"] for row in added))
    print("added_by_system", Counter(row["system"] for row in added))
    print("added_sum_count", sum(int(row["count"]) for row in added))


if __name__ == "__main__":
    main()
