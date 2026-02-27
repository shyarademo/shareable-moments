# UI Changes for Maximum Conversion & Information Accessibility

## Problems Identified

1. **Homepage hero is text-heavy, no visual proof** — no template preview or phone mockup showing what guests actually see
2. **Featured templates on homepage show plain text, not TemplateThumbnail** — the thumbnails we built aren't used on the homepage
3. **No sticky CTA or floating action** — users scroll through content without persistent conversion prompt
4. **Gallery has no quick-preview** — users must navigate away to preview; no modal/lightbox option
5. **No inline pricing info on homepage** — users must navigate to /pricing to learn it's affordable; "Starting Free" should be visible immediately
6. **Checkout template summary shows plain text box instead of TemplateThumbnail**
7. **No trust signals** — no "X invites created", "Y guests RSVPed" counters
8. **Homepage "How It Works" is 5 columns — cramped on tablet, no icons** — emoji/icon-driven steps would convert better
9. **No "See it in action" inline preview on homepage** — an embedded phone frame showing a real template would be a huge conversion driver
10. **Category section is just chips** — adding a template count per category and mini-thumbnails would help

## Implementation Plan

### 1. Homepage Hero Overhaul

- Add a floating phone mockup on the right side showing a live template preview (Royal Gold thumbnail inside a phone frame CSS shape)
- Add trust stats bar below hero CTAs: "5,000+ Invites Created · 50,000+ Guests RSVPed · 4.9★ Rating"
- Add "Starting Free · No credit card needed" micro-copy below CTA buttons

### 2. Homepage Featured Templates — Use Real Thumbnails

- Replace the plain `bg-muted` placeholder with `<TemplateThumbnail config={t} />` (already built, just not wired on homepage)
- Add hover overlay with "Preview" and "Use This" buttons matching the gallery cards

### 3. Inline Live Demo Section on Homepage

- New section between Featured Templates and Categories: "See It In Action"
- Embed a scaled-down phone frame with the Royal Gold template rendered inside (using GenericRenderer with dummy data, scaled via CSS transform)
- Side text: "Your guests receive a stunning, animated invitation. Tap to open → Beautiful reveal → Event details → RSVP in seconds"
- CTA: "Try the Live Demo →" linking to `/i/demo-invite`

### 4. Sticky Mobile CTA Bar

- Fixed bottom bar on mobile (hidden on desktop) with "Browse Templates" button — appears after scrolling past the hero
- Uses `IntersectionObserver` on the hero section

### 5. Gallery Quick-Preview Modal

- Add a "Quick Look" eye icon button on each gallery card
- Opens a dialog/sheet showing the template rendered at mobile size inside a phone frame, with "Use This Template" CTA — without navigating away from gallery

### 6. Homepage Category Cards Upgrade

- Replace plain chips with cards showing: category emoji, name, template count (e.g., "5 templates"), and 3 mini-thumbnail dots as visual preview

### 7. Trust & Urgency Signals Throughout

- Add animated counter stats section on homepage (Total Invites Created, Happy Couples, Guest RSVPs)
- Add "Most Popular" badge on the most-used template in gallery
- Add "Free templates available" callout banner at top of gallery

### 8. Checkout Page — Use TemplateThumbnail

- Replace the plain text placeholder in checkout's template summary with `<TemplateThumbnail config={template} />`

### 9. Pricing Teaser on Homepage

- Add a compact pricing section before the final CTA: "Free templates forever. Premium from just ₹199." with a link to /pricing

### Files to Edit

- `src/pages/Home.tsx` — Hero with phone mockup, trust stats, real thumbnails, inline demo section, category upgrade, pricing teaser, sticky mobile CTA
- `src/pages/Gallery.tsx` — Quick-preview dialog, free banner, popular badge
- `src/pages/Checkout.tsx` — Use TemplateThumbnail in summary
- `src/components/PhoneMockup.tsx` — New reusable phone frame component
- `src/components/QuickPreview.tsx` — New gallery quick-look dialog