# Visual thesis: The Replay Line

Import Mapping Replay uses an art-deco transit-poster system because an import mapping is a route: source fields enter on one side, pass through named transformations, and arrive at a fixed template. The visual language makes that route inspectable. Parallel rails, ticket punches, numbered stops, and strong destination boards explain repeatability without decorative clutter.

## Palette

The site is deliberately single-mode, like a printed station poster under warm hall lights.

- `--ink: #172b32` — deep blue-green type and panels; primary text on paper.
- `--paper: #f3ead7` — warm ticket stock; page background.
- `--paper-light: #fffaf0` — work surfaces and code slips.
- `--signal: #b92f28` — station red for primary actions and route markers.
- `--signal-dark: #861f1b` — hover and dark-red text.
- `--brass: #bd8128` — brass dividers and secondary emphasis.
- `--line: #526f70` — muted route lines and secondary text.
- `--success: #255f4b`, `--warning: #8a5a12`, `--danger: #9d2822`.

All body combinations meet 4.5:1 contrast. Color always travels with a label, symbol, or border.

## Type

The display face uses the self-hosted system stack `Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif`, set in compact uppercase with wide tracking. It echoes hand-set transit headings without adding font bytes. Body and code use `Avenir Next, Avenir, "Segoe UI", sans-serif` and `ui-monospace, "SFMono-Regular", Consolas, monospace`. Numbers use tabular figures. There are no network fonts.

## Spacing and shape

Spacing follows an 8 px rail grid: 8, 16, 24, 32, 48, 64, 96. Content measures at most 70 characters. Corners are clipped or nearly square, with 2 px ink rules and offset brass shadows. Buttons resemble destination plates. Dots, parallel rules, and numbered medallions form the signature route motif.

## Motion

On entry, a route line draws once from source to output in 650 ms. Interface changes use 180–240 ms opacity and transform transitions. Nothing loops. With `prefers-reduced-motion: reduce`, drawing and movement become instant; state changes remain visible through contrast and labels.

## Original asset plan and provenance

The hero asset is a wide, text-free art-deco poster illustration: a cream CSV ticket enters a geometric routing machine and leaves as an ordered red-and-teal manifest, with parallel rails and punch marks. It explains source → mapping → evidence at a glance. It will be generated with `/opt/fleet/lib/gen-image.sh` using the factory `factory-image` deployment, then cropped to 1200×630 for social metadata and converted to WebP under 300 KB for the page. The prompt and generator metadata are stored beside the source asset. No third-party assets are used.

Small marks, favicon, route diagram, and terminal chrome are hand-made SVG/CSS geometry in this repository. They contain no borrowed artwork.

## Responsive behavior

At 390 px, copy comes before art, the terminal spans the viewport, and route steps stack into a vertical line. Nonessential poster flourishes disappear. Every control remains at least 44 px tall. Desktop uses an asymmetric 5/7-column poster composition rather than a centered SaaS hero.
