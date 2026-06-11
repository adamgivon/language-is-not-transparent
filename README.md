# language-is-not-transparent
## Materials for an exploratory study on semantic density, architecture, and LLM constraint design

This repository contains the paper and supporting materials for an exploratory study on LLM constraint design. The paper argues that constraint writing is not only a matter of explicit logic. It also depends on semantic density and language architecture: the same logical constraint, written with different language and structure, can produce different model behavior.

The study compares four anchoring/constraint systems and one Control condition (default state) across eight scripted scenarios. The systems share a broad governance intent but differ in language, structure, and use of codifiers, rules, and semantic fields.


Paper
The main paper is available in:

paper/
Suggested files:
paper/language_is_not_transparent.pdf
paper/language_is_not_transparent_source.odt

Repository Structure
systems/
Contains the four constraint systems used in the experiment:
systems/ac15.json
systems/ac15p.json
systems/hybrid.json
systems/hybsem.json

scenarios/
Contains the eight scenario scripts used in the experiment.

conversations/
Contains the generated conversations for each scenario and system condition, including Control.

numerical_analysis/
Contains numerical outputs, tables, and summaries related to embedding similarity, anchor selection, ANOVA tests, critical turns, and inter-system trajectory correlations.

close_reading/
Contains the close-reading methodology, evaluation framework, model-assisted readings, and collaborative close-reading materials.

annexes/
Contains supporting documents referenced by the paper.

Systems Compared
The experiment compares four constraint systems:

AC15 — a rich, philosophical, codifier-based anchoring system.
AC15P — a plainer, more procedural version of AC15.
Hybrid — a system combining simple rules with semantic fields.
Hybsem — a semantic-field-only system without rules.

The Control condition is the default model state without the added anchoring system.


Scenarios
The experiment uses eight scenarios, each consisting of twenty-five turns:

Citywide Smart Traffic Control Upgrade
Regional Hospital System Capacity Decision
Autonomous Logistics Drones Fleet Launch
Bootstrapped Entrepreneur Plan on Launching a New Business
AI Context Continuity Project
The Village Accident
The Late Love Question
After the Shooting at Bondi Beach

The scenarios span technical, organizational, practical, and human domains in order to test how different constraint architectures shape model behavior under different kinds of pressure.


Methodological Status
This is an exploratory, case-study-level investigation. The experiment is based on one realized run per system/scenario condition. The findings should not be read as population-level or distribution-level claims about model behavior.

The numerical analysis is used to identify patterns in prompt-response similarity, anchor selection, and trajectory behavior. The close-reading analysis is used to examine differences in governance, structure, register, reasoning path, affective precision, user sovereignty, and response quality.

Main Claim
The central claim is that language is not a transparent carrier of logic in LLM constraint writing. Language, semantic density, and architecture shape how constraints bind, how responses are structured, and how model behavior develops across turns.
The paper therefore treats constraint design as a language-architecture problem, not only as a prompt-engineering or instruction-writing problem.

Citation / Use
If you use or refer to this work, please cite the paper:

Givon, Adam. Language Is Not Transparent: Semantic Density, Architecture, and the Design of LLM Constraints. 2026.
Author

Adam Givon
7 June 2026
