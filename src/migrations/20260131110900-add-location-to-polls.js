'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add locationId column to Polls table
    await queryInterface.addColumn('Polls', 'locationId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Locations',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // Add index for locationId
    await queryInterface.addIndex('Polls', ['locationId'], {
      name: 'polls_location_id_index'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove index
    await queryInterface.removeIndex('Polls', 'polls_location_id_index');
    
    // Remove column
    await queryInterface.removeColumn('Polls', 'locationId');
  }
};
