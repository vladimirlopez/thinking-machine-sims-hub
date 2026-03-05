# Default Simulation Themes (Persistent)

For all new simulation/frontend projects in this workspace, use the stored reusable themes unless the user explicitly requests a different visual style.

## Required defaults

1. Dark mode default: `/Users/vladimir.lopez/Documents/Projects/AI/Thinking Machine Sims/themes/dark-refraction-theme.css`.
2. Light mode alternative: `/Users/vladimir.lopez/Documents/Projects/AI/Thinking Machine Sims/themes/light-half-atwood-theme.css`.
3. HTML style references:
- `/Users/vladimir.lopez/Documents/Projects/AI/Thinking Machine Sims/themes/dark-refraction-style.html`
- `/Users/vladimir.lopez/Documents/Projects/AI/Thinking Machine Sims/themes/light-half-atwood-style.html`
4. Start new dark simulations from `/Users/vladimir.lopez/Documents/Projects/AI/Thinking Machine Sims/templates/thinking-experiment-sim-v1`.
5. Preserve responsive behavior for desktop and mobile.
6. Use the Thinking Experiment favicon pair:
- `https://vladimirlopez.github.io/the-thinking-experiment/assets/favicon-32.png`
- `https://vladimirlopez.github.io/the-thinking-experiment/assets/favicon-16.png`

## Override rule

Only depart from these themes if the user explicitly asks for a different palette, typography, or visual direction.

## Additional persistent style requirements

Apply these by default for inquiry simulations unless explicitly overridden:

1. Put the theme toggle in the title/hero card at the top-right (not inside the main control stack).
2. Light mode must follow the Half-Atwood light style language:
- card-like white panels
- teal left vertical accent on hero card
- soft blue/warm background gradients
3. When switching to light mode, also switch simulation canvas visuals (track and cart colors), not only page/panel colors.
4. Velocity graph must expose cart velocities directly (live labels/readout), so values are visible without requiring only manual probing.
5. Explosion mode must show a pre-release state before split, then release/split event; do not trigger explosion instantly at `t=0` by default.
6. Prevent title-card clipping and left-corner misalignment:
- avoid horizontal overflow
- keep hero card fully visible at all breakpoints.
