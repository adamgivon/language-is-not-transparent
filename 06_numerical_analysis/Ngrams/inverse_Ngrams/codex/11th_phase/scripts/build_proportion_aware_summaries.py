import csv
from collections import defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
PHASE11 = ROOT / "11th_phase"
SUMMARIES = PHASE11 / "summaries"
WRITEUP = PHASE11 / "writeup"

ALL_LEVELS = ROOT / "1st_phase" / "parsed" / "all_levels_tidy.csv"
GROUP_BALANCE = ROOT / "4th_phase" / "summaries" / "system_grouping_balance_summary.csv"
ANCHOR_CROSS = ROOT / "4th_phase" / "summaries" / "system_anchor_cross_scenario_summary.csv"
NEG_SPACE = ROOT / "5th_phase" / "summaries" / "negative_space_system_band_summary.csv"
CONTROL_WORDS = ROOT / "control_signature" / "summaries" / "control_disproportionate_words_main.csv"
CONTROL_STARTERS = ROOT / "control_signature" / "summaries" / "control_top_phrase_starters.csv"


SYSTEM_ORDER = ["CONTROL", "AC15", "AC15P", "HYBRID_3_5", "HYBRID_SEMANTIC"]
LEVEL_ORDER = ["bigrams", "trigrams", "quadgrams"]


def read_csv(path):
    with open(path, newline="") as f:
        return list(csv.DictReader(f))


def write_csv(path, rows, fieldnames):
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        w.writeheader()
        w.writerows(rows)


def load_totals():
    level_totals = defaultdict(int)
    tri_quad_totals = defaultdict(int)
    ngram_map = defaultdict(dict)

    for row in read_csv(ALL_LEVELS):
        system = row["system"]
        level = row["level"]
        scenario = row["scenario"]
        ngram = row["ngram"]
        count = int(row["count"])
        level_totals[(system, level)] += count
        if level in ("trigrams", "quadgrams"):
            tri_quad_totals[system] += count
        ngram_map[(scenario, level, ngram)][system] = count

    total_rows = []
    for system in SYSTEM_ORDER:
        tri = level_totals[(system, "trigrams")]
        quad = level_totals[(system, "quadgrams")]
        total_rows.append(
            {
                "system": system,
                "trigram_total": tri,
                "quadgram_total": quad,
                "tri_plus_quad_total": tri + quad,
            }
        )
    write_csv(
        SUMMARIES / "system_total_ngram_windows.csv",
        total_rows,
        ["system", "trigram_total", "quadgram_total", "tri_plus_quad_total"],
    )
    return level_totals, tri_quad_totals, ngram_map


