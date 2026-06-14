#!/usr/bin/env python3

from __future__ import annotations

import csv
from collections import defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[3]
PHASE3_ROOT = ROOT / "codex" / "3rd_phase"
OUT_ROOT = Path(__file__).resolve().parents[1]

LEVELS = ("trigrams", "quadgrams")
LAYER_A_GROUPS = {
    "truth",
    "practical_considerations_and_execution",
    "temporal_projection",
    "imagination_and_possibility",
}


def ensure_dirs() -> None:
    for rel in ["summaries", "scripts"]:
        (OUT_ROOT / rel).mkdir(parents=True, exist_ok=True)


def to_bool(value: str) -> bool:
    return str(value).strip().lower() == "true"


def read_annotated_rows(level: str) -> list[dict[str, object]]:
    rows: list[dict[str, object]] = []
    src = PHASE3_ROOT / "grouped" / "annotated_core_filtered" / level
    for path in sorted(src.glob("*.csv")):
        with path.open(newline="", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                groups = [g for g in row["matched_expression_groups"].split(";") if g]
                layers = [g for g in row["matched_expression_layers"].split(";") if g]
                subgroup_keys = [g for g in row.get("matched_expression_subgroups", "").split(";") if g]
                subgroups: list[tuple[str, str]] = []
                for subgroup_key in subgroup_keys:
                    if ":" in subgroup_key:
                        group_name, subgroup_name = subgroup_key.split(":", 1)
                        subgroups.append((group_name, subgroup_name))
                rows.append(
                    {
                        "scenario": row["scenario"],
                        "scenario_label": row["scenario_label"],
                        "level": row["level"],
                        "system": row["system"],
                        "ngram": row["ngram"],
                        "count": int(row["count"]),
                        "constraint_hit_count": int(row["constraint_hit_count"]),
                        "matched_constraints": row["matched_constraints"],
                        "groups": groups,
                        "layers": layers,
                        "subgroups": subgroups,
                        "scenario_heavy": to_bool(row["scenario_heavy"]),
                        "is_grouped": int(row["expression_group_count"]) > 0,
                    }
                )
    return rows


def safe_div(num: int, den: int) -> float:
    if den == 0:
        return 0.0
    return num / den


def write_csv(path: Path, rows: list[dict[str, object]], fieldnames: list[str]) -> None:
    with path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def build_phase4() -> None:
    ensure_dirs()
    rows: list[dict[str, object]] = []
    for level in LEVELS:
        rows.extend(read_annotated_rows(level))

    system_scenario_level_totals: dict[tuple[str, str, str], dict[str, int]] = defaultdict(
        lambda: {
            "total_rows": 0,
            "total_sum": 0,
            "grouped_rows": 0,
            "grouped_sum": 0,
            "unclassified_rows": 0,
            "unclassified_sum": 0,
        }
    )
    scenario_level_totals: dict[tuple[str, str], dict[str, int]] = defaultdict(
        lambda: {
            "total_rows": 0,
            "total_sum": 0,
            "grouped_rows": 0,
            "grouped_sum": 0,
            "unclassified_rows": 0,
            "unclassified_sum": 0,
        }
    )
    system_group_scenario_level: dict[tuple[str, str, str, str], dict[str, int]] = defaultdict(
        lambda: {"row_count": 0, "sum_count": 0, "scenario_heavy_row_count": 0, "scenario_heavy_sum_count": 0}
    )
    system_subgroup_scenario_level: dict[tuple[str, str, str, str, str], dict[str, int]] = defaultdict(
        lambda: {"row_count": 0, "sum_count": 0, "scenario_heavy_row_count": 0, "scenario_heavy_sum_count": 0}
    )
    system_layer_scenario_level: dict[tuple[str, str, str, str], dict[str, int]] = defaultdict(
        lambda: {"row_count": 0, "sum_count": 0, "scenario_heavy_row_count": 0, "scenario_heavy_sum_count": 0}
    )
    system_anchor_cross_scenario: dict[tuple[str, str, str], dict[str, object]] = defaultdict(
        lambda: {"row_count": 0, "sum_count": 0, "scenarios": set()}
    )
    system_anchor_subgroup_cross_scenario: dict[tuple[str, str, str, str], dict[str, object]] = defaultdict(
        lambda: {"row_count": 0, "sum_count": 0, "scenarios": set()}
    )
    scenario_group_level: dict[tuple[str, str, str], dict[str, object]] = defaultdict(
        lambda: {"row_count": 0, "sum_count": 0, "systems": set()}
    )
    scenario_subgroup_level: dict[tuple[str, str, str, str], dict[str, object]] = defaultdict(
        lambda: {"row_count": 0, "sum_count": 0, "systems": set()}
    )
    phrase_all: dict[tuple[str, str, str, str], dict[str, object]] = defaultdict(
        lambda: {
            "total_count": 0,
            "row_occurrences": 0,
            "scenarios": set(),
            "scenario_heavy_hits": 0,
            "matched_constraints": set(),
        }
    )
    phrase_non_scenario_heavy: dict[tuple[str, str, str, str], dict[str, object]] = defaultdict(
        lambda: {
            "total_count": 0,
            "row_occurrences": 0,
            "scenarios": set(),
            "matched_constraints": set(),
        }
    )
    subgroup_phrase_all: dict[tuple[str, str, str, str, str], dict[str, object]] = defaultdict(
        lambda: {
            "total_count": 0,
            "row_occurrences": 0,
            "scenarios": set(),
            "scenario_heavy_hits": 0,
            "matched_constraints": set(),
        }
    )
    subgroup_phrase_non_scenario_heavy: dict[tuple[str, str, str, str, str], dict[str, object]] = defaultdict(
        lambda: {
            "total_count": 0,
            "row_occurrences": 0,
            "scenarios": set(),
            "matched_constraints": set(),
        }
    )

    for row in rows:
        key_ssl = (str(row["scenario"]), str(row["level"]), str(row["system"]))
        key_sl = (str(row["scenario"]), str(row["level"]))

        system_scenario_level_totals[key_ssl]["total_rows"] += 1
        system_scenario_level_totals[key_ssl]["total_sum"] += int(row["count"])
        scenario_level_totals[key_sl]["total_rows"] += 1
        scenario_level_totals[key_sl]["total_sum"] += int(row["count"])

        if not bool(row["is_grouped"]):
            system_scenario_level_totals[key_ssl]["unclassified_rows"] += 1
            system_scenario_level_totals[key_ssl]["unclassified_sum"] += int(row["count"])
            scenario_level_totals[key_sl]["unclassified_rows"] += 1
            scenario_level_totals[key_sl]["unclassified_sum"] += int(row["count"])
            continue

        system_scenario_level_totals[key_ssl]["grouped_rows"] += 1
        system_scenario_level_totals[key_ssl]["grouped_sum"] += int(row["count"])
        scenario_level_totals[key_sl]["grouped_rows"] += 1
        scenario_level_totals[key_sl]["grouped_sum"] += int(row["count"])

        groups = list(row["groups"])
        subgroups = list(row["subgroups"])
        layers = list(row["layers"])
        matched_constraints = [c for c in str(row["matched_constraints"]).split(";") if c]

        for group in groups:
            key = (str(row["scenario"]), str(row["level"]), str(row["system"]), group)
            system_group_scenario_level[key]["row_count"] += 1
            system_group_scenario_level[key]["sum_count"] += int(row["count"])
            if bool(row["scenario_heavy"]):
                system_group_scenario_level[key]["scenario_heavy_row_count"] += 1
                system_group_scenario_level[key]["scenario_heavy_sum_count"] += int(row["count"])

            key2 = (str(row["scenario"]), str(row["level"]), group)
            scenario_group_level[key2]["row_count"] += 1
            scenario_group_level[key2]["sum_count"] += int(row["count"])
            scenario_group_level[key2]["systems"].add(str(row["system"]))

            phrase_key = (str(row["level"]), str(row["system"]), group, str(row["ngram"]))
            phrase_all[phrase_key]["total_count"] += int(row["count"])
            phrase_all[phrase_key]["row_occurrences"] += 1
            phrase_all[phrase_key]["scenarios"].add(str(row["scenario"]))
            if bool(row["scenario_heavy"]):
                phrase_all[phrase_key]["scenario_heavy_hits"] += 1
            for c in matched_constraints:
                phrase_all[phrase_key]["matched_constraints"].add(c)

            if not bool(row["scenario_heavy"]):
                phrase_non_scenario_heavy[phrase_key]["total_count"] += int(row["count"])
                phrase_non_scenario_heavy[phrase_key]["row_occurrences"] += 1
                phrase_non_scenario_heavy[phrase_key]["scenarios"].add(str(row["scenario"]))
                for c in matched_constraints:
                    phrase_non_scenario_heavy[phrase_key]["matched_constraints"].add(c)

            if group in LAYER_A_GROUPS:
                key3 = (str(row["level"]), str(row["system"]), group)
                system_anchor_cross_scenario[key3]["row_count"] += 1
                system_anchor_cross_scenario[key3]["sum_count"] += int(row["count"])
                system_anchor_cross_scenario[key3]["scenarios"].add(str(row["scenario"]))

        for group, subgroup in subgroups:
            key = (str(row["scenario"]), str(row["level"]), str(row["system"]), group, subgroup)
            system_subgroup_scenario_level[key]["row_count"] += 1
            system_subgroup_scenario_level[key]["sum_count"] += int(row["count"])
            if bool(row["scenario_heavy"]):
                system_subgroup_scenario_level[key]["scenario_heavy_row_count"] += 1
                system_subgroup_scenario_level[key]["scenario_heavy_sum_count"] += int(row["count"])

            key2 = (str(row["scenario"]), str(row["level"]), group, subgroup)
            scenario_subgroup_level[key2]["row_count"] += 1
            scenario_subgroup_level[key2]["sum_count"] += int(row["count"])
            scenario_subgroup_level[key2]["systems"].add(str(row["system"]))

            phrase_key = (str(row["level"]), str(row["system"]), group, subgroup, str(row["ngram"]))
            subgroup_phrase_all[phrase_key]["total_count"] += int(row["count"])
            subgroup_phrase_all[phrase_key]["row_occurrences"] += 1
            subgroup_phrase_all[phrase_key]["scenarios"].add(str(row["scenario"]))
            if bool(row["scenario_heavy"]):
                subgroup_phrase_all[phrase_key]["scenario_heavy_hits"] += 1
            for c in matched_constraints:
                subgroup_phrase_all[phrase_key]["matched_constraints"].add(c)

            if not bool(row["scenario_heavy"]):
                subgroup_phrase_non_scenario_heavy[phrase_key]["total_count"] += int(row["count"])
                subgroup_phrase_non_scenario_heavy[phrase_key]["row_occurrences"] += 1
                subgroup_phrase_non_scenario_heavy[phrase_key]["scenarios"].add(str(row["scenario"]))
                for c in matched_constraints:
                    subgroup_phrase_non_scenario_heavy[phrase_key]["matched_constraints"].add(c)

            if group in LAYER_A_GROUPS:
                key3 = (str(row["level"]), str(row["system"]), group, subgroup)
                system_anchor_subgroup_cross_scenario[key3]["row_count"] += 1
                system_anchor_subgroup_cross_scenario[key3]["sum_count"] += int(row["count"])
                system_anchor_subgroup_cross_scenario[key3]["scenarios"].add(str(row["scenario"]))

        for layer in layers:
            key = (str(row["scenario"]), str(row["level"]), str(row["system"]), layer)
            system_layer_scenario_level[key]["row_count"] += 1
            system_layer_scenario_level[key]["sum_count"] += int(row["count"])
            if bool(row["scenario_heavy"]):
                system_layer_scenario_level[key]["scenario_heavy_row_count"] += 1
                system_layer_scenario_level[key]["scenario_heavy_sum_count"] += int(row["count"])

    system_group_rows: list[dict[str, object]] = []
    for key, stats in sorted(system_group_scenario_level.items()):
        scenario, level, system, group = key
        base_system = system_scenario_level_totals[(scenario, level, system)]
        base_scenario = scenario_level_totals[(scenario, level)]
        layer = "constraint_aligned" if group in LAYER_A_GROUPS else "cross_cutting"
        system_group_rows.append(
            {
                "scenario": scenario,
                "level": level,
                "system": system,
                "expression_group_layer": layer,
                "expression_group": group,
                "row_count": stats["row_count"],
                "sum_count": stats["sum_count"],
                "scenario_heavy_row_count": stats["scenario_heavy_row_count"],
                "scenario_heavy_sum_count": stats["scenario_heavy_sum_count"],
                "share_of_system_scenario_grouped_rows": f"{safe_div(stats['row_count'], base_system['grouped_rows']):.6f}",
                "share_of_system_scenario_grouped_sum": f"{safe_div(stats['sum_count'], base_system['grouped_sum']):.6f}",
                "share_of_scenario_level_grouped_rows": f"{safe_div(stats['row_count'], base_scenario['grouped_rows']):.6f}",
                "share_of_scenario_level_grouped_sum": f"{safe_div(stats['sum_count'], base_scenario['grouped_sum']):.6f}",
            }
        )

    system_subgroup_rows: list[dict[str, object]] = []
    for key, stats in sorted(system_subgroup_scenario_level.items()):
        scenario, level, system, group, subgroup = key
        base_system = system_scenario_level_totals[(scenario, level, system)]
        base_scenario = scenario_level_totals[(scenario, level)]
        layer = "constraint_aligned" if group in LAYER_A_GROUPS else "cross_cutting"
        system_subgroup_rows.append(
            {
                "scenario": scenario,
                "level": level,
                "system": system,
                "expression_group_layer": layer,
                "expression_group": group,
                "expression_subgroup": subgroup,
                "row_count": stats["row_count"],
                "sum_count": stats["sum_count"],
                "scenario_heavy_row_count": stats["scenario_heavy_row_count"],
                "scenario_heavy_sum_count": stats["scenario_heavy_sum_count"],
                "share_of_system_scenario_grouped_rows": f"{safe_div(stats['row_count'], base_system['grouped_rows']):.6f}",
                "share_of_system_scenario_grouped_sum": f"{safe_div(stats['sum_count'], base_system['grouped_sum']):.6f}",
                "share_of_scenario_level_grouped_rows": f"{safe_div(stats['row_count'], base_scenario['grouped_rows']):.6f}",
                "share_of_scenario_level_grouped_sum": f"{safe_div(stats['sum_count'], base_scenario['grouped_sum']):.6f}",
            }
        )

    system_layer_rows: list[dict[str, object]] = []
    for key, stats in sorted(system_layer_scenario_level.items()):
        scenario, level, system, layer = key
        base_system = system_scenario_level_totals[(scenario, level, system)]
        base_scenario = scenario_level_totals[(scenario, level)]
        system_layer_rows.append(
            {
                "scenario": scenario,
                "level": level,
                "system": system,
                "expression_group_layer": layer,
                "row_count": stats["row_count"],
                "sum_count": stats["sum_count"],
                "scenario_heavy_row_count": stats["scenario_heavy_row_count"],
                "scenario_heavy_sum_count": stats["scenario_heavy_sum_count"],
                "share_of_system_scenario_grouped_rows": f"{safe_div(stats['row_count'], base_system['grouped_rows']):.6f}",
                "share_of_system_scenario_grouped_sum": f"{safe_div(stats['sum_count'], base_system['grouped_sum']):.6f}",
                "share_of_scenario_level_grouped_rows": f"{safe_div(stats['row_count'], base_scenario['grouped_rows']):.6f}",
                "share_of_scenario_level_grouped_sum": f"{safe_div(stats['sum_count'], base_scenario['grouped_sum']):.6f}",
            }
        )

    system_anchor_base_totals: dict[tuple[str, str], dict[str, int]] = defaultdict(lambda: {"row_count": 0, "sum_count": 0})
    for (level, system, _group), stats in system_anchor_cross_scenario.items():
        system_anchor_base_totals[(level, system)]["row_count"] += int(stats["row_count"])
        system_anchor_base_totals[(level, system)]["sum_count"] += int(stats["sum_count"])

    system_anchor_rows: list[dict[str, object]] = []
    for key, stats in sorted(system_anchor_cross_scenario.items()):
        level, system, group = key
        base = system_anchor_base_totals[(level, system)]
        system_anchor_rows.append(
            {
                "level": level,
                "system": system,
                "expression_group": group,
                "row_count": stats["row_count"],
                "sum_count": stats["sum_count"],
                "scenario_count": len(stats["scenarios"]),
                "scenarios": ";".join(sorted(stats["scenarios"])),
                "share_of_system_level_anchor_rows": f"{safe_div(int(stats['row_count']), base['row_count']):.6f}",
                "share_of_system_level_anchor_sum": f"{safe_div(int(stats['sum_count']), base['sum_count']):.6f}",
            }
        )

    system_anchor_subgroup_base_totals: dict[tuple[str, str, str], dict[str, int]] = defaultdict(
        lambda: {"row_count": 0, "sum_count": 0}
    )
    for (level, system, group, _subgroup), stats in system_anchor_subgroup_cross_scenario.items():
        system_anchor_subgroup_base_totals[(level, system, group)]["row_count"] += int(stats["row_count"])
        system_anchor_subgroup_base_totals[(level, system, group)]["sum_count"] += int(stats["sum_count"])

    system_anchor_subgroup_rows: list[dict[str, object]] = []
    for key, stats in sorted(system_anchor_subgroup_cross_scenario.items()):
        level, system, group, subgroup = key
        base = system_anchor_subgroup_base_totals[(level, system, group)]
        system_anchor_subgroup_rows.append(
            {
                "level": level,
                "system": system,
                "expression_group": group,
                "expression_subgroup": subgroup,
                "row_count": stats["row_count"],
                "sum_count": stats["sum_count"],
                "scenario_count": len(stats["scenarios"]),
                "scenarios": ";".join(sorted(stats["scenarios"])),
                "share_of_system_level_group_subgroup_rows": f"{safe_div(int(stats['row_count']), base['row_count']):.6f}",
                "share_of_system_level_group_subgroup_sum": f"{safe_div(int(stats['sum_count']), base['sum_count']):.6f}",
            }
        )

    scenario_group_rows: list[dict[str, object]] = []
    for key, stats in sorted(scenario_group_level.items()):
        scenario, level, group = key
        base_scenario = scenario_level_totals[(scenario, level)]
        layer = "constraint_aligned" if group in LAYER_A_GROUPS else "cross_cutting"
        scenario_group_rows.append(
            {
                "scenario": scenario,
                "level": level,
                "expression_group_layer": layer,
                "expression_group": group,
                "row_count": stats["row_count"],
                "sum_count": stats["sum_count"],
                "system_count": len(stats["systems"]),
                "systems": ";".join(sorted(stats["systems"])),
                "share_of_scenario_level_grouped_rows": f"{safe_div(stats['row_count'], base_scenario['grouped_rows']):.6f}",
                "share_of_scenario_level_grouped_sum": f"{safe_div(stats['sum_count'], base_scenario['grouped_sum']):.6f}",
            }
        )

    scenario_subgroup_rows: list[dict[str, object]] = []
    for key, stats in sorted(scenario_subgroup_level.items()):
        scenario, level, group, subgroup = key
        base_scenario = scenario_level_totals[(scenario, level)]
        layer = "constraint_aligned" if group in LAYER_A_GROUPS else "cross_cutting"
        scenario_subgroup_rows.append(
            {
                "scenario": scenario,
                "level": level,
                "expression_group_layer": layer,
                "expression_group": group,
                "expression_subgroup": subgroup,
                "row_count": stats["row_count"],
                "sum_count": stats["sum_count"],
                "system_count": len(stats["systems"]),
                "systems": ";".join(sorted(stats["systems"])),
                "share_of_scenario_level_grouped_rows": f"{safe_div(stats['row_count'], base_scenario['grouped_rows']):.6f}",
                "share_of_scenario_level_grouped_sum": f"{safe_div(stats['sum_count'], base_scenario['grouped_sum']):.6f}",
            }
        )

    system_grouping_balance_rows: list[dict[str, object]] = []
    unclassified_rows: list[dict[str, object]] = []
    for key, stats in sorted(system_scenario_level_totals.items()):
        scenario, level, system = key
        system_grouping_balance_rows.append(
            {
                "scenario": scenario,
                "level": level,
                "system": system,
                "total_core_rows": stats["total_rows"],
                "total_core_sum_count": stats["total_sum"],
                "grouped_rows": stats["grouped_rows"],
                "grouped_sum_count": stats["grouped_sum"],
                "unclassified_rows": stats["unclassified_rows"],
                "unclassified_sum_count": stats["unclassified_sum"],
                "grouped_row_share": f"{safe_div(stats['grouped_rows'], stats['total_rows']):.6f}",
                "grouped_sum_share": f"{safe_div(stats['grouped_sum'], stats['total_sum']):.6f}",
                "unclassified_row_share": f"{safe_div(stats['unclassified_rows'], stats['total_rows']):.6f}",
                "unclassified_sum_share": f"{safe_div(stats['unclassified_sum'], stats['total_sum']):.6f}",
            }
        )
        unclassified_rows.append(
            {
                "scenario": scenario,
                "level": level,
                "system": system,
                "unclassified_rows": stats["unclassified_rows"],
                "unclassified_sum_count": stats["unclassified_sum"],
                "total_core_rows": stats["total_rows"],
                "total_core_sum_count": stats["total_sum"],
                "unclassified_row_share": f"{safe_div(stats['unclassified_rows'], stats['total_rows']):.6f}",
                "unclassified_sum_share": f"{safe_div(stats['unclassified_sum'], stats['total_sum']):.6f}",
            }
        )

    def build_top_phrase_rows(source: dict[tuple, dict[str, object]], subgroup_mode: bool) -> list[dict[str, object]]:
        by_bucket: dict[tuple, list[dict[str, object]]] = defaultdict(list)
        for key, stats in source.items():
            if subgroup_mode:
                level, system, group, subgroup, ngram = key
                bucket_key = (level, system, group, subgroup)
                row = {
                    "level": level,
                    "system": system,
                    "expression_group_layer": "constraint_aligned" if group in LAYER_A_GROUPS else "cross_cutting",
                    "expression_group": group,
                    "expression_subgroup": subgroup,
                    "ngram": ngram,
                    "total_count": stats["total_count"],
                    "row_occurrences": stats["row_occurrences"],
                    "scenario_count": len(stats["scenarios"]),
                    "scenarios": ";".join(sorted(stats["scenarios"])),
                    "matched_constraints": ";".join(sorted(stats["matched_constraints"])),
                    "scenario_heavy_hits": stats.get("scenario_heavy_hits", 0),
                }
            else:
                level, system, group, ngram = key
                bucket_key = (level, system, group)
                row = {
                    "level": level,
                    "system": system,
                    "expression_group_layer": "constraint_aligned" if group in LAYER_A_GROUPS else "cross_cutting",
                    "expression_group": group,
                    "ngram": ngram,
                    "total_count": stats["total_count"],
                    "row_occurrences": stats["row_occurrences"],
                    "scenario_count": len(stats["scenarios"]),
                    "scenarios": ";".join(sorted(stats["scenarios"])),
                    "matched_constraints": ";".join(sorted(stats["matched_constraints"])),
                    "scenario_heavy_hits": stats.get("scenario_heavy_hits", 0),
                }
            by_bucket[bucket_key].append(row)

        out: list[dict[str, object]] = []
        for bucket, items in sorted(by_bucket.items()):
            ordered = sorted(
                items,
                key=lambda row: (-int(row["total_count"]), -int(row["scenario_count"]), str(row["ngram"])),
            )[:15]
            out.extend(ordered)
        return out

    top_phrase_all_rows = build_top_phrase_rows(phrase_all, subgroup_mode=False)
    top_phrase_non_scenario_rows = build_top_phrase_rows(phrase_non_scenario_heavy, subgroup_mode=False)
    top_subgroup_all_rows = build_top_phrase_rows(subgroup_phrase_all, subgroup_mode=True)
    top_subgroup_non_scenario_rows = build_top_phrase_rows(
        subgroup_phrase_non_scenario_heavy,
        subgroup_mode=True,
    )

    write_csv(
        OUT_ROOT / "summaries" / "system_group_scenario_level_summary.csv",
        system_group_rows,
        [
            "scenario",
            "level",
            "system",
            "expression_group_layer",
            "expression_group",
            "row_count",
            "sum_count",
            "scenario_heavy_row_count",
            "scenario_heavy_sum_count",
            "share_of_system_scenario_grouped_rows",
            "share_of_system_scenario_grouped_sum",
            "share_of_scenario_level_grouped_rows",
            "share_of_scenario_level_grouped_sum",
        ],
    )
    write_csv(
        OUT_ROOT / "summaries" / "system_subgroup_scenario_level_summary.csv",
        system_subgroup_rows,
        [
            "scenario",
            "level",
            "system",
            "expression_group_layer",
            "expression_group",
            "expression_subgroup",
            "row_count",
            "sum_count",
            "scenario_heavy_row_count",
            "scenario_heavy_sum_count",
            "share_of_system_scenario_grouped_rows",
            "share_of_system_scenario_grouped_sum",
            "share_of_scenario_level_grouped_rows",
            "share_of_scenario_level_grouped_sum",
        ],
    )
    write_csv(
        OUT_ROOT / "summaries" / "system_layer_scenario_level_summary.csv",
        system_layer_rows,
        [
            "scenario",
            "level",
            "system",
            "expression_group_layer",
            "row_count",
            "sum_count",
            "scenario_heavy_row_count",
            "scenario_heavy_sum_count",
            "share_of_system_scenario_grouped_rows",
            "share_of_system_scenario_grouped_sum",
            "share_of_scenario_level_grouped_rows",
            "share_of_scenario_level_grouped_sum",
        ],
    )
    write_csv(
        OUT_ROOT / "summaries" / "system_anchor_cross_scenario_summary.csv",
        system_anchor_rows,
        [
            "level",
            "system",
            "expression_group",
            "row_count",
            "sum_count",
            "scenario_count",
            "scenarios",
            "share_of_system_level_anchor_rows",
            "share_of_system_level_anchor_sum",
        ],
    )
    write_csv(
        OUT_ROOT / "summaries" / "system_anchor_subgroup_cross_scenario_summary.csv",
        system_anchor_subgroup_rows,
        [
            "level",
            "system",
            "expression_group",
            "expression_subgroup",
            "row_count",
            "sum_count",
            "scenario_count",
            "scenarios",
            "share_of_system_level_group_subgroup_rows",
            "share_of_system_level_group_subgroup_sum",
        ],
    )
    write_csv(
        OUT_ROOT / "summaries" / "scenario_group_level_summary.csv",
        scenario_group_rows,
        [
            "scenario",
            "level",
            "expression_group_layer",
            "expression_group",
            "row_count",
            "sum_count",
            "system_count",
            "systems",
            "share_of_scenario_level_grouped_rows",
            "share_of_scenario_level_grouped_sum",
        ],
    )
    write_csv(
        OUT_ROOT / "summaries" / "scenario_subgroup_level_summary.csv",
        scenario_subgroup_rows,
        [
            "scenario",
            "level",
            "expression_group_layer",
            "expression_group",
            "expression_subgroup",
            "row_count",
            "sum_count",
            "system_count",
            "systems",
            "share_of_scenario_level_grouped_rows",
            "share_of_scenario_level_grouped_sum",
        ],
    )
    write_csv(
        OUT_ROOT / "summaries" / "system_grouping_balance_summary.csv",
        system_grouping_balance_rows,
        [
            "scenario",
            "level",
            "system",
            "total_core_rows",
            "total_core_sum_count",
            "grouped_rows",
            "grouped_sum_count",
            "unclassified_rows",
            "unclassified_sum_count",
            "grouped_row_share",
            "grouped_sum_share",
            "unclassified_row_share",
            "unclassified_sum_share",
        ],
    )
    write_csv(
        OUT_ROOT / "summaries" / "unclassified_summary.csv",
        unclassified_rows,
        [
            "scenario",
            "level",
            "system",
            "unclassified_rows",
            "unclassified_sum_count",
            "total_core_rows",
            "total_core_sum_count",
            "unclassified_row_share",
            "unclassified_sum_share",
        ],
    )
    write_csv(
        OUT_ROOT / "summaries" / "top_phrases_by_system_group_all.csv",
        top_phrase_all_rows,
        [
            "level",
            "system",
            "expression_group_layer",
            "expression_group",
            "ngram",
            "total_count",
            "row_occurrences",
            "scenario_count",
            "scenarios",
            "matched_constraints",
            "scenario_heavy_hits",
        ],
    )
    write_csv(
        OUT_ROOT / "summaries" / "top_phrases_by_system_group_non_scenario_heavy.csv",
        top_phrase_non_scenario_rows,
        [
            "level",
            "system",
            "expression_group_layer",
            "expression_group",
            "ngram",
            "total_count",
            "row_occurrences",
            "scenario_count",
            "scenarios",
            "matched_constraints",
            "scenario_heavy_hits",
        ],
    )
    write_csv(
        OUT_ROOT / "summaries" / "top_phrases_by_system_subgroup_all.csv",
        top_subgroup_all_rows,
        [
            "level",
            "system",
            "expression_group_layer",
            "expression_group",
            "expression_subgroup",
            "ngram",
            "total_count",
            "row_occurrences",
            "scenario_count",
            "scenarios",
            "matched_constraints",
            "scenario_heavy_hits",
        ],
    )
    write_csv(
        OUT_ROOT / "summaries" / "top_phrases_by_system_subgroup_non_scenario_heavy.csv",
        top_subgroup_non_scenario_rows,
        [
            "level",
            "system",
            "expression_group_layer",
            "expression_group",
            "expression_subgroup",
            "ngram",
            "total_count",
            "row_occurrences",
            "scenario_count",
            "scenarios",
            "matched_constraints",
            "scenario_heavy_hits",
        ],
    )


def write_readme() -> None:
    (OUT_ROOT / "README.md").write_text(
        """# Codex Inverse N-Gram Workspace — 4th Phase

This phase compresses the final phase-3 grouped outputs into synthesis tables.

Input:
- `3rd_phase/grouped/annotated_core_filtered/trigrams`
- `3rd_phase/grouped/annotated_core_filtered/quadgrams`

This phase produces:
- system × group × scenario × level summaries
- system × subgroup × scenario × level summaries
- system × layer × scenario × level summaries
- cross-scenario anchor summaries for the four Layer A groups
- cross-scenario anchor subgroup summaries
- scenario × group × level summaries
- scenario × subgroup × level summaries
- grouping balance and unclassified summaries
- top phrase shortlists for groups and subgroups, both all-in and non-scenario-heavy only

Important:
- group and subgroup shares are overlapping shares
- groups are multi-label, so shares across groups do not sum to 1
- subgroup shares within a group can also overlap
- the non-scenario-heavy shortlists are meant as the cleaner identity-support view
""",
        encoding="utf-8",
    )


if __name__ == "__main__":
    build_phase4()
    write_readme()
