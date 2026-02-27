

# Plan: Three Fixes for Shyara Frontend

## FIX 1 — InviteCover on Live Invite Page

**Finding:** After reading all 15 template renderers, every single one already imports and renders `InviteCover` internally (e.g., royal-gold at line 86, executive-edge at line 26, confetti-burst at line 117). `LiveInvite.tsx` renders the template renderer, which already shows the cover first and gates content behind `isOpened` state. The `isPreview` prop is not passed (defaults to `false`), so localStorage is respected. `data.slug` is spread into the data object from the URL param.

**Conclusion: FIX 1 is already working.** No changes needed. Adding InviteCover at the LiveInvite level would cause a double cover. I will skip this fix.

---

## FIX 2 — Template-Specific Exit Animations in InviteCover

**Current state:** Line 174 has a single generic exit: `exit={{ opacity: 0, scale: 1.05 }}` for all themes.

**Plan:** Restructure InviteCover to support 6 distinct exit animation types based on theme:

1. **Double doors** (gold, ivory-classic, rustic-warm, celestial-navy, anniversary-warm, golden-warm): Split the cover into two absolutely-positioned halves (left/right) using `clipPath`. On exit, left half slides to `x: "-100%"` and right half to `x: "100%"` simultaneously.

2. **Curtain drop** (pastel-floral, rose-pink, dark-floral): Exit slides down `y: "100vh"`.

3. **Zoom burst** (confetti, neon-dark): Exit scales to 1.8 and fades to 0.

4. **Soft fade up** (star-blue, sweet-pink): Exit `y: -60, opacity: 0`.

5. **Horizontal slide** (corporate-dark, corporate-light): Exit `x: "-100vw"`.

**Implementation approach:**
- Create a `getExitType(theme)` function mapping theme → animation group
- For the "doors" type: render TWO `motion.div` children with identical content but `clipPath: inset(0 50% 0 0)` and `clipPath: inset(0 0 0 50%)`, each with their own exit animation
- For all other types: single `motion.div` with conditional exit variant
- Use `AnimatePresence mode="wait"` and a `state` variable (`'visible' | 'exiting' | 'done'`) to control the flow
- Keep all existing enter animations unchanged — only the exit changes
- "Skip Intro" triggers the same exit animation (not an instant skip)

**File:** `src/components/InviteCover.tsx`

---

## FIX 3 — Gallery Section in Executive Edge + Config Update

**Add to config.ts:**
- Add `galleryPhotos` array with 6 `/placeholder.svg` entries to `dummyData`

**Add to index.tsx:**
- Insert a Gallery section between the Venue section (line 91) and the RSVP section (line 93)
- Conditional render: only if `data.galleryPhotos?.length > 0`
- Grid layout: 2 columns on mobile, 3 on desktop
- Each item: a styled card with `c.bgCard` background, `c.border` border, hover scale effect, rounded corners
- Section header: "Gallery" with the same accent divider pattern used in other sections
- Background: `c.bg` (alternating with bgAlt from venue above)

**Files:** `src/templates/corporate/executive-edge/config.ts`, `src/templates/corporate/executive-edge/index.tsx`

