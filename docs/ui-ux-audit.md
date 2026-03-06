# UI/UX Audit Report — Maintix Frontend

**Date:** March 4, 2026  
**Last Updated:** July 2, 2025  
**Auditor:** Senior SaaS Product Designer & Frontend Architect  
**Scope:** `apps/web/` — Next.js 15 + React 19 + Tailwind v4 + shadcn/ui (new-york)  
**Severity Levels:** 🔴 Critical · 🟠 High · 🟡 Medium · 🟢 Low / Suggestion  
**Status Key:** ✅ Fixed · ⚠️ Partially Fixed · ❌ Open

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

Maintix has a **strong foundation** — the tech stack is modern (Next.js 15, React 19, Tailwind v4, shadcn/ui new-york, TanStack Query), the codebase is well-organized, and the landing page has impressive visual polish with Magic UI animations. Since the initial audit, **significant improvements** have been made: the dashboard now features gradient accents, hover animations, and design polish; semantic HTML landmarks, ARIA attributes, and keyboard accessibility have been added; a command palette, search, sorting, and activity timeline are fully implemented; and file uploads with drag-and-drop + progress indicators are complete.

The remaining gaps are primarily around **missing auth flows** (forgot password, registration), **per-page metadata titles**, **root-level error boundaries**, and a few **form UX enhancements**.

### Scores (out of 10)

| Category                  | Score             | Notes                                                           |
| ------------------------- | ----------------- | --------------------------------------------------------------- |
| Visual Design (Landing)   | **8.5**           | Polished, modern SaaS aesthetic with quality animations         |
| Visual Design (Dashboard) | **5.0** → **8.0** | Gradient accents, hover animations, card polish added           |
| Accessibility             | **6.0** → **8.0** | Semantic landmarks, ARIA dialogs, sr-only text, focus traps     |
| Responsive Design         | **7.0** → **8.0** | Filter rows wrap, grids stack, mobile sidebar has focus trap    |
| Component Consistency     | **6.5** → **7.5** | Progress bar, upload dropzone, activity timeline added          |
| Data & Loading UX         | **7.0** → **8.5** | Skeleton loaders, empty states, 401 handler, smart retry logic  |
| Forms & Validation        | **7.5** → **8.0** | Required field asterisks, inline errors, form reset on success  |
| Error Handling            | **5.5** → **7.0** | Dashboard error.tsx exists; root error.tsx still missing        |
| Performance               | **6.5**           | No dynamic imports; useMemo in key spots; needs Image component |
| Dark Mode                 | **7.5** → **9.0** | Comprehensive CSS variable palette, semantic tokens throughout  |

**Overall: 6.7 → 8.0 / 10** — Major improvements across dashboard design, accessibility, and data UX. Remaining work is focused on auth flows, error boundaries, and performance optimization.

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

| ID      | Severity | Status | Issue                                                                                                                                                                                                 |
| ------- | -------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ARCH-01 | 🟡       | ❌     | All pages are `'use client'` — no Server Components used anywhere. The entire app tree is client-rendered, defeating Next.js 15 RSC benefits (smaller bundles, faster TTFB, SEO for dashboard routes) |
| ARCH-02 | 🟡       | ⚠️     | Auth state is stored in `localStorage` with no refresh token mechanism. **Mitigated**: global 401 handler now dispatches `auth:session-expired` event and redirects to login                          |
| ARCH-03 | 🟢       | ✅     | `QueryClient` is created inline in `Providers` with `useState` — correct pattern, well done                                                                                                           |
| ARCH-04 | 🟡       | ⚠️     | `app/dashboard/error.tsx` ✅ exists. **Still missing**: root `app/error.tsx` and `app/not-found.tsx`                                                                                                  |

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

| ID      | Severity | Status | Issue                                                                                                                                                                                 | Location                    |
| ------- | -------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| A11Y-01 | 🔴       | ❌     | **No `<title>` per-page** — all dashboard pages inherit the root metadata title. Each page should have a unique title (e.g., "Tickets — Maintix") for screen readers and browser tabs | `app/dashboard/**/page.tsx` |
| A11Y-02 | 🔴       | ✅     | ~~No heading hierarchy in dashboard pages.~~ **FIXED**: Dashboard layout now uses `<aside>`, `<nav>`, `<header>`, `<main>` semantic elements with proper landmark structure           | `dashboard-layout.tsx`      |
| A11Y-03 | 🟠       | ⚠️     | **Ticket list items in `<Link>`** — semantic text content (title, category, author) present but no explicit `role` attribute on inner div                                             | `tickets/page.tsx`          |
| A11Y-04 | 🟠       | ✅     | ~~Mobile sidebar overlay has no `role="dialog"`.~~ **FIXED**: Has `role="dialog"`, `aria-modal="true"`, `aria-label`, Escape key handler, and focus trap                              | `dashboard-layout.tsx`      |
| A11Y-05 | 🟠       | ✅     | ~~Notification unread badge has no `aria-label`.~~ **FIXED**: Badge now has `aria-label` with count context                                                                           | `dashboard-layout.tsx`      |
| A11Y-06 | 🟡       | ⚠️     | **Color-only priority dots** — animated pulse circles convey meaning through color alone. Status badge is separate, but priority dot has no `aria-label`                              | `tickets/page.tsx`          |
| A11Y-07 | 🟡       | ✅     | ~~`CardTitle` renders as `<div>`.~~ **FIXED**: `CardTitle` now renders as `<h3>`                                                                                                      | `ui/card.tsx`               |
| A11Y-08 | 🟡       | ❌     | **Toast notifications** need `role="status"` or `aria-live="polite"` verification                                                                                                     | `ui/toaster.tsx`            |
| A11Y-09 | 🟡       | ✅     | ~~Loading spinner has no accessible text.~~ **FIXED**: Has `<span className="sr-only">Loading…</span>`                                                                                | `auth-guard.tsx`            |
| A11Y-10 | 🟢       | ✅     | **Emoji used in notifications** — marked `aria-hidden` on the landing page `NotificationItem`. Good.                                                                                  |                             |

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

