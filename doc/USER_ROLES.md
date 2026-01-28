# User Roles and Responsibilities

This application uses role-based access control to tailor what each user can do.
The `role` field on a user account determines the permissions available across the API
and frontend.

## Roles at a Glance

| Role | Primary Focus | Typical Actions |
| --- | --- | --- |
| **Admin** | Full system control | Manage all articles, approve news submissions, access admin dashboard |
| **Moderator** | News moderation | Approve news submissions, manage news flags, access admin dashboard |
| **Editor** | Content management | Create articles, edit any article, flag articles as news |
| **Viewer** | Reading and personal publishing | Read published articles, create and manage their own articles |

## Role Details

### Admin
- Full access to all article operations (create, edit, publish, delete).
- Approves news submissions and publishes flagged articles.
- Access to the admin dashboard and moderation tools.

### Moderator
- Reviews and approves articles flagged as news.
- Can publish approved news submissions.
- Can flag or unflag their own articles as news submissions.
- Access to the admin dashboard for moderation tasks.
- Manages their own articles but cannot edit or delete other users’ articles.

### Editor
- Creates new articles and edits any article.
- Flags articles for news consideration when needed.
- Manages their own articles (including deletion of their own content).
- Does not approve news submissions or delete other users’ articles.

### Viewer
- Reads published articles.
- Creates, edits, and deletes their own articles.
- Can flag their own articles as news submissions for review.

## Role Values

Use these role values when registering users:
`admin`, `moderator`, `editor`, `viewer`.

The frontend registration form only exposes `viewer`, `editor`, and `admin`. Moderator
accounts are typically created through backend tooling or by updating the user role
via the API/database.