def build_grouped_scale(level_totals, tri_quad_totals):
    anchor_rows = read_csv(ANCHOR_CROSS)
    out = []
    overall_group = defaultdict(lambda: {"row_count": 0, "sum_count": 0, "levels": set(), "scenarios": set()})
    for row in anchor_rows:
        system = row["system"]
        level = row["level"]
        group = row["expression_group"]
        sum_count = int(row["sum_count"])
        row_count = int(row["row_count"])
        total_level = level_totals[(system, level)]
        out.append(
            {
                "system": system,
                "level": level,
                "expression_group": row["expression_group"],
                "row_count": row_count,
                "sum_count": sum_count,
                "share_of_system_level_grouped_sum": row["share_of_system_level_anchor_sum"],
                "share_of_total_level_tokens": f"{(sum_count / total_level):.6f}",
                "rate_per_10k_level_tokens": f"{(sum_count / total_level) * 10000:.3f}",
            }
        )
        key = (system, group)
        overall_group[key]["row_count"] += row_count
        overall_group[key]["sum_count"] += sum_count
        overall_group[key]["levels"].add(level)
        for scenario in row["scenarios"].split(";"):
            if scenario:
                overall_group[key]["scenarios"].add(scenario)

    write_csv(
        SUMMARIES / "grouped_anchor_scale_by_system_level.csv",
        out,
        [
            "system",
            "level",
            "expression_group",
            "row_count",
            "sum_count",
            "share_of_system_level_grouped_sum",
            "share_of_total_level_tokens",
            "rate_per_10k_level_tokens",
        ],
    )

    overall_rows = []
    for system in SYSTEM_ORDER:
        for group in [
            "practical_considerations_and_execution",
            "temporal_projection",
            "truth",
            "imagination_and_possibility",
        ]:
            data = overall_group[(system, group)]
            tri_quad_total = tri_quad_totals[system]
            overall_rows.append(
                {
                    "system": system,
                    "expression_group": group,
                    "row_count": data["row_count"],
                    "sum_count": data["sum_count"],
                    "levels": ";".join(sorted(data["levels"])),
                    "scenario_count": len(data["scenarios"]),
                    "scenarios": ";".join(sorted(data["scenarios"])),
                    "share_of_total_tokens": f"{(data['sum_count'] / tri_quad_total):.6f}",
                    "rate_per_10k_tokens": f"{(data['sum_count'] / tri_quad_total) * 10000:.3f}",
                }
            )
    write_csv(
        SUMMARIES / "grouped_anchor_scale_by_system_overall.csv",
        overall_rows,
        [
            "system",
            "expression_group",
            "row_count",
            "sum_count",
            "levels",
            "scenario_count",
            "scenarios",
            "share_of_total_tokens",
            "rate_per_10k_tokens",
        ],
    )

    system_balance = defaultdict(lambda: {"grouped_sum_count": 0, "grouped_rows": 0, "core_sum_count": 0, "core_rows": 0})
    for row in read_csv(GROUP_BALANCE):
        system = row["system"]
        system_balance[system]["grouped_sum_count"] += int(row["grouped_sum_count"])
        system_balance[system]["grouped_rows"] += int(row["grouped_rows"])
        system_balance[system]["core_sum_count"] += int(row["total_core_sum_count"])
        system_balance[system]["core_rows"] += int(row["total_core_rows"])

    overall = []
    for system in SYSTEM_ORDER:
        grouped_sum = system_balance[system]["grouped_sum_count"]
        core_sum = system_balance[system]["core_sum_count"]
        tri_quad_total = tri_quad_totals[system]
        overall.append(
            {
                "system": system,
                "grouped_sum_count": grouped_sum,
                "filtered_inverse_sum_count": core_sum,
                "tri_plus_quad_total": tri_quad_total,
                "grouped_share_within_filtered_inverse": f"{(grouped_sum / core_sum):.6f}",
                "filtered_inverse_share_of_total_tokens": f"{(core_sum / tri_quad_total):.6f}",
                "grouped_share_of_total_tokens": f"{(grouped_sum / tri_quad_total):.6f}",
                "grouped_rate_per_10k_tokens": f"{(grouped_sum / tri_quad_total) * 10000:.3f}",
            }
        )
    write_csv(
        SUMMARIES / "grouped_system_overall_scale.csv",
        overall,
        [
            "system",
            "grouped_sum_count",
            "filtered_inverse_sum_count",
            "tri_plus_quad_total",
            "grouped_share_within_filtered_inverse",
            "filtered_inverse_share_of_total_tokens",
            "grouped_share_of_total_tokens",
            "grouped_rate_per_10k_tokens",
        ],
    )


def build_negative_space_scale(tri_quad_totals):
    rows = []
    for row in read_csv(NEG_SPACE):
        system = row["system"]
        band = row["band"]
        sum_count = int(row["sum_count"])
        tri_quad_total = tri_quad_totals[system]
        rows.append(
            {
                "system": system,
                "band": band,
                "rows": int(row["rows"]),
                "sum_count": sum_count,
                "sum_share_within_recurring_word_table": row["sum_share_within_system"],
                "share_of_total_tokens": f"{(sum_count / tri_quad_total):.6f}",
                "rate_per_10k_tokens": f"{(sum_count / tri_quad_total) * 10000:.3f}",
            }
        )
    write_csv(
        SUMMARIES / "negative_space_scale_by_system.csv",
        rows,
        [
            "system",
            "band",
            "rows",
            "sum_count",
            "sum_share_within_recurring_word_table",
            "share_of_total_tokens",
            "rate_per_10k_tokens",
        ],
    )