| ID     | Severity | Status | Issue                                                                                                                                                                                                                               |
| ------ | -------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| NAV-01 | 🟠       | ❌     | **No breadcrumbs** on detail pages. Only a back button (`router.back()`). Should use explicit `<Link href="/dashboard/tickets">` as breadcrumb                                                                                      |
| NAV-02 | 🟠       | ✅     | ~~Tickets require a property selection first.~~ **FIXED**: Default is "All Properties" — users can see tickets across all properties or filter by one                                                                               |
| NAV-03 | 🟡       | ✅     | ~~Sidebar doesn't show active state for nested routes.~~ **FIXED**: Active state uses `bg-primary/10 text-primary` with proper `aria-current="page"` semantic attribute. Detects nested routes via `pathname.startsWith(item.href)` |
| NAV-04 | 🟡       | ✅     | ~~No search functionality.~~ **FIXED**: Ticket search with debounced `useDeferredValue`, plus global command palette (⌘K / Ctrl+K) via `cmdk` library with grouped navigation commands and property search                          |
| NAV-05 | 🟡       | ❌     | **Notification bell in header** lacks a tooltip or count context. Clicking goes to full page. Consider a popover for quick triage                                                                                                   |
| NAV-06 | 🟢       | ⚠️     | **Sidebar nav** has flat structure with no section headers/grouping ("Management", "Content" etc.). **Landing page footer** has proper 4-column layout (Brand, Product, Resources, Legal) with links                                |

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

| ID    | Severity | Status | Issue                                                                                                                                                                                    |
| ----- | -------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| LP-01 | 🟠       | ✅     | ~~1,274 lines in a single `page.tsx`.~~ **FIXED**: Split into 14 section components in `_components/` (hero, features, pricing, CTA, footer, etc.). Main `page.tsx` is now 94 lines      |
| LP-02 | 🟠       | ❌     | **Bundle size** — landing page imports `framer-motion`, 10+ Magic UI components. Consider lazy-loading below-fold sections and dynamic imports for heavy animation components            |
| LP-03 | 🟡       | ❌     | **Hero parallax** on mobile creates imperceptible value. Disable on mobile via `useMediaQuery` or `prefers-reduced-motion`                                                               |
| LP-04 | 🟡       | ❌     | **Pricing links** — "Contact Sales" for Enterprise tier links to `#`. Should open a form or link to an email                                                                             |
| LP-05 | 🟡       | ✅     | ~~No `prefers-reduced-motion` support.~~ **FIXED**: Complete `@media (prefers-reduced-motion: reduce)` block in `globals.css` zeroing animation/transition durations and scroll behavior |
| LP-06 | 🟢       | ❌     | **Emoji in notification mock** — consider SVG icons for consistency with the design system                                                                                               |
| LP-07 | 🟢       | ⚠️     | **Social proof** — trust badges/marquee present via `TRUST_ITEMS` constants. Stats (500+ tickets, 98% satisfaction) still appear fabricated for beta                                     |

---

## 6. Authentication Flow

### Current Flow

1. User visits `/login` → Card with email/password form
2. On submit → `POST /auth/login` → receives `accessToken`
3. Token stored in `localStorage` → fetch `/users/me` → set user state
4. Redirect to `/dashboard`

### Issues

