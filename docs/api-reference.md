# API Reference

The Maintix API is a RESTful service built with NestJS 10. All endpoints are prefixed with `/api/v1`.

**Base URL**: `http://localhost:3001/api/v1`  
**Swagger UI**: `http://localhost:3001/api/docs`

## Authentication

All endpoints require a valid JWT token unless marked as **Public**.

```
Authorization: Bearer <access_token>
```

### Login

```http
POST /api/v1/auth/login
```

**Public** — Rate limited to 5 requests per minute.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | User email address |
| `password` | string | Yes | Min 6 characters |

**Response** `200 OK`:

```json
{
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "uuid",
      "email": "admin@Maintix.com",
      "firstName": "Admin",
      "lastName": "Manager",
      "role": "MANAGER"
    }
  }
}
```

**Errors**: `401 INVALID_CREDENTIALS`, `403 USER_INACTIVE`

---

## Response Format

All successful responses are wrapped in a `data` envelope:

```json
{ "data": { ... } }
```

Paginated responses include a `meta` object:

```json
{
  "data": [ ... ],
  "meta": {
    "hasMore": true,
    "nextCursor": "uuid-of-last-item",
    "total": 42
  }
}
```

### Error Response

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errorCode": "VALIDATION_ERROR",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

## Global Behaviors

| Feature | Description |
|---------|-------------|
| **Rate Limiting** | 30 requests per 60 seconds (global), 5/min for login |
| **Request ID** | Every request gets a `x-request-id` header (auto-generated or pass-through) |
| **CORS** | Configurable via `CORS_ORIGIN` env variable |
| **Validation** | Request bodies are validated against DTOs; unknown fields are stripped |

---

## Health

### Check Health

```http
GET /api/v1/health
```

**Public** — No authentication required.

**Response** `200 OK`:

```json
{
  "data": {
    "status": "ok",
    "database": "connected"
  }
}
```

---

## Users

### Create User

```http
POST /api/v1/users
```

**Requires**: `MANAGER` role

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `email` | string | Yes | Valid email |
| `firstName` | string | Yes | 2–50 chars |
| `lastName` | string | Yes | 2–50 chars |
| `password` | string | Yes | 8+ chars, 1 uppercase, 1 number |
| `role` | string | Yes | `TENANT` or `TECHNICIAN` (not MANAGER) |

**Response** `201 Created`: User object (without password hash).

**Errors**: `409 EMAIL_ALREADY_EXISTS`, `403 CANNOT_CREATE_MANAGER`

### List Users

```http
GET /api/v1/users
```

**Requires**: `MANAGER` role

| Param | Type | Description |
|-------|------|-------------|
| `role` | query | Filter by role: `TENANT`, `TECHNICIAN`, `MANAGER` |

### Get Current User

```http
GET /api/v1/users/me
```

Returns the authenticated user's profile.

### Get User by ID

```http
GET /api/v1/users/:id
```

**Requires**: `MANAGER` role

### Update User

```http
PATCH /api/v1/users/:id
```

**Requires**: `MANAGER` role

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `firstName` | string | No | 2–50 chars |
| `lastName` | string | No | 2–50 chars |
| `isActive` | boolean | No | Activate/deactivate user |

### Delete User (Soft)

```http
DELETE /api/v1/users/:id
```

**Requires**: `MANAGER` role — Sets `deletedAt` timestamp, does not remove data.

---

## Properties

### Create Property

```http
POST /api/v1/properties
```

**Requires**: `MANAGER` role — The creator is automatically added as a member.

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `name` | string | Yes | 2–200 chars |
| `address` | string | Yes | 5–500 chars |
| `description` | string | No | - |

### List Properties

```http
GET /api/v1/properties
```

Returns all properties the authenticated user is a member of, with enriched counts.

### Get Property

```http
GET /api/v1/properties/:id
```

**Guard**: `PropertyGuard` — User must be a member of the property.

### Update Property

```http
PATCH /api/v1/properties/:id
```

**Requires**: `MANAGER` role + `PropertyGuard`

### Delete Property (Soft)

```http
DELETE /api/v1/properties/:id
```

**Requires**: `MANAGER` role + `PropertyGuard`

---

## Property Members

All member endpoints are nested under a property and require `PropertyGuard`.

### Add Member

```http
POST /api/v1/properties/:propertyId/members
```

