'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add articleType column
    await queryInterface.addColumn('Articles', 'articleType', {
      type: Sequelize.ENUM('personal', 'articles', 'news'),
      defaultValue: 'personal',
      allowNull: false
    });

    // Keep readingTimeMinutes column (frontend and API still depend on it)
  },

  down: async (queryInterface, Sequelize) => {
    // Remove articleType column and its ENUM type
    await queryInterface.removeColumn('Articles', 'articleType');
    
    // Drop the ENUM type (PostgreSQL only)
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Articles_articleType"');

    // Add back readingTimeMinutes column
    await queryInterface.addColumn('Articles', 'readingTimeMinutes', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  }
};