| ID      | Severity | Issue |
| ------- | -------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| AUTH-01 | 🔴       | ❌    | **No "Forgot Password" link** — a login form without password recovery is a user-blocking gap                                                                                                    |
| AUTH-02 | 🔴       | ❌    | **No registration flow** — landing page "Get Started" and "Start Free" CTAs link to `/login`, but there's no sign-up form                                                                        |
| AUTH-03 | 🟠       | ❌    | **No "Remember Me" option** — tokens persist in `localStorage` forever with no explicit expiry                                                                                                   |
| AUTH-04 | 🟠       | ❌    | **Token in `localStorage`** is vulnerable to XSS. Consider `httpOnly` cookies set by the backend                                                                                                 |
| AUTH-05 | 🟡       | ✅    | ~~Login page is bare.~~ **FIXED**: Split-screen layout with branded sidebar featuring testimonial quote, gradient background, and Maintix branding                                               |
| AUTH-06 | 🟡       | ✅    | ~~No password visibility toggle.~~ **FIXED**: Eye/EyeOff toggle button on password field                                                                                                         |
| AUTH-07 | 🟡       | ✅    | ~~Error message styling lacks icon/animation.~~ **FIXED**: Proper error display with `text-error-500`, focus management. Keyboard navigation with focus trap in sidebar, proper `htmlFor` labels |

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

| ID      | Severity | Status | Issue                                                                                                                                                                                                                                                                                                        |
| ------- | -------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| DASH-01 | 🟠       | ✅     | ~~No page title in the header bar.~~ **FIXED**: Current page name shown in header for spatial orientation                                                                                                                                                                                                    |
| DASH-02 | 🟠       | ✅     | ~~Dashboard home page~~ — **FIXED**: Open Tickets and Pending Approval now show real aggregated data across all properties via `useAllPropertyTickets`. "Team Members" now shows total member count via `useUsers()` hook.                                                                                   |
| DASH-03 | 🟠       | ✅     | ~~Stark design contrast with landing page.~~ **FIXED**: Dashboard cards now have gradient overlays (`bg-gradient-to-br from-primary/[0.03]`), hover shadow/border transitions (`hover:shadow-md hover:border-primary/20`), icon badges with semantic colors, and arrow indicator animation on property cards |
| DASH-04 | 🟡       | ✅     | ~~No ThemeToggle in dashboard.~~ **FIXED**: ThemeToggle present in dashboard header                                                                                                                                                                                                                          |
| DASH-05 | 🟡       | ✅     | ~~Sidebar close button has no `aria-label`.~~ **FIXED**: Close button has `aria-label`                                                                                                                                                                                                                       |
| DASH-06 | 🟡       | ❌     | **Logout button** has no confirmation dialog — one click immediately logs out                                                                                                                                                                                                                                |
| DASH-07 | 🟡       | ❌     | **Main content area** has `overflow-hidden` on the parent `flex-1 flex-col` which could clip content on long pages                                                                                                                                                                                           |
| DASH-08 | 🟢       | ✅     | ~~No keyboard shortcut hints.~~ **FIXED**: ⌘K keyboard shortcut hint displayed, command palette fully implemented with `cmdk` library                                                                                                                                                                        |

---

## 8. Core Pages Audit

### 8.1 Properties Page (`/dashboard/properties`)

| ID      | Severity | Status | Issue                                                                                                                                                                                                |
| ------- | -------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PROP-01 | 🟡       | ⚠️     | **Property cards only show `name` and `address`** on the list page. **Note**: detail page (`[propertyId]/page.tsx`) does show ticket count, member count, and categories — but the card grid doesn't |
| PROP-02 | 🟡       | ✅     | ~~No confirmation before deleting members.~~ **FIXED**: Uses `<AlertDialog>` with "Remove member?" title + description requiring confirmation                                                        |
| PROP-03 | 🟢       | ✅     | **Empty state is good** — role-aware messaging ("Create your first property" vs "Ask your manager") is excellent UX                                                                                  |

### 8.2 Tickets Page (`/dashboard/tickets`)

| ID     | Severity | Status | Issue                                                                                                                                                                             |
| ------ | -------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TKT-01 | 🟠       | ✅     | ~~Property must be selected first.~~ **FIXED**: Default is `selectedPropertyId = 'all'` showing tickets across all properties, with option to filter by individual property       |
| TKT-02 | 🟠       | ✅     | ~~No sorting options.~~ **FIXED**: Full Sort dropdown with 5 options: Newest First, Oldest First, Recently Updated, Highest Priority, Lowest Priority (with `<ArrowUpDown>` icon) |
| TKT-03 | 🟡       | ❌     | **Ticket rows use card-based layout** (stacked divs, not a table). For dense data, a `<table>` or Tanstack Table with column headers would be more scannable                      |
| TKT-04 | 🟡       | ❌     | **"Load More" pagination** — infinite query wired up with manual button. Consider infinite scroll or "Showing X of Y tickets"                                                     |
| TKT-05 | 🟡       | ✅     | ~~Create ticket `categoryId` missing required indicator.~~ **FIXED**: All required fields (Title, Description, Category) now have red `*` asterisks                               |
| TKT-06 | 🟡       | ❌     | **No priority selector** in the create ticket form — tickets created without priority, can only be set post-creation on detail page                                               |
| TKT-07 | 🟢       | ✅     | **Status badges with config** (`statusConfig`) mapping is clean and extensible                                                                                                    |

### 8.3 Ticket Detail Page (`/dashboard/tickets/:id`)

