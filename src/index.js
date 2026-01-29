const express = require('express');
const cors = require('cors');
const { sequelize, Poll, PollOption, PollVote } = require('./models');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const articleRoutes = require('./routes/articleRoutes');
const locationRoutes = require('./routes/locationRoutes');
const pollRoutes = require('./routes/pollRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

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

const ensurePollTables = async () => {
  const queryInterface = sequelize.getQueryInterface();
  const tables = await queryInterface.showAllTables();
  const normalizedTables = tables
    .map(normalizeTableName)
    .filter(Boolean)
    .map((name) => name.replace(/"/g, '').split('.').pop().toLowerCase());
  const requiredTables = [Poll, PollOption, PollVote]
    .map((model) => normalizeTableName(model.getTableName()))
    .filter(Boolean)
    .map((name) => name.replace(/"/g, '').split('.').pop().toLowerCase());
  const missingTables = requiredTables.filter((tableName) => !normalizedTables.includes(tableName));

  if (missingTables.length > 0) {
    console.warn(
      `Poll tables missing (${missingTables.join(', ')}). Creating missing poll tables with model sync.`
    );
    await sequelize.sync({ models: [Poll, PollOption, PollVote] });
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
