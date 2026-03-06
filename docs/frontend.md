# Frontend Guide

The Maintix frontend is a **Next.js 15** single-page application using React 19, Tailwind CSS 4, and TanStack Query 5 for data fetching.

## Pages & Routes

| Route                        | File                                             | Access       | Description                                   |
| ---------------------------- | ------------------------------------------------ | ------------ | --------------------------------------------- |
| `/`                          | `app/page.tsx`                                   | Public       | Landing page with Magic UI animations         |
| `/login`                     | `app/login/page.tsx`                             | Public       | Email/password login form                     |
| `/dashboard`                 | `app/dashboard/page.tsx`                         | Protected    | Stats overview + property cards               |
| `/dashboard/properties`      | `app/dashboard/properties/page.tsx`              | Protected    | Property list with CRUD                       |
| `/dashboard/properties/[id]` | `app/dashboard/properties/[propertyId]/page.tsx` | Protected    | Property detail: members, categories, tickets |
| `/dashboard/tickets`         | `app/dashboard/tickets/page.tsx`                 | Protected    | Ticket list with filters & pagination         |
| `/dashboard/tickets/[id]`    | `app/dashboard/tickets/[ticketId]/page.tsx`      | Protected    | Ticket detail + lifecycle actions             |
| `/dashboard/users`           | `app/dashboard/users/page.tsx`                   | Manager only | User management (create/list)                 |
| `/dashboard/notifications`   | `app/dashboard/notifications/page.tsx`           | Protected    | Notification center                           |

All dashboard routes are wrapped in `AuthGuard` + `DashboardLayout` via the dashboard layout file.

## Layouts

### Root Layout (`app/layout.tsx`)

- Loads **DM Sans** font (weights: 400, 500, 600, 700)
- Registers CSS variables: `--font-display`, `--font-sans`
- Wraps children in `<Providers>`
- Sets `suppressHydrationWarning` for theme hydration

### Dashboard Layout (`app/dashboard/layout.tsx`)

```tsx
<AuthGuard>
  <DashboardLayout>{children}</DashboardLayout>
</AuthGuard>
```

## Authentication

### Auth Flow

1. User submits email/password on `/login`
2. `AuthProvider.login()` calls `POST /auth/login`
3. JWT stored in `localStorage.accessToken`
4. `GET /users/me` hydrates user state
5. All subsequent API calls include `Authorization: Bearer <token>`
6. On page load, `AuthProvider` reads token and rehydrates user

### AuthGuard (`components/auth-guard.tsx`)

Client-side route protection:

- Shows spinner while checking auth state
- Redirects to `/login` if not authenticated
- Renders children once authenticated

### AuthProvider (`contexts/auth-context.tsx`)

Exports via `useAuth()` hook:

| Property/Method          | Type            | Description                  |
| ------------------------ | --------------- | ---------------------------- |
| `user`                   | `User \| null`  | Current authenticated user   |
| `isLoading`              | `boolean`       | Auth state loading           |
| `isAuthenticated`        | `boolean`       | `!!user`                     |
| `login(email, password)` | `Promise<void>` | Authenticate and store token |
| `logout()`               | `void`          | Clear token and user state   |

## Provider Chain

Defined in `components/providers.tsx`:

```
ThemeProvider (next-themes)
  └── QueryClientProvider (TanStack Query)
        └── AuthProvider (JWT context)
              └── {children}
              └── Toaster (toast UI)
```

**QueryClient config**:

- Stale time: 30 seconds
- Max retries: 2 (no retry on 401/403)

## API Client (`lib/api-client.ts`)

Centralized HTTP client for all backend communication.

| Method                         | Signature    | Description                    |
| ------------------------------ | ------------ | ------------------------------ |
| `api.get<T>(url)`              | `Promise<T>` | GET request                    |
| `api.post<T>(url, body)`       | `Promise<T>` | POST with JSON body            |
| `api.patch<T>(url, body)`      | `Promise<T>` | PATCH with JSON body           |
| `api.delete<T>(url)`           | `Promise<T>` | DELETE request                 |
| `api.upload<T>(url, formData)` | `Promise<T>` | POST with FormData (multipart) |

