const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PollOption = sequelize.define('PollOption', {
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
  text: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 500]
    },
    comment: 'Option text or name of person/article'
  },
  photoUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'Photo URL for complex poll options'
  },
  linkUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'Link to article, profile, or external resource'
  },
  orderIndex: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Display order of options'
  },
  isUserSubmitted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
    comment: 'Whether this option was added by a user vs the creator'
  },
  submittedByUserId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    },
    comment: 'User who submitted this option (if user-submitted)'
  }
}, {
  timestamps: true
});

module.exports = PollOption;