| ID    | Severity | Status | Issue                                                                                                                                                                                                                                    |
| ----- | -------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TD-01 | 🟠       | ✅     | ~~No workflow timeline/history.~~ **FIXED**: `<ActivityTimeline>` component (187 lines) shows full action history with 10 color-coded action types, actor names, timestamps, detail text, skeleton loaders, and pagination ("Load More") |
| TD-02 | 🟡       | ✅     | ~~Action buttons have no loading state.~~ **FIXED**: All mutation buttons show loading text: "Starting…", "Submitting…", "Approving…" during pending state                                                                               |
| TD-03 | 🟡       | ✅     | ~~No file attachments UI.~~ **FIXED**: Attachments grid with image hover zoom + download icons. `<UploadDropzone>` component with drag-and-drop, progress bars, client-side validation. Hidden for terminal states (DONE/CANCELLED)      |
| TD-04 | 🟡       | ✅     | ~~Sidebar metadata is cramped.~~ **FIXED**: Right sidebar (responsive `lg:grid-cols-3`) with clear card layout. Each metadata item has icon + label + value, `border-t` separators, visual hierarchy via text sizes                      |

### 8.4 Users Page (`/dashboard/users`)

| ID     | Severity | Status | Issue                                                                                                                                    |
| ------ | -------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| USR-01 | 🟡       | ❌     | **No user editing or deactivation** — page is read-only (except create for admins). No way to update role, reset password, or deactivate |
| USR-02 | 🟡       | ✅     | ~~No filtering or search.~~ **FIXED**: Debounced search via `useDeferredValue` filtering by search term                                  |
| USR-03 | 🟢       | ✅     | **User initials avatar** is a nice touch. Consider adding a colored background based on the role                                         |

### 8.5 Notifications Page (`/dashboard/notifications`)

| ID       | Severity | Issue |
| -------- | -------- | ----- | --------------------------------------------------------------------------------------------------------------------------------------- |
| NOTIF-01 | 🟡       | ❌    | **No pagination** — loads all notifications at once via basic query, no infinite query or "Load More"                                   |
| NOTIF-02 | 🟡       | ✅    | ~~No notification type filtering.~~ **FIXED**: Dropdown filter for notification types with all `NotificationType` enum values           |
| NOTIF-03 | 🟡       | ✅    | ~~Clicking a notification doesn't navigate to ticket.~~ **FIXED**: Notifications with `ticketId` wrap in `<Link>` to ticket detail page |
| NOTIF-04 | 🟢       | ✅    | **Polling at 15s/30s** is reasonable for near-real-time updates. Consider WebSocket/SSE for true real-time in future                    |

---

## 9. Component Library & Design System

**Component Inventory:** 25 components in `ui/` + 8 custom app components

| Component                   | Source                                        | Notes                            |
| --------------------------- | --------------------------------------------- | -------------------------------- |
| `badge.tsx`                 | shadcn + custom `success`, `warning` variants | ✅ Extended correctly            |
| `button.tsx`                | shadcn standard                               | ✅ Good                          |
| `card.tsx`                  | shadcn standard                               | ✅ `CardTitle` renders as `<h3>` |
| `dialog.tsx`                | shadcn (Radix)                                | ✅ Good                          |
| `input.tsx`                 | shadcn standard                               | ✅ Good                          |
| `label.tsx`                 | shadcn (Radix)                                | ✅ Good                          |
| `progress.tsx`              | Custom (new)                                  | ✅ Tailwind progress bar         |
| `select.tsx`                | shadcn (Radix)                                | ✅ Good                          |
| `skeleton.tsx`              | shadcn standard                               | ✅ Good                          |
| `textarea.tsx`              | shadcn standard                               | ✅ Good                          |
| `alert-dialog.tsx`          | shadcn (Radix)                                | ✅ Used for confirmations        |
| `toast.tsx` + `toaster.tsx` | shadcn (Radix)                                | ✅ Good                          |
| `empty-state.tsx`           | Custom (new)                                  | ✅ Reusable empty state          |
| `page-header.tsx`           | Custom (new)                                  | ✅ Reusable page header          |
| `data-table.tsx`            | Custom (new)                                  | ✅ Reusable list component       |
| `animated-list.tsx`         | Magic UI                                      | Landing page only                |
| `animated-shiny-text.tsx`   | Magic UI                                      | Landing page only                |
| `blur-fade.tsx`             | Magic UI                                      | Landing page only                |
| `border-beam.tsx`           | Magic UI                                      | Landing page only                |
| `dot-pattern.tsx`           | Magic UI                                      | Landing page only                |
| `marquee.tsx`               | Magic UI                                      | Landing page only                |
| `number-ticker.tsx`         | Magic UI                                      | Landing page only                |
| `ripple.tsx`                | Magic UI                                      | Landing page only                |
| `shine-border.tsx`          | Magic UI                                      | Landing page only                |
| `word-rotate.tsx`           | Magic UI                                      | Landing page only                |

**Custom App Components:**

