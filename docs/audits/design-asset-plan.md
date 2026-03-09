# Maintix Design Asset Plan

> Comprehensive design system documentation and asset generation guide for the Maintix property maintenance platform.

---

## 1. Design System Audit

### 1.1 Color Palette

#### Primary Colors (Indigo/Violet Spectrum)
| Token | Hex Value | Usage |
|-------|-----------|-------|
| `--color-primary-50` | `#eef2ff` | Light backgrounds, subtle highlights |
| `--color-primary-100` | `#e0e7ff` | Hover states, soft fills |
| `--color-primary-200` | `#c7d2fe` | Borders, accents |
| `--color-primary-300` | `#a5b4fc` | Dark mode primary, links |
| `--color-primary-400` | `#818cf8` | Glow effects, gradients |
| `--color-primary-500` | `#6366f1` | Primary buttons, icons, focus rings |
| `--color-primary-600` | `#4f46e5` | **Main brand color**, CTAs, links (light mode) |
| `--color-primary-700` | `#4338ca` | Button hover states, emphasis |
| `--color-primary-800` | `#3730a3` | Deep accents |
| `--color-primary-900` | `#312e81` | Dark text on light backgrounds |
| `--color-primary-950` | `#1e1b4b` | Deepest accents, dark mode backgrounds |

#### Neutral Colors (Zinc Scale)
| Token | Hex Value | Usage |
|-------|-----------|-------|
| `--color-neutral-50` | `#fafafa` | Subtle backgrounds |
| `--color-neutral-100` | `#f5f5f5` | Muted backgrounds, light mode secondary |
| `--color-neutral-200` | `#e5e5e5` | Borders, dividers |
| `--color-neutral-300` | `#d4d4d4` | Disabled states |
| `--color-neutral-400` | `#a3a3a3` | Placeholder text |
| `--color-neutral-500` | `#737373` | Muted text, secondary text |
| `--color-neutral-600` | `#525252` | Body text (dark mode) |
| `--color-neutral-700` | `#404040` | Emphasis text |
| `--color-neutral-800` | `#262626` | Dark mode secondary backgrounds |
| `--color-neutral-900` | `#171717` | Primary text (light mode) |
| `--color-neutral-950` | `#0a0a0a` | Deep backgrounds |

#### Semantic Colors
| Purpose | Light Mode | Dark Mode |
|---------|------------|-----------|
| **Background** | `#ffffff` | `#09090b` |
| **Card** | `#ffffff` | `#18181b` |
| **Muted** | `#f5f5f5` | `#27272a` |
| **Border** | `#e5e5e5` | `#27272a` |
| **Primary** | `#4f46e5` | `#a5b4fc` |
| **Success** | `#22c55e` | `#16a34a` |
| **Warning** | `#f59e0b` | `#d97706` |
| **Error** | `#ef4444` | `#dc2626` |

#### Accent Color (Emerald)
| Token | Hex Value | Usage |
|-------|-----------|-------|
| `--color-accent-500` | `#10b981` | Success indicators, completion states |
| `--color-accent-400` | `#34d399` | Gradients, highlights |

### 1.2 Typography System

#### Font Families
| Variable | Font | Fallbacks | Usage |
|----------|------|-------------|-------|
| `--font-display` | DM Sans | `'DM Sans', ui-sans-serif, system-ui, sans-serif` | Headings, display text, brand elements |
| `--font-sans` | Inter | `'Inter', ui-sans-serif, system-ui, sans-serif` | Body text, UI elements, paragraphs |

#### Type Scale
| Element | Size | Weight | Line Height | Letter Spacing | Font |
|---------|------|--------|-------------|----------------|------|
| **Hero H1** | `2.5rem` (mobile) → `4.5rem` (desktop) | 800 (extrabold) | 1.05 | -0.035em | Display |
| **Section H2** | `1.875rem` → `2.75rem` | 800 | 1.2 | -0.03em | Display |
| **Card Title** | `1.5rem` (24px) | 600 | 1.3 | -0.02em | Display |
| **Subtitle** | `1.125rem` (18px) | 600 | 1.4 | -0.01em | Sans |
| **Body Large** | `1rem` (16px) | 400 | 1.6 | normal | Sans |
| **Body** | `0.875rem` (14px) | 400 | 1.5 | normal | Sans |
| **Small/Caption** | `0.75rem` (12px) | 500 | 1.4 | 0.02em | Sans |
| **Label** | `0.75rem` (12px) | 600 | 1 | 0.05em (uppercase) | Sans |

### 1.3 Spacing System

| Token | Value | Usage |
|-------|-------|-------|
| **xs** | `4px` (0.25rem) | Tight gaps, icon padding |
| **sm** | `8px` (0.5rem) | Button padding, small gaps |
| **md** | `16px` (1rem) | Card padding, standard gaps |
| **lg** | `24px` (1.5rem) | Section padding, large gaps |
| **xl** | `32px` (2rem) | Hero spacing, section breaks |
| **2xl** | `48px` (3rem) | Major section dividers |
| **3xl** | `64px` (4rem) | Page section spacing |

### 1.4 Border Radius System

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | `0.375rem` (6px) | Small buttons, tags |
| `--radius-md` | `0.5rem` (8px) | Inputs, small cards |
| `--radius-lg` | `0.75rem` (12px) | Cards, modals |
| `--radius-xl` | `1rem` (16px) | Large cards, containers |
| `--radius-2xl` | `1.25rem` (20px) | Hero elements, featured cards |

### 1.5 Shadow System

| Level | Value | Usage |
|-------|-------|-------|
| **Card Hover** | `0 0 40px rgba(99,102,241,0.25)` | Premium card hover |
| **Button Hover** | `0 0 20px rgba(99,102,241,0.3)` | CTA button glow |
| **Navbar** | `0 1px 3px rgba(0,0,0,0.05)` | Subtle elevation |
| **Dropdown** | `0 10px 40px rgba(0,0,0,0.15)` | Modal/dialog depth |
| **Button Shadow** | `0 0 40px rgba(99,102,241,0.25)` | Primary CTA emphasis |

### 1.6 Visual Effects & Patterns

#### Glassmorphism
```css
.glass {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(0, 0, 0, 0.06);
}
```

#### Gradient Patterns
| Name | Value | Usage |
|------|-------|-------|
| **Primary Gradient** | `linear-gradient(135deg, #6366f1, #4f46e5)` | Buttons, highlights |
| **Hero Background** | `linear-gradient(to bottom, #eef2ff, #ffffff)` | Landing page hero |
| **Text Gradient** | `linear-gradient(to right, #4f46e5, #6366f1, #10b981)` | Animated headings |
| **Card Hover** | `linear-gradient(to br, rgba(79,70,229,0.03), transparent)` | Card hover overlay |

#### Animation Timings
| Animation | Duration | Easing |
|-----------|----------|--------|
| **Blur Fade** | 0.3-0.5s | ease-out |
| **Hover Transition** | 0.3s | ease |
| **Glow Pulse** | 4s | ease-in-out infinite |
| **Float** | 6s | ease-in-out infinite |
| **Shimmer** | 3s | ease-in-out infinite |
| **Marquee** | 25s | linear infinite |

### 1.6 Motion Design System

#### Motion Philosophy

**Core Principle:** Motion should feel **physical, purposeful, and premium** — like Linear's snappy interactions and Stripe's polished transitions. Every animation communicates state change and guides attention.

**Guiding Rules:**
1. **Motion is not decoration** — it clarifies hierarchy and state
2. **Speed matters** — fast feels responsive, slow feels premium when used intentionally
3. **Consistency creates trust** — same motion patterns throughout
4. **Respect user preferences** — honor `prefers-reduced-motion`

#### Motion Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--motion-instant` | `80ms` | Micro-interactions (toggle switches, checkbox) |
| `--motion-fast` | `120ms` | Hover states, button presses, icon changes |
| `--motion-normal` | `180ms` | Dropdowns, tooltips, small transitions |
| `--motion-slow` | `260ms` | Modals, sheets, page transitions |
| `--motion-dramatic` | `400ms` | Hero animations, entrance sequences |

#### Motion Rules by Component

| Component | Duration | Easing | Delay Pattern |
|-----------|----------|--------|---------------|
| **Button Hover** | 120ms | `ease-out` | None |
| **Button Press** | 80ms | `ease-out` | None |
| **Dropdown Open** | 160ms | `cubic-bezier(0.16, 1, 0.3, 1)` | None |
| **Dropdown Close** | 120ms | `ease-in` | None |
| **Modal/Dialog Open** | 220ms | `cubic-bezier(0.16, 1, 0.3, 1)` | 0ms (backdrop: 0ms) |
| **Modal/Dialog Close** | 180ms | `ease-in` | 0ms (backdrop: 0ms) |
| **Sheet/Drawer** | 300ms | `cubic-bezier(0.32, 0.72, 0, 1)` | None |
| **Card Hover** | 300ms | `ease-out` | None |
| **Toast** | 400ms | `cubic-bezier(0.16, 1, 0.3, 1)` | Stagger: 50ms between |
| **Page Transition** | 300ms | `ease-out` | None |
| **Skeleton Pulse** | 2000ms | `ease-in-out` (infinite) | Stagger: 150ms |
| **BlurFade Entrance** | 400ms | `ease-out` | Stagger: 100ms |
| **Stagger Children** | 400ms | `ease-out` | Stagger: 50-100ms per item |

