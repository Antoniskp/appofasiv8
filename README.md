# News Application

Professional news application with JWT authentication, PostgreSQL, role-based access control, and a Next.js frontend.

## Documentation

- [Project summary](doc/PROJECT_SUMMARY.md)
- [Architecture](doc/ARCHITECTURE.md)
- [Deployment](doc/DEPLOYMENT.md)
- [VPS deployment](doc/VPS_DEPLOYMENT.md)
- [Security](doc/SECURITY.md)
- [User roles](doc/USER_ROLES.md)
- [Poll system overview](doc/POLL_SYSTEM_README.md)
- [Poll API](doc/POLL_API.md)
- [Poll user guide](doc/POLL_USER_GUIDE.md)
- [API testing](doc/API_TESTING.md)
- [Database migrations](doc/MIGRATIONS.md)
- [Database schema overview](doc/DB_SCHEMA.md)

## Quick start

Prerequisites: Node.js and PostgreSQL (see [Deployment](doc/DEPLOYMENT.md)).

```bash
npm install
cp .env.example .env
# Edit .env with your credentials and create the database
npm run migrate
```

### Start servers

```bash
# Backend
npm run dev

# Frontend
npm run frontend
```

## Database schema

See [DB schema documentation](doc/DB_SCHEMA.md) for a table-by-table overview, column notes, and indexes.

## License

ISC
