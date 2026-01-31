# Database Schema Overview

This document summarizes the current database schema as defined by Sequelize models and migrations. It complements the migration guide by providing a table-by-table reference for the data model.

## Schema Notes

- All tables use auto-incrementing integer primary keys.
- Timestamps use Sequelize `createdAt` and `updatedAt` columns.
- `locationId` values are **string codes** sourced from JSON location files (for example, `GR`, `GR-I`, `GR-I-6104`). No `Locations` table exists.
- Poll vote deduplication uses unique indexes (`pollId`, `userId`) and (`pollId`, `voterIdentifier`) for authenticated and unauthenticated voters.

## Users

| Column | Type | Notes |
| --- | --- | --- |
| id | integer | Primary key |
| username | string | Unique, 3-50 chars |
| email | string | Unique, validated email |
| password | string | bcrypt hash |
| role | enum | `admin`, `moderator`, `editor`, `viewer` |
| firstName | string | Optional |
| lastName | string | Optional |
| avatarUrl | string | Optional |
| profileColor | string | Optional |
| githubId | string | Optional, unique |
| githubUsername | string | Optional |
| githubProfileUrl | string | Optional |
| githubAvatarUrl | string | Optional |
| githubEmail | string | Optional |
| locationId | string(100) | Location code from JSON files |
| createdAt | datetime | |
| updatedAt | datetime | |

## Articles

| Column | Type | Notes |
| --- | --- | --- |
| id | integer | Primary key |
| title | string | Required, 5-200 chars |
| content | text | Required, 10-50000 chars |
| summary | string(500) | Optional |
| subtitle | string(255) | Optional |
| coverImageUrl | string(500) | Optional |
| coverImageCaption | string(500) | Optional |
| sourceName | string(255) | Optional |
| sourceUrl | string(500) | Optional |
| tags | JSON | Optional list of tags |
| articleType | enum | `personal`, `articles`, `news` |
| isFeatured | boolean | Defaults to false |
| authorId | integer | FK → Users |
| status | enum | `draft`, `published`, `archived` |
| publishedAt | datetime | Optional |
| category | string | Optional |
| isNews | boolean | Defaults to false |
| newsApprovedAt | datetime | Optional |
| newsApprovedBy | integer | FK → Users |
| locationId | string(100) | Location code from JSON files |
| createdAt | datetime | |
| updatedAt | datetime | |

## Polls

| Column | Type | Notes |
| --- | --- | --- |
| id | integer | Primary key |
| title | string | Required, 3-200 chars |
| description | text | Optional |
| pollType | enum | `simple`, `complex` |
| questionType | enum | `single-choice`, `ranked-choice` |
| allowUserSubmittedAnswers | boolean | Defaults to false |
| allowUnauthenticatedVoting | boolean | Defaults to false |
| allowFreeTextResponse | boolean | Defaults to false |
| status | enum | `draft`, `active`, `closed` |
| creatorId | integer | FK → Users |
| articleId | integer | FK → Articles, optional |
| locationId | string(100) | Location code from JSON files |
| startsAt | datetime | Optional |
| endsAt | datetime | Optional |
| createdAt | datetime | |
| updatedAt | datetime | |

## PollOptions

| Column | Type | Notes |
| --- | --- | --- |
| id | integer | Primary key |
| pollId | integer | FK → Polls |
| text | string | Required, 1-500 chars |
| photoUrl | string(500) | Optional |
| linkUrl | string(500) | Optional |
| orderIndex | integer | Sort order |
| isUserSubmitted | boolean | Defaults to false |
| submittedByUserId | integer | FK → Users, optional |
| createdAt | datetime | |
| updatedAt | datetime | |

## PollVotes

| Column | Type | Notes |
| --- | --- | --- |
| id | integer | Primary key |
| pollId | integer | FK → Polls |
| userId | integer | FK → Users, optional |
| optionId | integer | FK → PollOptions, optional |
| ranking | JSONB | Ordered option IDs for ranked-choice polls |
| freeTextResponse | text | Optional, up to 1000 chars |
| isAuthenticated | boolean | Defaults to false |
| voterIdentifier | string | Hash/session ID for unauthenticated dedupe |
| createdAt | datetime | |
| updatedAt | datetime | |

## Indexes

| Table | Index | Purpose |
| --- | --- | --- |
| PollVotes | `unique_user_poll_vote` | Enforces one vote per poll for authenticated users |
| PollVotes | `poll_voter_identifier_index` | Helps dedupe unauthenticated votes |
| PollOptions | `poll_option_order_index` | Sort options per poll |