#### Easing Functions Reference

```css
/* Standard easings */
--ease-linear: linear;
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

/* Custom easings (Linear/Stripe style) */
--ease-spring: cubic-bezier(0.16, 1, 0.3, 1);    /* Bouncy entrance */
--ease-entrance: cubic-bezier(0, 0, 0.2, 1);     /* Smooth deceleration */
--ease-exit: cubic-bezier(0.4, 0, 1, 1);         /* Quick acceleration */
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);   /* Sheet slide */
```

#### Motion Patterns

**Entrance (ease-out):**
- Elements entering the viewport
- Modal/sheet opening
- Toast appearing
- Hover state activation

**Exit (ease-in):**
- Elements leaving viewport
- Modal/sheet closing
- Toast dismissing
- Hover state deactivation

**Continuous (linear or ease-in-out):**
- Loading spinners
- Skeleton loading
- Marquee scrolling
- Border beam animations

**Spring (cubic-bezier(0.16, 1, 0.3, 1)):**
- Scale transforms on buttons
- Dropdown expansion
- Card lift on hover
- Dialog appearance

#### Animation Implementation Examples

```tsx
// Button hover with proper easing
<Button className="transition-all duration-120 ease-out hover:scale-[1.02] active:scale-[0.98]">

// Card entrance with stagger
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{
    duration: 0.4,
    ease: [0.16, 1, 0.3, 1],
    delay: index * 0.05
  }}
/>

// Dropdown with proper open/close easing
<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
    />
  )}
</AnimatePresence>
```

#### Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### 1.7 Component Architecture

#### Core Components (shadcn/ui)

Located in `apps/web/src/components/ui/`

| Component | File | Variants | Custom Features |
|-----------|------|----------|-----------------|
| **Button** | `button.tsx` | default, destructive, outline, secondary, ghost, link | xs, sm, lg, icon sizes; icon-xs, icon-sm, icon-lg |
| **Card** | `card.tsx` | — | Header, Title (h3), Description, Content, Footer |
| **Input** | `input.tsx` | — | Rounded-md, ring focus states, icon support |
| **Textarea** | `textarea.tsx` | — | Multi-line with auto-resize |
| **Select** | `select.tsx` | — | Radix-based with animations, scrollable |
| **Dialog** | `dialog.tsx` | — | AnimatePresence, backdrop blur, motion |
| **Sheet** | `sheet.tsx` | — | Side drawer with spring animation |
| **Badge** | `badge.tsx` | default, secondary, destructive, outline, success, warning | Semantic color variants |
| **Toast** | `toast.tsx` | default, destructive | Notification system with swipe dismiss |
| **Skeleton** | `skeleton.tsx` | — | Loading placeholder with pulse animation |
| **Progress** | `progress.tsx` | — | Indeterminate and determinate |
| **Tabs** | `tabs.tsx` | — | Radix-based with active indicator |
| **Tooltip** | `tooltip.tsx` | — | Hover delay, positioning |
| **Dropdown Menu** | `dropdown-menu.tsx` | — | Nested menus, separators, shortcuts |
| **Avatar** | `avatar.tsx` | — | Fallback with initials, sizes |
| **Alert Dialog** | `alert-dialog.tsx` | — | Destructive confirmation patterns |
| **Label** | `label.tsx` | — | Form label with required indicator |
| **Separator** | `separator.tsx` | — | Horizontal and vertical |

#### Animation Components (Custom)

Located in `apps/web/src/components/ui/`

| Component | File | Purpose | Motion Pattern |
|-----------|------|---------|----------------|
| **BlurFade** | `blur-fade.tsx` | Entrance animations with blur | opacity + y + blur, stagger support |
| **ShineBorder** | `shine-border.tsx` | Animated gradient border | 14s linear infinite rotation |
| **BorderBeam** | `border-beam.tsx` | Traveling gradient border | Vertical beam animation |
| **DotPattern** | `dot-pattern.tsx` | Background dot grid | Static with optional glow |
| **Marquee** | `marquee.tsx` | Infinite scroll container | CSS animation, pause on hover |
| **WordRotate** | `word-rotate.tsx` | Text rotation | 3s interval, blur transition |
| **NumberTicker** | `number-ticker.tsx` | Animated counting | Duration-based counting |
| **AnimatedShinyText** | `animated-shiny-text.tsx` | Shimmer text | Gradient position animation |
| **AnimatedList** | `animated-list.tsx` | Staggered list items | Framer Motion stagger |
| **Ripple** | `ripple.tsx` | Expanding circles | Scale + opacity animation |

#### Domain Components (Business Logic)

Located in `apps/web/src/components/`

| Component | Purpose | Props Interface |
|-----------|---------|-----------------|
| **ActivityTimeline** | Ticket activity feed | `ticketId: string` |
| **CommandPalette** | CMD+K navigation | — |
| **DashboardLayout** | App shell with sidebar | `children: React.ReactNode` |
| **EmptyState** | Consistent empty state | `icon, title, description, action?` |
| **PageHeader** | Page title with actions | `title, description?, action?` |
| **TicketStatusChart** | Recharts donut chart | `tickets: Ticket[]` |
| **UploadDropzone** | File upload with drag-drop | `onUpload, acceptedTypes?` |
| **ThemeToggle** | Dark/light mode switch | `className?` |
| **AuthGuard** | Route protection wrapper | `children, allowedRoles?` |

#### Component Usage Patterns

**Button Patterns:**
```tsx
// Primary CTA
<Button size="lg">Create Ticket</Button>

// Destructive action
<Button variant="destructive" size="sm">Delete</Button>

// Icon button
<Button variant="ghost" size="icon"><Plus className="h-4 w-4" /></Button>

// Loading state
<Button disabled={isLoading}>
  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
  Submit
</Button>
```

**Card Patterns:**
```tsx
// Stats card with hover effect
<Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/20">
  <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent
    opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>

// Link card
<Link href="/path">
  <Card className="cursor-pointer hover:border-primary/30 transition-all duration-300">
    <CardContent>...</CardContent>
  </Card>
</Link>
```

### 1.8 Layout System

#### Layout Philosophy

**Container-based responsive design** with a **240px fixed sidebar** and **flexible content area**. The layout prioritizes:
1. **Clear information hierarchy** — sidebar for navigation, header for context, main for content
2. **Scannable content** — cards, grids, and consistent spacing
3. **Responsive adaptation** — collapsible sidebar on mobile, full-width on desktop

#### Page Container System

| Container | Max Width | Padding | Usage |
|-----------|-----------|---------|-------|
| **Full Width** | 100% | `px-4 lg:px-6` | Dashboard pages |
| **Narrow** | `max-w-lg` (512px) | `px-4` | Forms, login |
| **Medium** | `max-w-2xl` (672px) | `px-4` | Detail pages |
| **Wide** | `max-w-4xl` (896px) | `px-4` | Complex forms |
| **Content** | `max-w-6xl` (1152px) | `px-6` | Landing pages |

#### Dashboard Layout Structure

```tsx
// apps/web/src/components/dashboard-layout.tsx
<div className="flex h-screen overflow-hidden bg-background">
  {/* Sidebar — Fixed on mobile, collapsible on desktop */}
  <aside className="fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-card
    transition-all duration-200
    lg:static lg:translate-x-0
    w-64 (expanded) | w-16 (collapsed)"
  >
    {/* Logo Section */}
    <div className="flex h-16 items-center border-b px-6">
      <div className="h-8 w-8 rounded-lg bg-primary text-white font-bold">M</div>
      <span className="ml-2 text-lg font-semibold">Maintix</span>
    </div>

    {/* Navigation */}
    <nav className="flex-1 space-y-1 p-4">
      {/* Nav items with active state */}
    </nav>

    {/* User Section */}
    <div className="border-t p-4">
      {/* Avatar, name, role, logout */}
    </div>
  </aside>

  {/* Main Content */}
  <div className="flex flex-1 flex-col overflow-hidden">
    {/* Header — 64px height */}
    <header className="flex h-16 items-center gap-4 border-b bg-card px-4 lg:px-6">
      {/* Mobile menu button, breadcrumbs, command palette, theme toggle, notifications */}
    </header>

    {/* Page Content — Scrollable */}
    <main className="flex-1 overflow-y-auto p-4 lg:p-6">
      {children}
    </main>
  </div>
</div>
```