def build_control_scale(tri_quad_totals):
    tri_quad_total = tri_quad_totals["CONTROL"]
    word_rows = []
    for row in read_csv(CONTROL_WORDS):
        count = int(row["control_count"])
        word_rows.append(
            {
                **row,
                "share_of_control_tri_quad_total": f"{(count / tri_quad_total):.6f}",
                "rate_per_10k_control_tokens": f"{(count / tri_quad_total) * 10000:.3f}",
            }
        )
    write_csv(
        SUMMARIES / "control_disproportionate_words_with_scale.csv",
        word_rows,
        list(word_rows[0].keys()),
    )

    starter_rows = []
    for row in read_csv(CONTROL_STARTERS):
        total = int(row["total_count"])
        starter_rows.append(
            {
                **row,
                "share_of_control_tri_quad_total": f"{(total / tri_quad_total):.6f}",
                "rate_per_10k_control_tokens": f"{(total / tri_quad_total) * 10000:.3f}",
            }
        )
    write_csv(
        SUMMARIES / "control_phrase_starters_with_scale.csv",
        starter_rows,
        list(starter_rows[0].keys()),
    )


def build_pairwise_mass(level_totals, ngram_map):
    pair_counts = defaultdict(lambda: {"type_count": 0, "token_mass": 0, "scenario_set": set()})
    triple_counts = defaultdict(lambda: {"type_count": 0, "token_mass": 0, "scenario_set": set()})

    for (scenario, level, ngram), owners in ngram_map.items():
        systems = sorted(owners)
        owner_count = len(systems)
        if owner_count == 2:
            pair = "|".join(systems)
            key = (level, pair)
            pair_counts[key]["type_count"] += 1
            pair_counts[key]["token_mass"] += sum(owners.values())
            pair_counts[key]["scenario_set"].add(scenario)
        elif owner_count == 3:
            triple = "|".join(systems)
            key = (level, triple)
            triple_counts[key]["type_count"] += 1
            triple_counts[key]["token_mass"] += sum(owners.values())
            triple_counts[key]["scenario_set"].add(scenario)

    pair_rows = []
    for (level, pair), data in sorted(pair_counts.items()):
        s1, s2 = pair.split("|")
        combined_total = level_totals[(s1, level)] + level_totals[(s2, level)]
        pair_rows.append(
            {
                "level": level,
                "pair": pair,
                "type_count": data["type_count"],
                "token_mass": data["token_mass"],
                "scenario_count": len(data["scenario_set"]),
                "scenarios": ";".join(sorted(data["scenario_set"])),
                "share_of_combined_pair_tokens": f"{(data['token_mass'] / combined_total):.6f}",
                "rate_per_10k_combined_pair_tokens": f"{(data['token_mass'] / combined_total) * 10000:.3f}",
            }
        )
    write_csv(
        SUMMARIES / "pairwise_exact_sharing_mass.csv",
        pair_rows,
        [
            "level",
            "pair",
            "type_count",
            "token_mass",
            "scenario_count",
            "scenarios",
            "share_of_combined_pair_tokens",
            "rate_per_10k_combined_pair_tokens",
        ],
    )

    triple_rows = []
    for (level, triple), data in sorted(triple_counts.items()):
        systems = triple.split("|")
        combined_total = sum(level_totals[(system, level)] for system in systems)
        triple_rows.append(
            {
                "level": level,
                "triple": triple,
                "type_count": data["type_count"],
                "token_mass": data["token_mass"],
                "scenario_count": len(data["scenario_set"]),
                "scenarios": ";".join(sorted(data["scenario_set"])),
                "share_of_combined_triple_tokens": f"{(data['token_mass'] / combined_total):.6f}",
                "rate_per_10k_combined_triple_tokens": f"{(data['token_mass'] / combined_total) * 10000:.3f}",
            }
        )
    write_csv(
        SUMMARIES / "triple_exact_sharing_mass.csv",
        triple_rows,
        [
            "level",
            "triple",
            "type_count",
            "token_mass",
            "scenario_count",
            "scenarios",
            "share_of_combined_triple_tokens",
            "rate_per_10k_combined_triple_tokens",
        ],
    )


def main():
    SUMMARIES.mkdir(parents=True, exist_ok=True)
    WRITEUP.mkdir(parents=True, exist_ok=True)
    level_totals, tri_quad_totals, ngram_map = load_totals()
    build_grouped_scale(level_totals, tri_quad_totals)
    build_negative_space_scale(tri_quad_totals)
    build_control_scale(tri_quad_totals)
    build_pairwise_mass(level_totals, ngram_map)


if __name__ == "__main__":
    main()
