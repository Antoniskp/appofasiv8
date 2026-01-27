const sequelize = require('../config/database');
const User = require('./User');
const Article = require('./Article');
const Location = require('./Location');

// Define associations

// User - Article relationships
User.hasMany(Article, {
  foreignKey: 'authorId',
  as: 'articles'
});

Article.belongsTo(User, {
  foreignKey: 'authorId',
  as: 'author'
});

// Location - User relationships
Location.hasMany(User, {
  foreignKey: 'locationId',
  as: 'users'
});

User.belongsTo(Location, {
  foreignKey: 'locationId',
  as: 'location'
});

// Location - Article relationships
Location.hasMany(Article, {
  foreignKey: 'locationId',
  as: 'articles'
});

Article.belongsTo(Location, {
  foreignKey: 'locationId',
  as: 'location'
});

// Location self-referencing hierarchy
Location.hasMany(Location, {
  foreignKey: 'parentId',
  as: 'children'
});

Location.belongsTo(Location, {
  foreignKey: 'parentId',
  as: 'parent'
});

module.exports = {
  sequelize,
  User,
  Article,
  Location
};
