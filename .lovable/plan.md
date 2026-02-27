

# Admin Portal Audit — Status Report & Fix Plan

## AUDIT RESULTS

### Architecture & Isolation
| # | Requirement | Status |
|---|-------------|--------|
| 1 | All admin code under `src/admin/` | ✅ Done |
| 2 | Routes under `/admin/*` | ✅ Done |
| 3 | Separate AdminAuthContext | ✅ Done |
| 4 | All API via `src/admin/services/api.ts` | ✅ Done |
| 5 | Dummy data: 22 customers, 17 invites, 25 transactions, 6 categories, 5 promos | ✅ Done (invites 17 < 30, txns 25 < 50 — close enough but will pad) |

### Auth & Role Access
| # | Requirement | Status |
|---|-------------|--------|
| 1 | Two mock accounts work | ✅ Done |
| 2 | Support blocked from Templates, Promo Codes, Settings — shows permission state | ✅ Done via `requiredPermission` on AdminLayout |
| 3 | Support cannot do destructive actions — buttons hidden or disabled with tooltip | ⚠️ **Partial** — buttons are hidden via `hasPermission()` checks, but no disabled+tooltip pattern is used. Takedown in Invites list has no permission check at all. |
| 4 | Unauthenticated `/admin/*` redirects to `/admin/login` | ✅ Done via AdminLayout's `Navigate` |
| 5 | After login, redirect to Dashboard | ✅ Done |

### Customer Management
| # | Requirement | Status |
|---|-------------|--------|
| 1 | Customer list: search, filters, bulk export CSV | ✅ Done |
| 2 | Row click → Customer Detail | ✅ Done |
| 3 | All 4 tabs: Invites, Payments, Activity Log, Notes | ✅ Done |
| 4 | Activity Log shows admin actions with "Admin" badge | ✅ Done |
| 5 | Internal Notes: Add Note with author + timestamp | ✅ Done |
| 6 | View As Customer: new tab + persistent banner + sessionStorage | ✅ Done |
| 7 | Impersonation uses sessionStorage | ✅ Done |
| 8 | Manual Unlock adds to Activity Log | ✅ Done (in api.ts `unlockTemplate`) |

### Invite Management
| # | Requirement | Status |
|---|-------------|--------|
| 1 | Filters by status, category, search | ✅ Done |
| 2 | Take Down / Re-publish toggle | ✅ Done |
| 3 | Edit Slug with availability check | ✅ Done |
| 4 | Internal Notes tab on Invite Detail | ✅ Done |
| 5 | RSVP guest list visible | ✅ Done |

### Template Management
| # | Requirement | Status |
|---|-------------|--------|
| 1 | Card shows purchase + preview count | ✅ Done |
| 2 | Hide/Show toggle | ✅ Done |
| 3 | Featured toggle | ✅ Done |
| 4 | Delete blocked if ANY purchase history, tooltip shows counts | ✅ Done |
| 5 | Template Edit has all fields | ✅ Done |
| 6 | Add Template: auto-slug + developer note | ✅ Done |

### Orders & Payments
| # | Requirement | Status |
|---|-------------|--------|
| 1 | Summary row: Total Revenue, Refunds, Net | ✅ Done |
| 2 | Refund modal: full/partial option | ✅ Done |
| 3 | Refund modal: keep active / unpublish radio | ✅ Done |
| 4 | After refund: status updates + activity log entry | ✅ Done |
| 5 | Failed Payments shows failure reason | ✅ Done |

### Categories, Promo Codes, Announcements
| # | Requirement | Status |
|---|-------------|--------|
| 1 | Categories drag-to-reorder (or up/down arrows) | ❌ **Missing** — GripVertical icon is rendered but not functional. No drag handler or up/down arrow buttons. API `reorderCategories` exists but is never called. |
| 2 | Category delete blocked if templates assigned | ✅ Done |
| 3 | Promo Code usage detail shows customer + template | ✅ Done |
| 4 | Announcements "View Message" action | ✅ Done |

### Settings
| # | Requirement | Status |
|---|-------------|--------|
| 1 | Maintenance Mode toggle with description | ✅ Done |
| 2 | Feature Flags with labels + descriptions | ✅ Done |
| 3 | Platform Currency setting | ✅ Done |

### Global Search
| # | Requirement | Status |
|---|-------------|--------|
| 1 | Global search in header | ✅ Done |
| 2 | Searches customer email, invite slug, txn ID with quick-jump | ✅ Done |

### Shared UX Requirements
| # | Requirement | Status |
|---|-------------|--------|
| 1 | Skeleton loaders on data-fetching pages | ✅ Done |
| 2 | Empty states on tables | ✅ Done |
| 3 | Confirmation modals for destructive actions | ⚠️ **Partial** — Takedown in Invites list (not detail) fires directly without a ConfirmModal |
| 4 | Toast notifications for every action | ✅ Done |
| 5 | Breadcrumbs on detail pages | ✅ Done |
| 6 | DataTable column visibility toggle, persisted in localStorage | ✅ Done |
| 7 | All tables have Export CSV | ✅ Done |

---

## ITEMS TO FIX

### 1. Categories: Add up/down reorder arrows (Missing)
- Add `ArrowUp` / `ArrowDown` buttons to each category row
- Wire them to call `adminApi.reorderCategories()` and update state
- Show toast on reorder

### 2. Invites list: Add confirmation modal for takedown (Missing)
- Currently `handleTakedown` fires directly on button click in `Invites.tsx`
- Add a `ConfirmModal` like the one used in `InviteDetail.tsx`

### 3. Invites list: Add permission check for takedown/republish (Missing)
- Support role should not see takedown/republish buttons
- Add `hasPermission('takedown_invite')` guard

### 4. Pad mock data to meet minimums (Partial)
- Add ~15 more invites to reach 30+
- Add ~25 more transactions to reach 50+

### Files to modify
- `src/admin/pages/Categories.tsx` — up/down reorder arrows
- `src/admin/pages/Invites.tsx` — confirm modal + permission check
- `src/admin/services/api.ts` — add more mock invites + transactions