**Layout Specifications:**

| Element | Value | Notes |
|---------|-------|-------|
| **Sidebar Width (Expanded)** | `240px` (w-64) | Shows icons + text |
| **Sidebar Width (Collapsed)** | `64px` (w-16) | Icons only |
| **Header Height** | `64px` (h-16) | Fixed top bar |
| **Main Padding** | `16px` (p-4) mobile, `24px` (p-6) desktop |
| **Content Max Width** | 100% (flexible) | Within flex container |

#### Grid System

**Responsive Grid Patterns:**

```css
/* 1-2-3 column grid */
grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4

/* Stats row (4 columns on large) */
grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4

/* Detail page layout (2 columns, 2:1 ratio) */
grid-cols-1 lg:grid-cols-3 gap-6
  /* Main content: lg:col-span-2 */
  /* Sidebar: lg:col-span-1 */

/* Form layout */
grid-cols-1 md:grid-cols-2 gap-4
```

**Spacing Between Sections:**

| Pattern | Class | Usage |
|---------|-------|-------|
| **Tight sections** | `space-y-4` | Related content groups |
| **Standard sections** | `space-y-6` | Page sections |
| **Loose sections** | `space-y-8` | Major page divisions |

#### Responsive Breakpoints

| Breakpoint | Width | Behavior |
|------------|-------|----------|
| **Mobile** | < 640px | Single column, hidden sidebar, hamburger menu |
| **Tablet (sm)** | ≥ 640px | 2-column grids, sidebar overlay |
| **Desktop (lg)** | ≥ 1024px | Full sidebar, multi-column layouts |
| **Large (xl)** | ≥ 1280px | Maximized layouts, wider spacing |

**Mobile Adaptations:**
- Sidebar becomes slide-out drawer with overlay
- Command palette hidden, search in header
- Grid columns reduce to 1-2
- Filter bar stacks vertically
- Tables become cards or horizontal scroll

### 1.9 Real Product Screens

#### Screen Inventory

| Screen | Route | Primary Function |
|--------|-------|------------------|
| **Dashboard** | `/dashboard` | Overview stats, quick actions |
| **Tickets List** | `/dashboard/tickets` | Browse, filter, create tickets |
| **Ticket Detail** | `/dashboard/tickets/[id]` | View, manage single ticket |
| **Properties List** | `/dashboard/properties` | Property management |
| **Property Detail** | `/dashboard/properties/[id]` | Single property view |
| **Users** | `/dashboard/users` | Team management (manager only) |
| **Notifications** | `/dashboard/notifications` | Activity feed |
| **Login** | `/login` | Authentication |
| **Landing** | `/` | Marketing page |

#### Dashboard Page Wireframe

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Header: Breadcrumbs | ⌘K Search | Theme | 🔔 (3)                         │ 64px
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Welcome back, Alex                                                         │
│  Here's an overview of your maintenance platform.                          │
│                                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ 📋         │  │ 🎫         │  │ ⏰         │  │ 👥         │        │
│  │ Properties │  │ Open       │  │ Pending    │  │ Team       │        │
│  │ 12         │  │ 8          │  │ 3          │  │ 24         │        │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Ticket Status Distribution [Donut Chart]                              │   │
│  │ Open: 8 | In Progress: 5 | Completed: 45 | Approved: 12 | Closed: 89  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  Your Properties                                            [View All →]    │
│                                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                      │
│  │ Sunset Plaza │  │ Ocean View   │  │ Downtown     │                      │
│  │ 123 Main St  │  │ 456 Beach Rd │  │ 789 Center   │                      │
│  │ →            │  │ →            │  │ →            │                      │
│  └──────────────┘  └──────────────┘  └──────────────┘                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Dashboard Components:**
- Welcome header with user name
- 4-column stats grid (properties, open tickets, pending approval, team)
- Ticket status distribution chart (donut chart with legend)
- Properties grid (3 columns on desktop)
- Each property card shows name, address, arrow on hover

#### Tickets List Page Wireframe

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Header: Dashboard / Tickets                                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Tickets                              [+ New Ticket]                        │
│  Maintenance requests across your properties.                               │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 🔍 Search... | ▼ All Properties | ▼ All Status | ▼ All Priority | ↕ Sort │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 🔴 Leaking faucet in unit 3B                    [Open] ───────────   │   │
│  │ Sunset Plaza · Plumbing · John Doe · 2 hours ago                    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 🟡 AC not cooling in lobby                      [In Progress] ───   │   │
│  │ Ocean View · HVAC · Jane Smith · 5 hours ago  → Mike               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 🔴 Elevator maintenance required                [Open] ───────────   │   │
│  │ Downtown · Elevator · Alex Johnson · 1 day ago                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│                              [Load More]                                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Tickets List Components:**
- Page header with create button (manager only)
- Filter bar: search input, property select, status select, priority select, sort dropdown
- Ticket list items with hover effect
- Each ticket shows: priority indicator (dot), title, property, category, creator, time
- Status badge on right
- Assigned technician name if assigned
- Load more button for pagination

#### Ticket Detail Page Wireframe

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Header: Dashboard / Tickets / TK-2847                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  [←] Leaking faucet in unit 3B                          [In Progress] 🔴 │
│  Created Jan 15, 2026 by John Doe                                           │
│                                                                             │
│  ┌──────────────────────────────────────────────┐  ┌───────────────────┐   │
│  │ Description                                  │  │ Details           │   │
│  │ ─────────────────────────────────────────    │  │ ───────────────── │   │
│  │ The kitchen faucet in unit 3B has been      │  │ Status: Open      │   │
│  │ leaking slowly for the past week. Tenant     │  │ Priority: High 🔴 │   │
│  │ reports water pooling under the sink.        │  │ Category: Plumbing│   │
│  │                                              │  │ Property: Sunset  │   │
│  │ [2 Attachments] 📎 IMG_2847.jpg              │  │ Created: Jan 15   │   │
│  │                📎 leak-video.mp4             │  │ Updated: Jan 15   │   │
│  │                                              │  │                   │   │
│  │ Actions                                      │  │ Assigned To:      │   │
│  │ ─────────────────────────────────────────    │  │ [Avatar] Mike R.  │   │
│  │ [Start Work] [Reassign] [Cancel] [Update    │  │                   │   │
│  │  Priority]                                   │  │ [Change Assignee] │   │
│  │                                              │  │                   │   │
│  └──────────────────────────────────────────────┘  └───────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 🕐 Activity Timeline                                                │   │
│  │ ────────────────────────────────────────────────────────────────────  │   │
│  │  ● Mike Rodriguez assigned technician → Mike R.            2m ago   │   │
│  │  ● John Doe created ticket                                 2h ago   │   │
│  │                                                                     │   │
│  │  [Load older activity]                                              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Ticket Detail Components:**
- Back button + ticket title + status badge + priority indicator
- Created by + date metadata
- 2-column layout: main content (2/3), sidebar (1/3)
- Description card with attachments
- Action buttons based on role and status
- Details card with metadata
- Assignment card with avatar
- Activity timeline with vertical line and icon nodes

#### Activity Timeline Component

```
Timeline Structure:

│  ●───── Icon node (8x8 circle with icon)
│  │       Color-coded by action type
│  │
│  ●───── Next activity
│  │
│  ●───── Last activity

Actions with icons:
• Plus → Created
• UserCheck → Assigned
• RotateCcw → Reassigned
• Play → Work Started
• CheckCircle → Completed
• ThumbsUp → Approved
• XCircle → Cancelled
• AlertTriangle → Priority Changed
• Paperclip → Attachment Added
```

### 1.10 SaaS Visual Personality

#### Visual Signature: "Indigo Glow + Glass Surfaces"

**Core Concept:** Maintix combines the **professional trust of Stripe** with the **snappy interactions of Linear**, wrapped in a distinctive visual language of **indigo glows and glassmorphism**.

**Visual Differentiators:**

| Element | Implementation | Reference |
|---------|---------------|-----------|
| **Primary Glow** | `box-shadow: 0 0 40px rgba(99,102,241,0.25)` | Stripe's button glows |
| **Glass Panels** | `backdrop-blur: 24px` with 60% white | iOS/macOS glass |
| **Gradient Mesh** | `radial-gradient` orbs in hero | Linear's backgrounds |
| **Sharp UI** | Minimal borders, crisp shadows | Linear's density |
| **Motion** | Spring physics, snappy transitions | Linear's feel |

#### Indigo Glow System

**Glow Shadows:**
```css
/* Primary glow — buttons, cards on hover */
--glow-primary: 0 0 20px rgba(99, 102, 241, 0.3);
--glow-primary-lg: 0 0 40px rgba(99, 102, 241, 0.25);
--glow-primary-xl: 0 0 60px rgba(99, 102, 241, 0.2);

/* Implementation */
.hover\:glow:hover {
  box-shadow: var(--glow-primary-lg);
}

/* Button glow on hover */
.btn-glow:hover {
  box-shadow: 0 0 40px rgba(99, 102, 241, 0.25);
}
```

