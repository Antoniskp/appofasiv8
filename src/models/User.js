const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');
const userRoles = require('../../data/user-roles.json');

if (!Array.isArray(userRoles) || userRoles.length === 0) {
  throw new Error('User roles configuration is missing.');
}

const roleKeys = userRoles.map((role) => role.key);

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 50]
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM(...roleKeys),
    defaultValue: 'viewer',
    allowNull: false
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  avatarUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  profileColor: {
    type: DataTypes.STRING,
    allowNull: true
  },
  githubId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  githubUsername: {
    type: DataTypes.STRING,
    allowNull: true
  },
  githubProfileUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  githubAvatarUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  githubEmail: {
    type: DataTypes.STRING,
    allowNull: true
  },
  locationId: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Location code (e.g., GR, GR-I, GR-I-6104) from JSON location data'
  }
}, {
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = User;
