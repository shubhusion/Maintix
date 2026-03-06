# Database Schema

Maintix uses **PostgreSQL 16** with **Prisma 6** as the ORM. The schema is defined in `packages/database/prisma/schema.prisma`.

## Entity Relationship Diagram

```
┌──────────┐       ┌──────────────────┐       ┌──────────┐
│   User   │──────▶│ PropertyMember   │◀──────│ Property │
│          │  1:N  │ (junction table) │  N:1  │          │
└──────┬───┘       └──────────────────┘       └────┬─────┘
       │                                           │
       │  1:N (createdBy)                    1:N   │
       │  1:N (assignedTo)                         │
       ▼                                           ▼
┌──────────────┐       ┌────────────┐       ┌──────────┐
│    Ticket    │──────▶│  Category  │◀──────│ Property │
│              │  N:1  │            │  1:N  │          │
└──┬──┬──┬─────┘       └────────────┘       └──────────┘
   │  │  │
   │  │  └── 1:N ──▶ TicketAttachment
   │  │
   │  └───── 1:N ──▶ TicketActivity
   │
   └──────── 1:N ──▶ Notification
                          │
                     N:1  │
                          ▼
                       ┌──────┐
                       │ User │
                       └──────┘
```

## Models

### User

The central identity model. Users can be tenants, managers, or technicians.

| Column          | Type      | Constraints        | Description                       |
| --------------- | --------- | ------------------ | --------------------------------- |
| `id`            | UUID      | PK, auto-generated | Unique identifier                 |
| `email`         | String    | Unique             | Login email                       |
| `password_hash` | String    | —                  | bcrypt hash (12 rounds)           |
| `first_name`    | String    | —                  | First name                        |
| `last_name`     | String    | —                  | Last name                         |
| `role`          | Role enum | —                  | `TENANT`, `MANAGER`, `TECHNICIAN` |
| `is_active`     | Boolean   | Default: `true`    | Account status                    |
| `created_at`    | DateTime  | Auto               | Creation timestamp                |
| `updated_at`    | DateTime  | Auto               | Last update                       |
| `deleted_at`    | DateTime? | Nullable           | Soft delete timestamp             |

**Relations**: propertyMemberships, createdTickets, assignedTickets, activities, notifications, uploadedAttachments

---

### Property

Represents a physical property being managed.

| Column        | Type      | Constraints | Description           |
| ------------- | --------- | ----------- | --------------------- |
| `id`          | UUID      | PK          | Unique identifier     |
| `name`        | String    | —           | Property name         |
| `address`     | String    | —           | Physical address      |
| `description` | String?   | Nullable    | Optional description  |
| `created_at`  | DateTime  | Auto        | Creation timestamp    |
| `updated_at`  | DateTime  | Auto        | Last update           |
| `deleted_at`  | DateTime? | Nullable    | Soft delete timestamp |

**Relations**: members (PropertyMember[]), categories, tickets

---

### PropertyMember

Junction table linking users to properties they can access.

| Column        | Type     | Constraints   | Description          |
| ------------- | -------- | ------------- | -------------------- |
| `id`          | UUID     | PK            | Unique identifier    |
| `property_id` | UUID     | FK → Property | Property reference   |
| `user_id`     | UUID     | FK → User     | User reference       |
| `joined_at`   | DateTime | Auto          | Membership timestamp |

**Unique constraint**: `(property_id, user_id)` — each user can be a member only once per property.

**Indexes**: `user_id`

---

### Category

Maintenance categories scoped to a specific property.

| Column        | Type      | Constraints   | Description        |
| ------------- | --------- | ------------- | ------------------ |
| `id`          | UUID      | PK            | Unique identifier  |
| `name`        | String    | —             | Category name      |
| `property_id` | UUID      | FK → Property | Owning property    |
| `created_at`  | DateTime  | Auto          | Creation timestamp |
| `deleted_at`  | DateTime? | Nullable      | Soft delete        |

**Unique constraint**: `(property_id, name)` — unique name per property.

---

### Ticket

Core model for maintenance requests with a full lifecycle.