**Gradient Glow Orbs:**
```tsx
// Hero background orbs
<div className="absolute top-0 left-1/4 h-[600px] w-[600px] rounded-full
  bg-primary-400/10 blur-[150px] animate-glow-pulse" />
<div className="absolute top-1/3 right-0 h-[400px] w-[400px] rounded-full
  bg-primary-300/10 blur-[120px] animate-glow-pulse [animation-delay:2s]" />
```

#### Glass Surface System

**Glass Card:**
```css
.glass {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.dark .glass {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

/* Premium glass with gradient border */
.glass-premium {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(24px);
  border: 1px solid transparent;
  background-clip: padding-box;
  position: relative;
}

.glass-premium::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(135deg, rgba(99,102,241,0.3), transparent 50%);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  -webkit-mask-composite: xor;
  pointer-events: none;
}
```

#### Brand Personality Matrix

| Trait | Expression | Implementation |
|-------|-----------|----------------|
| **Professional** | Clean lines, consistent spacing | 16px base grid, aligned baselines |
| **Trustworthy** | Security badges, clear feedback | Shield icons, success states |
| **Efficient** | Fast interactions, clear CTAs | Snappy 120ms transitions |
| **Modern** | Glass effects, subtle animations | backdrop-blur, glow effects |
| **Premium** | Gradient text, shine borders | gradient-to-r, ShineBorder component |

#### Visual Hierarchy Levels

**Level 1 — Hero/Primary:**
- Gradient text (`bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500`)
- Glow orbs in background
- Large extrabold headings
- Glass card overlays

**Level 2 — Section Headers:**
- Solid primary color
- Section badges with icons
- Consistent `space-y-6` spacing

**Level 3 — Cards/Content:**
- White/dark card surfaces
- Subtle borders (`border-neutral-200`)
- Hover glow effects

**Level 4 — Interactive Elements:**
- Primary buttons with glow
- Link hover with underline offset
- Focus rings with primary color

#### Signature Combinations

**The "Maintix Glow" (Hero CTA):**
```tsx
<Button className="bg-gradient-to-r from-primary-600 to-primary-700
  hover:shadow-[0_0_40px_rgba(99,102,241,0.25)]
  transition-all duration-300">
```

**The "Glass Card" (Feature Cards):**
```tsx
<Card className="glass group hover:border-primary/30
  transition-all duration-300">
```

**The "Shine Border" (Premium Highlight):**
```tsx
<ShineBorder borderWidth={1} duration={14}
  shineColor={['#6366f1', '#818cf8', '#a5b4fc']} />
```

**The "Gradient Text" (Hero Headlines):**
```tsx
<h1 className="bg-gradient-to-r from-primary-600 via-primary-500
  to-accent-500 bg-clip-text text-transparent">
```

#### Dark Mode Signature

**Dark Mode Adaptations:**
- Primary color shifts lighter (`#a5b4fc`)
- Glows become more pronounced (higher opacity)
- Glass backgrounds have lower opacity
- Borders remain subtle (`rgba(255,255,255,0.06)`)

```css
.dark .glow-orbs {
  opacity: 0.15; /* Higher than light mode 0.10 */
}

.dark .glass {
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.06);
}
```

---

## 2. Brand Identity Requirements

### 2.1 Product Context

**Maintix** is a multi-property maintenance management platform that connects property managers, technicians, and tenants through streamlined ticket workflows.

**Brand Personality:**
- Professional yet approachable
- Modern and tech-forward
- Trustworthy and reliable
- Efficient and organized
- Premium SaaS aesthetic

### 2.2 Logo Concepts

#### Primary Logo
- **Style:** Wordmark with icon
- **Icon Concept:** Abstract "M" formed from interconnected maintenance/tool elements (wrench + building)
- **Font:** DM Sans Bold/Extrabold
- **Lockup:** Icon left, wordmark right

#### Icon Logo (Favicon/App Icon)
- **Shape:** Rounded square with 20% corner radius
- **Design:** Stylized "M" or crossed wrench/building icon
- **Background:** Gradient from primary-500 to primary-700
- **Size:** 1024×1024px base (export to all sizes)

#### Logo Variants Needed
| Variant | Format | Sizes | Usage |
|---------|--------|-------|-------|
| Full Logo (Light) | SVG, PNG | 512px, 1024px | Light backgrounds |
| Full Logo (Dark) | SVG, PNG | 512px, 1024px | Dark backgrounds |
| Icon Only | SVG, PNG | 64px-1024px | Favicon, app icons |
| Wordmark Only | SVG | scalable | Compact spaces |
| Monochrome | SVG | scalable | Single-color contexts |

### 2.3 Brand Style Guidelines

#### Core Brand Colors
- **Primary:** `#4f46e5` (Indigo 600)
- **Secondary:** `#10b981` (Emerald 500) - for success/completion
- **Accent:** `#6366f1` (Indigo 500) - for highlights

#### Color Usage Rules
1. **60-30-10 Rule:** 60% neutral, 30% primary indigo, 10% emerald accent
2. **Dark Mode Shift:** Primary becomes lighter (`#a5b4fc`) for better contrast
3. **Gradient Usage:** Use primary-to-primary gradient for premium feel
4. **Success States:** Always use emerald green for completion/success

#### Voice & Tone
- Clear and direct
- Professional but friendly
- Action-oriented
- Trust-building (security-focused)

### 2.4 Icon Style Direction

**Selected Style:** Lucide-style outline icons with consistent characteristics:

| Attribute | Specification |
|-----------|---------------|
| **Style** | Outline/Stroke based |
| **Stroke Width** | 1.5px - 2px |
| **Corner Radius** | 1.5px-2px (slightly rounded) |
| **Line Caps** | Rounded |
| **Grid** | 24×24px base |
| **Visual Weight** | Consistent 2px stroke |
| **Library** | Lucide React (primary) |

**Characteristics:**
- Clean, minimal line work
- Geometric but friendly
- 2px consistent stroke width
- Slight rounding on corners (1.5-2px radius)
- No fill (outline only) for UI icons
- Subtle fill only for feature/illustration icons

---

## 3. Required Visual Assets

### 3.1 Logo Assets

| Asset | Formats | Sizes | Background |
|-------|---------|-------|------------|
| **Logo Full (Light)** | SVG, PNG@1x, PNG@2x, PNG@3x | 512px, 1024px | Transparent |
| **Logo Full (Dark)** | SVG, PNG@1x, PNG@2x, PNG@3x | 512px, 1024px | Transparent |
| **Logo Icon Only** | SVG, PNG | 64, 128, 256, 512, 1024 | Transparent |
| **Logo Wordmark** | SVG | scalable | Transparent |
| **Logo Monochrome** | SVG | scalable | Transparent |

### 3.2 Favicon Package

| File | Size | Format |
|------|------|--------|
| `favicon.ico` | 16×16, 32×32 | ICO (multi-resolution) |
| `favicon-16x16.png` | 16×16 | PNG |
| `favicon-32x32.png` | 32×32 | PNG |
| `apple-touch-icon.png` | 180×180 | PNG |
| `android-chrome-192x192.png` | 192×192 | PNG |
| `android-chrome-512x512.png` | 512×512 | PNG |
| `safari-pinned-tab.svg` | scalable | SVG (monochrome) |
| `mstile-150x150.png` | 150×150 | PNG |
| `browserconfig.xml` | - | XML config |
| `site.webmanifest` | - | JSON |

### 3.3 Navigation Icons

All from Lucide React, already implemented:
- `Home` - Dashboard
- `Building2` - Properties
- `Ticket` - Tickets
- `Users` - Users
- `Bell` - Notifications
- `Settings` - Settings
- `LogOut` - Sign out
- `Menu` - Mobile menu
- `X` - Close
- `ArrowRight` - Navigation
- `ChevronDown` - Dropdowns
- `Search` - Search

### 3.4 Feature Icons (Custom/Enhanced)

For landing page features section, create custom illustrated icons:

| Feature | Icon Concept | Style |
|---------|--------------|-------|
| **Ticket Management** | Clipboard with wrench overlay | Outline + subtle fill |
| **Role-Based Access** | Shield with user silhouettes | Outline |
| **Real-time Sync** | Lightning bolt with sync arrows | Dynamic lines |
| **Multi-Property** | Multiple building outlines | Stacked geometric |
| **Smart Notifications** | Bell with AI/gear indicator | Tech-forward |
| **Analytics Dashboard** | Chart bars with trend line | Data visualization |

### 3.5 Empty State Illustrations

