

# Implementation Plan: Complete Shyara Frontend (7 Items)

## Scope Assessment

- **14 template renderers** need unique implementations (currently re-export GenericRenderer)
- **InviteCover** needs per-template animation variants
- **InviteForm** needs multi-step wizard refactor
- **Account page** needs functional password/avatar/notifications
- **FieldRenderer** needs inline validation
- **TemplateThumbnail** already has per-template themes — needs minor refinement to use config dummyData names instead of hardcoded names

---

## Implementation Steps

### ITEM 1+2: Template Renderers with Opening Animations (14 files)

Each renderer follows the same pattern as `royal-gold/index.tsx` and `midnight-bloom/index.tsx`: unique color palette object, custom animation variants, InviteCover with template-specific theme, and all sections (hero, story, schedule, venue, gallery, RSVP).

**InviteCover changes**: Add 11 new theme variants to `themeStyles` (pastel-floral, ivory-classic, rustic-warm, celestial-navy, golden-warm, rose-pink, neon-dark, star-blue, sweet-pink, corporate-dark, corporate-light, anniversary-warm). Update `localStorage` key to use `shyara_intro_seen_{slug}` per spec. Add `skipDelay` to 4 seconds (currently 2.5s).

**New renderers** (each file `~150-250 lines`, unique identity):

| Template | Color Palette | Animation Style |
|---|---|---|
| floral-garden | Sage green + blush pink, light bg | Petals parting reveal, botanical ornaments |
| eternal-vows | Ivory + deep burgundy, cream bg | Curtain draw reveal, classic serif feel |
| rustic-charm | Warm brown + olive, kraft-paper bg | Barn doors sliding open, handwritten feel |
| celestial-dreams | Navy + gold stars, dark bg | Starfield zoom-out reveal, twinkling particles |
| golden-ring | Warm gold + cream, light bg | Ring spin reveal, warm elegance |
| rose-garden | Dusty rose + sage, soft pink bg | Rose petals falling away reveal |
| neon-glow | Cyan neon + purple, dark bg | Neon flicker-on reveal, glow effects |
| little-star | Soft blue + yellow stars, pastel bg | Star twinkle reveal, gentle animations |
| sweet-arrival | Pastel pink + mint, soft bg | Envelope unfold reveal, cute motifs |
| executive-edge | Dark navy + electric blue, dark bg | Clean slide-up reveal, geometric |
| modern-summit | White + bright blue, clean bg | Fade-scale reveal, minimal |
| timeless-love | Warm sepia + burgundy, warm bg | Photo album page-turn reveal |

Each renderer imports `InviteCover` and `InviteRsvpForm`, defines its own color constants, animation variants, decorative components (dividers, particles, ornaments), and renders all supported sections from config.

### ITEM 3+4: Multi-Step Wizard

**Refactor `src/components/InviteForm/index.tsx`:**

- Add `currentStep` state (0-3)
- Define 4 steps: `['Event Details', 'Venue & Story', 'Media & Schedule', 'Review & Publish']`
- Map config field sections to steps:
  - Step 0: fields where `section === 'basic'`
  - Step 1: fields where `section === 'venue' || section === 'story'`
  - Step 2: fields where `section === 'gallery' || section === 'schedule' || section === 'settings'`
  - Step 3: Live preview + SlugPicker + publish
- Step indicator bar at top with numbered circles, step names, connecting lines, active/completed states
- "Previous" / "Next" buttons replace current layout; "Save Draft" on every step; "Publish" only on step 3
- Next button validates only current step's required fields before advancing
- Step 3 shows full template renderer with mobile/desktop toggle using PhoneMockup for mobile view
- Form data preserved in `formData` state across steps (already works this way)

### ITEM 5: Template Thumbnails

**Update `TemplateThumbnail.tsx`:**
- Use `config.dummyData` to extract real names instead of hardcoded "Sarah & Aryan" etc.
- Add the same name extraction logic as GenericRenderer's `getTitle()`

### ITEM 6: Account Page

**Update `src/pages/Account.tsx`:**
- **Password**: Add `currentPassword`, `newPassword`, `confirmPassword` state. Validate: current not empty, new >= 8 chars, confirm matches. Show inline red error text. Toast on success.
- **Avatar**: Add hidden `<input type="file" accept="image/*">` ref. On select, use `URL.createObjectURL` + save base64 via FileReader to `localStorage('shyara_avatar')`. Read on mount.
- **Notifications**: Read/write toggle states from `localStorage('shyara_notif_rsvp')` and `localStorage('shyara_notif_weekly')`.

### ITEM 7: Inline Form Validation

**Update `FieldRenderer.tsx`:**
- Add `touched` state per field (set on blur)
- Add `error` prop passed from parent
- Show red error message below field when touched and error exists
- Clear error on change

**Update `InviteForm/index.tsx`:**
- Add `errors` state and `touched` state
- `validateStep(step)` function: checks required fields for current step, date-in-future for date fields, RSVP deadline before event date
- On "Next" click: mark all current step fields as touched, run validateStep, block if errors
- Pass error strings to FieldRenderer

---

## Files to Create/Edit

**Create (14 template renderers):**
- `src/templates/wedding/floral-garden/index.tsx`
- `src/templates/wedding/eternal-vows/index.tsx`
- `src/templates/wedding/rustic-charm/index.tsx`
- `src/templates/wedding/celestial-dreams/index.tsx`
- `src/templates/engagement/golden-ring/index.tsx`
- `src/templates/engagement/rose-garden/index.tsx`
- `src/templates/birthday/neon-glow/index.tsx`
- `src/templates/baby-shower/little-star/index.tsx`
- `src/templates/baby-shower/sweet-arrival/index.tsx`
- `src/templates/corporate/executive-edge/index.tsx`
- `src/templates/corporate/modern-summit/index.tsx`
- `src/templates/anniversary/timeless-love/index.tsx`

**Edit:**
- `src/components/InviteCover.tsx` — add theme variants, update localStorage key, 4s skip delay
- `src/components/InviteForm/index.tsx` — multi-step wizard with step indicator, validation, step 4 preview
- `src/components/InviteForm/FieldRenderer.tsx` — inline validation display
- `src/components/TemplateThumbnail.tsx` — use dummyData names
- `src/pages/Account.tsx` — functional password/avatar/notifications