- `dashboard-layout.tsx` — Main app shell with sidebar, topbar, breadcrumbs (394 lines)
- `command-palette.tsx` — Global ⌘K search/navigation via `cmdk`
- `ticket-status-chart.tsx` — Recharts-based ticket visualization
- `upload-dropzone.tsx` — DnD file upload with progress bars (new)
- `activity-timeline.tsx` — Action history display with 10 event types (187 lines)
- `empty-state.tsx` — Reusable empty state (icon + title + description + action)
- `page-header.tsx` — Reusable page header (title + description + action button)
- `data-table.tsx` — Reusable card-based list component

**Icon Library:** Lucide React exclusively — consistent semantic icon usage throughout

### Issues

| ID    | Severity | Status | Issue                                                                                                                                                                                                            |
| ----- | -------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| DS-01 | 🟠       | ⚠️     | **10 of 22 UI components are landing-page-only animations.** Dashboard now has gradient accents and hover animations (DASH-03 fixed) but still doesn't use Magic UI components like `BlurFade` or `AnimatedList` |
| DS-02 | 🟡       | ⚠️     | **Some missing components** — no `Table`, `Tabs`, `Tooltip`, `Avatar`, `Popover`, `DropdownMenu`. **Added**: `progress.tsx`, `alert-dialog.tsx`                                                                  |
| DS-03 | 🟡       | ✅     | ~~No shared `DataTable` component.~~ **FIXED**: Created `components/data-table.tsx` — supports card-based row rendering with keyField, renderRow, empty, and loading props                                       |
| DS-04 | 🟡       | ✅     | ~~No shared `EmptyState` component.~~ **FIXED**: Created `components/empty-state.tsx` — reusable icon + title + description + action pattern (used in 8+ pages)                                                  |
| DS-05 | 🟡       | ✅     | ~~No shared `PageHeader` component.~~ **FIXED**: Created `components/page-header.tsx` — reusable title + description + action button layout (used in all dashboard pages)                                        |
| DS-06 | 🟢       | ✅     | **`cn()` utility** correctly implemented with `clsx` + `tailwind-merge`. Good foundation                                                                                                                         |

---

## 10. Forms & Validation

### Strengths

- ✅ **Zod schemas** with descriptive error messages (`"Title must be at least 3 characters"`)
- ✅ **react-hook-form** with `zodResolver` — properly integrated on all forms
- ✅ **`isSubmitting` state** used to disable submit buttons during async operations
- ✅ **Inline error styling** with `text-error-500` below each field

### Issues

| ID      | Severity | Status | Issue                                                                                                                                                                                                               |
| ------- | -------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FORM-01 | 🟠       | ✅     | ~~No required field indicators.~~ **FIXED**: Required fields show red `*` asterisks (e.g., `Title <span className="text-error-500">*</span>`) on ticket, property, and user forms                                   |
| FORM-02 | 🟡       | ✅     | ~~Error text inconsistency.~~ **FIXED**: Hybrid approach — inline `text-sm text-error-500` for validation hints below fields, toast for submission results (success/failure)                                        |
| FORM-03 | 🟡       | ✅     | ~~No loading state on submit button.~~ **FIXED**: All forms disable and show loading text: `disabled={isSubmitting}` with text like "Creating..." during async operations. Toast appears for success, dialog closes |
| FORM-04 | 🟡       | ✅     | ~~Password requirements not displayed upfront.~~ **FIXED**: Password field in user creation now shows hint: "Must be at least 8 characters, with an uppercase letter and a number."                                 |
| FORM-05 | 🟡       | ✅     | ~~No character counter on description textareas.~~ **FIXED**: Ticket description textarea now shows character count below the field: "X / 5000"                                                                     |
| FORM-06 | 🟢       | ✅     | ~~No form reset after submit.~~ **FIXED**: All forms call `reset()` after successful submission, dialog closes on success                                                                                           |

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

| ID      | Severity | Status | Issue                                                                                                                                                                                                                                            |
| ------- | -------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| DATA-01 | 🟠       | ✅     | ~~No global error handler for 401s.~~ **FIXED**: Custom `auth:session-expired` event dispatched on 401 in both `fetch` and `uploadWithProgress` (XHR). AuthProvider listens and redirects to login. QueryClient config prevents retry on 401/403 |
| DATA-02 | 🟡       | ❌     | **No optimistic updates** — all mutations wait for server response before updating cache. Ticket status changes, "Mark as Read" would benefit from optimistic UI                                                                                 |
| DATA-03 | 🟡       | ❌     | **Query key consistency** — invalidation uses broad `queryKey: ['tickets']`. Works but could be more precise                                                                                                                                     |
| DATA-04 | 🟡       | ❌     | **Skeleton sizing is arbitrary** — `Skeleton className="h-[72px]"` may not match actual row heights                                                                                                                                              |
| DATA-05 | 🟢       | ❌     | **No prefetching** — hovering over ticket links could trigger `queryClient.prefetchQuery` for instant navigation                                                                                                                                 |