| State | Description | Style |
|-------|-------------|-------|
| **No Tickets** | Empty inbox/document with search | Line illustration |
| **No Properties** | Building outline with plus sign | Minimal line art |
| **No Users** | User silhouettes with dotted outline | Soft illustration |
| **No Notifications** | Bell with sleep z's | Friendly, minimal |
| **No Results** | Magnifying glass with question | Search-focused |
| **Error State** | Warning triangle with tools | Alert styling |
| **Success State** | Checkmark with confetti | Celebration |
| **Loading** | Animated spinner (exists) | Motion component |

### 3.6 Dashboard Illustrations

| Illustration | Use Case | Dimensions |
|--------------|----------|------------|
| **Welcome Hero** | First-time user dashboard | 600×400px |
| **Quick Start Guide** | Onboarding steps | 400×300px |
| **Property Map Pin** | Property location indicator | 48×48px |
| **Ticket Priority Indicators** | High/Medium/Low badges | 24×24px |
| **Status Badges** | Open/Assigned/Progress/Complete | 16×16px icons |
| **Activity Timeline** | Event icons | 24×24px |

### 3.7 Background Graphics

| Asset | Usage | Format |
|-------|-------|--------|
| **Dot Pattern** | Hero background (exists) | SVG/CSS |
| **Glow Orbs** | Hero accents (exists) | CSS gradient |
| **Noise Texture** | Grain overlay (exists) | SVG filter |
| **Grid Pattern** | Subtle section backgrounds | SVG |
| **Gradient Mesh** | Premium sections | PNG/SVG |
| **Abstract Lines** | Feature section accents | SVG |

### 3.8 Marketing Visuals (Landing Page)

| Asset | Description | Dimensions |
|-------|-------------|------------|
| **Dashboard Mockup** | Product screenshot/UI preview | 1200×800px |
| **Feature Bento Grid** | 6-card feature showcase | Responsive |
| **Workflow Diagram** | 6-stage ticket flow | 800×200px |
| **Role Cards** | Manager/Tech/Tenant icons | 200×200px each |
| **Testimonial Avatars** | User profile images | 64×64px, 128×128px |
| **Trust Badges** | Security/SSL/compliance | 120×40px |
| **Social Proof Logos** | Company logos (placeholder) | 120×40px |

### 3.9 Loading Animations

| Animation | Usage | Implementation |
|-----------|-------|----------------|
| **Spinner** | Button loading states | Lucide Loader2 |
| **Skeleton** | Content loading | shadcn Skeleton |
| **Shimmer** | Card placeholder | CSS animation (exists) |
| **Progress Bar** | File uploads, processes | shadcn Progress |
| **Page Transition** | Route changes | Motion library |

---

## 4. Icon System Specification

### 4.1 Size System

| Size | Pixels | Usage |
|------|--------|-------|
| **XS** | 12px | Inline text, badges |
| **SM** | 16px | Buttons, inline |
| **MD** | 20px | Form inputs, navigation |
| **LG** | 24px | Standard UI, cards |
| **XL** | 32px | Feature icons, empty states |
| **2XL** | 48px | Large feature highlights |
| **3XL** | 64px | Hero illustrations |

### 4.2 Stroke Width Guidelines

| Context | Width | Notes |
|---------|-------|-------|
| **Navigation** | 1.5px | Lucide default |
| **Buttons** | 1.5px | Match text weight |
| **Feature Icons** | 2px | Slightly bolder for visibility |
| **Illustrations** | 2px | Consistent line weight |
| **Decorative** | 1px | Subtle accents |

### 4.3 Grid System

**Base Grid:** 24×24px viewBox
```
+------------------------+
|  2px margin (safe zone) |
|  +------------------+  |
|  |  20px live area  |  |
|  |                  |  |
|  +------------------+  |
|  2px margin            |
+------------------------+
```

### 4.4 Naming Conventions

```
[category]-[name]-[variant]-[size].[ext]

Examples:
logo-maintix-full.svg
logo-maintix-icon-dark.svg
icon-ticket-outline-24.svg
illustration-empty-tickets-light.svg
bg-dot-pattern.svg
```

### 4.5 SVG Export Standards

**Requirements:**
- ViewBox: `0 0 24 24` (for icons) or appropriate for illustrations
- No width/height attributes (scale via CSS)
- Fill: `currentColor` or `none` for strokes
- Stroke: `currentColor` for outline icons
- Clean paths: No unnecessary points
- Optimized: Run through SVGO
- Accessible: Include `aria-hidden` or proper labels

---

## 5. Asset Generation Prompts

### 5.1 Logo Prompts

#### Primary Logo (Full)
```
A modern SaaS logo for "Maintix" - a property maintenance management platform.

Design: Wordmark "Maintix" in DM Sans font with an abstract icon to the left.

Icon concept: A stylized letter "M" formed by a combination of a wrench
and building outline, representing maintenance and property management.

Style: Clean, geometric, tech-forward. Outline-based with 2px stroke weight.

Colors: Primary indigo (#4f46e5) for icon, dark charcoal (#171717) for wordmark.

Background: Transparent.

Mood: Professional, trustworthy, efficient, modern.

Format: Vector SVG, minimalist design, scalable.
```

#### App Icon
```
App icon for Maintix property maintenance platform.

Shape: Rounded square with smooth corners (20% radius).

Design: Stylized "M" made from a wrench and building silhouette,
or crossed tools with a subtle building outline.

Style: Modern, flat design with subtle depth. Glassmorphism optional.

Gradient: Linear gradient from #6366f1 (top-left) to #4f46e5 (bottom-right).

Icon color: White (#ffffff) with subtle drop shadow.

Background: Rich indigo gradient.

Mood: Professional, reliable, tech-savvy.

Format: 1024x1024px, export to all platform sizes.
```

### 5.2 Feature Icon Prompts

#### Ticket Management Icon
```
Feature icon for ticket management system.

Design: A clipboard document with a small wrench overlay in the corner.
The clipboard shows 3 horizontal lines representing text.

Style: Outline icon, 2px stroke, rounded corners (1.5px radius).
Geometric and clean.

Color: Indigo (#4f46e5) stroke on transparent background.

Size: 48x48px viewBox.

Mood: Organized, efficient, professional.

Format: SVG, Lucide-style consistent line weight.
```

#### Role-Based Access Icon
```
Feature icon for role-based access control.

Design: A shield shape containing three small user silhouettes
arranged in a row, representing different user roles.

Style: Outline icon, 2px stroke, rounded edges.

Color: Indigo (#4f46e5).

Size: 48x48px viewBox.

Mood: Secure, trustworthy, organized.

Format: SVG.
```

#### Real-time Sync Icon
```
Feature icon for real-time synchronization.

Design: A lightning bolt with circular sync arrows around it,
or a refresh icon with speed lines.

Style: Dynamic outline, 2px stroke, motion implied through curves.

Color: Indigo (#4f46e5) or Emerald (#10b981) for "active" feel.

Size: 48x48px viewBox.

Mood: Fast, modern, connected.

Format: SVG.
```

### 5.3 Empty State Illustration Prompts

#### No Tickets Empty State
```
Empty state illustration for "No tickets found".

Design: A friendly, minimal line illustration of an empty inbox
or clipboard with a magnifying glass. Add subtle dashed lines
suggesting "searching."

Style: Minimalist line art, 2px strokes, rounded corners.
No fill, just outlines.

Colors: Neutral gray (#737373) on transparent,
with a small accent of indigo (#4f46e5) on the magnifying glass.

Size: 200x160px.

Mood: Friendly, helpful, not alarming.

Format: SVG.
```

#### No Properties Empty State
```
Empty state illustration for "No properties yet".

Design: A simple building outline with a plus (+) sign in a circle
overlay at the bottom right. Subtle dotted outline effect.

Style: Minimalist line art, architectural but friendly.

Colors: Neutral gray with indigo accent on the plus sign.

Size: 200x160px.

Mood: Inviting, ready to add, clean slate.

Format: SVG.
```

### 5.4 Background Asset Prompts

#### Hero Dot Pattern
```
Subtle dot pattern background for SaaS hero section.

Design: Grid of small circles, evenly spaced, creating a
technical but elegant texture.

Specs: 32px grid spacing, 1-2px dot radius.

Color: Muted indigo (#a5b4fc) at 15% opacity on transparent.
Dark mode: Same dots at 12% opacity.

Style: Technical, premium, subtle.

Format: SVG pattern, tileable.
```

#### Gradient Glow Orbs
```
Abstract gradient orbs for hero background decoration.

Design: Soft, blurry circular gradients, overlapping.
Large scale (600px diameter implied).

Colors: Primary indigo (#818cf8) at 10% opacity,
blending to transparent.

Effect: Gaussian blur 150px radius.

Style: Ethereal, premium, tech atmosphere.

Format: CSS/SVG gradient, can be generated with CSS.
```

