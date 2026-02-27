

# Dark Mode Color System Overhaul

## Current Issues
The dark mode palette uses a uniform `345` hue (rose/maroon) across background, card, border, muted, and accent — creating a muddy, monotone feel with poor contrast and visual flatness. The `bg-accent/30` alternating sections barely differ from the background.

## Plan

### 1. Revamp CSS Variables in `src/index.css` (.dark block)

New dark palette philosophy: **deep warm charcoal base** (not rose-tinted), with the rose/primary as an accent pop, and warm cream foregrounds for readability.

| Token | Current | New | Rationale |
|-------|---------|-----|-----------|
| `--background` | `345 25% 6%` | `240 10% 6%` | Neutral deep charcoal, not rose-tinted |
| `--foreground` | `39 15% 92%` | `40 20% 93%` | Warmer cream white for readability |
| `--card` | `345 20% 10%` | `240 8% 10%` | Subtle lift from bg, neutral base |
| `--card-foreground` | `39 15% 92%` | `40 20% 93%` | Match foreground |
| `--popover` | `345 20% 10%` | `240 8% 12%` | Slightly lighter than card |
| `--primary` | `345 50% 55%` | `345 60% 60%` | Brighter rose for better pop in dark |
| `--secondary` | `345 18% 15%` | `240 8% 14%` | Neutral, not rose-tinted |
| `--secondary-foreground` | `39 15% 85%` | `40 15% 88%` | Slightly brighter |
| `--muted` | `345 15% 15%` | `240 6% 14%` | Neutral muted bg |
| `--muted-foreground` | `39 10% 60%` | `40 10% 65%` | Better readability (was too dim) |
| `--accent` | `345 20% 18%` | `345 15% 14%` | Keep slight rose tint for accent only |
| `--accent-foreground` | `39 15% 92%` | `40 20% 93%` | Match foreground |
| `--border` | `345 15% 18%` | `240 8% 18%` | Neutral border, visible but subtle |
| `--input` | `345 15% 18%` | `240 8% 18%` | Match border |
| `--ring` | `345 50% 55%` | `345 60% 60%` | Match primary |
| `--gold` | `38 55% 45%` | `38 65% 52%` | Brighter gold for dark backgrounds |
| `--destructive` | `0 62% 30%` | `0 65% 45%` | More visible red on dark bg |
| Sidebar tokens | Rose-tinted | Neutral charcoal matching new base | Consistent |

### 2. Homepage Dark-Specific Tweaks in `src/pages/Home.tsx`

- **Hero mesh gradient**: Add `dark:opacity-30` to reduce gradient intensity in dark mode (currently `opacity-40` may feel washed)
- **Alternating sections** (`bg-accent/30`): Change to `bg-muted/40 dark:bg-white/[0.02]` for subtle layering that actually works in dark mode
- **Template card hover overlay**: Change `bg-foreground/0 group-hover:bg-foreground/40` to use `dark:group-hover:bg-black/50` for cleaner overlay
- **Quote icon** in testimonials: `text-muted/40` → add `dark:text-muted-foreground/20` for visibility
- **Trust stats bar**: `bg-card/60` → add `dark:bg-card/80` for better card visibility in dark

### 3. Files Modified
- `src/index.css` — Dark mode CSS variables
- `src/pages/Home.tsx` — Dark-specific class adjustments on ~5 elements

