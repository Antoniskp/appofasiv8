const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PollVote = sequelize.define('PollVote', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  pollId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Polls',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    },
    comment: 'Null if unauthenticated vote'
  },
  optionId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'PollOptions',
      key: 'id'
    },
    comment: 'Selected option (null for free-text only)'
  },
  ranking: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Array of option IDs in ranked order for ranked-choice polls'
  },
  freeTextResponse: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: [0, 1000]
    },
    comment: 'Optional free-text response'
  },
  isAuthenticated: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Whether this vote was from an authenticated user'
  },
  voterIdentifier: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'IP hash or session ID for unauthenticated votes to prevent duplicates'
  }
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['pollId', 'userId'],
      name: 'unique_user_poll_vote',
      where: {
        userId: {
          [sequelize.Sequelize.Op.ne]: null
        }
      }
    },
    {
      fields: ['pollId', 'voterIdentifier'],
      name: 'poll_voter_identifier_index'
    }
  ]
});

module.exports = PollVote;