**Key behaviors**:

- Base URL from `NEXT_PUBLIC_API_URL` or `http://localhost:3001/api/v1`
- Auto-injects `Authorization: Bearer` from localStorage
- Unwraps `{ data: T }` envelope from API responses
- Throws `ApiError(statusCode, errorCode, message)` on non-OK

## Hooks

### Properties

| Hook                             | Description                           |
| -------------------------------- | ------------------------------------- |
| `useProperties()`                | Fetch all properties for current user |
| `useProperty(id)`                | Fetch single property detail          |
| `usePropertyMembers(propertyId)` | Fetch property members                |
| `useCreateProperty()`            | Create property mutation              |
| `useUpdateProperty(id)`          | Update property mutation              |
| `useAddMember(propertyId)`       | Add member mutation                   |
| `useRemoveMember(propertyId)`    | Remove member mutation                |

### Tickets

| Hook                                     | Description                     |
| ---------------------------------------- | ------------------------------- |
| `useTickets(propertyId, params)`         | Fetch tickets with filters      |
| `useInfiniteTickets(propertyId, params)` | Cursor-paginated infinite query |
| `useTicket(id)`                          | Fetch single ticket detail      |
| `useCreateTicket(propertyId)`            | Create ticket mutation          |
| `useAssignTicket()`                      | Assign technician mutation      |
| `useStartWork()`                         | Start work mutation             |
| `useSubmitCompletion()`                  | Submit completion mutation      |
| `useApproveTicket()`                     | Approve ticket mutation         |
| `useCancelTicket()`                      | Cancel ticket mutation          |
| `useUpdatePriority()`                    | Update priority mutation        |
| `useReassignTicket()`                    | Reassign technician mutation    |

All ticket mutations use optimistic concurrency (pass `version` field).

### Categories

| Hook                            | Description                   |
| ------------------------------- | ----------------------------- |
| `useCategories(propertyId)`     | Fetch categories for property |
| `useCreateCategory(propertyId)` | Create category mutation      |

### Notifications

| Hook                            | Description                           |
| ------------------------------- | ------------------------------------- |
| `useNotifications(unreadOnly?)` | Fetch notifications (polls every 30s) |
| `useUnreadCount()`              | Fetch unread count (polls every 15s)  |
| `useMarkAsRead()`               | Mark single notification read         |
| `useMarkAllAsRead()`            | Mark all notifications read           |

### Users

| Hook              | Description          |
| ----------------- | -------------------- |
| `useUsers()`      | Fetch all users      |
| `useCreateUser()` | Create user mutation |

### Toast

| Export       | Description                            |
| ------------ | -------------------------------------- |
| `useToast()` | Access toast state and dispatch        |
| `toast()`    | Imperatively show a toast notification |

Global toast system — limit 5 visible, auto-dismiss after 5 seconds.

## Form Validation

Zod schemas defined in `lib/validations.ts`:

| Schema                 | Used In         | Fields                                     |
| ---------------------- | --------------- | ------------------------------------------ |
| `loginSchema`          | Login page      | email, password                            |
| `createUserSchema`     | Users page      | email, firstName, lastName, password, role |
| `createPropertySchema` | Properties page | name, address                              |
| `createCategorySchema` | Property detail | name                                       |
| `createTicketSchema`   | Property detail | title, description, categoryId             |
| `assignTicketSchema`   | Ticket detail   | technicianId, version                      |
| `cancelTicketSchema`   | Ticket detail   | reason, version                            |
| `updatePrioritySchema` | Ticket detail   | priority, version                          |

## Components

### DashboardLayout (`components/dashboard-layout.tsx`)

Full dashboard shell with:

