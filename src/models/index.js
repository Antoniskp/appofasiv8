const sequelize = require('../config/database');
const User = require('./User');
const Article = require('./Article');
const Poll = require('./Poll');
const PollOption = require('./PollOption');
const PollVote = require('./PollVote');

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

// User - Poll relationships
User.hasMany(Poll, {
  foreignKey: 'creatorId',
  as: 'polls'
});

Poll.belongsTo(User, {
  foreignKey: 'creatorId',
  as: 'creator'
});

// Poll - Article relationship (optional)
Poll.belongsTo(Article, {
  foreignKey: 'articleId',
  as: 'article'
});

Article.hasMany(Poll, {
  foreignKey: 'articleId',
  as: 'polls'
});

// Poll - PollOption relationships
Poll.hasMany(PollOption, {
  foreignKey: 'pollId',
  as: 'options',
  onDelete: 'CASCADE'
});

PollOption.belongsTo(Poll, {
  foreignKey: 'pollId',
  as: 'poll'
});

// User - PollOption (for user-submitted options)
User.hasMany(PollOption, {
  foreignKey: 'submittedByUserId',
  as: 'submittedOptions'
});

PollOption.belongsTo(User, {
  foreignKey: 'submittedByUserId',
  as: 'submittedBy'
});

// Poll - PollVote relationships
Poll.hasMany(PollVote, {
  foreignKey: 'pollId',
  as: 'votes',
  onDelete: 'CASCADE'
});

PollVote.belongsTo(Poll, {
  foreignKey: 'pollId',
  as: 'poll'
});

// User - PollVote relationships
User.hasMany(PollVote, {
  foreignKey: 'userId',
  as: 'votes'
});

PollVote.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// PollOption - PollVote relationships
PollOption.hasMany(PollVote, {
  foreignKey: 'optionId',
  as: 'votes'
});

PollVote.belongsTo(PollOption, {
  foreignKey: 'optionId',
  as: 'option'
});

module.exports = {
  sequelize,
  User,
  Article,
  Poll,
  PollOption,
  PollVote
};
