# Maintix Frontend — Premium & Professional Upgrade Audit

> **Date:** March 6, 2026
> **Scope:** Full codebase review of `apps/web/` — landing page, dashboard, UI components, hooks, styling, and architecture.

---

## Table of Contents

- [Executive Summary](#executive-summary)
- [Current State Assessment](#current-state-assessment)
- [A. Dashboard — Biggest Gap (High Impact)](#a-dashboard--biggest-gap-high-impact)
- [B. Missing Premium UX Patterns (Medium Impact)](#b-missing-premium-ux-patterns-medium-impact)
- [C. Visual & Polish Details (Medium-Low Impact)](#c-visual--polish-details-medium-low-impact)
- [D. Missing Functional Features](#d-missing-functional-features-adds-perceived-premium)
- [E. Performance & Technical Debt](#e-performance--technical-debt)
- [Priority Implementation Roadmap](#priority-implementation-roadmap)

---

## Executive Summary

The Maintix landing page is well-executed — strong use of `framer-motion`, blur-fade animations, bento cards, shine borders, marquee trust strip, animated word rotation, and a cohesive indigo/violet palette. However, the **dashboard (the actual product)** feels like a default shadcn/ui scaffold with minimal design effort compared to the landing page polish.

**The core problem:** The marketing site promises a premium product, but the in-app experience doesn't deliver on that promise.

### Key Metrics

| Area                 | Score (1-10) | Notes                                                  |
| -------------------- | :----------: | ------------------------------------------------------ |
| Landing page design  |   **8.5**    | Polished, animated, modern                             |
| Login page           |    **8**     | Good split-panel layout, testimonial, trust indicators |
| Dashboard home       |    **4**     | Barren stats with `—` placeholders, no charts          |
| Tickets list         |    **5**     | Functional but plain text rows                         |
| Ticket detail        |    **6**     | Decent layout, needs visual refinement                 |
| Properties list      |   **4.5**    | Basic card grid, minimal hover effects                 |
| Property detail      |    **5**     | Info dump — no tabs, no visuals                        |
| Users list           |   **4.5**    | Flat card stack, no table view                         |
| Notifications        |    **5**     | Functional but no grouping or animation                |
| Sidebar / Navigation |   **5.5**    | No collapse, no keyboard nav                           |
| Overall consistency  |    **5**     | Landing ≠ Dashboard quality gap                        |

---

## Current State Assessment

### What's Working Well

- **Landing page:** Hero section with parallax, `WordRotate`, gradient text, `DotPattern` backgrounds, `ShineBorder`, `Marquee` trust strip, animated `NumberTicker` stats, bento feature grid, `AnimatedList` notifications demo — this is genuinely premium marketing.
- **Login page:** Split-panel layout with branded left side, testimonial card, trust indicators (SSL badge), keyboard hint, `ShineBorder` on the form card.
- **Design tokens:** Well-structured `globals.css` with semantic color tokens, light/dark mode, indigo/violet primary palette, proper `@theme` block, glass effects, noise texture overlay, gradient borders.
- **Animation infrastructure:** `blur-fade`, `shimmer`, `glow-pulse`, `float`, `gradient-shift`, `beam` keyframes all defined. Reduced motion media query present.
- **Component library:** Solid shadcn/ui new-york foundation with custom additions (`animated-list`, `animated-shiny-text`, `blur-fade`, `border-beam`, `dot-pattern`, `marquee`, `number-ticker`, `ripple`, `shine-border`, `word-rotate`).
- **Architecture:** Clean separation — contexts, hooks, lib, components, pages. React Query for data fetching. Zod + react-hook-form for validation.

### What's Not Working

- **Dashboard is a stark quality drop** from the landing page.
- **Zero data visualization** — no charts, graphs, or sparklines anywhere.
- **No page transitions** — dashboard pages load with no animation.
- **No command palette** — missing `Cmd+K` quick navigation.
- **Sidebar is rigid** — no collapsed mode, no keyboard toggle.
- **Lists are unstyled rows** — no proper data tables.
- **Empty states are generic** — icon + text, no illustrations.
- **No onboarding** — new users see an empty dashboard with no guidance.
- **No profile/settings** — users can't manage their own account.

---

## A. Dashboard — Biggest Gap (High Impact)

### 1. Dashboard Home Page is Barren

**File:** `src/app/dashboard/page.tsx`

**Current state:** Shows 2-4 stat cards with hardcoded `—` placeholders and a simple property card grid. No actionable data, no visualizations, no activity feed.

**What premium apps have:**

- **Real summary stats** — aggregate open ticket count, avg resolution time, tickets resolved this week, satisfaction rate
- **Key metric sparklines** in each stat card (tiny inline charts showing trend direction)
- **Quick actions strip** — prominently placed buttons: "Create Ticket", "View Open Tickets", "Recent Activity"
- **Recent activity feed** on the homepage (the `ActivityTimeline` component exists but is only used on ticket detail)
- **Charts section** — ticket volume over time (area chart), status distribution (donut), priority breakdown (horizontal bar)
- **Time-aware greeting** — "Good morning, James" instead of static "Welcome back"

**Recommended implementation:**

```
Dashboard home should have:
┌─────────────────────────────────────────────────────────────┐
│  Good morning, James 👋                                     │
│  Here's your maintenance overview for today.                │
├────────┬────────┬────────┬────────┬─────────────────────────┤
│ Open   │ In     │ Avg    │ Resol- │ ▃▅▇▅▃▅▇ (sparkline)    │
│ 12     │ Prog 5 │ 2.1hr  │ ved 48 │                         │
├────────┴────────┴────────┴────────┴─────────────────────────┤
│                                                              │
│  ┌─ Ticket Volume ──────────┐  ┌─ Status Breakdown ───────┐ │
│  │  Area chart (7/30 days)  │  │  Donut chart             │ │
│  └──────────────────────────┘  └──────────────────────────┘ │
│                                                              │
│  ┌─ Recent Activity ────────────────────────────────────────┐│
│  │  Timeline feed (last 10 activities across all tickets)   ││
│  └──────────────────────────────────────────────────────────┘│
│                                                              │
│  ┌─ Your Properties ────────────────────────────────────────┐│
│  │  Property cards with mini stat badges                    ││
│  └──────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────┘
```

**Package needed:** `recharts` (lightweight, React-native charting library)

---

### 2. No Data Visualization Anywhere

**Affected files:** All dashboard pages

**Current state:** The entire dashboard has zero charts, graphs, sparklines, or visual data representations. Everything is text and numbers.

**What to add:**

| Chart Type          | Location        | Purpose                                                   |
| ------------------- | --------------- | --------------------------------------------------------- |
| **Area/Line chart** | Dashboard home  | Ticket volume trend (Created vs Resolved, last 7/30 days) |
| **Donut chart**     | Dashboard home  | Ticket status distribution                                |
| **Horizontal bar**  | Dashboard home  | Tickets by priority                                       |
| **Sparklines**      | Stat cards      | Trend direction indicator inside each stat card           |
| **Progress bar**    | Property detail | Open vs Closed ticket ratio                               |
| **Stacked bar**     | Property detail | Tickets by category                                       |

**Backend impact:** Requires new API endpoints for aggregated statistics:

- `GET /api/v1/stats/ticket-volume?days=30` — daily ticket counts
- `GET /api/v1/stats/status-distribution` — count per status
- `GET /api/v1/stats/priority-distribution` — count per priority
- Or compute client-side from existing ticket data for MVP

---

### 3. Tickets List is Plain Text Rows

**File:** `src/app/dashboard/tickets/page.tsx` (lines 208-240)

**Current state:** Tickets are rendered as simple bordered `<div>` rows with text, a badge, and minimal styling. No table headers, no column sorting UI, no view options.

**Upgrade options:**

#### Option A: Proper Data Table

- Use `@tanstack/react-table` + shadcn `<Table>` component
- Columns: Status (icon+badge) | Title | Property | Priority (colored dot) | Assignee (avatar) | Created | Updated
- Sortable column headers with visual indicators
- Row selection checkboxes for batch actions
- Sticky header on scroll
- Alternating row background tint
- Pagination at bottom

#### Option B: Kanban Board View (toggle)

- Add a toggle: `List | Board` in the page header
- Board view shows columns: Open → Assigned → In Progress → Awaiting Approval → Done
- Each ticket as a card with title, priority dot, assignee avatar, time ago
- Drag-and-drop between columns (with permission checks)

**Recommended:** Implement both views with a toggle. The table is the default, kanban is the alternate.

---

### 4. Users List is a Flat Card Stack

**File:** `src/app/dashboard/users/page.tsx`

**Current state:** Full-width stacked cards with initials circle, name, email, role badge. Looks like a mobile-first design stretched to desktop.

**Upgrade to:**

- A proper `<Table>` with columns: Avatar | Name | Email | Role | Properties (count) | Joined Date | Actions
- Role badges with consistent color coding (Manager=indigo, Technician=amber, Tenant=emerald)
- Hover row highlighting
- Click to expand inline details or navigate to user profile
- Pagination (currently loads all users at once)
- Bulk selection for batch role changes or removal

---

### 5. Notifications Page Lacks Polish

**File:** `src/app/dashboard/notifications/page.tsx`

**Current state:** All notifications in a flat list with a type filter dropdown. No grouping, no time separation, no animations.

**Upgrade:**

- **Group by date:** "Today", "Yesterday", "This Week", "Earlier"
- **Transition animations:** Fade-out on mark-as-read, slide-in for new notifications
- **Inline action preview:** Show the ticket title/status change inline rather than just the message
- **"New since last visit"** divider line
- **Custom empty state illustration** instead of just `<BellOff>` icon

---

### 6. Property Detail is a Basic Info Dump

**File:** `src/app/dashboard/properties/[propertyId]/page.tsx`

**Current state:** Header with name/address → 3 stat cards → 2-column cards (members + categories) → recent tickets list. All in one scrollable page.

**Upgrade:**

- **Header area** with a colored banner/gradient or property image placeholder
- **Tab navigation:** Overview | Tickets | Members | Categories | Settings
- **Overview tab:** Summary stats with mini charts (ticket volume for this property, status distribution)
- **Mini progress bar** on stat cards: "12 open / 48 total" with a visual fill bar
- **Member cards** with avatars, hover to see properties they're also in
- **Map embed placeholder** with the property address (Google Maps static image or iframe)

---

## B. Missing Premium UX Patterns (Medium Impact)

### 7. Loading Skeletons Need Shimmer Animation

**Affected files:** All pages using `<Skeleton>`

**Current state:** Skeletons are plain gray rectangles from shadcn/ui default. The `animate-shimmer` keyframe is defined in `globals.css` but never applied to skeletons.

**Fix:**

- Update `src/components/ui/skeleton.tsx` to include shimmer animation
- Create content-aware skeleton layouts that mirror actual content structure (e.g., a ticket-row skeleton should look like a ticket row, not a generic rectangle)

**Example skeleton patterns needed:**

- `TicketRowSkeleton` — matches the ticket list row layout
- `StatCardSkeleton` — matches the stat card layout with number + label
- `PropertyCardSkeleton` — matches property card with title + address
- `UserRowSkeleton` — matches user table row

---

### 8. No Page Transition Animations in Dashboard

**File:** `src/app/dashboard/layout.tsx`

**Current state:** Pages simply appear with no transition. The landing page has extensive `BlurFade` entrance animations, but the dashboard has none.

**Solution:** Add a `framer-motion` `<AnimatePresence>` wrapper with subtle fade+slide:

```tsx
// In dashboard layout, wrap {children} with:
<motion.div
  key={pathname}
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.2, ease: 'easeOut' }}
>
  {children}
</motion.div>
```

Also add staggered entrance animations for card grids and list items in dashboard pages.

---

### 9. No Tooltips or Contextual Help

**Affected files:** All dashboard pages

**Current state:** Zero tooltips in the entire dashboard. Users have no contextual guidance.

**Where to add tooltips:**

- Stat card titles ("Total properties you have access to")
- Filter controls ("Filter tickets by their current workflow status")
- Action buttons that might be unclear ("Assign this ticket to a technician")
- Priority indicators ("Urgent priority — requires immediate attention")
- Notification bell count ("3 unread notifications")

**Package:** `@radix-ui/react-tooltip` (already using other Radix primitives)

---

### 10. No Confirmation/Success Microinteractions

**Current state:** All mutations use `toast()` for feedback. No visual change on the mutated element itself.

**Upgrade:**

- **Ticket status change:** Brief green flash/pulse on the status badge after transition
- **Ticket approval:** Confetti burst or animated checkmark overlay
- **Assignment:** Avatar pop-in animation for the newly assigned technician
- **Optimistic UI:** Immediately update the UI state before server confirms (React Query already supports this via `onMutate`)
- **Button loading state:** Show spinner inside the button during mutation (partially done but inconsistent)

---

### 11. No Empty State Illustrations

**Affected areas:**

- No properties (`src/app/dashboard/page.tsx`, `properties/page.tsx`)
- No tickets (`tickets/page.tsx`)
- No users (`users/page.tsx`)
- No notifications (`notifications/page.tsx`)

**Current state:** Generic Lucide icons (`Building2`, `Ticket`, `BellOff`, `UsersIcon`) with plain text.

**Upgrade:**

- Create 4-5 custom SVG illustrations (or use open-source illustration sets like Undraw, Popsy, or Storyset)
- Each empty state should have: Illustration + Headline + Description + Primary CTA button
- Make them theme-aware (different fills for light/dark mode)

---

### 12. Sidebar Has No Collapsed Mode

**File:** `src/components/dashboard-layout.tsx`

**Current state:** Sidebar is fixed at `w-64` (256px). On mobile it's a slide-out overlay. No way to minimize it on desktop.

**Upgrade:**

- **Collapsed state:** Icons-only sidebar at `w-16` (64px)
- **Toggle button** at bottom of sidebar or in header
- **Hover to expand** in collapsed mode (show labels on hover as tooltips)
- **Persist state** in `localStorage`
- **Keyboard shortcut:** `Ctrl+B` / `Cmd+B` to toggle
- **Smooth animation** between expanded and collapsed states

**Implementation sketch:**

```
Expanded (w-64):          Collapsed (w-16):
┌──────────────┐          ┌────┐
│ M  Maintix   │          │ M  │
├──────────────┤          ├────┤
│ 🏠 Dashboard │          │ 🏠 │
│ 🏢 Properties│          │ 🏢 │
│ 🎫 Tickets   │          │ 🎫 │
│ 👥 Users     │          │ 👥 │
├──────────────┤          ├────┤
│ JM  James M. │          │ JM │
│     Manager  │          └────┘
└──────────────┘
```

---

### 13. No Command Palette / Quick Search

**Current state:** No global search. Users must navigate page by page.

**What to add:**

- `Cmd+K` / `Ctrl+K` command palette overlay
- Search across: Pages, Tickets (by title/ID), Properties (by name), Users (by name/email)
- Quick actions: "Create Ticket", "Go to Properties", "Toggle Theme", "Log Out"
- Recent searches / frequently accessed items

**Package:** `cmdk` (by pacocoursey, same author as `sonner` — lightweight, unstyled, composable)

**Implementation:**

1. Install `cmdk`
2. Create `src/components/command-palette.tsx`
3. Register the `Cmd+K` keyboard listener in dashboard layout
4. Wire search to existing API hooks

---

## C. Visual & Polish Details (Medium-Low Impact)

### 14. Inconsistent Card Hover Effects

**Landing page cards have:**

- Gradient overlay on hover (`bg-gradient-to-br from-primary-500/[0.04]`)
- Border color change (`hover:border-primary-500/20`)
- Elevated shadow (`hover:shadow-lg hover:shadow-primary-500/[0.04]`)
- `ShineBorder` on featured cards
- 500ms transition duration

**Dashboard cards have:**

- Basic `hover:border-primary/30 hover:shadow-sm`
- No gradient overlays
- No animated borders
- Inconsistent transition durations (some 300ms, some none)

**Fix:** Create a `<PremiumCard>` wrapper or update the base `<Card>` component with consistent hover effects matching the landing page quality.

---

### 15. No Avatar Component Usage

**Current state:** `@radix-ui/react-avatar` is installed in `package.json` but never imported or used. Instead, manual `<div>` circles with initials are used in:

- `dashboard-layout.tsx` (sidebar user)
- `users/page.tsx` (user list)
- `properties/[propertyId]/page.tsx` (member list)
- `tickets/[ticketId]/page.tsx` (assignee display)

**Upgrade:**

- Create `src/components/ui/avatar.tsx` with Radix Avatar primitive
- Support image URLs (future profile photos)
- Role-based color coding for fallback backgrounds:
  - Manager: `bg-primary-500/10 text-primary-600`
  - Technician: `bg-amber-500/10 text-amber-600`
  - Tenant: `bg-emerald-500/10 text-emerald-600`
- Consistent sizing: `sm` (32px), `md` (40px), `lg` (48px)
- Avatar group component for member lists (overlapping circles with "+3 more")

---

### 16. Breadcrumbs Are Basic

**File:** `src/components/dashboard-layout.tsx` (lines 200-220)

**Current state:** Plain text links with `ChevronRight` separator. Functional but not premium.

**Upgrade:**

- Add page-specific icons next to breadcrumb labels (🏠 Dashboard > 🎫 Tickets > TK-2847)
- Dropdown on intermediate segments (clicking "Properties" shows a list of all properties to navigate to)
- Truncation with tooltip for long property/ticket names
- Current page styled as non-interactive text (already done, but add a subtle background pill)

---

### 17. No Favicon, No OG Image, No Metadata

**Current state:**

- No custom favicon (browser shows default)
- No Open Graph image for social sharing
- Basic `<Metadata>` only on root layout and login layout

**Add:**

- **Favicon:** SVG favicon matching the gradient "M" logo (+ PNG fallbacks, apple-touch-icon)
- **OG image:** 1200x630 branded image for social link previews
- **Per-page metadata:** Title and description for each dashboard route
- **`manifest.json`** for PWA-like "Add to Home Screen" support

---

### 18. Forms Need More Polish

**Affected files:** All dialog forms (create ticket, create property, create user, assign, cancel)

**Current issues:**

- No helper text / field descriptions
- No inline success validation (green checkmark when field is valid)
- Single-page forms even for complex flows (ticket creation)
- No form auto-focus on dialog open
- Inconsistent spacing between form groups

**Upgrades:**

- Add `<FormDescription>` text under labels (e.g., "A short title describing the maintenance issue")
- Show green check icon when field passes validation
- Consider multi-step form for ticket creation: Title → Description → Category → Priority → Review & Submit
- Auto-focus first input field when dialog opens
- Add character count indicator for text areas
- Consistent `space-y-5` on all form groups

---

## D. Missing Functional Features (Adds Perceived Premium)

### 19. No Profile/Settings Page

**Current state:** Users can only log out. No way to manage their own account.

**What to add:**

**Profile page** (`/dashboard/settings` or `/dashboard/profile`):

- View/edit first name, last name
- View email (read-only or editable with verification)
- Change password
- Profile photo upload

**Settings page:**

- Notification preferences (email, in-app, per notification type)
- Theme preference (light/dark/system — already exists via toggle, but no persistent preference page)
- Timezone setting
- Language / locale (future)

---

### 20. No Onboarding Flow

**Current state:** First-time users land on an empty dashboard with generic "No properties yet" text.

**What to add:**

- **Welcome modal** on first login with a brief product tour
- **Getting Started checklist** card on dashboard:
  1. ✅ Create your account
  2. ⬜ Add your first property
  3. ⬜ Invite team members
  4. ⬜ Create your first ticket
- Progress bar showing completion (25% → 50% → 75% → 100%)
- Checklist dismissible after completion or manual close
- Store onboarding state in localStorage or user preferences

---

### 21. No Real-time Updates

**Current state:** Data freshness relies on React Query's `staleTime: 30s` and page navigation refetches. No push mechanism.

**What premium apps do:**

- **WebSocket or SSE** for live ticket status updates
- **"New tickets available" banner** that appears when background data changes
- **Live notification counter** updates without page refresh
- **Optimistic updates** for actions like assign, approve, start work (partial — mutations are instant but UI doesn't animate the change)

**Implementation options:**

1. **SSE (Server-Sent Events)** — simplest, one-directional, built into NestJS
2. **WebSocket via Socket.IO** — bidirectional, more complex but more flexible
3. **Polling fallback** — reduce `staleTime` to 5s on critical queries + use `refetchInterval`

---

### 22. No Export / Reporting

**Current state:** No way to export or print any data.

**What to add:**

- **"Export CSV" button** on the tickets list page (filtered results)
- **"Export PDF" button** on ticket detail (print-friendly single ticket view)
- **Weekly digest email** toggle in settings (backend feature, but UI toggle is needed)
- **Print stylesheet** (`@media print`) for clean printing of ticket details

---

### 23. No Keyboard Shortcuts

**Current state:** Only the login page mentions keyboard interaction (Enter to submit).

**What to add:**

| Shortcut           | Action                                   |
| ------------------ | ---------------------------------------- |
| `Cmd+K` / `Ctrl+K` | Open command palette                     |
| `Cmd+B` / `Ctrl+B` | Toggle sidebar                           |
| `N`                | Create new ticket (when on tickets page) |
| `?`                | Show keyboard shortcuts modal            |
| `Esc`              | Close dialog / sidebar / command palette |
| `J` / `K`          | Navigate up/down in ticket list          |
| `Enter`            | Open selected ticket                     |
| `G` then `D`       | Go to Dashboard                          |
| `G` then `T`       | Go to Tickets                            |
| `G` then `P`       | Go to Properties                         |

**Implementation:** Create a `useKeyboardShortcuts` hook registered in the dashboard layout. Show a "Keyboard Shortcuts" modal accessible from sidebar footer or `?` key.

---

### 24. No Date Picker / Date Range Filter

**Current state:** Tickets can be sorted by `createdAt` or `updatedAt`, but there's no date-based filtering.

**What to add:**

- Date range picker on the tickets list page
- Preset options: "Today", "Last 7 days", "Last 30 days", "This month", "Custom range"
- Useful for managers reviewing monthly ticket reports
- Also applicable to notifications page ("Show notifications from last week")

**Package options:**

- `react-day-picker` (lightweight, used by shadcn/ui's date picker)
- `@radix-ui/react-popover` + `react-day-picker` combo

---

## E. Performance & Technical Debt

### 25. Everything is `'use client'`

**Current state:** Every single page and component uses `'use client'` directive. This means:

- No server-side rendering for any dashboard content
- Larger JavaScript bundle shipped to client
- No streaming/Suspense benefits from Next.js App Router

**What to refactor:**

- Page shells (header, title, breadcrumbs) can be Server Components
- Interactive parts (forms, filters, data fetching) remain Client Components as "islands"
- Data fetching could use React Server Components with `fetch()` on the server (requires API to be callable server-side)

**Realistic approach:** Keep data-heavy pages as client components but extract static wrappers:

```
page.tsx (Server Component — renders the shell)
  └── PageContent.tsx (Client Component — data fetching + interactivity)
```

---

### 26. No `loading.tsx` Files

**Current state:** No `loading.tsx` files anywhere in the app. Next.js App Router uses this file convention for automatic Suspense boundaries during navigation.

**What to add:**

| File                                            | Purpose                                                      |
| ----------------------------------------------- | ------------------------------------------------------------ |
| `dashboard/loading.tsx`                         | Skeleton of dashboard home (stat cards + chart placeholders) |
| `dashboard/tickets/loading.tsx`                 | Skeleton of filter bar + ticket list rows                    |
| `dashboard/tickets/[ticketId]/loading.tsx`      | Skeleton of ticket detail layout                             |
| `dashboard/properties/loading.tsx`              | Skeleton of property card grid                               |
| `dashboard/properties/[propertyId]/loading.tsx` | Skeleton of property detail                                  |
| `dashboard/users/loading.tsx`                   | Skeleton of users table                                      |
| `dashboard/notifications/loading.tsx`           | Skeleton of notification list                                |

Each `loading.tsx` should use properly shaped skeleton components (not generic rectangles) that match the actual page layout.

---

### 27. No Custom `not-found.tsx` for Dashboard Routes

**Current state:** Invalid ticket/property IDs show inline "not found" text. No route-level 404.

**What to add:**

- `dashboard/not-found.tsx` — branded 404 page with illustration, message, and "Go to Dashboard" CTA
- `dashboard/tickets/[ticketId]/not-found.tsx` — "Ticket not found" with back link
- `dashboard/properties/[propertyId]/not-found.tsx` — "Property not found" with back link

---

## Priority Implementation Roadmap

### P0 — Critical (Do First)

These are the changes that will make the biggest perceived quality jump for the least effort.

| #   | Item                                     | Files Affected                              | Effort   | Impact |
| --- | ---------------------------------------- | ------------------------------------------- | -------- | ------ |
| 1   | Dashboard charts + real stat aggregation | `dashboard/page.tsx`, new chart components  | 1-2 days | ★★★★★  |
| 2   | Collapsible sidebar + `Ctrl+B` shortcut  | `dashboard-layout.tsx`                      | 0.5 day  | ★★★★☆  |
| 3   | Command palette (`Cmd+K`)                | New `command-palette.tsx`, dashboard layout | 0.5 day  | ★★★★☆  |

### P1 — High Priority

These complete the "premium dashboard" feeling.

| #   | Item                              | Files Affected                          | Effort  | Impact |
| --- | --------------------------------- | --------------------------------------- | ------- | ------ |
| 4   | Proper data table for tickets     | `tickets/page.tsx`, new table component | 1 day   | ★★★★☆  |
| 5   | Kanban board view toggle          | New `ticket-board.tsx` component        | 1 day   | ★★★★☆  |
| 6   | Page transition animations        | `dashboard/layout.tsx`, all pages       | 0.5 day | ★★★☆☆  |
| 7   | Avatar component with role colors | New `ui/avatar.tsx`, all user displays  | 0.5 day | ★★★☆☆  |
| 8   | Shimmer skeletons + `loading.tsx` | `ui/skeleton.tsx`, new loading files    | 0.5 day | ★★★☆☆  |
| 9   | Data table for users              | `users/page.tsx`                        | 0.5 day | ★★★☆☆  |

### P2 — Medium Priority

These round out the experience for power users.

| #   | Item                               | Files Affected                     | Effort  | Impact |
| --- | ---------------------------------- | ---------------------------------- | ------- | ------ |
| 10  | Profile/Settings page              | New route + components             | 1 day   | ★★★☆☆  |
| 11  | Onboarding checklist               | New component + dashboard page     | 0.5 day | ★★★☆☆  |
| 12  | Property detail tabs + header      | `properties/[propertyId]/page.tsx` | 1 day   | ★★★☆☆  |
| 13  | Empty state illustrations          | SVG assets + all empty states      | 0.5 day | ★★☆☆☆  |
| 14  | Notification grouping + animations | `notifications/page.tsx`           | 0.5 day | ★★☆☆☆  |
| 15  | Consistent card hover effects      | `ui/card.tsx` + dashboard pages    | 0.5 day | ★★☆☆☆  |
| 16  | Tooltips across dashboard          | All dashboard pages                | 0.5 day | ★★☆☆☆  |

### P3 — Nice to Have

Polish items that complete the premium feel.

| #   | Item                               | Files Affected                          | Effort   | Impact |
| --- | ---------------------------------- | --------------------------------------- | -------- | ------ |
| 17  | Date range filters                 | Tickets page, new date picker component | 0.5 day  | ★★☆☆☆  |
| 18  | Export to CSV/PDF                  | Tickets page, new export utils          | 0.5 day  | ★★☆☆☆  |
| 19  | Favicon + OG images                | Public assets, layout metadata          | 0.5 day  | ★★☆☆☆  |
| 20  | Keyboard shortcuts system          | New hook + shortcuts modal              | 0.5 day  | ★★☆☆☆  |
| 21  | Breadcrumb dropdown navigation     | `dashboard-layout.tsx`                  | 0.5 day  | ★☆☆☆☆  |
| 22  | Server Components refactor         | All dashboard pages                     | 1-2 days | ★★☆☆☆  |
| 23  | Custom 404 pages                   | New `not-found.tsx` files               | 0.5 day  | ★☆☆☆☆  |
| 24  | Real-time updates (WebSocket/SSE)  | Backend + frontend hooks                | 2-3 days | ★★★☆☆  |
| 25  | Microinteractions (confetti, etc.) | Action buttons, status changes          | 0.5 day  | ★☆☆☆☆  |

---

## Estimated Total Effort

| Priority  | Items        | Total Effort    |
| --------- | ------------ | --------------- |
| P0        | 3 items      | ~2-3 days       |
| P1        | 6 items      | ~4 days         |
| P2        | 7 items      | ~4 days         |
| P3        | 9 items      | ~7-9 days       |
| **Total** | **25 items** | **~17-20 days** |

---

## New Dependencies Needed

| Package                   | Purpose                       | Size   |
| ------------------------- | ----------------------------- | ------ |
| `recharts`                | Charts and data visualization | ~200KB |
| `cmdk`                    | Command palette               | ~8KB   |
| `@radix-ui/react-tooltip` | Tooltips                      | ~12KB  |
| `react-day-picker`        | Date range picker             | ~30KB  |
| `@tanstack/react-table`   | Data tables                   | ~50KB  |

All are widely used, well-maintained, and have good tree-shaking support.

---

## Summary

The landing page sets a high bar. The dashboard needs to match it. The three highest-ROI changes are:

1. **Add charts to the dashboard** — transforms it from "empty scaffold" to "real product"
2. **Collapsible sidebar + command palette** — makes it feel like a professional tool
3. **Proper data tables with view toggles** — makes data management feel intentional rather than minimal

These three alone would dramatically shift the perceived quality of the application.
