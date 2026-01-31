const { sequelize, Poll, PollOption, PollVote } = require('../models');

const toggleSqliteForeignKeys = async (enabled) => {
  if (sequelize.getDialect() !== 'sqlite') {
    return;
  }
  try {
    await sequelize.query(`PRAGMA foreign_keys = ${enabled ? 'ON' : 'OFF'};`);
  } catch (error) {
    console.warn(
      `Unable to ${enabled ? 'enable' : 'disable'} SQLite foreign keys:`,
      error.message || error
    );
  }
};

const syncPollTables = async ({ force = false } = {}) => {
  await toggleSqliteForeignKeys(false);
  await Poll.sync({ force });
  await PollOption.sync({ force });
  await PollVote.sync({ force });
  await toggleSqliteForeignKeys(true);
};

module.exports = {
  syncPollTables
};
