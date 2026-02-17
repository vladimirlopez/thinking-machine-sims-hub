# Simulation Themes (Dark + Light)

This folder stores two reusable visual themes for future simulations:

- `dark-refraction-theme.css` (dark mode)
- `light-half-atwood-theme.css` (light mode)

HTML reference previews:

- `dark-refraction-style.html`
- `light-half-atwood-style.html`

## Use in any GitHub simulation repo

After this repository is pushed to GitHub (`vladimirlopez/thinking-machine-sims-hub`), include one of these lines in the `<head>` of any simulation:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/vladimirlopez/thinking-machine-sims-hub@main/themes/dark-refraction-theme.css" />
```

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/vladimirlopez/thinking-machine-sims-hub@main/themes/light-half-atwood-theme.css" />
```

## Recommended long-term setup

1. Tag stable versions (for example `v1.0.0`) in this repo.
2. Replace `@main` with version tags in production sims:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/vladimirlopez/thinking-machine-sims-hub@v1.0.0/themes/dark-refraction-theme.css" />
```

3. Keep simulation-specific overrides in each repo below the shared link:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/vladimirlopez/thinking-machine-sims-hub@v1.0.0/themes/dark-refraction-theme.css" />
<link rel="stylesheet" href="./styles-local-overrides.css" />
```

## Theme selection convention

- Default for new simulations: dark theme (`dark-refraction-theme.css`)
- Use light theme when requested by project design or pedagogy (`light-half-atwood-theme.css`)

## Fast apply script

Use the helper script from this repo to inject the shared theme link into any simulation HTML file:

```bash
/Users/vladimir.lopez/Documents/Projects/AI/Thinking Machine Sims/scripts/apply-shared-theme.sh /path/to/index.html dark
```

```bash
/Users/vladimir.lopez/Documents/Projects/AI/Thinking Machine Sims/scripts/apply-shared-theme.sh /path/to/index.html light
```