| Column                | Type         | Constraints         | Description                    |
| --------------------- | ------------ | ------------------- | ------------------------------ |
| `id`                  | UUID         | PK                  | Unique identifier              |
| `title`               | String       | 3–200 chars         | Ticket title                   |
| `description`         | String       | 10–5000 chars       | Issue description              |
| `status`              | TicketStatus | Default: `OPEN`     | Current workflow status        |
| `priority`            | Priority     | Default: `LOW`      | Urgency level                  |
| `version`             | Int          | Default: `1`        | Optimistic concurrency version |
| `property_id`         | UUID         | FK → Property       | Owning property                |
| `category_id`         | UUID         | FK → Category       | Issue category                 |
| `created_by_id`       | UUID         | FK → User           | Ticket creator                 |
| `assigned_to_id`      | UUID?        | FK → User, Nullable | Assigned technician            |
| `cancellation_reason` | String?      | Nullable            | Reason for cancellation        |
| `created_at`          | DateTime     | Auto                | Creation timestamp             |
| `updated_at`          | DateTime     | Auto                | Last update                    |
| `deleted_at`          | DateTime?    | Nullable            | Soft delete                    |

**Indexes**:

- `(property_id, status)` — Property ticket listings
- `(assigned_to_id, status)` — Technician workload queries
- `(created_by_id)` — Creator's tickets

**Relations**: property, category, createdBy, assignedTo, attachments, activities, notifications

---

### TicketAttachment

File attachments stored in Supabase Storage.

| Column           | Type     | Constraints | Description          |
| ---------------- | -------- | ----------- | -------------------- |
| `id`             | UUID     | PK          | Unique identifier    |
| `ticket_id`      | UUID     | FK → Ticket | Parent ticket        |
| `url`            | String   | —           | Supabase storage URL |
| `file_name`      | String   | —           | Original filename    |
| `file_size`      | Int      | —           | File size in bytes   |
| `mime_type`      | String   | —           | MIME type            |
| `uploaded_by_id` | UUID     | FK → User   | Uploader             |
| `created_at`     | DateTime | Auto        | Upload timestamp     |

**Cascade**: Deleting a ticket removes all attachments.

---

### TicketActivity

Immutable audit trail — no updates or deletes allowed.

| Column           | Type           | Constraints | Description              |
| ---------------- | -------------- | ----------- | ------------------------ |
| `id`             | UUID           | PK          | Unique identifier        |
| `ticket_id`      | UUID           | FK → Ticket | Parent ticket            |
| `actor_id`       | UUID           | FK → User   | Who performed the action |
| `action`         | ActivityAction | —           | Action type enum         |
| `previous_value` | JSON?          | Nullable    | State before action      |
| `new_value`      | JSON?          | Nullable    | State after action       |
| `created_at`     | DateTime       | Auto        | Timestamp                |

**Indexes**: `(ticket_id, created_at)` — Efficient activity log retrieval.

**Cascade**: Deleting a ticket removes all activity records.

---

### Notification

User notifications triggered by ticket events.

| Column       | Type             | Constraints           | Description            |
| ------------ | ---------------- | --------------------- | ---------------------- |
| `id`         | UUID             | PK                    | Unique identifier      |
| `user_id`    | UUID             | FK → User             | Recipient              |
| `ticket_id`  | UUID?            | FK → Ticket, Nullable | Related ticket         |
| `type`       | NotificationType | —                     | Notification type enum |
| `title`      | String           | —                     | Display title          |
| `message`    | String           | —                     | Display message        |
| `is_read`    | Boolean          | Default: `false`      | Read status            |
| `created_at` | DateTime         | Auto                  | Timestamp              |

**Indexes**: `(user_id, is_read, created_at)` — Efficient unread/list queries.

**On ticket delete**: `ticket_id` is set to NULL (preserves notification).

---

## Enums

### Role

| Value        | Description                                             |
| ------------ | ------------------------------------------------------- |
| `TENANT`     | Reports maintenance issues                              |
| `MANAGER`    | Oversees properties, assigns work, approves completions |
| `TECHNICIAN` | Performs maintenance work                               |

