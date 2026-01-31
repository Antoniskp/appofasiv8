const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Article = sequelize.define('Article', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [5, 200]
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [10, 50000]
    }
  },
  summary: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  subtitle: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  coverImageUrl: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  coverImageCaption: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  sourceName: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  sourceUrl: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  articleType: {
    type: DataTypes.ENUM('personal', 'articles', 'news'),
    defaultValue: 'personal',
    allowNull: false
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  authorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'archived'),
    defaultValue: 'draft',
    allowNull: false
  },
  publishedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isNews: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  newsApprovedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  newsApprovedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  locationId: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Location code (e.g., GR, GR-I, GR-I-6104) from JSON location data'
  }
}, {
  timestamps: true
});

module.exports = Article;
