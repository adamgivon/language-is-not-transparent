#!/usr/bin/env python3

from __future__ import annotations

import csv
import re
from collections import Counter, defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[3]
WORKSPACE = ROOT / "codex" / "control_signature"
PARSED_DIR = ROOT / "codex" / "1st_phase" / "parsed"
SCENARIO_LEXICON = ROOT / "scenario_specific_lexicon.md"
NEGATIVE_BANDS = ROOT / "negative_space_word_bands.md"

SUMMARIES = WORKSPACE / "summaries"
WRITEUP = WORKSPACE / "writeup"

SYSTEMS = ["CONTROL", "AC15", "AC15P", "HYBRID_3_5", "HYBRID_SEMANTIC"]
ANCHORED = ["AC15", "AC15P", "HYBRID_3_5", "HYBRID_SEMANTIC"]
LEVELS = ["trigrams", "quadgrams"]
LIGHT_STOPWORDS = {
    "a", "an", "the", "to", "of", "in", "on", "for", "and", "or", "but",
    "if", "then", "than", "from", "with", "into", "onto", "about", "across",
    "through", "around", "between", "something", "things", "thing",
}


def ensure_dirs() -> None:
    SUMMARIES.mkdir(parents=True, exist_ok=True)
    WRITEUP.mkdir(parents=True, exist_ok=True)


def tokenize(text: str) -> list[str]:
    return [t for t in re.findall(r"[a-z0-9_']+", text.lower()) if t]


def parse_scenario_terms(path: Path) -> set[str]:
    text = path.read_text(encoding="utf-8")
    terms = set()
    in_code = False
    for raw_line in text.splitlines():
        line = raw_line.strip()
        if line == "```":
            in_code = not in_code
            continue
        if in_code and line:
            for token in re.split(r"[\s,]+", line.lower()):
                token = token.strip()
                if token:
                    terms.add(token)
    return terms


def parse_function_residue(path: Path) -> set[str]:
    text = path.read_text(encoding="utf-8")
    words = set()
    in_band1 = False
    in_code = False
    for raw_line in text.splitlines():
        line = raw_line.strip()
        if line.startswith("## Band 1:"):
            in_band1 = True
            in_code = False
            continue
        if in_band1 and line.startswith("## Band 2:"):
            break
        if in_band1 and line == "```":
            in_code = not in_code
            continue
        if in_band1 and in_code and line:
            words.add(line.lower())
    return words


def read_total_rows() -> list[dict[str, str]]:
    rows: list[dict[str, str]] = []
    for level in LEVELS:
        for csv_path in sorted((PARSED_DIR / level).glob("*.csv")):
            with csv_path.open("r", encoding="utf-8", newline="") as handle:
                rows.extend(csv.DictReader(handle))
    return rows


