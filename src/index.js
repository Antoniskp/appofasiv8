const express = require('express');
const cors = require('cors');
const { Sequelize } = require('sequelize');
const { sequelize, Poll, PollOption, PollVote, User } = require('./models');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const articleRoutes = require('./routes/articleRoutes');
const locationRoutes = require('./routes/locationRoutes');
const pollRoutes = require('./routes/pollRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

const normalizeTableIdentifier = (name) => {
  if (!name) {
    return null;
  }
  return name.replace(/"/g, '').split('.').pop().toLowerCase();
};

const normalizeTableName = (table) => {
  if (!table) {
    return null;
  }
  if (typeof table === 'string') {
    return table;
  }
  if (typeof table === 'object') {
    return table.tableName || table.name || table.tablename || null;
  }
  return String(table);
};

const normalizeTableKey = (table) => {
  const name = normalizeTableName(table);
  return normalizeTableIdentifier(name);
};

const buildTableNameMap = (tables = []) => {
  const tableNameMap = new Map();
  tables.forEach((table) => {
    const key = normalizeTableKey(table);
    if (key && !tableNameMap.has(key)) {
      tableNameMap.set(key, table);
    }
  });
  return tableNameMap;
};

const ensurePollTables = async () => {
  const queryInterface = sequelize.getQueryInterface();
  const tables = await queryInterface.showAllTables();
  const tableNameMap = buildTableNameMap(tables);
  const requiredTables = [Poll, PollOption, PollVote]
    .map((model) => normalizeTableKey(model.getTableName()))
    .filter(Boolean);
  const missingTables = requiredTables.filter((tableName) => !tableNameMap.has(tableName));
  const missingModels = [Poll, PollOption, PollVote].filter((model) => {
    const tableKey = normalizeTableKey(model.getTableName());
    return tableKey ? missingTables.includes(tableKey) : false;
  });

  if (missingTables.length > 0) {
    console.warn(
      `Poll tables missing (${missingTables.join(', ')}). Creating missing poll tables with model sync.`
    );
    await sequelize.sync({ models: missingModels });
  }

  try {
    const updatedTables = missingTables.length > 0 ? await queryInterface.showAllTables() : tables;
    const updatedTableNameMap = buildTableNameMap(updatedTables);
    const pollTableKey = normalizeTableKey(Poll.getTableName());
    const pollTableName = updatedTableNameMap.get(pollTableKey) || Poll.getTableName();
    if (!pollTableKey || !pollTableName) {
      return;
    }
    const pollTable = await queryInterface.describeTable(pollTableName);
    if (pollTable.locationId) {
      const columnType = String(pollTable.locationId.type || '').toLowerCase();
      const isStringType = columnType.includes('char') || columnType.includes('text');
      if (!isStringType) {
        const foreignKeys = await queryInterface
          .getForeignKeyReferencesForTable(pollTableName)
          .catch((foreignKeyError) => {
            console.warn(
              'Unable to inspect poll foreign keys:',
              foreignKeyError.message || foreignKeyError
            );
            return [];
          });
        const locationForeignKeys = foreignKeys.filter(
          (foreignKey) =>
            foreignKey.columnName === 'locationId'
            && foreignKey.constraintName != null
        );
        for (const foreignKey of locationForeignKeys) {
          await queryInterface.removeConstraint(pollTableName, foreignKey.constraintName);
        }
        await queryInterface.changeColumn(pollTableName, 'locationId', {
          type: Sequelize.STRING(100),
          allowNull: true,
          comment: 'Location code (e.g., GR, GR-I, GR-I-6104) from JSON location data'
        });
      }
    }
  } catch (error) {
    console.warn('Unable to verify poll location column:', error.message);
  }
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'News Application API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      articles: '/api/articles',
      locations: '/api/locations',
      polls: '/api/polls'
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/polls', pollRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Database sync and server start
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Check if we should run migrations or use sync
    const useMigrations = process.env.USE_MIGRATIONS !== 'false';
    
    if (useMigrations) {
      // In production or when migrations are enabled, we rely on migrations being run
      console.log('Using migration-based schema management.');
      console.log('Make sure to run migrations with: npx sequelize-cli db:migrate');
      await ensurePollTables();
    } else {
      // Fallback to sync for development (not recommended for production)
      console.warn('WARNING: Using sequelize.sync() - not recommended for production!');
      console.warn('Set USE_MIGRATIONS=true and run migrations instead.');
      await ensurePollTables();
      await sequelize.sync({ alter: true });
      console.log('Database models synchronized.');
    }

    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

app.ensurePollTables = ensurePollTables;

startServer();

module.exports = app;