#### Noise Texture Overlay
```
Subtle noise texture overlay for premium feel.

Design: Fractal noise pattern, very fine grain.

Opacity: 4% (nearly invisible but adds texture).

Style: Film grain, premium texture.

Format: SVG filter or CSS noise texture.
Implementation: Already exists in codebase via CSS.
```

### 5.5 Marketing Visual Prompts

#### Dashboard Mockup
```
Product screenshot/mockup of Maintix dashboard.

Show: Modern SaaS dashboard with sidebar navigation, header,
cards showing ticket statistics, recent activity feed.

Style: Clean UI, card-based layout, indigo accent color.
Dark mode variant: Deep charcoal backgrounds (#18181b).

Details: Include sample data - ticket counts, status badges,
property list, notification bell.

Perspective: Slight isometric angle or flat front-facing.

Shadow: Soft drop shadow, floating effect.

Size: 1200x800px.

Format: PNG or SVG illustration.
```

#### Workflow Visualization
```
6-stage workflow diagram for property maintenance process.

Stages: Open → Assigned → In Progress → Completed → Approved → Closed

Design: Horizontal flow with connected nodes.
Each node is a circle with an icon inside.
Connecting lines show progression.

Style: Clean, modern, timeline aesthetic.

Colors: Indigo for active/complete, gray for pending.
Emerald green for "Approved/Closed" success states.

Size: 800x200px, responsive.

Format: SVG.
```

---

## 6. Folder Structure for Assets

```
/apps/web/public/
├── /assets/
│   ├── /logo/
│   │   ├── logo-full.svg
│   │   ├── logo-full-dark.svg
│   │   ├── logo-icon.svg
│   │   ├── logo-wordmark.svg
│   │   └── /exports/
│   │       ├── logo-512.png
│   │       ├── logo-1024.png
│   │       └── logo-monochrome.svg
│   │
│   ├── /favicon/
│   │   ├── favicon.ico
│   │   ├── favicon-16x16.png
│   │   ├── favicon-32x32.png
│   │   ├── apple-touch-icon.png
│   │   ├── android-chrome-192x192.png
│   │   ├── android-chrome-512x512.png
│   │   ├── safari-pinned-tab.svg
│   │   ├── mstile-150x150.png
│   │   ├── browserconfig.xml
│   │   └── site.webmanifest
│   │
│   ├── /icons/
│   │   ├── /navigation/
│   │   │   ├── home.svg
│   │   │   ├── properties.svg
│   │   │   ├── tickets.svg
│   │   │   ├── users.svg
│   │   │   ├── notifications.svg
│   │   │   └── settings.svg
│   │   │
│   │   ├── /actions/
│   │   │   ├── search.svg
│   │   │   ├── filter.svg
│   │   │   ├── sort.svg
│   │   │   ├── edit.svg
│   │   │   ├── delete.svg
│   │   │   └── more.svg
│   │   │
│   │   ├── /status/
│   │   │   ├── open.svg
│   │   │   ├── assigned.svg
│   │   │   ├── in-progress.svg
│   │   │   ├── completed.svg
│   │   │   ├── approved.svg
│   │   │   └── closed.svg
│   │   │
│   │   └── /features/
│   │       ├── ticket-management.svg
│   │       ├── role-access.svg
│   │       ├── real-time.svg
│   │       ├── multi-property.svg
│   │       ├── notifications.svg
│   │       └── analytics.svg
│   │
│   ├── /illustrations/
│   │   ├── /empty-states/
│   │   │   ├── no-tickets.svg
│   │   │   ├── no-properties.svg
│   │   │   ├── no-users.svg
│   │   │   ├── no-notifications.svg
│   │   │   ├── no-results.svg
│   │   │   ├── error.svg
│   │   │   └── success.svg
│   │   │
│   │   ├── /dashboard/
│   │   │   ├── welcome-hero.svg
│   │   │   ├── quick-start.svg
│   │   │   └── activity-timeline.svg
│   │   │
│   │   └── /marketing/
│   │       ├── hero-dashboard.svg
│   │       ├── feature-workflow.svg
│   │       └── role-icons/
│   │           ├── manager.svg
│   │           ├── technician.svg
│   │           └── tenant.svg
│   │
│   ├── /backgrounds/
│   │   ├── dot-pattern.svg
│   │   ├── grid-pattern.svg
│   │   ├── gradient-mesh.svg
│   │   ├── noise-texture.svg
│   │   └── /orbs/
│   │       ├── orb-primary.svg
│   │       └── orb-secondary.svg
│   │
│   └── /animations/
│       ├── loading-spinner.lottie
│       ├── success-check.json
│       └── notification-bell.json
│
└── /images/
    ├── /marketing/
    │   ├── dashboard-screenshot.png
    │   ├── mobile-app-mockup.png
    │   └── team-photo.jpg
    │
    ├── /testimonials/
    │   ├── avatar-1.jpg
    │   ├── avatar-2.jpg
    │   └── avatar-3.jpg
    │
    └── /blog/
        └── (blog post images)
```

---

## 7. Design Consistency Recommendations

### 7.1 Current Strengths

1. **Strong Color System:** Well-defined indigo/emerald palette with semantic mapping
2. **Consistent Typography:** DM Sans + Inter pairing works well for SaaS
3. **Animation Library:** Excellent Motion-based components (BlurFade, ShineBorder, etc.)
4. **Glassmorphism:** Appropriate use of backdrop-blur and transparency
5. **Dark Mode:** Comprehensive variable system for theme switching
6. **Border Radius:** Consistent scale from sm to 2xl
7. **Lucide Icons:** Consistent icon library throughout

### 7.2 Areas for Improvement

#### High Priority

1. **Custom Logo Design**
   - Current placeholder: "M" in a gradient box
   - Need: Professional logo with brand identity
   - Action: Create logo assets per Section 5.1

2. **Empty State Illustrations**
   - Currently missing or using generic icons
   - Need: Custom illustrations for all empty states
   - Action: Generate illustrations per Section 3.5

3. **Feature Icons**
   - Landing page uses Lucide icons exclusively
   - Need: Custom illustrated feature icons for bento grid
   - Action: Create custom SVG feature icons

#### Medium Priority

4. **Favicon Package**
   - Need: Complete favicon set for all platforms
   - Action: Generate from logo icon per Section 3.2

5. **Marketing Imagery**
   - Dashboard mockup could be enhanced
   - Need: Higher-fidelity product screenshots
   - Action: Create polished dashboard mockup

6. **Background Variety**
   - Dot pattern used throughout
   - Need: Additional subtle patterns for section differentiation
   - Action: Create grid pattern, abstract lines

#### Low Priority

7. **Animation Polish**
   - Some animations could use stagger improvements
   - Need: Lottie animations for complex interactions
   - Action: Consider Lottie for success states

8. **Icon Consistency**
   - Some icons may have inconsistent sizing
   - Need: Audit all icon usage for 16/20/24px consistency
   - Action: Review codebase for icon size standardization

### 7.3 Missing UI Elements

| Element | Priority | Notes |
|---------|----------|-------|
| Onboarding wizard | High | Step-by-step first-time setup |
| Tutorial tooltips | Medium | Contextual help system |
| Confirmation illustrations | Medium | For destructive actions |
| Achievement badges | Low | Gamification elements |
| Printable report templates | Low | PDF export styling |
| Email template assets | Medium | Notification email headers |

### 7.4 Modern SaaS Standards to Adopt

1. **Micro-interactions**
   - Add subtle scale transforms on button hover
   - Implement staggered list item entrances
   - Add haptic feedback patterns for mobile

2. **Visual Hierarchy**
   - Increase shadow depth on elevated elements
   - Use gradient text sparingly for emphasis only
   - Ensure sufficient color contrast (WCAG AA)

3. **Accessibility**
   - Add `prefers-reduced-motion` media query (partially done)
   - Ensure all icons have aria-labels
   - Test color contrast ratios

4. **Responsive Imagery**
   - Implement `srcset` for marketing images
   - Create mobile-optimized illustration variants
   - Consider dark mode variants for all images

5. **Performance**
   - Lazy load below-fold illustrations
   - Optimize SVG files (SVGO)
   - Use CSS animations over JS where possible

---

## 8. Implementation Checklist

### Phase 1: Core Brand Assets (Week 1)
- [ ] Create logo variants (full, icon, wordmark)
- [ ] Generate favicon package
- [ ] Design custom feature icons (6)
- [ ] Set up asset folder structure

### Phase 2: UI Assets (Week 2)
- [ ] Create empty state illustrations (8)
- [ ] Design status badge icons
- [ ] Add navigation icon variants
- [ ] Create background patterns

### Phase 3: Marketing Assets (Week 3)
- [ ] Design dashboard mockup
- [ ] Create workflow visualization
- [ ] Generate role icons
- [ ] Design testimonial avatars

