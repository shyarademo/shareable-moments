

# Admin Portal — Full Implementation Plan

## Architecture

All admin code in `src/admin/`, completely isolated from customer site. Admin routes mounted under `/admin/*` in `App.tsx`. Separate `AdminAuthContext` for admin auth with role-based access.

## File Structure

```text
src/admin/
├── types.ts
├── services/api.ts              # ~30 mock endpoints, rich dummy data
├── contexts/AdminAuthContext.tsx  # admin/support roles, impersonation via sessionStorage
├── components/
│   ├── AdminLayout.tsx           # Sidebar + header with global search
│   ├── AdminSidebar.tsx          # Dark sidebar, role-aware nav
│   ├── AdminHeader.tsx           # Top bar with global search + breadcrumbs
│   ├── DataTable.tsx             # Reusable: sort, filter, paginate, bulk select, CSV export, column visibility toggle (localStorage per table)
│   ├── StatsCard.tsx             # Value + trend indicator
│   ├── ConfirmModal.tsx          # Destructive action confirmation
│   ├── StatusBadge.tsx           # Color-coded status pills
│   ├── ImpersonationBanner.tsx   # Persistent non-dismissible banner for "View As Customer"
│   └── InternalNotes.tsx         # Reusable notes component (used on Customer Detail + Invite Detail)
├── pages/
│   ├── AdminLogin.tsx
│   ├── Dashboard.tsx
│   ├── Customers.tsx
│   ├── CustomerDetail.tsx
│   ├── AddCustomer.tsx
│   ├── Invites.tsx
│   ├── InviteDetail.tsx
│   ├── Templates.tsx
│   ├── TemplateEdit.tsx
│   ├── AddTemplate.tsx
│   ├── Transactions.tsx
│   ├── FailedPayments.tsx
│   ├── Categories.tsx
│   ├── PromoCodes.tsx
│   ├── Announcements.tsx
│   └── Settings.tsx
```

## Implementation Details

### 1. Types (`src/admin/types.ts`)
Admin-specific interfaces: `AdminUser` (id, name, email, role: 'admin'|'support'), `AdminCustomer` (extends User with joinDate, totalInvites, totalSpent, status, lastActive, plan), `AdminInvite` (extends Invite with customerName, customerEmail, viewCount), `AdminTransaction` (id, customerId, customerName, templateSlug, templateName, amount, currency, date, status: 'success'|'failed'|'refunded', failureReason?, refundAmount?), `AdminCategory` (id, name, slug, emoji, templateCount, displayOrder, isVisible), `AdminPromoCode` (id, code, discountType, discountValue, appliesTo, usageCount, usageLimit, expiryDate, status, usageDetails[]), `AdminAnnouncement` (id, subject, body, recipientTarget, dateSent, recipientCount), `AdminSettings` (currency, defaultPremiumPrice, maxFileSizes, maintenanceMode, featureFlags[]), `ActivityLogEntry` (id, customerId, action, timestamp, isAdminAction, adminEmail?, details?), `InternalNote` (id, entityId, entityType, content, authorEmail, createdAt).

### 2. Mock API Service (`src/admin/services/api.ts`)
- Rich dummy data: 20+ customers, 30+ invites across all templates, 50+ transactions, 6 categories, 5 promo codes, 3 announcements, activity logs with admin actions
- All ~30 endpoints with 300-600ms simulated delays
- Mutating endpoints update in-memory arrays
- **Refund endpoint** accepts `{ keepInviteActive: boolean }` — if false, sets invite status to 'taken-down' and adds activity log entry
- **Manual unlock endpoint** accepts `{ reason: string }` — creates activity log entry: "Template [name] manually unlocked by [admin email] — Reason: [reason]"
- **Template delete** returns error with purchase/invite counts if either > 0
- **Global search endpoint** `GET /admin/search?q=` — filters across customers (name/email), invites (slug/eventName), transactions (id) and returns grouped results
- Currency setting stored in settings, used to format all monetary values

### 3. Auth Context (`src/admin/contexts/AdminAuthContext.tsx`)
- Two mock accounts: `admin@shyara.co.in` / `admin123` (role: admin), `support@shyara.co.in` / `support123` (role: support)
- `hasPermission(action)` helper — support role blocked from: template management, pricing, promo codes, settings, destructive actions (suspend, delete, refund, manual unlock)
- Impersonation: `startImpersonation(customerId)` stores `{ customerId, customerName }` in `sessionStorage('shyara_admin_impersonate')`, opens customer dashboard in new tab. `endImpersonation()` clears it.

### 4. Impersonation Banner (`ImpersonationBanner.tsx`)
- Reads `sessionStorage('shyara_admin_impersonate')` on mount
- If present: renders a fixed top banner (z-50, bg-amber-500, text-black): "Admin View — You are viewing as [Customer Name]" with "Exit Admin View" button
- Not dismissible — always visible during impersonation session
- "Exit Admin View" clears sessionStorage and closes the tab
- **Mounted in customer site's App.tsx** (not admin portal) — conditionally rendered only when sessionStorage key exists. This is the ONE touch point in the customer codebase.

### 5. Layout Components
- **AdminSidebar**: Dark slate-900 bg, sections grouped with headers. Support role: hide Templates, Promo Codes, Settings nav items. Admin name + role badge at bottom, logout button.
- **AdminHeader**: Top bar with breadcrumbs (left) and global search (right). Search uses cmdk Command component — type to search, results grouped by Customers/Invites/Transactions with quick-jump links. Debounced 300ms.
- **AdminLayout**: Sidebar + header + scrollable content area. Wraps all admin pages.