def write_csv(path: Path, rows: list[dict[str, object]], fieldnames: list[str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        for row in rows:
            writer.writerow(row)


def fmt(value: float) -> str:
    return f"{value:.6f}"


def main() -> None:
    ensure_dirs()
    scenario_terms = parse_scenario_terms(SCENARIO_LEXICON)
    function_residue = parse_function_residue(NEGATIVE_BANDS)
    rows = read_total_rows()

    total_weighted_tokens = Counter()
    word_counts = Counter()
    scenario_word_counts = Counter()
    scenario_system_totals = Counter()

    control_phrase_counts = Counter()
    control_phrase_level_counts = Counter()
    control_phrase_scenarios: dict[tuple[str, str], set[str]] = defaultdict(set)
    control_starters = Counter()
    control_starter_examples: dict[tuple[str, str], Counter] = defaultdict(Counter)

    for row in rows:
        system = row["system"]
        scenario = row["scenario"]
        level = row["level"]
        ngram = row["ngram"].lower()
        count = int(row["count"])
        tokens = tokenize(ngram)

        # Word-level counts for disproportionate-word analysis
        for token in tokens:
            if token in function_residue or token in LIGHT_STOPWORDS:
                continue
            total_weighted_tokens[system] += count
            word_counts[(system, token)] += count
            scenario_word_counts[(system, scenario, token)] += count
            scenario_system_totals[(system, scenario)] += count

        # Phrase-level control totals
        if system == "CONTROL":
            control_phrase_counts[(level, ngram)] += count
            control_phrase_level_counts[level] += count
            control_phrase_scenarios[(level, ngram)].add(scenario)
            if len(tokens) >= 2:
                starter = " ".join(tokens[:2])
                control_starters[(level, starter)] += count
                control_starter_examples[(level, starter)][ngram] += count

    # Disproportionate-word analysis
    all_tokens = sorted({token for (_, token) in word_counts})
    disproportionate_rows: list[dict[str, object]] = []
    main_rows: list[dict[str, object]] = []

    for token in all_tokens:
        control_count = word_counts.get(("CONTROL", token), 0)
        if control_count == 0:
            continue

        control_share = control_count / total_weighted_tokens["CONTROL"] if total_weighted_tokens["CONTROL"] else 0.0
        anchor_counts = {system: word_counts.get((system, token), 0) for system in ANCHORED}
        anchor_shares = {
            system: (anchor_counts[system] / total_weighted_tokens[system] if total_weighted_tokens[system] else 0.0)
            for system in ANCHORED
        }
        max_anchor_system = max(anchor_shares, key=anchor_shares.get)
        max_anchor_share = anchor_shares[max_anchor_system]
        ratio = (control_share / max_anchor_share) if max_anchor_share > 0 else float("inf")
        share_gap = control_share - max_anchor_share

        scenario_wins = 0
        scenarios_present = 0
        for scenario in ["S1", "S3", "S5", "S7"]:
            c_count = scenario_word_counts.get(("CONTROL", scenario, token), 0)
            if c_count <= 0:
                continue
            scenarios_present += 1
            control_total_s = scenario_system_totals[("CONTROL", scenario)]
            c_share = c_count / control_total_s if control_total_s else 0.0
            anchor_max_s = 0.0
            for system in ANCHORED:
                a_count = scenario_word_counts.get((system, scenario, token), 0)
                anchor_total_s = scenario_system_totals[(system, scenario)]
                a_share = a_count / anchor_total_s if anchor_total_s else 0.0
                anchor_max_s = max(anchor_max_s, a_share)
            if c_share > anchor_max_s:
                scenario_wins += 1

        output_row = {
            "word": token,
            "control_count": control_count,
            "control_share": fmt(control_share),
            "max_anchor_system": max_anchor_system,
            "max_anchor_count": anchor_counts[max_anchor_system],
            "max_anchor_share": fmt(max_anchor_share),
            "control_vs_max_anchor_ratio": "inf" if ratio == float("inf") else fmt(ratio),
            "share_gap": fmt(share_gap),
            "scenarios_control_present": scenarios_present,
            "scenario_win_count": scenario_wins,
            "scenario_term": token in scenario_terms,
        }
        disproportionate_rows.append(output_row)

        if (not (token in scenario_terms)) and scenarios_present >= 3 and scenario_wins >= 3 and control_count >= 8:
            main_rows.append(output_row)

    disproportionate_rows.sort(
        key=lambda r: (
            -r["scenario_win_count"],
            -float("inf" if r["control_vs_max_anchor_ratio"] == "inf" else r["control_vs_max_anchor_ratio"]),
            -r["control_count"],
            r["word"],
        )
    )
    main_rows.sort(
        key=lambda r: (
            -r["scenario_win_count"],
            -float("inf" if r["control_vs_max_anchor_ratio"] == "inf" else r["control_vs_max_anchor_ratio"]),
            -r["control_count"],
            r["word"],
        )
    )

    write_csv(
        SUMMARIES / "control_disproportionate_words.csv",
        disproportionate_rows,
        [
            "word",
            "control_count",
            "control_share",
            "max_anchor_system",
            "max_anchor_count",
            "max_anchor_share",
            "control_vs_max_anchor_ratio",
            "share_gap",
            "scenarios_control_present",
            "scenario_win_count",
            "scenario_term",
        ],
    )
    write_csv(
        SUMMARIES / "control_disproportionate_words_main.csv",
        main_rows,
        [
            "word",
            "control_count",
            "control_share",
            "max_anchor_system",
            "max_anchor_count",
            "max_anchor_share",
            "control_vs_max_anchor_ratio",
            "share_gap",
            "scenarios_control_present",
            "scenario_win_count",
            "scenario_term",
        ],
    )

    context_rows: list[dict[str, object]] = []
    top_context_words = [row["word"] for row in main_rows[:20]]
    for token in top_context_words:
        hits = []
        for row in rows:
            if row["system"] != "CONTROL":
                continue
            ngram = row["ngram"].lower()
            tokens = tokenize(ngram)
            if token in tokens:
                hits.append((int(row["count"]), row["scenario"], row["level"], ngram))
        hits.sort(reverse=True)
        for count, scenario, level, ngram in hits[:8]:
            context_rows.append(
                {
                    "word": token,
                    "count": count,
                    "scenario": scenario,
                    "level": level,
                    "ngram": ngram,
                }
            )

    write_csv(
        SUMMARIES / "control_disproportionate_word_contexts.csv",
        context_rows,
        ["word", "count", "scenario", "level", "ngram"],
    )

    # Phrase-level tables
    phrase_rows: list[dict[str, object]] = []
    for (level, ngram), total_count in sorted(control_phrase_counts.items(), key=lambda kv: (-kv[1], kv[0][0], kv[0][1])):
        tokens = tokenize(ngram)
        starter = " ".join(tokens[:2]) if len(tokens) >= 2 else ngram
        scenario_hits = control_phrase_scenarios[(level, ngram)]
        scenario_token_count = sum(1 for t in tokens if t in scenario_terms)
        phrase_rows.append(
            {
                "level": level,
                "ngram": ngram,
                "total_count": total_count,
                "scenarios_present": len(scenario_hits),
                "scenarios": "|".join(sorted(scenario_hits)),
                "starter": starter,
                "scenario_term_count": scenario_token_count,
                "scenario_heavy": scenario_token_count >= max(1, len(tokens) // 2 + (len(tokens) % 2)),
            }
        )
    phrase_rows = phrase_rows[:120]
    write_csv(
        SUMMARIES / "control_top_total_phrases.csv",
        phrase_rows,
        ["level", "ngram", "total_count", "scenarios_present", "scenarios", "starter", "scenario_term_count", "scenario_heavy"],
    )

    starter_rows: list[dict[str, object]] = []
    for (level, starter), total_count in sorted(control_starters.items(), key=lambda kv: (-kv[1], kv[0][0], kv[0][1])):
        examples = control_starter_examples[(level, starter)].most_common(5)
        starter_rows.append(
            {
                "level": level,
                "starter": starter,
                "total_count": total_count,
                "example_phrases": " || ".join(f"{phrase} ({count})" for phrase, count in examples),
            }
        )
    starter_rows = starter_rows[:80]
    write_csv(
        SUMMARIES / "control_top_phrase_starters.csv",
        starter_rows,
        ["level", "starter", "total_count", "example_phrases"],
    )

    # Short observations draft
    top_main = main_rows[:12]
    top_phrases = phrase_rows[:15]
    top_starters = starter_rows[:15]

    lines = []
    lines.append("# Control Signature — Initial Observations")
    lines.append("")
    lines.append("## What this looks at")
    lines.append("")
    lines.append("This note reads `CONTROL` outside the constraint buckets.")
    lines.append("")
    lines.append("It uses two layers:")
    lines.append("- disproportionate words across all scenarios, normalized against the anchored systems")
    lines.append("- light phrase-shape support from CONTROL's most repeated total trigrams and quadgrams")
    lines.append("")
    lines.append("## 1. Disproportionate words")
    lines.append("")
    if top_main:
        lines.append("Top non-scenario words where CONTROL beats every anchored system in at least 3 scenarios:")
        for row in top_main:
            ratio = row["control_vs_max_anchor_ratio"]
            lines.append(
                f"- `{row['word']}`: CONTROL `{row['control_count']}`, strongest anchor `{row['max_anchor_system']}` `{row['max_anchor_count']}`, wins `{row['scenario_win_count']}` scenarios, ratio `{ratio}`"
            )
    else:
        lines.append("No words passed the stricter main filter yet.")
    lines.append("")
    lines.append("Basic read:")
    lines.append("- this layer should show whether CONTROL leans on broad organizer or balancing vocabulary rather than anchored constraint language")
    lines.append("- the result is comparative, not categorical: it asks what CONTROL overuses relative to the anchored systems")
    lines.append("")
    lines.append("## 2. Phrase-level patterns")
    lines.append("")
    lines.append("Most repeated CONTROL phrases from total output:")
    for row in top_phrases[:10]:
        lines.append(f"- `{row['level']}`: `{row['ngram']}` ({row['total_count']})")
    lines.append("")
    lines.append("Most repeated phrase starters:")
    for row in top_starters[:10]:
        lines.append(f"- `{row['level']}`: `{row['starter']}` ({row['total_count']})")
    lines.append("")
    lines.append("Basic read:")
    lines.append("- this layer is about phrase shape, not identity words")
    lines.append("- if CONTROL repeats organizer scaffolds or generic advisory templates, they should appear here")
    lines.append("")
    lines.append("## 3. Limits")
    lines.append("")
    lines.append("- this is total-output comparison, not inverse-only comparison")
    lines.append("- scenario terms are flagged, not deleted")
    lines.append("- phrase-level patterns are support, not the main evidence")
    lines.append("- any stronger style claim still needs human reading of the actual phrases")

    (WRITEUP / "control_signature_observations.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
