# Database Migrations Guide

This application uses Sequelize migrations to manage database schema changes. This provides a safe, version-controlled way to evolve the database schema over time.

## Quick Start

### For Fresh Installations

1. Make sure PostgreSQL is running
2. Create the database (if needed):
   ```bash
   npm run setup-db  # or manually: createdb newsapp
   ```
3. Run migrations:
   ```bash
   npm run migrate
   ```
4. Start the server:
   ```bash
   npm start
   ```

### For Existing Databases

If you have an existing database with the old schema (e.g., locationId as INTEGER with foreign keys):

1. **Backup your data first!**
   ```bash
   pg_dump -U postgres newsapp > backup.sql
   ```

2. Run migrations to update schema:
   ```bash
   npm run migrate
   ```
   
   The migration will automatically:
   - Detect and remove any foreign key constraints on `Users.locationId`
   - Detect and remove any foreign key constraints on `Articles.locationId`
   - Convert `locationId` columns from INTEGER to VARCHAR(100)
   - Preserve existing data in the locationId columns

3. **Important**: If your old database had a `Locations` table with integer IDs, you'll need to manually convert the data:
   
   The location codes should follow this pattern:
   - Country: `GR` (Greece), `INT` (International), `GR+INT` (Greece+International)
   - Jurisdiction: `GR-I` (Attica), `GR-B` (Central Macedonia), etc.
   - Municipality: `GR-I-6104` (Athens), etc.
   
   Example conversion query (adjust as needed):
   ```sql
   -- This is just an example - adjust based on your actual Locations table structure
   UPDATE "Users" u
   SET "locationId" = l.code
   FROM "Locations" l
   WHERE u."locationId"::integer = l.id;
   
   UPDATE "Articles" a
   SET "locationId" = l.code
   FROM "Locations" l
   WHERE a."locationId"::integer = l.id;
   ```

4. Start the server:
   ```bash
   npm start
   ```

## Migration Commands

### Run pending migrations
```bash
npm run migrate
# or
npx sequelize-cli db:migrate
```

### Check migration status
```bash
npm run migrate:status
# or
npx sequelize-cli db:migrate:status
```

### Undo last migration
```bash
npm run migrate:undo
# or
npx sequelize-cli db:migrate:undo
```

**Note**: The `fix-locationid-foreign-key` migration is designed to be one-way only and cannot be safely reverted automatically.

## Migration Files

Migrations are located in `src/migrations/` directory:

1. **20260128230337-initial-schema.js**
   - Creates the Users and Articles tables with the correct schema
   - Sets locationId as VARCHAR(100) from the start
   - Use this for fresh installations

2. **20260128230405-fix-locationid-foreign-key.js**
   - Fixes legacy databases that have locationId as INTEGER with foreign keys
   - Removes foreign key constraints
   - Converts locationId to VARCHAR(100)
   - Safe to run on both old and new schemas (idempotent)

## Environment Variables

You can control migration behavior with environment variables:

- `USE_MIGRATIONS`: Set to `false` to use `sequelize.sync()` instead of migrations (not recommended for production)
  ```bash
  USE_MIGRATIONS=false npm start
  ```

Default behavior (recommended):
- Uses migrations in all environments
- Server will start but won't auto-create/modify tables
- You must run `npm run migrate` before starting the server

## Development vs Production

### Development
```bash
# Run migrations
npm run migrate

# Start with nodemon
npm run dev
```

### Production
```bash
# Always run migrations first
npm run migrate

# Then start server
npm start
```

## Troubleshooting

### "relation does not exist" error
You haven't run migrations yet. Run:
```bash
npm run migrate
```

### "column does not exist" error
Your database schema is out of date. Run:
```bash
npm run migrate
```

### Migration fails with foreign key error
1. Check what migrations have run: `npm run migrate:status`
2. Make sure you're not mixing `sequelize.sync()` with migrations
3. Drop the database and start fresh if possible:
   ```bash
   dropdb newsapp
   createdb newsapp
   npm run migrate
   ```

### Converting from sync() to migrations

If you've been using `sequelize.sync()` and want to switch to migrations:

1. Backup your database
2. Export your data
3. Drop and recreate the database
4. Run migrations: `npm run migrate`
5. Re-import your data

Or use the migration approach:
1. Backup your database
2. Comment out the tables in the `initial-schema` migration's `up` function (they already exist)
3. Run `npm run migrate` - this will only run the fix migration
4. Restore the initial-schema migration for future fresh installs

## Location System Notes

This application uses a **JSON-based location system**, not a database table:

- Location data is stored in `/locations` directory as JSON files
- `locationId` fields store location **codes** (e.g., `GR`, `GR-I`, `GR-I-6104`)
- No `Locations` table exists in the database
- No foreign key relationships for location data

Location codes follow this hierarchy:
- **Country codes**: `GR` (Greece), `INT` (International), `GR+INT` (both)
- **Jurisdiction codes**: `GR-I` (Attica/Αττική), `GR-B` (Central Macedonia), etc.
- **Municipality codes**: `GR-I-6104` (Athens), etc.

See the main README.md for more details about the location system.