### TicketStatus

| Value               | Description                             |
| ------------------- | --------------------------------------- |
| `OPEN`              | Newly created, awaiting assignment      |
| `ASSIGNED`          | Technician assigned                     |
| `IN_PROGRESS`       | Technician has started work             |
| `AWAITING_APPROVAL` | Work complete, pending manager approval |
| `DONE`              | Approved and closed (terminal)          |
| `CANCELLED`         | Cancelled by creator (terminal)         |

### Priority

| Value    | Description                          |
| -------- | ------------------------------------ |
| `LOW`    | Non-urgent                           |
| `MEDIUM` | Standard priority                    |
| `HIGH`   | Needs prompt attention               |
| `URGENT` | Critical — immediate action required |

### ActivityAction

| Value                   | Emitted When                  |
| ----------------------- | ----------------------------- |
| `TICKET_CREATED`        | Ticket is created             |
| `TECHNICIAN_ASSIGNED`   | Technician is assigned        |
| `TECHNICIAN_REASSIGNED` | Technician is changed         |
| `WORK_STARTED`          | Technician starts work        |
| `COMPLETION_SUBMITTED`  | Technician submits completion |
| `TICKET_APPROVED`       | Manager approves completion   |
| `TICKET_CANCELLED`      | Ticket is cancelled           |
| `PRIORITY_CHANGED`      | Priority is updated           |
| `ATTACHMENT_ADDED`      | File is uploaded              |
| `ATTACHMENT_REMOVED`    | File is deleted               |

### NotificationType

| Value                   | Description                                      |
| ----------------------- | ------------------------------------------------ |
| `TICKET_CREATED`        | New ticket notification (→ managers)             |
| `TICKET_ASSIGNED`       | Assignment notification (→ technician + creator) |
| `WORK_STARTED`          | Work started notification (→ creator + managers) |
| `COMPLETION_SUBMITTED`  | Completion submitted (→ managers)                |
| `TICKET_APPROVED`       | Ticket approved (→ creator + technician)         |
| `TICKET_CANCELLED`      | Ticket cancelled (→ managers + technician)       |
| `PRIORITY_CHANGED`      | Priority changed (→ assignee)                    |
| `TECHNICIAN_REASSIGNED` | Reassignment (→ old + new technician)            |

---

## Database Management

### Commands

| Command            | Description                            |
| ------------------ | -------------------------------------- |
| `pnpm db:generate` | Generate Prisma client from schema     |
| `pnpm db:migrate`  | Create and run migrations (production) |
| `pnpm db:push`     | Push schema directly (development)     |
| `pnpm db:seed`     | Seed with default manager account      |
| `pnpm db:studio`   | Open Prisma Studio at `localhost:5555` |

### Seed Data

The seed script (`packages/database/prisma/seed.ts`) creates three users, a property, memberships, and default categories:

**Users:**

| Email                | Password                | Role       |
| -------------------- | ----------------------- | ---------- |
| `admin@Maintix.com`  | `ChangeThisPassword123` | Manager    |
| `tenant@Maintix.com` | `TenantPass123`         | Tenant     |
| `tech@Maintix.com`   | `TechPass123`           | Technician |

The manager email/password can be overridden via env vars:

| Field      | Default                 | Env Override              |
| ---------- | ----------------------- | ------------------------- |
| Email      | `admin@Maintix.com`     | `SEED_MANAGER_EMAIL`      |
| Password   | `ChangeThisPassword123` | `SEED_MANAGER_PASSWORD`   |
| First Name | `Admin`                 | `SEED_MANAGER_FIRST_NAME` |
| Last Name  | `Manager`               | `SEED_MANAGER_LAST_NAME`  |

**Property:** "Sunrise Apartments" at 123 Main St — all three users are linked as members.

**Categories:** Plumbing, Electrical, HVAC, General Maintenance (scoped to the property).

The seed is idempotent — running it again will skip existing records.

### Connection

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/Maintix
```

Docker Compose provides a PostgreSQL 16 Alpine container with a persistent volume.
