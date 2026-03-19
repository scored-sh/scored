Unslop profile for developer tool directory websites like skills.sh, npm registry pages, and CLI tool landing pages.

---

## Colors to never use

- `#0a0a0a`, `#0a0a0b`, `#0a0a0f` as body background
- `#111113`, `#111111`, `#111114` as surface/card background
- `#131316`, `#141414`, `#18181b` as elevated surface
- `#1e1e22`, `#1e1e24`, `#27272a` as border color
- `#e4e4e7`, `#e5e5e5`, `#ededef` as primary text on dark
- `#71717a`, `#a1a1aa`, `#52525b` as muted/secondary text
- The Tailwind zinc scale as your entire dark palette
- `#6366f1`, `#4f46e5`, `#a78bfa` (indigo/violet) as accent — this is the single most overused accent color
- `#3b82f6`, `#2563eb` (blue) as accent
- `#22d3ee`, `#06b6d4` (cyan/teal) as accent
- Monochromatic-plus-one-accent as your entire color strategy. Pages don't have to be gray + one pop color.

## Badge/pill color pairings to never use

These exact dark-bg/light-text combos are Tailwind defaults and instantly read as AI:

- Green: `#022c22`/`#34d399`, `#064e3b`/`#6ee7b7`
- Blue: `#172554`/`#60a5fa`, `#172554`/`#93c5fd`
- Yellow: `#422006`/`#fbbf24`
- Red: `#450a0a`/`#fca5a5`
- Purple: `#2e1065`/`#c084fc`

## Fonts to never pair together

- Inter + JetBrains Mono. This is the default AI "developer" font stack. Either one alone is fine. Together they are a fingerprint.
- Do not default to Inter for body text. It appears in 85% of AI-generated developer pages.
- Do not default to JetBrains Mono for code. It appears in 60%.
- Do not use the `-apple-system, BlinkMacSystemFont, "Segoe UI"` fallback stack as a way to seem "neutral" — it's another default.

## Structural patterns to avoid

### The hero section formula
Do not build this exact sequence:
1. Small uppercase badge/label at top
2. Large h1 with tight letter-spacing
3. Muted gray subtitle, max-width 480–580px, centered
4. One or two CTA buttons (filled + outlined)
5. Install command block below

This five-part hero is the single most common AI landing page structure.

### The feature grid section
Do not follow this:
1. Uppercase accent-colored section label
2. Larger section heading
3. 2–3 column grid of cards
4. Each card: emoji icon in colored box → bold title → muted description

### Page structure ordering
Do not use `nav → hero → features → install → CTA → footer` as your page flow without variation. This exact sequence is AI boilerplate.

### Card grid layout
- Do not use `grid-template-columns: repeat(auto-fill, minmax(280–320px, 1fr))` — this is the universal AI grid.
- Do not make card hover effects border-color-only. AI never uses scale, shadow, background shift, or anything else.

## CSS patterns to never use

### The section label
Do not combine all of these on a label above a heading:
- `font-size: 12–13px`
- `font-weight: 600`
- `text-transform: uppercase`
- `letter-spacing: 0.05–0.08em`
- `color: [accent]`

This tiny uppercase accent-colored label above a bigger heading is one of the strongest AI tells.

### The pill badge
Do not combine all of these:
- `border-radius: 9999px`
- `text-transform: uppercase`
- `font-size: 0.65–0.78rem`
- `letter-spacing: 0.05–0.08em`

### Card styling
Do not use this exact combination:
- `background: #111113`
- `border: 1px solid #27272a`
- `border-radius: 10–12px`
- `padding: 1.25–1.75rem`
- `transition: border-color 0.15s`

### Container centering
Do not use `max-width: [value]; margin: 0 auto; padding: 0 24px` on every page without thinking. It's fine CSS — it's just the only layout AI ever generates.

### Transition timing
Do not default to `transition: all 0.15s`. This exact duration appears in 85% of AI output. Use different durations. Use easing functions. Use targeted properties instead of `all`.

### Border-radius
Do not default to `8–12px` on every card and block. AI never uses sharp corners, large radii (20px+), or mixed radii. The sameness is the problem.

### Letter-spacing on headings
Do not apply `letter-spacing: -0.02em` to `-0.03em` on every heading. This is the AI copying Linear/Vercel's tight-heading style.

## Component patterns to avoid

### The install command block
Do not render a dark rounded rectangle with:
- Monospace text prefixed with `$`
- A "Copy" button at top-right that changes to "Copied!" on click
- `navigator.clipboard.writeText`
- Package manager tabs (npm / yarn / pnpm / bun) as toggle buttons above

This exact component appears in 70% of AI developer pages.

### The terminal window chrome
Do not add fake macOS traffic light dots to code blocks. This is pure AI decoration.

### The icon box
Do not put emoji icons inside 40x40px rounded-square colored backgrounds inside feature cards. Use actual icons, SVGs, or no icons at all.

### The green status dot
Do not use a small green circle next to status text. It's become an AI cliche.

### The gradient heading
Do not use `linear-gradient(135deg, ...)` with `-webkit-background-clip: text` on h1 elements.

## Table styling to avoid

Do not combine all of these on table headers:
- `text-transform: uppercase`
- `font-size: 0.8rem`
- `letter-spacing: 0.05em`
- `color: #a1a1aa`
- `background: #18181b`

## Things AI never does (that you should consider doing)

AI-generated developer pages never include:
- Background patterns, textures, or noise
- Custom illustrations or graphics (only emoji)
- Gradients on backgrounds
- Drop shadows on cards
- CSS animations or motion
- Asymmetric or non-centered layouts
- More than one accent color
- Serif fonts
- Variable fonts, oversized type, or mixed weights
- Warm color palettes
- Light mode as the default
- Sharp corners (0px border-radius)

The absence of all of these at once is itself a signal.

---

## The rule

If you catch yourself reaching for any of the patterns above, stop. Do something different. Don't swap one AI default for another AI default — actually make a creative choice.