**Requires**: `MANAGER` role

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `userId` | UUID | Yes | ID of user to add |

**Errors**: `409 ALREADY_PROPERTY_MEMBER`, `404 USER_NOT_FOUND`

### List Members

```http
GET /api/v1/properties/:propertyId/members
```

### Remove Member

```http
DELETE /api/v1/properties/:propertyId/members/:userId
```

**Requires**: `MANAGER` role

---

## Categories

### Create Category

```http
POST /api/v1/properties/:propertyId/categories
```

**Requires**: `MANAGER` role + `PropertyGuard`

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `name` | string | Yes | 2–100 chars, unique per property |

**Errors**: `409 CATEGORY_NAME_EXISTS`

### List Categories

```http
GET /api/v1/properties/:propertyId/categories
```

**Guard**: `PropertyGuard`

### Update Category

```http
PATCH /api/v1/categories/:id
```

**Requires**: `MANAGER` role

### Delete Category (Soft)

```http
DELETE /api/v1/categories/:id
```

**Requires**: `MANAGER` role

---

## Tickets

### Create Ticket

```http
POST /api/v1/properties/:propertyId/tickets
```

**Guard**: `PropertyGuard` — Any property member can create tickets.

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `title` | string | Yes | 3–200 chars |
| `description` | string | Yes | 10–5000 chars |
| `categoryId` | UUID | Yes | Must belong to the property |

### List Tickets

```http
GET /api/v1/properties/:propertyId/tickets
```

**Guard**: `PropertyGuard` — Cursor-paginated with filters.

| Param | Type | Description |
|-------|------|-------------|
| `status` | query | Filter by `TicketStatus` enum |
| `priority` | query | Filter by `Priority` enum |
| `categoryId` | query | Filter by category UUID |
| `assignedToId` | query | Filter by assignee UUID |
| `createdById` | query | Filter by creator UUID |
| `sortBy` | query | `createdAt` (default), `updatedAt`, `priority` |
| `sortDir` | query | `desc` (default), `asc` |
| `cursor` | query | Cursor for pagination |
| `limit` | query | 1–50, default 20 |

### Get Ticket

```http
GET /api/v1/tickets/:id
```

Returns ticket with attachments and related data.

### Assign Technician

```http
PATCH /api/v1/tickets/:id/assign
```

**Requires**: `MANAGER` role

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `technicianId` | UUID | Yes | Must be TECHNICIAN role + property member |
| `version` | integer | Yes | Current ticket version for concurrency |

**Transition**: OPEN → ASSIGNED

**Errors**: `409 TICKET_VERSION_CONFLICT`, `400 ASSIGNEE_NOT_TECHNICIAN`, `400 ASSIGNEE_NOT_PROPERTY_MEMBER`

### Start Work

```http
PATCH /api/v1/tickets/:id/start
```

**Requires**: `TECHNICIAN` role (must be the assignee)

| Field | Type | Required |
|-------|------|----------|
| `version` | integer | Yes |

**Transition**: ASSIGNED → IN_PROGRESS

### Submit Completion

```http
PATCH /api/v1/tickets/:id/complete
```

**Requires**: `TECHNICIAN` role (must be the assignee)

| Field | Type | Required |
|-------|------|----------|
| `version` | integer | Yes |

**Transition**: IN_PROGRESS → AWAITING_APPROVAL

### Approve Ticket

```http
PATCH /api/v1/tickets/:id/approve
```

**Requires**: `MANAGER` role

| Field | Type | Required |
|-------|------|----------|
| `version` | integer | Yes |

**Transition**: AWAITING_APPROVAL → DONE

### Cancel Ticket

```http
PATCH /api/v1/tickets/:id/cancel
```

Only the ticket creator can cancel, and only in OPEN or ASSIGNED status.

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `reason` | string | Yes | 5–1000 chars |
| `version` | integer | Yes | - |

**Transition**: OPEN/ASSIGNED → CANCELLED

### Update Priority

```http
PATCH /api/v1/tickets/:id/priority
```

**Requires**: `MANAGER` role

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `priority` | string | Yes | `LOW`, `MEDIUM`, `HIGH`, `URGENT` |
| `version` | integer | Yes | - |

### Reassign Technician

```http
PATCH /api/v1/tickets/:id/reassign
```

