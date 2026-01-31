'use strict';

/**
 * Normalize Sequelize index metadata into a set of index names.
 *
 * @param {Array} indexes Sequelize index metadata entries.
 * @returns {Set<string>} Set of index names for fast lookup.
 */
const getIndexNames = (indexes = []) => new Set(
  (Array.isArray(indexes) ? indexes : [])
    // Sequelize returns index names under different keys depending on dialect/driver.
    .map((index) => index?.name ?? index?.index_name ?? index?.keyName ?? '')
    .filter(Boolean)
);

/**
 * Fetch index names for a table, returning an empty set if the table does not exist yet.
 *
 * @param {object} queryInterface Sequelize query interface.
 * @param {string} tableName Table name to inspect.
 * @returns {Promise<Set<string>>} Set of index names.
 */
const getIndexNamesForTable = async (queryInterface, tableName) => {
  try {
    const indexes = await queryInterface.showIndex(tableName);
    return getIndexNames(indexes);
  } catch (error) {
    const originalError = error?.original;
    const message = originalError?.message ?? error?.message ?? String(error);
    const missingTable = originalError?.code === '42P01'
      || message.includes('does not exist')
      || message.includes('no such table');
    if (missingTable) {
      return new Set();
    }
    throw error;
  }
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create Polls table
    await queryInterface.createTable('Polls', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      pollType: {
        type: Sequelize.ENUM('simple', 'complex'),
        defaultValue: 'simple',
        allowNull: false
      },
      questionType: {
        type: Sequelize.ENUM('single-choice', 'ranked-choice'),
        defaultValue: 'single-choice',
        allowNull: false
      },
      allowUserSubmittedAnswers: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      allowUnauthenticatedVoting: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      allowFreeTextResponse: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('draft', 'active', 'closed'),
        defaultValue: 'draft',
        allowNull: false
      },
      creatorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      articleId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Articles',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      startsAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      endsAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Create PollOptions table
    await queryInterface.createTable('PollOptions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      pollId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Polls',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      text: {
        type: Sequelize.STRING,
        allowNull: false
      },
      photoUrl: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      linkUrl: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      orderIndex: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      isUserSubmitted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      submittedByUserId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Create PollVotes table
    await queryInterface.createTable('PollVotes', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      pollId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Polls',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      optionId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'PollOptions',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      ranking: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      freeTextResponse: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      isAuthenticated: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      voterIdentifier: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add indexes (skip if already present)
    const pollVoteIndexNames = await getIndexNamesForTable(queryInterface, 'PollVotes');

    if (!pollVoteIndexNames.has('unique_user_poll_vote')) {
      await queryInterface.addIndex('PollVotes', ['pollId', 'userId'], {
        name: 'unique_user_poll_vote',
        unique: true,
        where: {
          userId: {
            [Sequelize.Op.ne]: null
          }
        }
      });
    }

    if (!pollVoteIndexNames.has('poll_voter_identifier_index')) {
      await queryInterface.addIndex('PollVotes', ['pollId', 'voterIdentifier'], {
        name: 'poll_voter_identifier_index'
      });
    }

    const pollOptionIndexNames = await getIndexNamesForTable(queryInterface, 'PollOptions');

    if (!pollOptionIndexNames.has('poll_option_order_index')) {
      await queryInterface.addIndex('PollOptions', ['pollId', 'orderIndex'], {
        name: 'poll_option_order_index'
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Drop tables in reverse order
    await queryInterface.dropTable('PollVotes');
    await queryInterface.dropTable('PollOptions');
    await queryInterface.dropTable('Polls');
  }
};
