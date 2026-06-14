#!/usr/bin/env python3

from __future__ import annotations

import csv
from collections import Counter, defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[3]
CODEX_ROOT = ROOT / "codex" / "5th_phase"
BANDS_FILE = ROOT / "negative_space_word_bands.md"
RECURRING_FILE = ROOT / "claude" / "04_unclassified" / "cross_scenario_patterns" / "system_recurring_words.csv"
OUTPUT_DIR = ROOT / "claude" / "04_unclassified" / "cross_scenario_patterns"
SUMMARY_DIR = CODEX_ROOT / "summaries"


def ensure_dirs() -> None:
    SUMMARY_DIR.mkdir(parents=True, exist_ok=True)


def parse_bands(markdown_path: Path) -> dict[str, set[str]]:
    bands = {
        "function_residue": set(),
        "borderline": set(),
        "content_signature": set(),
        "technical_artifact_signature": set(),
    }

    current_bucket: str | None = None
    in_code = False

    with markdown_path.open("r", encoding="utf-8") as handle:
        for raw_line in handle:
            line = raw_line.strip()

            if line.startswith("## Band 1:"):
                current_bucket = "function_residue"
                in_code = False
                continue
            if line.startswith("## Band 2:"):
                current_bucket = "borderline"
                in_code = False
                continue
            if line.startswith("## Band 3:"):
                current_bucket = "content_signature"
                in_code = False
                continue
            if line.startswith("## Sub-category inside content_signature:"):
                current_bucket = "technical_artifact_signature"
                in_code = False
                continue

            if line.startswith("## ") and not line.startswith("## Band") and not line.startswith("## Sub-category"):
                current_bucket = None
                in_code = False
                continue

            if line == "```":
                in_code = not in_code
                continue

            if in_code and current_bucket and line:
                bands[current_bucket].add(line.lower())

    # Technical artifact terms are also content signatures.
    bands["content_signature"].update(bands["technical_artifact_signature"])
    return bands


def read_rows(csv_path: Path) -> list[dict[str, str]]:
    with csv_path.open("r", encoding="utf-8", newline="") as handle:
        return list(csv.DictReader(handle))


def classify_row(word: str, bands: dict[str, set[str]]) -> tuple[str, bool, str]:
    token = word.lower().strip()
    if token in bands["function_residue"]:
        return "function_residue", False, "listed_function_residue"
    if token in bands["content_signature"]:
        return "content_signature", token in bands["technical_artifact_signature"], "listed_content_signature"
    if token in bands["borderline"]:
        return "borderline", False, "listed_borderline"
    return "borderline", False, "default_borderline"


def write_csv(path: Path, rows: list[dict[str, str]], fieldnames: list[str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def main() -> None:
    ensure_dirs()
    bands = parse_bands(BANDS_FILE)
    rows = read_rows(RECURRING_FILE)

    enriched: list[dict[str, str]] = []
    for row in rows:
        band, is_tech, band_source = classify_row(row["word"], bands)
        enriched_row = dict(row)
        enriched_row["band"] = band
        enriched_row["is_technical_artifact"] = "True" if is_tech else "False"
        enriched_row["band_source"] = band_source
        enriched.append(enriched_row)

    fieldnames = list(enriched[0].keys()) if enriched else []

    all_path = OUTPUT_DIR / "system_recurring_words_with_band.csv"
    content_path = OUTPUT_DIR / "system_recurring_words_content.csv"
    borderline_path = OUTPUT_DIR / "system_recurring_words_borderline.csv"
    residue_path = OUTPUT_DIR / "system_recurring_words_residue.csv"

    content_rows = [r for r in enriched if r["band"] == "content_signature"]
    borderline_rows = [r for r in enriched if r["band"] == "borderline"]
    residue_rows = [r for r in enriched if r["band"] == "function_residue"]

    write_csv(all_path, enriched, fieldnames)
    write_csv(content_path, content_rows, fieldnames)
    write_csv(borderline_path, borderline_rows, fieldnames)
    write_csv(residue_path, residue_rows, fieldnames)

    band_counter = Counter(r["band"] for r in enriched)
    band_sum_counter = defaultdict(int)
    for row in enriched:
        band_sum_counter[row["band"]] += int(row["total_count_in_system"])

    total_rows = len(enriched)
    total_sum = sum(int(r["total_count_in_system"]) for r in enriched)

    summary_rows: list[dict[str, str]] = []
    for band in ("content_signature", "borderline", "function_residue"):
        summary_rows.append(
            {
                "band": band,
                "rows": str(band_counter.get(band, 0)),
                "sum_count": str(band_sum_counter.get(band, 0)),
                "row_share": f"{(band_counter.get(band, 0) / total_rows) if total_rows else 0:.6f}",
                "sum_share": f"{(band_sum_counter.get(band, 0) / total_sum) if total_sum else 0:.6f}",
            }
        )

    write_csv(
        SUMMARY_DIR / "negative_space_band_summary.csv",
        summary_rows,
        ["band", "rows", "sum_count", "row_share", "sum_share"],
    )

    system_band_counts: dict[tuple[str, str], dict[str, int]] = defaultdict(lambda: {"rows": 0, "sum_count": 0})
    for row in enriched:
        key = (row["system"], row["band"])
        system_band_counts[key]["rows"] += 1
        system_band_counts[key]["sum_count"] += int(row["total_count_in_system"])

    system_totals_rows = defaultdict(int)
    system_totals_sum = defaultdict(int)
    for row in enriched:
        system_totals_rows[row["system"]] += 1
        system_totals_sum[row["system"]] += int(row["total_count_in_system"])

    system_summary_rows: list[dict[str, str]] = []
    for (system, band), values in sorted(system_band_counts.items()):
        total_system_rows = system_totals_rows[system]
        total_system_sum = system_totals_sum[system]
        system_summary_rows.append(
            {
                "system": system,
                "band": band,
                "rows": str(values["rows"]),
                "sum_count": str(values["sum_count"]),
                "row_share_within_system": f"{(values['rows'] / total_system_rows) if total_system_rows else 0:.6f}",
                "sum_share_within_system": f"{(values['sum_count'] / total_system_sum) if total_system_sum else 0:.6f}",
            }
        )

    write_csv(
        SUMMARY_DIR / "negative_space_system_band_summary.csv",
        system_summary_rows,
        ["system", "band", "rows", "sum_count", "row_share_within_system", "sum_share_within_system"],
    )


if __name__ == "__main__":
    main()
