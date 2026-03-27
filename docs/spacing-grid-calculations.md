# Spacing grid width — reference calculations

CSS uses viewport units so values **change with real viewport height**. The table below uses **assumed heights** (common devices) so you can compare formulas at typical widths.

**Formulas (root `font-size` = 16px → `em` values):**

| Token | CSS |
|-------|-----|
| `--1920px-spacing-grid-width` | `calc(100vw + 75vh + 0.35em)` → px ≈ **W + 0.75×H + 5.6** |
| `--1400px-spacing-grid-width` | `calc(80vw + 65vh + 0.15em)` → px ≈ **0.8×W + 0.65×H + 2.4** |
| `--1024px-spacing-grid-width` | `calc(65vw + 50vh + 0.5em)` → px ≈ **0.65×W + 0.5×H + 8** |

**Assumed heights (H) for each width (W):**

| W (px) | H (px) | Assumption |
|--------|--------|------------|
| 320 | 568 | Phone (e.g. SE) |
| 360 | 640 | Phone |
| 768 | 1024 | Tablet portrait |
| 1024 | 768 | Tablet landscape |
| 1400 | 900 | Laptop |
| 1920 | 1080 | Desktop |

## Results (px, rounded to 1 decimal)

### `--1920px-spacing-grid-width` — `100vw + 75vh + 0.35em`

| W×H | Result (px) |
|-----|----------------|
| 320×568 | 751.6 |
| 360×640 | 845.6 |
| 768×1024 | 1541.6 |
| 1024×768 | 1605.6 |
| 1400×900 | 2080.6 |
| 1920×1080 | 2735.6 |

### `--1400px-spacing-grid-width` — `80vw + 65vh + 0.15em`

| W×H | Result (px) |
|-----|----------------|
| 320×568 | 627.6 |
| 360×640 | 706.4 |
| 768×1024 | 1282.4 |
| 1024×768 | 1320.8 |
| 1400×900 | 1707.4 |
| 1920×1080 | 2240.4 |

### `--1024px-spacing-grid-width` — `65vw + 50vh + 0.5em`

| W×H | Result (px) |
|-----|----------------|
| 320×568 | 500.0 |
| 360×640 | 562.0 |
| 768×1024 | 1019.2 |
| 1024×768 | 1057.6 |
| 1400×900 | 1368.0 |
| 1920×1080 | 1796.0 |

**Note:** In the app, `--spacing-grid-width` switches which formula is active at **1024px** and **1920px** viewport widths (see `src/index.css`). All three tokens remain available for direct use if needed.
