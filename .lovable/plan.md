

# invite.shyara.co.in — Customer Frontend

A premium digital e-invitation platform. Visitors browse templates, register, pay, fill event details, get a shareable invite link, and guests RSVP through a stunning personalized invite page.

---

## Architecture Constraints (Enforced Throughout)

- **Template folder structure:** All templates live at `src/templates/[category]/[slug]/` with `index.tsx` (renderer) and `config.ts` (metadata + fields). Gallery, form, and invite renderer discover templates by importing from this directory — nothing hardcoded.
- **Config is single source of truth:** The same `config.ts` field definitions drive the details form AND define what keys the renderer reads. Field key in config = data key in API response = prop the renderer reads. No separate mapping layer.
- **Dynamic template loading:** `React.lazy()` + Suspense for all template components. The `/i/:slug` page uses `templateSlug` from the API to dynamically import `src/templates/[category]/[slug]/index.tsx`. No if/else chains.
- **Route-based code splitting:** Every page route is its own lazy-loaded chunk. The `/i/:slug` bundle is completely isolated from dashboard/form/admin code.
- **Mock API service layer:** All API calls centralized in `src/services/api.ts`. Components never contain mock data directly. Swap to real API = change one file.
- **Multiple active invites per user.** No "one invite per account" restriction.

---

## Phase 1 — Foundation & Data Layer

1. **Create the mock API service layer** with all 15 endpoints returning realistic data with simulated delays. Include: templates CRUD, invites CRUD, public invite fetch (returns `templateSlug` + event data), RSVPs, auth (login/register/Google/me), and mock payment checkout.

2. **Define the TemplateConfig type** and create 12–16 template configs across categories (Wedding ×5, Engagement ×3, Birthday ×2, Baby Shower ×2, Corporate ×2, Anniversary ×1). Each config includes slug, name, category, tags, pricing, supportedSections, thumbnail/preview image paths, and field definitions array.

3. **Build auth context** with global state, Google sign-in mock, and redirect-after-auth logic (remembers which template the user came from → routes to checkout/form after login).

4. **Set up all routes** with React.lazy code splitting: `/`, `/templates`, `/templates/:slug/preview`, `/login`, `/register`, `/checkout/:slug`, `/create/:inviteId`, `/dashboard`, `/dashboard/invites/:inviteId/edit`, `/dashboard/invites/:inviteId/rsvps`, `/account`, `/pricing`, `/i/:slug`, and 404.

## Phase 2 — Public Pages & First Impression

5. **Build the Homepage** — premium hero with "Browse Templates" and "See a Live Example" CTAs, 5-step How It Works flow, featured templates strip (6–8 cards), event category chips linking to filtered gallery, "Why Shyara" value props, testimonials with dummy data, and footer.

6. **Build the Template Gallery** — filter by category, sort by Newest/Popular/Price, template cards with thumbnail, name, category tag, free/premium badge, star rating, "Preview" and "Use This Template" buttons. Lazy-load thumbnails on scroll. Pagination. Empty state. Skeleton loaders.

7. **Build the Template Preview Page** — full-screen live preview using the same renderer component used for `/i/:slug`, fed with dummy data. Opening animation → invite content. Floating top bar with template name, device toggle (mobile/desktop), "Use This Template" CTA, "Back to Gallery." Section listing what's included.

8. **Build the Pricing Page** — Free vs Premium comparison table, feature list, FAQs, CTAs.

## Phase 3 — Auth & Payment

9. **Build Login & Register pages** — Google sign-in as primary/prominent option, email+password as secondary. Post-auth redirect: if user came from "Use This Template," go to checkout for that template; otherwise go to dashboard.

10. **Build the Checkout page** — shows selected template thumbnail, name, price. Free templates → "Confirm & Continue" (skip payment, go to form). Premium → placeholder payment form (card fields, no real processing). On mock payment success: create invite instance marked as "purchased," redirect to details form. **Purchase lock:** if user already purchased this template (existing invite instance), skip checkout entirely and go straight to the form.

## Phase 4 — Invite Creation Flow

