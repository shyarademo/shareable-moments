

# Implementation Plan — 4 Fixes

## FIX 1: Forgot Password Page

**Files:**
- Create `src/pages/ForgotPassword.tsx` — two-state component (email input → success confirmation), 1.5s simulated delay, "Resend" returns to state 1 with email pre-filled
- Edit `src/pages/Login.tsx` line 77 — add "Forgot password?" link right-aligned below password field, navigating to `/forgot-password`
- Edit `src/App.tsx` — add lazy import for ForgotPassword and route `/forgot-password`

## FIX 2: Promo Code in Checkout

**File:** `src/pages/Checkout.tsx`

- Add state: `promoCode`, `promoExpanded`, `promoLoading`, `promoError`, `appliedPromo`
- Hardcoded valid codes map: `WELCOME10` (10%), `SHYARA20` (20%), `FLAT50` (₹50 flat), `NEWUSER` (15%), `SAVE100` (₹100 flat)
- Insert collapsible "Have a promo code?" section between "Payment Details" heading (line 139) and the card number input
- Collapsible uses ChevronDown icon, expands to input + Apply button
- Apply: 800ms spinner, validates against map, shows green success or red error
- On valid: replace input with applied code pill + ✕ Remove button
- Update Order Summary section: show original price struck through, discount line, new total
- On remove: revert everything

## FIX 3: Taken-Down Invite Page

**Files:**
- Edit `src/services/api.ts` — add a `taken-down-demo` mock invite with status `'taken-down'`, update `getPublicInvite` to check for taken-down status and throw a specific error (or return status in the data)
- Edit `src/types/index.ts` — add `'taken-down'` to `InviteStatus` type, add optional `status` field to `PublicInviteData`
- Edit `src/pages/LiveInvite.tsx` — add a `takenDown` state, check `inviteData.status === 'taken-down'`, render branded "This Invitation Is No Longer Available" page with Shyara logo, warm messaging, "Powered by Shyara" footer

## FIX 4: Mobile/Desktop Toggle on Template Preview

**File:** `src/pages/TemplatePreview.tsx`

- Add `previewMode` state: `'mobile' | 'desktop'` (default: `'mobile'`)
- Add sticky top bar: left = template name + category badge, center = pill toggle (Mobile/Desktop), right = "Use This Template" CTA linking to `/checkout/${slug}`
- Mobile mode: wrap `TemplateRenderer` in `PhoneMockup` component, centered, scrollable inside
- Desktop mode: render in max-w-5xl container with a fake browser chrome bar showing `invite.shyara.co.in/i/example`
- Pass `key={previewMode}` to `TemplateRenderer` to force remount and reset animation state
- Import `PhoneMockup` from `@/components/PhoneMockup`

---

**Total files to create:** 1 (`ForgotPassword.tsx`)
**Total files to edit:** 5 (`Login.tsx`, `App.tsx`, `Checkout.tsx`, `LiveInvite.tsx`, `TemplatePreview.tsx`, `api.ts`, `types/index.ts`)