---

## 12. Typography & Color System

### Typography

- **Display font:** DM Sans (400–800) via `--font-display`
- **Body font:** Inter (400–600) via `--font-sans`
- **Note:** Font pairing implemented — DM Sans for headings, Inter for body text creates visual hierarchy and improves readability.

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

| ID       | Severity | Status | Issue                                                                                                                                                           |
| -------- | -------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TYPE-01  | 🟡       | ✅     | ~~Font loading duplication.~~ **FIXED**: DM Sans loaded once in `layout.tsx` — single declaration                                                               |
| TYPE-02  | 🟡       | ✅     | ~~No font pairing.~~ **FIXED**: DM Sans now used for display headings (`--font-display`), Inter for body text (`--font-sans`) — creates proper visual hierarchy |
| TYPE-03  | 🟡       | ✅     | ~~Line length not constrained.~~ **FIXED**: Added `max-width: 65ch` to all `<p>` elements in `globals.css` for optimal readability                              |
| TYPE-04  | 🟢       | ❌     | **Body text size** `text-sm` (14px) pushes the lower boundary of readability for data-dense UIs                                                                 |
| COLOR-01 | 🟡       | ✅     | ~~Dark mode primary contrast.~~ **FIXED**: Dark mode primary changed from `primary-400` (#818cf8) to `primary-300` (#a5b4fc) — improves contrast ratio to 7.1:1 |
| COLOR-02 | 🟢       | ✅     | **Semantic color tokens** properly mapped in both `:root` and `.dark` — comprehensive palette with primary, neutral, accent, success, warning, error scales     |

---

## 13. Responsive Design & Mobile

### Strengths

- ✅ Mobile sidebar with overlay pattern
- ✅ Stacked grid layouts (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`)
- ✅ Mobile menu on landing page with `AnimatePresence`-style transitions
- ✅ `hidden sm:flex` for dashboard mockup sidebar (correctly hidden on small screens)

### Issues

| ID     | Severity | Status | Issue                                                                                                                                                                                                             |
| ------ | -------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RWD-01 | 🟠       | ✅     | ~~Ticket filter controls overflow on mobile.~~ **FIXED**: Uses `flex flex-wrap items-center gap-3` with responsive widths: `w-full sm:w-[220px]` for search, `w-full sm:w-[200px]` for selects — stacks on mobile |
| RWD-02 | 🟡       | ❌     | **Property detail two-column layout** jumps from single→two at `lg` breakpoint. Tablet (`md`) is single long scroll. Consider `md:grid-cols-2`                                                                    |
| RWD-03 | 🟡       | ❌     | **Ticket detail sidebar** collapses below main content on smaller screens, burying important context. Consider sticky top bar on mobile                                                                           |
| RWD-04 | 🟡       | ❌     | **Landing page stat strip** — `grid-cols-3` forces three columns. Gets cramped below 380px                                                                                                                        |
| RWD-05 | 🟢       | ✅     | **`overflow-x-hidden`** on landing page root prevents horizontal scroll from decorations. Main content uses `max-w-5xl` constraints                                                                               |

---

## 14. Performance

### Issues

| ID      | Severity | Status | Issue                                                                                                                                                                                                                                                                           |
| ------- | -------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PERF-01 | 🟠       | ❌     | **Landing page JavaScript weight** — imports `framer-motion` (~40KB gzipped), 10 Magic UI components. Consider dynamic imports for below-fold sections                                                                                                                          |
| PERF-02 | 🟠       | ❌     | **All pages are CSR** (`'use client'`) — dashboard could benefit from Server Components for initial HTML shell                                                                                                                                                                  |
| PERF-03 | 🟡       | ❌     | **No `<Image>` from `next/image`** — `next.config.ts` configures `remotePatterns` for Supabase storage, but no `<Image>` components used. Upload attachments display with plain `<img>` or object URLs. **Note**: server-side image optimization added via sharp in uploads API |
| PERF-04 | 🟡       | ❌     | **CSS includes 308 lines** of custom keyframes and landing-specific styles that ship to all routes. Consider code-splitting                                                                                                                                                     |
| PERF-05 | 🟡       | ❌     | **Multiple `useEffect` for scroll listeners** on landing page — consolidate into single listener                                                                                                                                                                                |
| PERF-06 | 🟢       | ✅     | **`will-change-transform`** correctly applied to animated glow orbs. **`useMemo`** used selectively in key spots (chart data, animated components). `React.memo` on `AnimatedList` and `Ripple`                                                                                 |

---

## 15. Dark Mode

### Implementation

- `next-themes` with `attribute="class"` and `defaultTheme="system"` — ✅ correct approach
- `suppressHydrationWarning` on `<html>` — ✅ prevents flash
- CSS variables swap in `.dark {}` block — ✅ well-structured

### Issues

| ID    | Severity | Status | Issue                                                                                                                                                                                                                                                        |
| ----- | -------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| DM-01 | 🟡       | ✅     | ~~Dashboard cards lack depth in dark mode.~~ **FIXED**: Cards use `bg-card/50` with `border-border/50` — part of comprehensive CSS variable system. Dashboard cards now have gradient overlays and hover transitions that work in both modes                 |
| DM-02 | 🟡       | ✅     | ~~Dashboard gets none of landing page's dark mode refinements.~~ **FIXED**: Components use semantic CSS variables (`bg-background`, `text-foreground`, `border-border`) that automatically swap in dark mode. No hardcoded colors found                      |
| DM-03 | 🟢       | ❌     | **Notification unread state** uses `bg-primary/[0.02]` in dark mode — nearly invisible. Bump to `bg-primary/[0.06]`                                                                                                                                          |
| DM-04 | 🟢       | ✅     | ~~Error states background variants missing.~~ **FIXED**: Added semantic `--success`, `--warning`, `--success-foreground`, `--warning-foreground` CSS variables with dark mode variants. Now use `bg-success`, `bg-warning` with automatic dark mode support. |

---

## 16. Error Handling & Empty States

### Empty States

All key pages have empty states — ✅ this is above average for early-stage SaaS:

| Page            | Has Empty State | Quality                                  |
| --------------- | --------------- | ---------------------------------------- |
| Properties      | ✅              | Good — role-aware messaging              |
| Tickets         | ✅              | Good — "Select a property" prompt        |
| Users           | ✅              | Good — includes CTA to create first user |
| Notifications   | ✅              | Good — "All caught up" positive framing  |
| Ticket Detail   | ✅              | Has "not found" fallback                 |
| Property Detail | ✅              | Has "not found" fallback                 |

### Issues

| ID     | Severity | Status | Issue                                                                                                                                                                                                                                  |
| ------ | -------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ERR-01 | 🔴       | ⚠️     | ~~No `error.tsx` boundary.~~ **PARTIALLY FIXED**: `app/dashboard/error.tsx` (33 lines) exists with recovery UI. **Still missing**: root `app/error.tsx` for non-dashboard routes                                                       |
| ERR-02 | 🟠       | ❌     | **No `not-found.tsx`** — navigating to `/dashboard/nonexistent-path` has no handler. Individual pages (tickets, properties) have inline "not found" cards for invalid IDs                                                              |
| ERR-03 | 🟠       | ⚠️     | **API errors partially differentiated** — 401 errors now redirect to login via `auth:session-expired` event. Other mutation errors still use generic toast pattern (`title: 'Error'`). Could differentiate validation vs server errors |
| ERR-04 | 🟡       | ❌     | **Silent error in notification "mark as read"** — catch block is empty. Should at minimum log to console                                                                                                                               |
| ERR-05 | 🟡       | ❌     | **No network error handling** — no offline detection or banner. API calls fail with generic toasts                                                                                                                                     |

---

## 17. Prioritized Action Items

### 🔴 Critical (Block launch / major user impact)

| #   | Item                                                           | Effort |
| --- | -------------------------------------------------------------- | ------ |
| 1   | Add registration/sign-up flow (landing → onboard)              | L      |
| 2   | Add "Forgot Password" to login page                            | M      |
| 3   | Add root `error.tsx` at `app/` level (dashboard one exists ✅) | S      |
| 4   | Add unique `<title>` metadata per dashboard page               | S      |

### 🟠 High (Significant quality issues)

| #   | Status | Item                                                                                                     | Effort |
| --- | ------ | -------------------------------------------------------------------------------------------------------- | ------ |
| 5   | ✅     | ~~Add global 401 interceptor to redirect to login with "Session expired"~~                               | S      |
| 6   | ❌     | Add breadcrumbs on all detail pages                                                                      | S      |
| 7   | ✅     | ~~Add "All Properties" option to ticket list~~                                                           | M      |
| 8   | ✅     | ~~Bridge design gap between landing page and dashboard (gradients, hover animations, card refinements)~~ | M      |
| 9   | ✅     | ~~Extract landing page into section components~~ (now 14 components, 94 lines)                           | M      |
| 10  | ✅     | ~~Add semantic HTML landmarks to dashboard layout (`<nav>`, `<aside>`, `<main>`)~~                       | S      |
| 11  | ✅     | ~~Add sorting to ticket list (date, priority, status)~~ (5 sort options)                                 | M      |
| 12  | ✅     | ~~Add ticket activity timeline / history log~~ (10 action types, pagination, color-coded icons)          | L      |
| 13  | ✅     | ~~Add mobile-accessible sidebar (keyboard Escape, `role="dialog"`, focus trap)~~                         | S      |

### 🟡 Medium (Polish & best practices)

| #   | Status | Item                                                                                                                     | Effort |
| --- | ------ | ------------------------------------------------------------------------------------------------------------------------ | ------ |
| 14  | ✅     | ~~Add ThemeToggle to dashboard header~~                                                                                  | S      |
| 15  | ✅     | ~~Add header page title to dashboard layout~~                                                                            | S      |
| 16  | ✅     | ~~Add `prefers-reduced-motion` support to all animations~~                                                               | S      |
| 17  | ✅     | ~~Create shared components~~ — `<EmptyState>`, `<PageHeader>`, `<DataTable>` all created in `components/`                | M      |
| 18  | ✅     | ~~Add required field indicators (\* or label suffix) to all forms~~                                                      | S      |
| 19  | ✅     | ~~Fix `CardTitle` to render as heading elements~~                                                                        | S      |
| 20  | ✅     | ~~Add loading states to action buttons on ticket detail page~~                                                           | S      |
| 21  | ✅     | ~~Make notifications clickable (link to related ticket)~~                                                                | S      |
| 22  | ✅     | ~~Add search to ticket list and users list~~                                                                             | M      |
| 23  | ✅     | ~~Add notification type filtering~~                                                                                      | M      |
| 24  | ✅     | ~~Add `sr-only` loading text to all spinner elements~~                                                                   | S      |
| 25  | ✅     | ~~Fix font loading — single DM Sans declaration~~                                                                        | S      |
| 26  | ✅     | ~~Constrain line length on description/text blocks~~ — Added `max-width: 65ch` to `<p>` in globals.css                   | S      |
| 27  | ✅     | ~~Add dark mode variants for error/warning backgrounds~~ — Added `--success`, `--warning` semantic tokens with dark mode | S      |

### 🟢 Low / Future

| #   | Status | Item                                                                                       | Effort |
| --- | ------ | ------------------------------------------------------------------------------------------ | ------ |
| 28  | ✅     | ~~Add keyboard shortcuts (⌘K search)~~ — command palette implemented                       | M      |
| 29  | ❌     | Add real-time updates via WebSocket/SSE                                                    | L      |
| 30  | ✅     | ~~Add file attachment upload/display in ticket detail~~ — UploadDropzone + attachment grid | M      |
| 31  | ❌     | Add user editing/deactivation in user management                                           | M      |
| 32  | ⚠️     | ~~Add confirmation dialogs for destructive actions~~ — member removal ✅, logout ❌        | S      |
| 33  | ❌     | Add query prefetching on hover for detail pages                                            | S      |
| 34  | ❌     | Replace social proof stats with real data or waitlist count                                | S      |
| 35  | ❌     | Add notification popover in header for quick triage                                        | M      |

### Progress Summary

**Completed: 22 / 35 action items (63%)**

| Priority    | Done | Total | Percentage |
| ----------- | ---- | ----- | ---------- |
| 🔴 Critical | 0    | 4     | 0%         |
| 🟠 High     | 7    | 9     | 78%        |
| 🟡 Medium   | 10   | 14    | 71%        |
| 🟢 Low      | 5    | 8     | 63%        |

**Remaining high-impact items:**

1. Registration/sign-up flow (AUTH-02) — blocks user self-onboarding
2. Forgot password (AUTH-01) — blocks locked-out users
3. Root `error.tsx` (ERR-01) — production crash safety net
4. Per-page metadata titles (A11Y-01) — accessibility compliance
5. Breadcrumb navigation (NAV-01) — improves deep-link experience
6. Shared components: EmptyState, PageHeader, DataTable (DS-03/04/05) — reduces code duplication

**Effort Key:** S = Small (< 2hr), M = Medium (2–8hr), L = Large (8hr+)

---

## Appendix: File Reference

| Area              | Key Files                                       |
| ----------------- | ----------------------------------------------- |
| Root Layout       | `app/layout.tsx`                                |
| Global Styles     | `app/globals.css` (308 lines)                   |
| Landing Page      | `app/page.tsx` (94 lines) + `_components/` (14) |
| Login             | `app/login/page.tsx` (350 lines)                |
| Dashboard Layout  | `components/dashboard-layout.tsx` (394 lines)   |
| Command Palette   | `components/command-palette.tsx`                |
| Activity Timeline | `components/activity-timeline.tsx` (187 lines)  |
| Upload Dropzone   | `components/upload-dropzone.tsx`                |
| Status Chart      | `components/ticket-status-chart.tsx`            |
| Auth Guard        | `components/auth-guard.tsx` (30 lines)          |
| Auth Context      | `contexts/auth-context.tsx`                     |
| API Client        | `lib/api-client.ts` (110 lines)                 |
| Validations       | `lib/validations.ts`                            |
| Ticket Config     | `lib/ticket-config.ts`                          |
| Providers         | `components/providers.tsx` (33 lines)           |
| UI Components     | `components/ui/*.tsx` (22 files)                |
| Hooks             | `hooks/use-*.ts` (6 files)                      |
| Dashboard Pages   | `app/dashboard/**/page.tsx` (7 pages)           |
| Error Boundary    | `app/dashboard/error.tsx` (33 lines)            |

---

_End of audit. Updated with current implementation status. 22 of 35 action items complete (63%). Focus on the 4 critical items (registration, forgot password, root error boundary, page titles) to reach launch readiness._
