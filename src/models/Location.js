const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Location = sequelize.define('Location', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      len: [1, 255]
    }
  },
  type: {
    type: DataTypes.ENUM('country', 'jurisdiction', 'municipality', 'address'),
    allowNull: false
  },
  code: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'ISO country code, region code, or other standard identifier'
  },
  parentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Locations',
      key: 'id'
    },
    comment: 'Parent location for hierarchical structure'
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Additional metadata like coordinates, official names in different languages, etc.'
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['type']
    },
    {
      fields: ['parentId']
    },
    {
      fields: ['code']
    }
  ]
});

module.exports = Location;
