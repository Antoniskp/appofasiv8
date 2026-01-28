'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Create Users table
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      role: {
        type: Sequelize.ENUM('admin', 'moderator', 'editor', 'viewer'),
        defaultValue: 'viewer',
        allowNull: false
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      avatarUrl: {
        type: Sequelize.STRING,
        allowNull: true
      },
      profileColor: {
        type: Sequelize.STRING,
        allowNull: true
      },
      githubId: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },
      githubUsername: {
        type: Sequelize.STRING,
        allowNull: true
      },
      githubProfileUrl: {
        type: Sequelize.STRING,
        allowNull: true
      },
      githubAvatarUrl: {
        type: Sequelize.STRING,
        allowNull: true
      },
      githubEmail: {
        type: Sequelize.STRING,
        allowNull: true
      },
      locationId: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: 'Location code (e.g., GR, GR-I, GR-I-6104) from JSON location data'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create Articles table
    await queryInterface.createTable('Articles', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      summary: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      subtitle: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      coverImageUrl: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      coverImageCaption: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      sourceName: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      sourceUrl: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      tags: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: []
      },
      readingTimeMinutes: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      isFeatured: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      authorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      status: {
        type: Sequelize.ENUM('draft', 'published', 'archived'),
        defaultValue: 'draft',
        allowNull: false
      },
      publishedAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      category: {
        type: Sequelize.STRING,
        allowNull: true
      },
      isNews: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      newsApprovedAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      newsApprovedBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      locationId: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: 'Location code (e.g., GR, GR-I, GR-I-6104) from JSON location data'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Articles');
    await queryInterface.dropTable('Users');
  }
};
