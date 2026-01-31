# Poll System API Documentation

This document describes the REST API endpoints for the Poll and Statistics System.

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <token>
```

Some endpoints support optional authentication (see details below).

## Base URL

All endpoints are relative to: `/api/polls`

---

## Endpoints

### 1. Create Poll
**POST** `/api/polls`

Creates a new poll. Requires authentication.

**Request Body:**
```json
{
  "title": "Poll Title",
  "description": "Optional description",
  "pollType": "simple",  // or "complex"
  "questionType": "single-choice",  // or "ranked-choice"
  "allowUserSubmittedAnswers": false,
  "allowUnauthenticatedVoting": false,
  "allowFreeTextResponse": false,
  "status": "draft",  // "draft", "active", or "closed"
  "articleId": null,  // optional, link to article
  "locationId": "GR-I-6104",  // optional location code
  "useUserLocation": false,  // optional, use creator's locationId
  "startsAt": null,  // optional, ISO 8601 date
  "endsAt": null,  // optional, ISO 8601 date
  "options": [
    {
      "text": "Option 1",
      "photoUrl": "https://...",  // optional, for complex polls
      "linkUrl": "https://..."  // optional, for complex polls
    },
    {
      "text": "Option 2",
      "photoUrl": "https://...",
      "linkUrl": "https://..."
    }
  ]
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Poll created successfully",
  "data": {
    "poll": { /* Poll object */ },
    "options": [ /* Array of option objects */ ]
  }
}
```

---

### 2. List Polls
**GET** `/api/polls`

Get a paginated list of polls. Supports optional authentication.

**Query Parameters:**
- `status` (optional): Filter by status ("active", "closed", "draft", "all"). Default: "active"
- `page` (optional): Page number. Default: 1
- `limit` (optional): Results per page (1-100). Default: 10

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "polls": [ /* Array of poll objects */ ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalPages": 5,
      "totalPolls": 50
    }
  }
}
```

---

### 3. Get Poll Details
**GET** `/api/polls/:id`

Get details of a specific poll. Supports optional authentication.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "poll": {
      "id": 1,
      "title": "...",
      "description": "...",
      "pollType": "simple",
      "questionType": "single-choice",
      "status": "active",
      "creator": {
        "id": 1,
        "username": "user",
        "avatarUrl": null
      },
      "options": [ /* Array of options */ ],
      "voteCount": 10,
      "hasVoted": false  // Only when authenticated
    }
  }
}
```

---

### 4. Submit Vote
**POST** `/api/polls/:id/vote`

Submit a vote for a poll. Supports optional authentication (depending on poll settings).

**Request Body for Single-Choice:**
```json
{
  "optionId": 1,
  "freeTextResponse": "Optional free text"  // if allowed by poll
}
```

**Request Body for Ranked-Choice:**
```json
{
  "ranking": [3, 1, 2],  // Array of option IDs in preferred order
  "freeTextResponse": "Optional free text"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Vote submitted successfully",
  "data": {
    "vote": { /* Vote object */ }
  }
}
```

**Error Responses:**
- `400 Bad Request`: Already voted, invalid option, etc.
- `401 Unauthorized`: Authentication required (if poll doesn't allow unauth voting)

---

### 5. Get Poll Results
**GET** `/api/polls/:id/results`

Get detailed results for a poll. Public endpoint.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "poll": {
      "id": 1,
      "title": "...",
      "description": "...",
      "pollType": "simple",
      "questionType": "single-choice"
    },
    "results": {
      "totalVotes": 100,
      "authenticatedVotes": 75,
      "unauthenticatedVotes": 25,
      "optionStats": [
        {
          "optionId": 1,
          "text": "Option 1",
          "photoUrl": "...",
          "linkUrl": "...",
          "totalVotes": 45,
          "authenticatedVotes": 35,
          "unauthenticatedVotes": 10,
          "percentage": "45.00"
        }
      ],
      "freeTextResponses": [
        {
          "response": "Great poll!",
          "isAuthenticated": true,
          "createdAt": "2026-01-29T12:00:00.000Z"
        }
      ]
    }
  }
}
```

---

### 6. Update Poll
**PUT** `/api/polls/:id`

Update a poll. Requires authentication and creator ownership.

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "status": "closed",
  "allowUserSubmittedAnswers": true,
  "allowUnauthenticatedVoting": true,
  "allowFreeTextResponse": true,
  "startsAt": "2026-02-01T00:00:00.000Z",
  "endsAt": "2026-02-28T23:59:59.999Z"
}
```

**Response:** `200 OK`

---

### 7. Delete Poll
**DELETE** `/api/polls/:id`

Delete a poll. Requires authentication and creator ownership.

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Poll deleted successfully"
}
```

---

### 8. Add User-Submitted Option
**POST** `/api/polls/:id/options`

Add a user-submitted option to a poll. Optional authentication.

**Request Body:**
```json
{
  "text": "My custom option",
  "photoUrl": "https://...",  // optional
  "linkUrl": "https://..."  // optional
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Option added successfully",
  "data": {
    "option": { /* Option object */ }
  }
}
```

---

## Data Models

### Poll Object
```typescript
{
  id: number
  title: string
  description?: string
  pollType: 'simple' | 'complex'
  questionType: 'single-choice' | 'ranked-choice'
  allowUserSubmittedAnswers: boolean
  allowUnauthenticatedVoting: boolean
  allowFreeTextResponse: boolean
  status: 'draft' | 'active' | 'closed'
  creatorId: number
  articleId?: number
  locationId?: string
  useUserLocation?: boolean
  startsAt?: Date
  endsAt?: Date
  createdAt: Date
  updatedAt: Date
}
```

### Poll Option Object
```typescript
{
  id: number
  pollId: number
  text: string
  photoUrl?: string
  linkUrl?: string
  orderIndex: number
  isUserSubmitted: boolean
  submittedByUserId?: number
  createdAt: Date
  updatedAt: Date
}
```

### Poll Vote Object
```typescript
{
  id: number
  pollId: number
  userId?: number  // null for unauthenticated votes
  optionId?: number
  ranking?: number[]  // for ranked-choice polls
  freeTextResponse?: string
  isAuthenticated: boolean
  voterIdentifier?: string  // hash for unauth votes
  createdAt: Date
  updatedAt: Date
}
```

---

## Error Handling

All endpoints return errors in the following format:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP status codes:
- `200 OK`: Successful GET/PUT/DELETE
- `201 Created`: Successful POST
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

---

## Vote Deduplication

- **Authenticated users**: Tracked by `userId`. One vote per poll.
- **Unauthenticated users**: Tracked by IP address hash (`voterIdentifier`). One vote per poll per IP.

---

## Examples

See the test file `__tests__/polls.test.js` for comprehensive usage examples.