**Requires**: `MANAGER` role

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `technicianId` | UUID | Yes | New technician |
| `version` | integer | Yes | - |

**Transition**: ASSIGNED/IN_PROGRESS → ASSIGNED

### Get Ticket Activity

```http
GET /api/v1/tickets/:id/activity
```

Returns the immutable audit trail for a ticket. Cursor-paginated.

| Param | Type | Description |
|-------|------|-------------|
| `cursor` | query | Cursor for pagination |
| `limit` | query | 1–50, default 20 |

---

## Attachments

### Upload Attachment

```http
POST /api/v1/properties/:propertyId/tickets/:ticketId/attachments
```

**Guard**: `PropertyGuard` — Multipart file upload.

| Field | Type | Description |
|-------|------|-------------|
| `file` | file | JPEG, PNG, or WebP image |

**Constraints**:
- Max file size: 5 MB
- Allowed types: `image/jpeg`, `image/png`, `image/webp`
- Max 5 attachments per ticket

**Errors**: `413 UPLOAD_SIZE_EXCEEDED`, `415 UPLOAD_TYPE_NOT_ALLOWED`, `400 UPLOAD_LIMIT_REACHED`

### List Attachments

```http
GET /api/v1/tickets/:ticketId/attachments
```

### Delete Attachment

```http
DELETE /api/v1/attachments/:id
```

Only the original uploader can delete their attachment.

---

## Notifications

### List Notifications

```http
GET /api/v1/notifications
```

Cursor-paginated.

| Param | Type | Description |
|-------|------|-------------|
| `unreadOnly` | query | `true` to filter unread only |
| `cursor` | query | Cursor for pagination |
| `limit` | query | 1–50, default 20 |

### Get Unread Count

```http
GET /api/v1/notifications/unread-count
```

**Response**: `{ "data": { "count": 5 } }`

### Mark as Read

```http
PATCH /api/v1/notifications/:id/read
```

### Mark All as Read

```http
PATCH /api/v1/notifications/read-all
```

---

## Error Codes Reference

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `INVALID_CREDENTIALS` | 401 | Wrong email or password |
| `USER_INACTIVE` | 403 | Account is deactivated |
| `TOKEN_EXPIRED` | 401 | JWT has expired |
| `TOKEN_INVALID` | 401 | JWT is malformed |
| `FORBIDDEN` | 403 | Generic forbidden |
| `ROLE_NOT_ALLOWED` | 403 | User role insufficient |
| `PROPERTY_ACCESS_DENIED` | 403 | Not a member of the property |
| `USER_NOT_FOUND` | 404 | User does not exist |
| `EMAIL_ALREADY_EXISTS` | 409 | Email taken |
| `CANNOT_CREATE_MANAGER` | 403 | Cannot create MANAGER accounts via API |
| `PROPERTY_NOT_FOUND` | 404 | Property does not exist |
| `ALREADY_PROPERTY_MEMBER` | 409 | User already a member |
| `NOT_PROPERTY_MEMBER` | 400 | User is not a member |
| `CATEGORY_NOT_FOUND` | 404 | Category does not exist |
| `CATEGORY_NAME_EXISTS` | 409 | Category name already taken in property |
| `TICKET_NOT_FOUND` | 404 | Ticket does not exist |
| `TICKET_INVALID_TRANSITION` | 400 | Invalid status transition |
| `TICKET_VERSION_CONFLICT` | 409 | Optimistic concurrency conflict |
| `TICKET_NOT_CANCELLABLE` | 400 | Can only cancel OPEN/ASSIGNED tickets |
| `TECHNICIAN_NOT_ASSIGNEE` | 403 | Technician is not the ticket's assignee |
| `ASSIGNEE_NOT_TECHNICIAN` | 400 | Target user is not a TECHNICIAN |
| `ASSIGNEE_NOT_PROPERTY_MEMBER` | 400 | Target technician is not a property member |
| `UPLOAD_SIZE_EXCEEDED` | 413 | File exceeds 5 MB |
| `UPLOAD_TYPE_NOT_ALLOWED` | 415 | Invalid file type |
| `UPLOAD_LIMIT_REACHED` | 400 | Max 5 attachments per ticket |
| `ATTACHMENT_NOT_FOUND` | 404 | Attachment does not exist |
| `VALIDATION_ERROR` | 400 | DTO validation failed |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Unhandled server error |