### Phase 4: Polish & Integration (Week 4)
- [ ] Audit icon usage consistency
- [ ] Add missing animations
- [ ] Test dark mode variants
- [ ] Optimize all assets
- [ ] Document usage guidelines

---

## Appendix A: Color Reference Chart

### Indigo Palette (Primary)
```
50:  #eef2ff
100: #e0e7ff
200: #c7d2fe
300: #a5b4fc
400: #818cf8
500: #6366f1
600: #4f46e5  ← BRAND PRIMARY
700: #4338ca
800: #3730a3
900: #312e81
950: #1e1b4b
```

### Emerald Palette (Accent)
```
400: #34d399
500: #10b981  ← SUCCESS/ACCENT
600: #16a34a
```

### Neutral Palette (Zinc)
```
50:  #fafafa
100: #f5f5f5
200: #e5e5e5  ← BORDERS
300: #d4d4d4
400: #a3a3a3
500: #737373  ← MUTED TEXT
600: #525252
700: #404040
800: #262626
900: #171717  ← TEXT
950: #0a0a0a
```

---

## Appendix B: Icon Usage Reference

### Navigation Icons (Lucide)
| Route | Icon | Size |
|-------|------|------|
| Dashboard | `Home` | 20px |
| Properties | `Building2` | 20px |
| Tickets | `Ticket` | 20px |
| Users | `Users` | 20px |
| Notifications | `Bell` | 20px |

### Action Icons (Lucide)
| Action | Icon | Size |
|--------|------|------|
| Search | `Search` | 16px |
| Filter | `Filter` | 16px |
| Edit | `Pencil` | 16px |
| Delete | `Trash2` | 16px |
| Close | `X` | 16px |
| More | `MoreVertical` | 16px |

### Status Icons (Custom/Lucide)
| Status | Icon | Color |
|--------|------|-------|
| Open | `Circle` | Neutral |
| Assigned | `UserCircle` | Primary |
| In Progress | `Clock` | Warning |
| Completed | `CheckCircle2` | Success |
| Approved | `CheckCircle` | Success |
| Closed | `Check` | Success |

---

## Appendix C: Design Asset Plan Audit Report

> Comprehensive audit by Senior Brand Identity Strategist & Lead Frontend Engineer
> **Industry:** Property Maintenance SaaS (PropTech)
> **Risk Score:** **6/10** (Moderate risk - missing critical social/metadata assets)
> **Audit Date:** March 2026

---

### C.1 Gap Analysis Table

| Category | Asset/Requirement | Status | Priority | Impact |
|----------|-----------------|--------|----------|--------|
| **Critical Gaps** |
| Metadata | OpenGraph Images (1200×630) | ❌ Missing | 🔴 P0 | Social sharing fails |
| Metadata | Twitter Card Images | ❌ Missing | 🔴 P0 | Twitter previews broken |
| Metadata | OpenGraph Video (optional) | ❌ Missing | 🟡 P2 | Rich sharing |
| Icons | iOS App Icon (apple-touch-icon) | ✅ Planned | 🟢 P1 | Covered in favicon |
| Icons | Safari Pinned Tab | ✅ Planned | 🟢 P1 | Monochrome SVG defined |
| **Technical Gaps** |
| Assets | WebP Format Variants | ❌ Missing | 🟡 P2 | Performance optimization |
| Assets | Responsive Image Srcset | ❌ Missing | 🟡 P2 | Bandwidth efficiency |
| Assets | SVG Sprite Sheet | ❌ Missing | 🟡 P2 | HTTP request reduction |
| CSS | CSS Container Queries | ❌ Missing | 🟡 P2 | Layout scalability |
| **Accessibility Gaps** |
| A11y | Focus Indicator Assets | ❌ Missing | 🟡 P2 | Keyboard navigation |
| A11y | Reduced Motion Fallbacks | ⚠️ Partial | 🟡 P2 | Only basic support |

---

### C.2 Technical Scalability Assessment

#### ✅ Strengths

| Aspect | Evaluation |
|--------|------------|
| **Vector Formats** | All icons and illustrations planned as SVG — scalable, crisp at all resolutions |
| **CSS-Based Effects** | Glow orbs, noise textures, dot patterns are CSS-generated — no image bloat |
| **Icon System** | Lucide React provides tree-shakeable imports — only used icons bundled |
| **Motion** | CSS animations with `will-change` hints — GPU-accelerated |

#### ⚠️ Concerns

| Aspect | Issue | Recommendation |
|--------|-------|----------------|
| **PNG Exports** | Logo exports at 1x/2x/3x require manual generation | Use `sharp` or `satori` for automated generation |
| **Illustration Complexity** | Empty state SVGs may become bloated if overly detailed | Keep < 50KB each, use simple paths |
| **No Sprite Sheet** | Individual SVG imports = multiple HTTP requests | Consider sprite sheet for >20 icons |
| **Missing WebP** | No WebP variants for raster fallbacks | Generate WebP alongside PNG |

**Scalability Score: 8/10**

---

### C.3 System Completeness Assessment

#### Invisible Assets Check

| Asset | Status | Notes |
|-------|--------|-------|
| **Favicon (ICO)** | ✅ Planned | Multi-resolution favicon.ico |
| **Favicon (PNG)** | ✅ Planned | 16×16, 32×32 PNG variants |
| **Apple Touch Icon** | ✅ Planned | 180×180 PNG specified |
| **Android Icons** | ✅ Planned | 192×192, 512×512 specified |
| **Web Manifest** | ✅ Planned | site.webmanifest included |
| **Browser Config** | ✅ Planned | browserconfig.xml for IE/Edge |
| **Safari Pinned Tab** | ✅ Planned | Monochrome SVG specified |
| **OpenGraph Image** | ❌ **MISSING** | **Critical for social sharing** |
| **Twitter Card Image** | ❌ **MISSING** | **Critical for Twitter/X** |
| **Manifest Icons** | ⚠️ Partial | No maskable icon for Android |

#### Missing Critical Assets

1. **OpenGraph/Social Images** — Not mentioned anywhere in the 1,500+ line document
2. **Loading States** — Only skeleton component mentioned, no custom loading illustrations
3. **Error State Illustrations** — Generic error icon, no custom 404/500 illustrations
4. **Onboarding Illustrations** — No welcome/tutorial visuals

**Completeness Score: 6/10**

---

### C.4 Mathematical Harmony Analysis

#### Spacing Grid System

| Token | Value | Multiple of 4 | Status |
|-------|-------|---------------|--------|
| `xs` | 4px | ✅ 1× | Valid |
| `sm` | 8px | ✅ 2× | Valid |
| `md` | 16px | ✅ 4× | Valid |
| `lg` | 24px | ✅ 6× | Valid |
| `xl` | 32px | ✅ 8× | Valid |
| `2xl` | 48px | ✅ 12× | Valid |
| `3xl` | 64px | ✅ 16× | Valid |

**Verdict:** ✅ **Consistent 4px base grid** — follows Tailwind conventions, mathematically sound

#### Border Radius System

| Token | Value | Multiple of 4 | Status |
|-------|-------|---------------|--------|
| `sm` | 6px | ❌ 1.5× | Minor deviation |
| `md` | 8px | ✅ 2× | Valid |
| `lg` | 12px | ✅ 3× | Valid |
| `xl` | 16px | ✅ 4× | Valid |
| `2xl` | 20px | ❌ 5× | Minor deviation |

**Verdict:** ⚠️ **Mostly consistent** — 6px and 20px break 4px grid but are acceptable

#### Aspect Ratios (Planned Assets)

| Asset | Dimensions | Ratio | Status |
|-------|------------|-------|--------|
| Logo | 1024×1024 | 1:1 | ✅ Square |
| OG Image | ❌ Not defined | — | ⚠️ **Missing** |
| Hero Illustrations | 600×400 | 3:2 | ✅ Standard |
| Avatar | 64×64, 128×128 | 1:1 | ✅ Square |

**Verdict:** ⚠️ **OpenGraph aspect ratio undefined** — should be 1.91:1 (1200×630)

**Mathematical Harmony Score: 8/10**

---

### C.5 Accessibility (WCAG) Assessment

#### Color Contrast Analysis

| Combination | Foreground | Background | Ratio | WCAG AA | Status |
|-------------|------------|------------|-------|---------|--------|
| Primary Text | `#171717` | `#ffffff` | 15.3:1 | ✅ Pass | ✅ |
| Muted Text | `#737373` | `#ffffff` | 4.6:1 | ✅ Pass (4.5:1) | ✅ |
| Primary Button | `#ffffff` | `#4f46e5` | 4.5:1 | ✅ Pass | ✅ |
| Success | `#ffffff` | `#22c55e` | 3.9:1 | ❌ Fail (needs 4.5:1) | ⚠️ |
| Warning | `#ffffff` | `#f59e0b` | 2.0:1 | ❌ Fail | 🔴 |
| Error | `#ffffff` | `#ef4444` | 4.0:1 | ❌ Fail (needs 4.5:1) | 🔴 |
| Dark Mode Primary | `#a5b4fc` | `#09090b` | 7.8:1 | ✅ Pass | ✅ |

