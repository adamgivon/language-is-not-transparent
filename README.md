# Language Is Not Transparent

**Language Is Not Transparent: An Exploratory Study of Semantic Density, Architecture, and Constraint Design in LLMs**

This repository contains the paper and supporting materials for an exploratory study of LLM constraint design. The central claim is that language is not a transparent carrier of logic: explicit logic, semantic density, and language architecture bind model behavior in different ways.

Archive DOI: https://doi.org/10.5281/zenodo.20689806

## Paper

The paper is available in:

- `01_paper/language_is_not_transparent.pdf`
- `01_paper/language_is_not_transparent.odt`

The Zenodo record is the canonical archive. This GitHub repository provides the browsable supporting materials and software snapshot.

## Repository Structure

- `01_paper/` - final paper files.
- `02_systems/` - the four constraint-system definitions used in the experiment.
- `03_scenarios/` - the eight scenario scripts used for the runs.
- `04_conversations/` - generated conversations for each scenario and system condition, including Control.
- `05_methodology/` - evaluation framework, close-reading methodology, and scenario-specific constraint materials.
- `06_numerical_analysis/` - numerical outputs, embedding-similarity workbooks, correlation notes, and exploratory n-gram materials.
- `07_close_reading/` - collaborative close-reading materials, cross-scenario synthesis, and supplementary model-led reads.
- `08_software/` - cleaned source snapshot of the experimental UI and anchoring workflow.
- `09_previous_work/` - pointer to earlier anchoring work that provides background for this paper.

## Systems Compared

The experiment compares four anchoring / constraint systems against an unconstrained Control condition:

- **AC15** - rich, codifier-based anchoring system.
- **AC15P** - plainer, more procedural version of AC15.
- **Hybrid** - system combining rules with semantic fields.
- **Hybsem** - semantic-field-oriented system without the same rule layer.
- **Control** - default model behavior without the added anchoring system.

The systems share a broad governance intent but differ in language register, semantic density, structure, and use of codifiers, rules, and fields.

## Scenarios

The experiment uses eight 25-turn scenarios:

1. Citywide Smart Traffic Control Upgrade
2. Regional Hospital System Capacity Decision
3. Autonomous Logistics Drones Fleet Launch
4. Bootstrapped Entrepreneur Plan on Launching a New Business
5. AI Context Continuity Project
6. The Village Accident
7. The Late Love Question
8. After the Shooting at Bondi Beach

The scenarios span technical, organizational, practical, and human domains to test how different constraint architectures shape model behavior under different kinds of pressure.

## Evidence Layers

The repository contains two main analysis layers:

- **Numerical analysis** in `06_numerical_analysis/`, mainly prompt-response embedding similarity, anchor-selection behavior, trajectory comparison, and supporting correlation materials.
- **Close reading** in `07_close_reading/`, mainly collaborative qualitative analysis of governance, structure, register, reasoning path, affective speech, user sovereignty, and response quality.

The numerical materials show that the constrained systems separate from Control in prompt-response behavior while remaining close to one another on average similarity. The close-reading materials show the sharper difference: each system produces recurring, system-specific patterns in epistemic route, expression, structure, and governance.

## Software Snapshot

The software source is in:

`08_software/`

Direct link:

https://github.com/adamgivon/language-is-not-transparent/tree/main/08_software

The software is a research-support snapshot, not an actively maintained product. It is included to show the experimental UI and anchoring workflow used to run and inspect the conversations. See `08_software/README.md` for setup and runtime notes.

## Methodological Status

This is an exploratory, case-study-level investigation based on a limited number of realized runs. The findings should be read as hypothesis-generating and analytically suggestive, not as population-level statistical proof.

Surface-text statistics were unstable and are included only as method notes. The paper's main contribution is the design and evaluation vocabulary: semantic density, binding strength, architecture, domain fit, and close reading as a method for evaluating model outputs.

## Previous Work

Earlier anchoring work is referenced in:

`09_previous_work/`

Canonical record:

https://doi.org/10.5281/zenodo.16764308

## Citation

If you use or refer to this work, cite the Zenodo record:

Givon, Adam. *Language Is Not Transparent: An Exploratory Study of Semantic Density, Architecture, and Constraint Design in LLMs*. 2026. https://doi.org/10.5281/zenodo.20689806

## License

Research materials are licensed under the repository `LICENSE` file.

Software materials in `08_software/` are licensed under `LICENSE-CODE` unless otherwise stated.