### 6. DataTable Component
- Props: columns config (key, label, sortable, hideable), data, loading, emptyState, onRowClick, bulkActions, filters
- Features: column sorting, search input, filter dropdowns, pagination (25/50/100 per page), checkbox bulk selection, CSV export button, **column visibility toggle** (gear icon → dropdown checklist, persisted to `localStorage('shyara_admin_cols_{tableId}')`)
- Skeleton loader rows when loading=true
- Empty state component when data.length === 0

### 7. Pages

**Dashboard**: 6 StatsCards (Total Users, Active Invites, Today's Revenue, New Signups Today, Total Templates, Total RSVPs — each with trend %). Revenue LineChart (recharts, 7d/30d/90d toggle). Recent signups table (10 rows). Recent transactions table (10 rows). Top 5 templates bar. Platform alerts section (failed payments count, flagged invites).

**Customers**: DataTable with columns: Name, Email, Join Date, Total Invites, Total Spent, Status, Last Active. Filters: status, date range. Search by name/email. Bulk: Export CSV, Suspend Selected. "Add Customer" button.

**CustomerDetail**: Breadcrumb (Customers > [Name]). Profile header card. Quick actions bar: Suspend/Unsuspend, Reset Password, Send Email (toast mock), **View As Customer** (opens new tab with impersonation sessionStorage set), Add Internal Note. **Tabs**: Invites (table), Payments (table with per-row Refund button), **Activity Log** (timestamped list — customer actions in default style, **admin actions with red "Admin" badge** and different left-border color), Internal Notes (InternalNotes component).

**Invites**: DataTable — Event Name, Customer, Template, Category, Status, Slug, Event Date, RSVP Count, Created Date. Filters: status, category, date. Actions: Preview (new tab), Take Down/Re-publish, Edit Slug (inline edit with availability check), View Customer.

**InviteDetail**: Breadcrumb. Metadata panel. Action buttons. RSVP summary (attending/maybe/declined counts). RSVP guest list table. **Internal Notes tab** (same InternalNotes component, entityType: 'invite').

**Templates**: Grid/table toggle. Each: thumbnail, name, category, price, free/premium badge, status (Visible/Hidden), featured badge, purchase count, preview count. Actions: Edit, Hide/Show, Featured toggle. **Delete button**: disabled with tooltip showing "Purchased X times, Y active invites — deletion blocked" if purchaseCount > 0. Only enabled and red if purchaseCount === 0. Filter by category, status, free/premium.

**TemplateEdit / AddTemplate**: Form fields for all metadata. Price field conditional on premium toggle. Supported sections checklist. Field definitions read-only table. AddTemplate has note: "After saving config, template component files must be added by a developer."

**Transactions**: Summary row (Total Revenue, Total Refunds, Net). DataTable with all columns. **Refund modal**: shows transaction details, full/partial radio (partial shows amount input), **"After refund" radio: "Keep invite active" / "Unpublish invite"**. Confirm triggers mock refund, updates transaction status, adds activity log entry with admin email.

**FailedPayments**: Filtered failed transactions. "Manually Unlock Template" button (admin-only, disabled for support with tooltip). **Unlock modal**: shows customer + template info, **"Reason" textarea** (required), confirm creates activity log entry: "Template [name] manually unlocked by [admin email] — Reason: [input]".

**Categories**: List with name, slug, emoji, template count, order. Add/edit/delete. Hide/show toggle. Delete blocked if templateCount > 0.

**PromoCodes**: Table with all fields. Create/edit/delete. Enable/disable toggle. "View Usage" expandable showing which customers used it.

**Announcements**: Compose form (subject, body, recipient target dropdown). Preview panel. Send (mocked toast). **History table with "View Message" action** — expands row or opens sheet showing full message body.

**Settings**: Currency selector (₹ INR default, $ USD, S$ SGD, Rp IDR) — controls currency symbol across all admin monetary displays. Pricing defaults. Asset size limits. Maintenance mode toggle. Feature flags (toggles with label + description).

### 8. Role-Based Access
- Support role accessing restricted pages (Templates, PromoCodes, Settings) sees a centered "You don't have permission" state with lock icon
- Destructive action buttons (suspend, delete, refund, manual unlock) hidden or disabled for support role
- `AdminLayout` checks role and conditionally renders restricted routes

### 9. Routing (addition to App.tsx)
```
/admin/login
/admin                    → Dashboard
/admin/customers          → Customers list
/admin/customers/new      → Add Customer
/admin/customers/:id      → Customer Detail
/admin/invites            → All Invites
/admin/invites/:id        → Invite Detail
/admin/templates          → All Templates
/admin/templates/new      → Add Template
/admin/templates/:slug    → Edit Template
/admin/transactions       → All Transactions
/admin/transactions/failed → Failed Payments
/admin/categories         → Categories
/admin/promo-codes        → Promo Codes
/admin/announcements      → Announcements
/admin/settings           → Settings
```

All lazy-loaded. Admin routes wrapped in `AdminAuthContext`. Unauthorized redirects to `/admin/login`.

### 10. Customer Site Touch Point (minimal)
Only change to existing code: add `ImpersonationBanner` component render in `App.tsx`, conditionally shown when `sessionStorage('shyara_admin_impersonate')` exists. No other customer-side changes.