#### Critical Issues

1. **Warning Color (#f59e0b)** — Only 2.0:1 contrast on white, needs dark text
2. **Error Color (#ef4444)** — 4.0:1, fails AA standard
3. **Success Color (#22c55e)** — 3.9:1, barely fails

#### Recommended Fixes

```css
/* Warning - use dark text instead of white */
.text-warning-dark {
  color: #92400e; /* amber-800 */
}

/* Error - darken the error color or use darker text */
.text-error-dark {
  color: #991b1b; /* red-800 */
}

/* Alternative: adjust error color to pass */
--color-error-600: #dc2626; /* Use 600 instead of 500 for text on white */
```

**Accessibility Score: 6/10**

---

### C.6 Agent-Ready Logic Assessment

### Code-Generatable Assets (Automated)

| Asset | Method | Complexity | Priority |
|-------|--------|------------|----------|
| **Logo SVG** | React component + CSS | Low | P0 |
| **Favicon Package** | `sharp` + `svg-to-ico` | Low | P0 |
| **Empty State SVGs** | React SVG components | Medium | P1 |
| **Feature Icons** | Lucide + custom SVG | Low | P1 |
| **Dot Pattern** | CSS/SVG component | Low | P0 |
| **Glow Orbs** | CSS radial gradients | Low | P0 |
| **Shine Border** | CSS animation | Low | P0 |

### Manual Creative Work Required

| Asset | Reason | Effort |
|-------|--------|--------|
| **Logo Design** | Brand identity requires creative decision | 2-4 hours |
| **Empty State Illustrations** | Artistic style needs human curation | 4-8 hours |
| **Marketing Hero Images** | Product screenshots need staging | 2-3 hours |
| **Testimonial Avatars** | Real user photos or stock | 1-2 hours |

**Agent-Ready Score: 9/10**

---

### C.7 Risk Analysis & Scoring

### Brand Consistency Risk: **6/10** (Moderate)

| Risk Factor | Severity | Mitigation |
|-------------|----------|------------|
| No OpenGraph images | 🔴 High | Social shares look unprofessional |
| Inconsistent empty states | 🟡 Medium | Lucide icons only, no illustrations |
| Missing color contrast | 🔴 High | Warning/error colors fail WCAG |
| No brand guidelines | 🟡 Medium | Document defines but needs enforcement |

### Technical Debt Risk: **4/10** (Low)

| Risk Factor | Severity | Mitigation |
|-------------|----------|------------|
| PNG exports manual | 🟡 Medium | Automate with `sharp` |
| No WebP variants | 🟢 Low | Add WebP generation |
| Missing sprite sheet | 🟢 Low | HTTP/2 reduces impact |

---

### C.8 Updated Implementation Priority List

### Phase 1: Critical (Week 1)

| Priority | Asset | Implementation | Est. Time |
|----------|-------|--------------|-----------|
| P0 | **OpenGraph Image** | Create `opengraph-image.tsx` using `@vercel/og` | 2h |
| P0 | **Twitter Card Image** | Reuse OG image or create variant | 1h |
| P0 | **Logo SVG** | Build React component with wrench+building M | 3h |
| P0 | **Favicon Package** | Generate from logo using script | 1h |
| P0 | **Color Contrast Fixes** | Update warning/error colors in globals.css | 1h |

### Phase 2: High (Week 2)

| Priority | Asset | Implementation | Est. Time |
|----------|-------|--------------|-----------|
| P1 | **Empty State SVGs** | Create 7 illustration components | 6h |
| P1 | **Logo Integration** | Replace "M" placeholder in layout/navbar | 1h |
| P1 | **Metadata Updates** | Add OG/Twitter meta tags to layout.tsx | 1h |
| P1 | **WebP Generation** | Add sharp-based conversion script | 2h |

### Phase 3: Medium (Week 3-4)

| Priority | Asset | Implementation | Est. Time |
|----------|-------|--------------|-----------|
| P2 | **Feature Icons** | 6 custom SVG feature icons | 3h |
| P2 | **Dashboard Mockup** | Screenshot or CSS-based mockup | 2h |
| P2 | **Role Illustrations** | Manager/Technician/Tenant icons | 3h |
| P2 | **SVG Sprite Sheet** | Optional: consolidate icons | 4h |

### Phase 4: Polish (Ongoing)

| Priority | Asset | Implementation | Est. Time |
|----------|-------|--------------|-----------|
| P3 | **Loading Animations** | Lottie JSON for complex loaders | 4h |
| P3 | **Marketing Assets** | Team photos, trust badges | 2h |
| P3 | **Print Assets** | Business card, letterhead templates | 4h |

---

### C.9 OpenGraph Asset Specification (NEW)

#### Required OpenGraph Images

| Asset | Dimensions | Aspect Ratio | Format | Purpose |
|-------|------------|--------------|--------|---------|
| **og-image.png** | 1200×630 | 1.91:1 | PNG | Default social share |
| **og-image-home.png** | 1200×630 | 1.91:1 | PNG | Landing page specific |
| **twitter-image.png** | 1200×600 | 2:1 | PNG | Twitter/X card |

#### OpenGraph Image Design Specification

```
Layout: Centered composition
Background: Gradient from primary-600 to primary-800
Logo: Centered, 200px width
Text: "Maintix — Property Maintenance Platform" (optional)
Style: Clean, minimal, consistent with brand
```

#### Implementation in Next.js

```tsx
// apps/web/src/app/opengraph-image.tsx
import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Logo component */}
        <Logo width={200} />
      </div>
    ),
    { ...size }
  );
}
```

#### Metadata Configuration

```tsx
// apps/web/src/app/layout.tsx
export const metadata = {
  openGraph: {
    title: 'Maintix — Multi-Property Maintenance Platform',
    description: 'Streamline maintenance workflows across your properties',
    images: ['/opengraph-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Maintix — Multi-Property Maintenance Platform',
    images: ['/twitter-image.png'],
  },
};
```

---

### C.10 WCAG Compliance Fixes (NEW)

#### Color Contrast Corrections

Update `apps/web/src/app/globals.css`:

```css
@layer base {
  :root {
    /* Fix warning colors for WCAG AA */
    --warning-foreground: #92400e; /* amber-800 for text on warning bg */

    /* Fix error colors for WCAG AA */
    --destructive: #dc2626; /* red-600 instead of red-500 */

    /* Success already close, but can use darker if needed */
    --success-foreground: #14532d; /* green-900 for text on success bg */
  }
}
```

#### Badge Component Update

```tsx
// Update badge variants for accessibility
const badgeVariants = cva({
  variants: {
    variant: {
      warning: 'border-transparent bg-warning-50 text-warning-800 dark:bg-warning-500/10 dark:text-warning-400',
      // Change from warning-600 to warning-800
    },
  },
});
```

---

### C.11 Summary & Recommendations

#### Overall Assessment

| Dimension | Score | Status |
|-----------|-------|--------|
| Technical Scalability | 8/10 | ✅ Excellent |
| System Completeness | 6/10 | ⚠️ Missing OG images |
| Mathematical Harmony | 8/10 | ✅ Consistent grid |
| Accessibility (WCAG) | 6/10 | ⚠️ Contrast issues |
| Agent-Ready Logic | 9/10 | ✅ Highly automatable |
| **Brand Consistency Risk** | **6/10** | ⚠️ **Moderate Risk** |

### Top 5 Action Items

1. **🔴 CRITICAL: Add OpenGraph/Twitter Card metadata** — Currently completely missing from the plan. Social sharing will look broken.

2. **🔴 CRITICAL: Fix color contrast** — Warning (#f59e0b) and Error (#ef4444) colors fail WCAG AA on white backgrounds.

3. **🟡 HIGH: Create empty state illustrations** — Currently using only Lucide icons. Custom SVG illustrations will significantly improve UX.

4. **🟡 HIGH: Generate favicon package** — Planned but needs automated generation script.

5. **🟢 MEDIUM: Add WebP variants** — Performance optimization for raster assets.

### Quick Wins (Agent-Ready)

All of these can be code-generated:

```bash
# Generate favicon package from logo SVG
npx sharp -i logo-icon.svg -o favicon-16x16.png resize 16
npx sharp -i logo-icon.svg -o favicon-32x32.png resize 32

# Create OG image with @vercel/og
# Create empty state SVGs as React components
# Build logo as React SVG component
```

---

*Audit Completed* ✓
*Risk Score: 6/10 (Moderate)*
*Recommended Action: Proceed with Phase 1 implementation*

---

*Document Version: 1.1*
*Last Updated: March 2026*
*Maintix Design System*