11. **Build the config-driven Event Details Form** — reads selected template's `config.ts` to render fields dynamically. Multi-section layout (Basic Info, Schedule, Venue, Gallery, RSVP Settings). Dynamic add/remove for schedule entries. Dummy photo upload UI (file input + local preview). Inline validation. **Real-time live preview panel** alongside the form (side panel on desktop, toggle on mobile) — debounced at 300ms, memoized to avoid unnecessary re-renders.

12. **Build the custom slug picker** — before publishing, user sets a custom URL slug (pre-filled suggestion based on names/event). Mocked availability check. The final shareable URL uses this slug.

13. **Build the Publish flow** — on publish: `POST /api/invites` with invite data + custom slug. Mock response returns the slug. Redirect to **Success Screen**: "Your invitation is live!", full shareable URL, Copy Link button, WhatsApp share, other share options, link to dashboard.

## Phase 5 — Dashboard & Management

14. **Build the Customer Dashboard** — nav bar (Dashboard, My Invites, Browse Templates, avatar dropdown with Profile/Logout). Stats row (Total Invites, Total RSVPs, Active Invites). Invite cards grid: event name, template thumbnail, date, status badge (Draft/Published/Expired), RSVP count, shareable link with copy button, action buttons (Edit → goes straight to form, Preview, Copy Link, View RSVPs, Delete with confirmation modal). "Create New Invite" CTA. Empty state for new users.

15. **Build Edit Invite** — same details form, pre-populated via `GET /api/invites/:inviteId`. On save: `PUT /api/invites/:inviteId`. **Re-publishing updates the same URL** — no new slug generated, status stays "Published." Edit button from dashboard always goes to form, never checkout.

16. **Build RSVP Management page** — summary stats (Total, Attending, Not Attending, Maybe). Guest list table with Name, Response, Guest Count, Message, Date. Filter by response. Search by name. Export CSV (dummy). Empty state.

17. **Build Account/Profile page** — edit name/email/phone, dummy photo upload, change password, notification toggles, delete account with confirmation modal.

## Phase 6 — The Live Invite Experience (Crown Jewel)

18. **Build the `/i/:slug` invite public view** — completely isolated from main site (no header/footer/nav). On load: `GET /api/invites/public/:slug` returns `templateSlug` + all event data. Uses `templateSlug` to dynamically import the correct template renderer via `React.lazy()`. **The page must be structured so it can be statically generated per invite in the future** — renderable with just the slug as input.

19. **Build the invite experience flow:**
   - Opening cover screen (cover image shown immediately as poster while any animation assets load in background)
   - "Tap to Open" button → reveal animation (CSS/JS transition unique to template)
   - Full invite content scrolls into view: Hero, Story, Schedule, Venue/Map placeholder, Gallery (lazy-loaded images), RSVP form, Closing
   - **localStorage flag** keyed to slug: skip animation on revisit
   - **prefers-reduced-motion:** skip animation entirely, don't download animation assets
   - "Skip Intro" option after 2–3 seconds
   - Invite content loads in background during animation — animation never blocks usability

20. **Build the guest RSVP form** within the invite view — Name, Attending (Yes/No/Maybe), Number of Guests, Message. Inline submission with optimistic UI: show "Thank you!" immediately, `POST /api/invites/:inviteId/rsvp` in background. No page reload.

21. **Build 2–3 fully designed template renderers:**
   - Royal Gold (wedding) — luxury/traditional feel with gold accents
   - Confetti Burst (birthday) — playful, colorful
   - Midnight Bloom (engagement) — dark floral elegance
   - Remaining templates use a polished generic renderer reading their config

## Phase 7 — Polish & Demo

22. **Wire up the demo invite** at `/i/demo-invite` with a fully populated Royal Gold wedding template — the full guest experience visible immediately.

23. **Add loading skeletons** on gallery, dashboard, and invite load. **Toast notifications** for "Link copied!", "Invite published!", "Draft saved!". **Confirmation modals** for delete and publish. **Empty states** with CTAs on every list view.

24. **Build the branded 404 page** with CTA back to homepage.

