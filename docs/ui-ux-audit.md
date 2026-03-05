# UI/UX Audit Report — Maintix Frontend

**Date:** March 4, 2026  
**Auditor:** Senior SaaS Product Designer & Frontend Architect  
**Scope:** `apps/web/` — Next.js 15 + React 19 + Tailwind v4 + shadcn/ui (new-york)  
**Severity Levels:** 🔴 Critical · 🟠 High · 🟡 Medium · 🟢 Low / Suggestion

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Architecture & Technology Stack](#2-architecture--technology-stack)
3. [Accessibility (A11y)](#3-accessibility-a11y)
4. [Information Architecture & Navigation](#4-information-architecture--navigation)
5. [Landing Page (Marketing)](#5-landing-page-marketing)
6. [Authentication Flow](#6-authentication-flow)
7. [Dashboard & Layout System](#7-dashboard--layout-system)
8. [Core Pages Audit](#8-core-pages-audit)
9. [Component Library & Design System](#9-component-library--design-system)
10. [Forms & Validation](#10-forms--validation)
11. [Data Fetching & Loading States](#11-data-fetching--loading-states)
12. [Typography & Color System](#12-typography--color-system)
13. [Responsive Design & Mobile](#13-responsive-design--mobile)
14. [Performance](#14-performance)
15. [Dark Mode](#15-dark-mode)
16. [Error Handling & Empty States](#16-error-handling--empty-states)
17. [Prioritized Action Items](#17-prioritized-action-items)

---

## 1. Executive Summary

Maintix has a **strong foundation** — the tech stack is modern (Next.js 15, React 19, Tailwind v4, shadcn/ui new-york, TanStack Query), the codebase is well-organized, and the landing page has impressive visual polish with Magic UI animations. However, the **dashboard experience lags significantly behind the landing page in design quality and UX polish**. The gap between the marketing-grade landing page and the functionally-adequate-but-bare dashboard creates a trust deficit once a user logs in.

### Scores (out of 10)

| Category | Score | Notes |
|---|---|---|
| Visual Design (Landing) | **8.5** | Polished, modern SaaS aesthetic with quality animations |
| Visual Design (Dashboard) | **5.0** | Functional but plain; stark contrast to landing page |
| Accessibility | **6.0** | Good basics (skip-link, aria-labels on landing), gaps in dashboard |
| Responsive Design | **7.0** | Mobile nav and sidebar handled, but tables/lists need work |
| Component Consistency | **6.5** | shadcn/ui base is solid; custom variants inconsistent |
| Data & Loading UX | **7.0** | Skeleton loaders present; polling for notifications is good |
| Forms & Validation | **7.5** | Zod + react-hook-form properly integrated |
| Error Handling | **5.5** | Basic toast errors; no error boundaries or recovery flows |
| Performance | **6.5** | Landing page heavy; dashboard reasonably lean |
| Dark Mode | **7.5** | Well-implemented via CSS variables; minor contrast issues |

**Overall: 6.7 / 10** — Solid engineering, needs UX polish and design consistency.

---

## 2. Architecture & Technology Stack

### What's Working Well

- **Monorepo structure** with `@maintix/shared-types` ensures type consistency between frontend and backend
- **Tailwind v4** with CSS `@theme` directive is a forward-looking choice
- **shadcn/ui (new-york)** provides a mature component foundation
- **TanStack Query** with proper `staleTime`, retry logic, and infinite queries
- **Zod validation schemas** shared between forms ensure consistency
- **Clean file organization** — hooks, contexts, lib, components, and pages are well-separated

### Concerns

| ID | Severity | Issue |
|---|---|---|
| ARCH-01 | 🟡 | All pages are `'use client'` — no Server Components used anywhere. The entire app tree is client-rendered, defeating Next.js 15 RSC benefits (smaller bundles, faster TTFB, SEO for dashboard routes) |
| ARCH-02 | 🟡 | Auth state is stored in `localStorage` with no refresh token mechanism. Token expiry will silently fail until the next API call |
| ARCH-03 | 🟢 | `QueryClient` is created inline in `Providers` with `useState` — correct pattern, well done |
| ARCH-04 | 🟡 | No `error.tsx` or `not-found.tsx` for route-level error handling at `app/` root level |

---

## 3. Accessibility (A11y)

### Strengths

- ✅ Skip-to-content link on the landing page (`<a href="#main" className="sr-only ...">`)
- ✅ `aria-label` on mobile hamburger menu toggle with `aria-expanded`
- ✅ `aria-hidden="true"` on decorative elements (glow orbs, dot patterns)
- ✅ `aria-label` on social links (GitHub, Twitter icons)
- ✅ `lang="en"` on `<html>` element
- ✅ `focus-visible` ring styles on buttons and links throughout the landing page

### Issues

| ID | Severity | Issue | Location |
|---|---|---|---|
| A11Y-01 | 🔴 | **No `<title>` per-page** — all dashboard pages inherit the root metadata title "Maintix — Multi-Property Maintenance Platform". Each page should have a unique title (e.g., "Tickets — Maintix") for screen readers and browser tabs | `app/dashboard/**/page.tsx` |
| A11Y-02 | 🔴 | **No heading hierarchy in dashboard pages.** Every page uses `<h1>` but sidebar doesn't use proper landmarks. Dashboard layout should use `<nav>`, `<main>`, `<aside>` semantic elements | `dashboard-layout.tsx` |
| A11Y-03 | 🟠 | **Ticket list items are wrapped in `<Link>` but the inner `<div>` has no role or accessible name.** The click target is the entire row, but screen readers just see the raw text dump without structure | `tickets/page.tsx` |
| A11Y-04 | 🟠 | **Mobile sidebar overlay `div` has no `role="dialog"` or `aria-label`**, and clicking the overlay to close is keyboard-inaccessible (no Escape key handler) | `dashboard-layout.tsx` |
| A11Y-05 | 🟠 | **Notification unread badge** (`<span>` with count) has no `aria-label` — screen readers will read the raw number without context | `dashboard-layout.tsx` |
| A11Y-06 | 🟡 | **Color-only status indicators** — Priority dots (colored circles) convey meaning through color alone. Add `aria-label` or visually-hidden text like "Urgent priority" | `tickets/page.tsx` |
| A11Y-07 | 🟡 | **`CardTitle` renders as `<div>`** — should be a heading element (`<h2>`, `<h3>`) for proper document outline | `ui/card.tsx` |
| A11Y-08 | 🟡 | **Toast notifications** appear visually but need `role="status"` or `aria-live="polite"` verification (the Radix toast component likely handles this, but confirm) | `ui/toaster.tsx` |
| A11Y-09 | 🟡 | **Loading spinner** has no accessible text. Add `<span className="sr-only">Loading...</span>` | `auth-guard.tsx`, `page.tsx` |
| A11Y-10 | 🟢 | **Emoji used in notifications** — `🔧`, `✅`, `🆕`, `⚡`, `📅` are marked `aria-hidden` on the landing page `NotificationItem`. Good. |

---

## 4. Information Architecture & Navigation

### Dashboard Navigation Structure

```
Dashboard (/)
├── Properties (/properties)
│   └── Property Detail (/properties/:id) — members, categories, tickets
├── Tickets (/tickets)
│   └── Ticket Detail (/tickets/:id) — status actions, assignment  
├── Users (/users) — manager-only
└── Notifications (/notifications)
```

### Issues

| ID | Severity | Issue |
|---|---|---|
| NAV-01 | 🟠 | **No breadcrumbs** on detail pages. When a user navigates to `/dashboard/tickets/TK-123`, there's only a back button (`router.back()`). If they landed via direct link, `router.back()` goes to the browser's previous page (could be external). Should use explicit `<Link href="/dashboard/tickets">` as breadcrumb |
| NAV-02 | 🟠 | **Tickets require a property selection first**, but there's no deep-link from dashboard stats to pre-filtered tickets. The "Open Tickets" card on the dashboard shows "—" with "Select a property to view" — this is a dead end |
| NAV-03 | 🟡 | **Sidebar doesn't show active state for nested routes** like `/dashboard/properties/abc-123`. The `isActive` logic checks `pathname.startsWith(item.href)` which works, but the visual indicator (only `bg-primary/10`) is subtle |
| NAV-04 | 🟡 | **No search functionality** — for a maintenance platform with many tickets, there's no global search or ticket search |
| NAV-05 | 🟡 | **Notification bell in header** lacks a tooltip or count context. The badge appears but there's no dropdown preview — clicking goes to a full page. Consider a popover for quick triage |
| NAV-06 | 🟢 | **Footer links** (Documentation, Support, Status, Privacy, Terms) all point to `#` — placeholder links should be addressed before launch |

---

## 5. Landing Page (Marketing)

### Strengths

The landing page is the strongest part of the frontend. It demonstrates a professional SaaS-grade marketing presence:

- ✅ **Hero section** — animated word rotation, gradient text, parallax scroll, shiny badge, dot pattern background
- ✅ **Dashboard mockup** — borderbeam effect, realistic UI preview with ticket data
- ✅ **Stats strip** — `NumberTicker` animated counters
- ✅ **Bento feature grid** — well-structured with `ShineBorder`, animated list, and color-coded icons
- ✅ **Pricing section** — 3-tier layout with highlighted middle tier
- ✅ **CTA section** — ripple effect background, strong contrast
- ✅ **Trust marquee** — auto-scrolling feature badges
- ✅ **Smooth scroll** with hash navigation
- ✅ **Authenticated redirect** — auto-redirects logged-in users to dashboard

### Issues

| ID | Severity | Issue |
|---|---|---|
| LP-01 | 🟠 | **1,274 lines in a single `page.tsx`** — this is a maintenance nightmare. Extract into composable sections: `HeroSection`, `FeaturesSection`, `PricingSection`, `CTASection`, `Footer` |
| LP-02 | 🟠 | **Bundle size** — the landing page imports `framer-motion`, 10+ Magic UI components, `lucide-react` icons. This is a marketing page that should be fast. Consider: (1) lazy-loading below-fold sections, (2) dynamic imports for heavy animation components |
| LP-03 | 🟡 | **Hero parallax** (`useTransform`) creates imperceptible value on mobile (small viewport). Disable on mobile via `useMediaQuery` or `prefers-reduced-motion` |
| LP-04 | 🟡 | **Pricing links** — "Contact Sales" for Enterprise tier links to `#`, which scrolls to top. Should open a form or link to an email |
| LP-05 | 🟡 | **No `prefers-reduced-motion` support** — the page has 8+ separate animations (float, glow-pulse, shimmer, gradient-shift, marquee, border-beam, ripple, blur-fade). Users who prefer reduced motion get all of them |
| LP-06 | 🟢 | **Emoji in notification mock** (`🔧`, `✅`) — consider SVG icons for consistency with the rest of the design system (the skill guidelines note: "Use SVG icons, not emojis") |
| LP-07 | 🟢 | **Social proof** — the stats (500+ tickets, 98% satisfaction) appear fabricated for a beta product. Consider replacing with "Join N+ teams on the waitlist" or removing until real data is available |

---

## 6. Authentication Flow

### Current Flow

1. User visits `/login` → Card with email/password form
2. On submit → `POST /auth/login` → receives `accessToken`
3. Token stored in `localStorage` → fetch `/users/me` → set user state
4. Redirect to `/dashboard`

### Issues

| ID | Severity | Issue |
|---|---|---|
| AUTH-01 | 🔴 | **No "Forgot Password" link** — a login form without password recovery is a user-blocking gap |
| AUTH-02 | 🔴 | **No registration flow** — the landing page has "Get Started" and "Start Free" CTAs that link to `/login`, but there's no sign-up form. Users cannot self-onboard |
| AUTH-03 | 🟠 | **No "Remember Me" option** — tokens persist in `localStorage` forever with no explicit expiry. If the server token expires, the user hits a silent failure on the next API call with no graceful re-auth flow |
| AUTH-04 | 🟠 | **Token in `localStorage`** is vulnerable to XSS. Consider `httpOnly` cookies set by the backend for the access token |
| AUTH-05 | 🟡 | **Login page is bare** — no branding aside from the "M" icon. The landing page has rich visuals, but the login page is a plain centered card. Add a split-screen or branded sidebar to maintain design continuity |
| AUTH-06 | 🟡 | **No password visibility toggle** — the password field is always masked, which is a minor usability friction |
| AUTH-07 | 🟡 | **Error message styling** — error banner uses `bg-error-50 text-error-600` which is good, but it lacks an icon and lacks animation (appears suddenly). Add a slide-in or fade animation and an `AlertCircle` icon |

---

## 7. Dashboard & Layout System

### Structure

```
DashboardLayout
├── Sidebar (w-64, fixed on mobile, static on lg+)
│   ├── Logo + name
│   ├── Navigation links (filtered by role)
│   └── User info + logout
├── Header (h-16)
│   ├── Mobile hamburger
│   ├── Spacer
│   └── Notifications bell
└── Main content (overflow-y-auto, p-4 lg:p-6)
```

### Strengths

- ✅ Role-based navigation filtering
- ✅ Mobile sidebar with overlay
- ✅ Notification badge with unread count
- ✅ User avatar with initials

### Issues

| ID | Severity | Issue |
|---|---|---|
| DASH-01 | 🟠 | **No page title in the header bar** — the header is mostly empty (just hamburger + bell). Showing the current page name (e.g., "Tickets", "Properties") gives users spatial orientation |
| DASH-02 | 🟠 | **Dashboard home page shows placeholder data** — "Open Tickets: —", "Pending Approval: —", "Team Members: —". These cards should either aggregate real data across all properties or be removed. Showing dashes is worse than showing nothing |
| DASH-03 | 🟠 | **Stark design contrast with landing page** — landing page uses gradients, animations, shine-borders, glassmorphism. Dashboard uses plain white cards with no personality. This "bait-and-switch" feeling hurts perceived quality. Consider: subtle gradient accents, hover microinteractions, or card border highlights in the dashboard |
| DASH-04 | 🟡 | **No ThemeToggle in dashboard** — the landing page navbar has it, but the dashboard header doesn't. Users who toggled to dark mode on the landing page may want to switch back in the dashboard |
| DASH-05 | 🟡 | **Sidebar close button** for mobile has no `aria-label` |
| DASH-06 | 🟡 | **Logout button** has no confirmation dialog — one click immediately logs out. For a SaaS with unsaved form state, consider a confirmation or at minimum a visual transition |
| DASH-07 | 🟡 | **Main content area** has `overflow-hidden` on the parent `flex-1 flex-col`, which could clip content unexpectedly on very long pages |
| DASH-08 | 🟢 | **No keyboard shortcut hints** — power users would benefit from `⌘K` for search, `⌘N` for new ticket, etc. |

---

## 8. Core Pages Audit

### 8.1 Properties Page (`/dashboard/properties`)

| ID | Severity | Issue |
|---|---|---|
| PROP-01 | 🟡 | **Property cards are minimal** — only show `name` and `address`. Add ticket count, member count, or last-activity timestamp for scan-ability |
| PROP-02 | 🟡 | **No confirmation before deleting** members from a property (`onRemoveMember` fires immediately). Add a confirmation dialog |
| PROP-03 | 🟢 | **Empty state is good** — role-aware messaging ("Create your first property" vs "Ask your manager") is excellent UX |

### 8.2 Tickets Page (`/dashboard/tickets`)

| ID | Severity | Issue |
|---|---|---|
| TKT-01 | 🟠 | **Property must be selected first** — the entire ticket list is hidden behind a property selector. If a manager oversees 20+ properties, they have to check each one individually. Add an "All properties" option or a global ticket view |
| TKT-02 | 🟠 | **No sorting options** — the hook supports `sortBy` and `sortDir` params, but the UI has no sort controls (by date, priority, status) |
| TKT-03 | 🟡 | **Ticket rows don't use a table** — they're stacked divs. For dense data like this, a proper `<table>` (or Tanstack Table) with column headers would be more scannable |
| TKT-04 | 🟡 | **"Load More" pagination** — the infinite query is wired up, but the UX is a manual "Load More" button. Consider infinite scroll or at least showing "Showing X of Y tickets" |
| TKT-05 | 🟡 | **Create ticket dialog** — `categoryId` uses a `Select` but isn't shown to the user as required (no asterisk). The schema requires it, so the error shows after submission only |
| TKT-06 | 🟡 | **No priority selector** in the create ticket form — tickets are created without a priority, but the API and listing UI support it |
| TKT-07 | 🟢 | **Status badges with config** (`statusConfig`) mapping is clean and extensible |

### 8.3 Ticket Detail Page (`/dashboard/tickets/:id`)

| ID | Severity | Issue |
|---|---|---|
| TD-01 | 🟠 | **No workflow timeline/history** — users can't see when status transitions happened, who assigned the ticket, or any activity log. For a 6-stage workflow, this is essential context |
| TD-02 | 🟡 | **Action buttons** have no loading state during mutations — the buttons don't disable or show spinners while the action is in progress. Only the "Cancel" and "Assign" dialogs handle `isSubmitting` |
| TD-03 | 🟡 | **No file attachments UI** — the `Ticket` type includes `attachments?: any[]`, but the detail page doesn't render them. Upload hooks exist in the API client (`api.upload`) but are unused |
| TD-04 | 🟡 | **Sidebar metadata** is cramped — "Category", "Priority", "Assigned To", "Last Updated" are stacked vertically in small text. Use a more spacious list with clear visual separation |

### 8.4 Users Page (`/dashboard/users`)

| ID | Severity | Issue |
|---|---|---|
| USR-01 | 🟡 | **No user editing or deactivation** — the page is create-only. There's no way to update a user's role, reset their password, or deactivate their account |
| USR-02 | 🟡 | **No filtering or search** on the users list. For organizations with many tenants, this will become unmanageable |
| USR-03 | 🟢 | **User initials avatar** is a nice touch. Consider adding a colored background based on the role |

### 8.5 Notifications Page (`/dashboard/notifications`)

| ID | Severity | Issue |
|---|---|---|
| NOTIF-01 | 🟡 | **No pagination** — the page loads notifications via a basic query, not an infinite query. If a user has hundreds of notifications, they all load at once |
| NOTIF-02 | 🟡 | **No notification categories or type filtering** — all notifications are identical in styling. Different types (assignment, status change, completion) should have distinct icons or colors |
| NOTIF-03 | 🟡 | **Clicking a notification** doesn't navigate to the related ticket. The `ticketId` exists on the notification object but isn't used for navigation |
| NOTIF-04 | 🟢 | **Polling at 15s/30s** is reasonable for near-real-time updates. Consider WebSocket/SSE for true real-time in future |

---

## 9. Component Library & Design System

### Inventory (21 components in `ui/`)

| Component | Source | Notes |
|---|---|---|
| `badge.tsx` | shadcn + custom `success`, `warning` variants | ✅ Extended correctly |
| `button.tsx` | shadcn standard | ✅ Good |
| `card.tsx` | shadcn standard | ⚠️ `CardTitle` renders as `<div>` |
| `dialog.tsx` | shadcn (Radix) | ✅ Good |
| `input.tsx` | shadcn standard | ✅ Good |
| `label.tsx` | shadcn (Radix) | ✅ Good |
| `select.tsx` | shadcn (Radix) | ✅ Good |
| `skeleton.tsx` | shadcn standard | ✅ Good |
| `textarea.tsx` | shadcn standard | ✅ Assumed present |
| `toast.tsx` + `toaster.tsx` | shadcn (Radix) | ✅ Good |
| `animated-list.tsx` | Magic UI | Landing page only |
| `animated-shiny-text.tsx` | Magic UI | Landing page only |
| `blur-fade.tsx` | Magic UI | Landing page only |
| `border-beam.tsx` | Magic UI | Landing page only |
| `dot-pattern.tsx` | Magic UI | Landing page only |
| `marquee.tsx` | Magic UI | Landing page only |
| `number-ticker.tsx` | Magic UI | Landing page only |
| `ripple.tsx` | Magic UI | Landing page only |
| `shine-border.tsx` | Magic UI | Landing page only |
| `word-rotate.tsx` | Magic UI | Landing page only |

### Issues

| ID | Severity | Issue |
|---|---|---|
| DS-01 | 🟠 | **10 of 21 components are landing-page-only animations.** The dashboard uses exactly 0 Magic UI components. This creates the design gap described in DASH-03. Consider using `BlurFade` for page transitions or `AnimatedList` for notification feeds in the dashboard |
| DS-02 | 🟡 | **Missing common components** — no `Table`, `Tabs` (imported but unused in package.json deps), `Tooltip`, `Avatar`, `Popover`, `DropdownMenu`, `Sheet` (for mobile sidebar). These are needed for a complete dashboard experience |
| DS-03 | 🟡 | **No `DataTable` component** — the ticket list, users list, and members list all use ad-hoc card/div rendering. A shared `DataTable` with sorting, filtering, and pagination would reduce boilerplate and improve consistency |
| DS-04 | 🟡 | **No `EmptyState` component** — every page reimplements the empty state pattern (icon + heading + description + optional CTA). Extract a shared `<EmptyState icon={…} title={…} description={…} action={…} />` component |
| DS-05 | 🟡 | **No `PageHeader` component** — every page repeats the same `<h1>` + `<p>` + action button layout. Extract a shared `<PageHeader title={…} description={…} actions={…} />` |
| DS-06 | 🟢 | **`cn()` utility** is correctly implemented with `clsx` + `tailwind-merge`. Good foundation |

---

## 10. Forms & Validation

### Strengths

- ✅ **Zod schemas** with descriptive error messages (`"Title must be at least 3 characters"`)
- ✅ **react-hook-form** with `zodResolver` — properly integrated on all forms
- ✅ **`isSubmitting` state** used to disable submit buttons during async operations
- ✅ **Inline error styling** with `text-error-500` below each field

### Issues

| ID | Severity | Issue |
|---|---|---|
| FORM-01 | 🟠 | **No required field indicators** — none of the forms show asterisks or (required) labels on mandatory fields. Users have to submit and wait for validation errors |
| FORM-02 | 🟡 | **Error text inconsistency** — some errors use `text-sm text-error-500` (login, tickets), while users page uses `text-xs text-error-500`. Should be standardized |
| FORM-03 | 🟡 | **No success feedback on form submission** — toast appears, but the dialog closes instantly. Consider a brief success state before closing |
| FORM-04 | 🟡 | **Password requirements** not displayed upfront — the schema requires 8+ chars, uppercase, and number, but the Login form doesn't show these rules. Users only learn them on error |
| FORM-05 | 🟡 | **Select components in forms** use `onValueChange` with `setValue()` but don't register with `react-hook-form` via `Controller`. This means they won't show as "dirty" or participate in form state properly |
| FORM-06 | 🟢 | **Textarea for ticket description** has `rows={4}` — consider making it auto-resizing for long descriptions |

---

## 11. Data Fetching & Loading States

### Strengths

- ✅ **TanStack Query** with `staleTime: 30s` — good balance between freshness and request volume
- ✅ **401/403 retry prevention** in `QueryClient` config — avoids retry loops on auth failures
- ✅ **Skeleton loaders** on all list pages (tickets, properties, users, notifications)
- ✅ **Infinite query** for tickets with cursor-based pagination
- ✅ **Notification polling** at 15s (unread count) and 30s (list) intervals
- ✅ **Optimistic query invalidation** on all mutations

### Issues

| ID | Severity | Issue |
|---|---|---|
| DATA-01 | 🟠 | **No global error handler for 401s** — if the token expires mid-session, each API call independently fails. There's no interceptor to detect 401 and redirect to `/login` with a "Session expired" message |
| DATA-02 | 🟡 | **No optimistic updates** — all mutations wait for server response before updating cache. For actions like "Mark as Read" on notifications, optimistic updates would feel instant |
| DATA-03 | 🟡 | **Query key consistency** — ticket detail uses `['tickets', 'detail', id]` but `useTickets` uses `['tickets', propertyId, params]`. The invalidation in mutations uses `queryKey: ['tickets']` which invalidates everything broadly. This works but is blunt |
| DATA-04 | 🟡 | **Skeleton sizing is arbitrary** — `Skeleton className="h-[72px]"` doesn't match actual ticket row heights. Skeleton shapes should mirror real content dimensions |
| DATA-05 | 🟢 | **No prefetching** — hovering over a ticket link could trigger `queryClient.prefetchQuery` for the ticket detail, making navigation feel instant |

---

## 12. Typography & Color System

### Typography

- **Display font:** DM Sans (400–800) via `--font-display`
- **Body font:** DM Sans (400–700) via `--font-sans`
- **Note:** Both display and body resolve to the same font (DM Sans). The comment says "Satoshi-like geometric sans via Outfit" for display, but the code loads DM Sans for both. This is technically a single-font system, not a pairing.

### Color System

A well-structured token system:

```
Primary:   Indigo (50–950) — #6366f1 base
Neutral:   Gray (50–950)
Accent:    Emerald 400/500
Success:   Green 50/500/600
Warning:   Amber 50/500/600
Error:     Red 50/500/600
```

### Issues

| ID | Severity | Issue |
|---|---|---|
| TYPE-01 | 🟡 | **Font loading duplication** — `layout.tsx` loads DM Sans twice (once as `display`, once as `body`) with the same configuration. This may download two identical font requests. Use a single declaration with all needed weights |
| TYPE-02 | 🟡 | **No font pairing** — the comments suggest display/body differentiation, but both are DM Sans. Consider using Inter or Geist for body text to create visual hierarchy |
| TYPE-03 | 🟡 | **Line length not constrained** — on wide screens, description text in ticket detail and forms can stretch 120+ characters per line. Add `max-w-prose` or `max-w-2xl` to text containers |
| TYPE-04 | 🟢 | **Body text size** — dashboard uses `text-sm` (14px) for most content, which is acceptable for data-dense UIs but pushes the lower boundary of readability |
| COLOR-01 | 🟡 | **Dark mode primary color** changes from `primary-600` (light) to `primary-400` (dark). This is correct lightness inversion, but the dark mode card background (`#18181b`) with `primary-400` text (`#818cf8`) has 5.2:1 contrast — passes AA but is barely comfortable for long reading |
| COLOR-02 | 🟢 | **Semantic color tokens** (`--background`, `--foreground`, etc.) are properly mapped in both `:root` and `.dark` — well implemented |

---

## 13. Responsive Design & Mobile

### Strengths

- ✅ Mobile sidebar with overlay pattern
- ✅ Stacked grid layouts (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`)
- ✅ Mobile menu on landing page with `AnimatePresence`-style transitions
- ✅ `hidden sm:flex` for dashboard mockup sidebar (correctly hidden on small screens)

### Issues

| ID | Severity | Issue |
|---|---|---|
| RWD-01 | 🟠 | **Ticket filter controls** — three `<Select>` side by side (`w-[200px]`, `w-[160px]`, `w-[140px]`) will overflow on screens < 540px despite `flex-wrap`. The fixed widths are problematic; use `min-w-0 flex-1` or a collapsible filter panel on mobile |
| RWD-02 | 🟡 | **Property detail two-column layout** (`lg:grid-cols-2`) jumps from single-column to two at the `lg` breakpoint. On tablet (`md`), the page is a single long scroll. Consider `md:grid-cols-2` |
| RWD-03 | 🟡 | **Ticket detail sidebar** (`lg:grid-cols-3`) — the metadata sidebar collapses below the main content on smaller screens, which buries important context. Consider making it a sticky top bar on mobile |
| RWD-04 | 🟡 | **Landing page stat strip** — `grid-cols-3` forces three columns even on very small screens. The numbers, labels, and sub-text can get cramped below 380px |
| RWD-05 | 🟢 | **`overflow-x-hidden`** on the landing page root prevents horizontal scroll from background decorations. Good practice |

---

## 14. Performance

### Issues

| ID | Severity | Issue |
|---|---|---|
| PERF-01 | 🟠 | **Landing page JavaScript weight** — imports `framer-motion` (~40KB gzipped), 10 Magic UI components, `@tanstack/react-query`, and `lucide-react`. For a marketing page, this is heavy. Split into dynamic imports: `const Marquee = dynamic(() => import('@/components/ui/marquee'))` |
| PERF-02 | 🟠 | **All pages are CSR** (`'use client'`) — the dashboard could benefit from Server Components for the initial HTML shell (layout, sidebar). The data-fetching pages can remain client components |
| PERF-03 | 🟡 | **No image optimization** — `next.config.ts` configures `remotePatterns` for Supabase storage, but no images are actually used in the UI. When they are (upload attachments, user avatars), ensure `<Image>` from `next/image` is used |
| PERF-04 | 🟡 | **CSS includes 300 lines** of custom keyframes, glass effects, noise textures, and gradient borders primarily for the landing page. These ship to all routes including the dashboard. Consider code-splitting the CSS or moving landing-specific styles into the page component |
| PERF-05 | 🟡 | **Multiple `useEffect` for scroll listeners** on the landing page (3 separate) — consolidate into a single listener for efficiency |
| PERF-06 | 🟢 | **`will-change-transform`** correctly applied to animated glow orbs. Good compositing hint |

---

## 15. Dark Mode

### Implementation

- `next-themes` with `attribute="class"` and `defaultTheme="system"` — ✅ correct approach
- `suppressHydrationWarning` on `<html>` — ✅ prevents flash
- CSS variables swap in `.dark {}` block — ✅ well-structured

### Issues

| ID | Severity | Issue |
|---|---|---|
| DM-01 | 🟡 | **Dashboard cards** use `bg-card` which maps to `#ffffff` (light) / `#18181b` (dark). The dark mode cards lack depth — they look flat against the `#09090b` background. Consider `bg-card/80` with a subtle border or adding a `shadow-sm` inset |
| DM-02 | 🟡 | **Landing page** has extensive dark mode overrides (`dark:bg-[#0c0c0f]`, `dark:border-white/[0.08]`, `dark:text-white/80`) — these are well-crafted, but the dashboard gets none of these refinements |
| DM-03 | 🟢 | **Notification unread state** uses `bg-primary/[0.02]` in dark mode which is nearly invisible. Bump to `bg-primary/[0.06]` |
| DM-04 | 🟢 | **Error states** (`bg-error-50 text-error-600`) don't have dark mode variants. In dark mode, `bg-error-50` (#fef2f2) will look jarring against the dark background |

---

## 16. Error Handling & Empty States

### Empty States

All key pages have empty states — ✅ this is above average for early-stage SaaS:

| Page | Has Empty State | Quality |
|---|---|---|
| Properties | ✅ | Good — role-aware messaging |
| Tickets | ✅ | Good — "Select a property" prompt |
| Users | ✅ | Good — includes CTA to create first user |
| Notifications | ✅ | Good — "All caught up" positive framing |
| Ticket Detail | ✅ | Has "not found" fallback |
| Property Detail | ✅ | Has "not found" fallback |

### Issues

| ID | Severity | Issue |
|---|---|---|
| ERR-01 | 🔴 | **No `error.tsx` boundary** — there is no error boundary at `app/dashboard/error.tsx` or `app/error.tsx`. An unhandled exception in any page component will show Next.js's default error overlay in dev and a blank screen in production |
| ERR-02 | 🟠 | **No `not-found.tsx`** for dynamic routes — navigating to `/dashboard/tickets/nonexistent-id` shows a loading skeleton, then a "not found" card inside the page component. But navigating to `/dashboard/nonexistent-path` has no handler |
| ERR-03 | 🟠 | **API errors are caught but not differentiated** — all mutation errors show the same toast pattern (`title: 'Error', description: message`). Different error types should have different treatments: validation errors (inline), auth errors (redirect), server errors (retry prompt) |
| ERR-04 | 🟡 | **Silent error in notification "mark as read"** — the catch block is empty (`/* silent */`). At minimum, log to console or show a subtle indicator |
| ERR-05 | 🟡 | **No network error handling** — if the user goes offline, API calls will fail with network errors that show as generic "An error occurred" toasts. Detect `navigator.onLine` and show an offline banner |

---

## 17. Prioritized Action Items

### 🔴 Critical (Block launch / major user impact)

| # | Item | Effort |
|---|---|---|
| 1 | Add registration/sign-up flow (landing → onboard) | L |
| 2 | Add "Forgot Password" to login page | M |
| 3 | Add `error.tsx` error boundaries at `app/` and `app/dashboard/` levels | S |
| 4 | Add unique `<title>` metadata per dashboard page | S |

### 🟠 High (Significant quality issues)

| # | Item | Effort |
|---|---|---|
| 5 | Add global 401 interceptor to redirect to login with "Session expired" | S |
| 6 | Add breadcrumbs on all detail pages | S |
| 7 | Add "All Properties" option to ticket list (or an overview-level global ticket page) | M |
| 8 | Bridge the design gap between landing page and dashboard (add subtle animations, card refinements, gradient accents) | M |
| 9 | Extract landing page into section components (reduce 1,274-line file) | M |
| 10 | Add semantic HTML landmarks to dashboard layout (`<nav>`, `<aside>`, `<main>`) | S |
| 11 | Add sorting to ticket list (date, priority, status) | M |
| 12 | Add ticket activity timeline / history log | L |
| 13 | Add mobile-accessible sidebar (keyboard Escape to close, `role="dialog"`, focus trap) | S |

### 🟡 Medium (Polish & best practices)

| # | Item | Effort |
|---|---|---|
| 14 | Add ThemeToggle to dashboard header | S |
| 15 | Add header page title to dashboard layout | S |
| 16 | Add `prefers-reduced-motion` support to all animations | S |
| 17 | Create shared `<EmptyState>`, `<PageHeader>`, `<DataTable>` components | M |
| 18 | Add required field indicators (* or label suffix) to all forms | S |
| 19 | Fix `CardTitle` to render as heading elements | S |
| 20 | Add loading states to individual action buttons on ticket detail page | S |
| 21 | Make notifications clickable (link to related ticket) | S |
| 22 | Add search to ticket list and users list | M |
| 23 | Add notification type icons and filtering | M |
| 24 | Add `sr-only` loading text to all spinner elements | S |
| 25 | Fix font loading — single DM Sans declaration instead of two identical ones | S |
| 26 | Constrain line length on description/text blocks (`max-w-prose`) | S |
| 27 | Add dark mode variants for error/warning backgrounds | S |

### 🟢 Low / Future

| # | Item | Effort |
|---|---|---|
| 28 | Add keyboard shortcuts (⌘K search, ⌘N new ticket) | M |
| 29 | Add real-time updates via WebSocket/SSE | L |
| 30 | Add file attachment upload/display in ticket detail | M |
| 31 | Add user editing/deactivation in user management | M |
| 32 | Add confirmation dialogs for destructive actions (remove member, logout) | S |
| 33 | Add query prefetching on hover for detail pages | S |
| 34 | Replace social proof stats with real data or waitlist count | S |
| 35 | Add notification popover in header for quick triage | M |

**Effort Key:** S = Small (< 2hr), M = Medium (2–8hr), L = Large (8hr+)

---

## Appendix: File Reference

| Area | Key Files |
|---|---|
| Root Layout | `app/layout.tsx` |
| Global Styles | `app/globals.css` (301 lines) |
| Landing Page | `app/page.tsx` (1,274 lines) |
| Login | `app/login/page.tsx` |
| Dashboard Layout | `components/dashboard-layout.tsx` |
| Auth Guard | `components/auth-guard.tsx` |
| Auth Context | `contexts/auth-context.tsx` |
| API Client | `lib/api-client.ts` |
| Validations | `lib/validations.ts` |
| Ticket Config | `lib/ticket-config.ts` |
| Providers | `components/providers.tsx` |
| UI Components | `components/ui/*.tsx` (21 files) |
| Hooks | `hooks/use-*.ts` (6 files) |
| Dashboard Pages | `app/dashboard/**/page.tsx` (7 pages) |

---

*End of audit. This report covers 35 actionable items prioritized by severity and effort. Focus on the 4 critical items first, then work through the high-priority list to bring the dashboard experience in line with the landing page's quality bar.*
