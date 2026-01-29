const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Poll = sequelize.define('Poll', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [3, 200]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  pollType: {
    type: DataTypes.ENUM('simple', 'complex'),
    defaultValue: 'simple',
    allowNull: false,
    comment: 'simple: text options, complex: options with photos/urls/details'
  },
  questionType: {
    type: DataTypes.ENUM('single-choice', 'ranked-choice'),
    defaultValue: 'single-choice',
    allowNull: false
  },
  allowUserSubmittedAnswers: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
    comment: 'Allow users to add their own answer options'
  },
  allowUnauthenticatedVoting: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
    comment: 'Allow non-authenticated users to vote'
  },
  allowFreeTextResponse: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
    comment: 'Allow one free-text response per user'
  },
  status: {
    type: DataTypes.ENUM('draft', 'active', 'closed'),
    defaultValue: 'draft',
    allowNull: false
  },
  creatorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  articleId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Articles',
      key: 'id'
    },
    comment: 'Optional reference if poll is embedded in an article'
  },
  startsAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  endsAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = Poll;
