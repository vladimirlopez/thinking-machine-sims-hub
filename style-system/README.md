# Shared Simulation Style System

This folder is the shared style reference for The Thinking Experiment simulations.

## Files

- `SIM_STYLE_TOKENS.md`: Human-readable guidance for visual language, typography, accessibility, and usage rules.
- `sim-style-tokens.json`: Machine-readable design tokens for AI tools and scripts.

## How to Reuse in New Sim Repos

1. Copy this folder into your simulation repo as `style-system/`.
2. In your sim `README.md`, add:
   - "This project uses `style-system/sim-style-tokens.json` and `style-system/SIM_STYLE_TOKENS.md`."
3. In AI prompts (Codex/Claude/Gemini), add:
   - "Use style tokens from `style-system/sim-style-tokens.json` and rules from `style-system/SIM_STYLE_TOKENS.md`."

## Optional Automation

If you scaffold sims from a template, include this folder in your template so every new project starts with the same style baseline.
