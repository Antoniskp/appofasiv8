'use strict';

/**
 * Migration to fix locationId field in Users and Articles tables.
 * 
 * This migration handles legacy databases where locationId might have been:
 * 1. An INTEGER column with a foreign key to a Locations table (old schema)
 * 
 * And migrates to the current design where:
 * 1. locationId is VARCHAR(100) storing location codes from JSON data (e.g., GR, GR-I, GR-I-6104)
 * 2. No foreign key constraint (locations come from JSON files, not DB)
 * 
 * @type {import('sequelize-cli').Migration}
 */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Note: We don't use a transaction here because describeTable can cause deadlocks
    // Each operation is atomic enough on its own
    
    try {
      console.log('Starting locationId migration...');
      
      // Get list of all foreign keys on Users table
      const usersForeignKeys = await queryInterface.sequelize.query(
        `SELECT tc.constraint_name, kcu.column_name
         FROM information_schema.table_constraints AS tc
         JOIN information_schema.key_column_usage AS kcu
           ON tc.constraint_name = kcu.constraint_name
           AND tc.table_schema = kcu.table_schema
         WHERE tc.constraint_type = 'FOREIGN KEY'
           AND tc.table_name = 'Users'
           AND kcu.column_name = 'locationId';`,
        { type: Sequelize.QueryTypes.SELECT }
      );

      // Drop foreign key constraint on Users.locationId if it exists
      for (const fk of usersForeignKeys) {
        console.log(`Dropping foreign key constraint ${fk.constraint_name} on Users.locationId`);
        await queryInterface.removeConstraint('Users', fk.constraint_name);
      }

      // Check current column type for Users.locationId using a direct query
      const usersColumnInfo = await queryInterface.sequelize.query(
        `SELECT data_type, character_maximum_length
         FROM information_schema.columns
         WHERE table_name = 'Users' AND column_name = 'locationId';`,
        { type: Sequelize.QueryTypes.SELECT }
      );

      // Change Users.locationId to VARCHAR(100) if it's not already
      if (usersColumnInfo.length > 0) {
        const columnType = usersColumnInfo[0].data_type;
        const columnLength = usersColumnInfo[0].character_maximum_length;
        
        if (columnType !== 'character varying' || columnLength !== 100) {
          console.log(`Converting Users.locationId from ${columnType}${columnLength ? '(' + columnLength + ')' : ''} to VARCHAR(100)`);
          await queryInterface.changeColumn('Users', 'locationId', {
            type: Sequelize.STRING(100),
            allowNull: true,
            comment: 'Location code (e.g., GR, GR-I, GR-I-6104) from JSON location data'
          });
        } else {
          console.log('Users.locationId is already VARCHAR(100)');
        }
      }

      // Get list of all foreign keys on Articles table
      const articlesForeignKeys = await queryInterface.sequelize.query(
        `SELECT tc.constraint_name, kcu.column_name
         FROM information_schema.table_constraints AS tc
         JOIN information_schema.key_column_usage AS kcu
           ON tc.constraint_name = kcu.constraint_name
           AND tc.table_schema = kcu.table_schema
         WHERE tc.constraint_type = 'FOREIGN KEY'
           AND tc.table_name = 'Articles'
           AND kcu.column_name = 'locationId';`,
        { type: Sequelize.QueryTypes.SELECT }
      );

      // Drop foreign key constraint on Articles.locationId if it exists
      for (const fk of articlesForeignKeys) {
        console.log(`Dropping foreign key constraint ${fk.constraint_name} on Articles.locationId`);
        await queryInterface.removeConstraint('Articles', fk.constraint_name);
      }

      // Check current column type for Articles.locationId using a direct query
      const articlesColumnInfo = await queryInterface.sequelize.query(
        `SELECT data_type, character_maximum_length
         FROM information_schema.columns
         WHERE table_name = 'Articles' AND column_name = 'locationId';`,
        { type: Sequelize.QueryTypes.SELECT }
      );

      // Change Articles.locationId to VARCHAR(100) if it's not already
      if (articlesColumnInfo.length > 0) {
        const columnType = articlesColumnInfo[0].data_type;
        const columnLength = articlesColumnInfo[0].character_maximum_length;
        
        if (columnType !== 'character varying' || columnLength !== 100) {
          console.log(`Converting Articles.locationId from ${columnType}${columnLength ? '(' + columnLength + ')' : ''} to VARCHAR(100)`);
          await queryInterface.changeColumn('Articles', 'locationId', {
            type: Sequelize.STRING(100),
            allowNull: true,
            comment: 'Location code (e.g., GR, GR-I, GR-I-6104) from JSON location data'
          });
        } else {
          console.log('Articles.locationId is already VARCHAR(100)');
        }
      }

      console.log('Migration completed successfully');
    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    }
  },

  async down (queryInterface, Sequelize) {
    // This migration is one-way only. Reverting would potentially lose data
    // or create inconsistencies. If you need to revert, you should:
    // 1. Create a Locations table
    // 2. Populate it with location data
    // 3. Create a data migration to convert location codes to integer IDs
    // 4. Add foreign key constraints
    console.warn('This migration cannot be safely reverted automatically.');
    console.warn('Manual intervention would be required to restore integer locationId with foreign keys.');
  }
};
