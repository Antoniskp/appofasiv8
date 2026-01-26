const { Sequelize } = require('sequelize');
require('dotenv').config();

const isTestEnv = process.env.NODE_ENV === 'test';

const database = isTestEnv
  ? (process.env.TEST_DB_NAME || 'newsapp_test')
  : (process.env.DB_NAME || 'newsapp');
const username = isTestEnv
  ? (process.env.TEST_DB_USER || '')
  : (process.env.DB_USER || 'postgres');
const password = isTestEnv
  ? (process.env.TEST_DB_PASSWORD || '')
  : (process.env.DB_PASSWORD || 'password');
const host = isTestEnv
  ? (process.env.TEST_DB_HOST || '')
  : (process.env.DB_HOST || 'localhost');
const port = isTestEnv
  ? (process.env.TEST_DB_PORT || '')
  : (process.env.DB_PORT || 5432);

const sequelize = isTestEnv
  ? new Sequelize({
      dialect: 'sqlite',
      storage: process.env.TEST_DB_STORAGE || ':memory:',
      logging: false
    })
  : new Sequelize(database, username, password, {
      host,
      port,
      dialect: 'postgres',
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    });

module.exports = sequelize;