- **Sidebar** — Role-based navigation links (Users visible to Managers only)
- **Top bar** — Notification bell with unread badge (polls every 15s), user avatar
- **Mobile** — Hamburger menu with overlay sidebar
- **User panel** — Initials avatar, name, role, logout button

### ThemeToggle (`components/theme-toggle.tsx`)

Sun/Moon icon button toggling dark/light mode via `next-themes`. Accessible with `aria-label`.

### Error Boundary (`app/dashboard/error.tsx`)

Client error boundary for the dashboard. Shows error message, provides retry button, and reset function.

## Theming

### System

- **Library**: `next-themes` v0.4.6
- **Attribute**: `class` on `<html>` (`dark` class)
- **Default**: `system` (follows OS preference)
- **Storage**: `localStorage` via next-themes

### CSS Architecture

Tailwind CSS 4 with `@theme inline` block defining:

- Semantic color tokens (all responsive to `dark:` variants)
- Font families: `--font-display`, `--font-sans` (DM Sans)
- Color palette: Indigo/violet primary (`--color-primary-*`), emerald accent
- Custom animations: marquee, ripple, shine, shiny-text (for Magic UI)
- Custom utilities: `.glass`, `.noise`, `.gradient-border`

### Color Palette

| Token      | Light                   | Dark                    |
| ---------- | ----------------------- | ----------------------- |
| Primary    | Indigo 600 (`#4f46e5`)  | Indigo 400 (`#818cf8`)  |
| Accent     | Emerald 500 (`#10b981`) | Emerald 400 (`#34d399`) |
| Background | White                   | Slate 950               |
| Surface    | Gray 50                 | Slate 900               |
| Text       | Gray 900                | Gray 100                |

## Magic UI Components

10 components from [Magic UI](https://magicui.design) installed via shadcn CLI into `components/ui/`:

| Component           | File                      | Usage                                                         |
| ------------------- | ------------------------- | ------------------------------------------------------------- |
| `BlurFade`          | `blur-fade.tsx`           | Scroll-triggered entrance animations (replaces custom reveal) |
| `NumberTicker`      | `number-ticker.tsx`       | Spring-physics animated number counter (stats section)        |
| `BorderBeam`        | `border-beam.tsx`         | Animated beam orbiting element border (dashboard mockup)      |
| `DotPattern`        | `dot-pattern.tsx`         | SVG dot pattern background (hero section)                     |
| `AnimatedList`      | `animated-list.tsx`       | Items appear sequentially (notification bento card)           |
| `Marquee`           | `marquee.tsx`             | Infinite scrolling content (trust row)                        |
| `WordRotate`        | `word-rotate.tsx`         | Rotating text with transitions (hero headline)                |
| `Ripple`            | `ripple.tsx`              | Concentric ripple circles (CTA background)                    |
| `ShineBorder`       | `shine-border.tsx`        | Animated gradient border (featured cards)                     |
| `AnimatedShinyText` | `animated-shiny-text.tsx` | Shimmering text effect (hero badge)                           |

## Landing Page (`app/page.tsx`)

The landing page (~1274 lines) is a client component featuring:

1. **Navbar** — Logo, desktop nav links (Features | How It Works | Pricing), theme toggle, CTA button, mobile hamburger menu
2. **Hero Section** — `DotPattern` background, `AnimatedShinyText` badge, `WordRotate` headline, animated dashboard mockup with `BorderBeam`
3. **Trust Row** — `Marquee` with integration/technology names
4. **Stats Section** — `NumberTicker` animated counters
5. **Bento Grid** — Feature showcase with `ShineBorder` on featured cards
6. **How It Works** — Pipeline visualization with step connectors
7. **Roles Section** — Cards for Tenant, Manager, Technician workflows
8. **Pricing Section** — Free, Pro ($29/mo), Enterprise tiers
9. **CTA Section** — `Ripple` background with conversion copy
10. **Footer** — Product links, Resources, Legal, social links

All sections use `BlurFade` for scroll-triggered entrance animations.
