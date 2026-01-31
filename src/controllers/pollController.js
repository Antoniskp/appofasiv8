const { sequelize, Poll, PollOption, PollVote, User } = require('../models');
const { Op } = require('sequelize');
const crypto = require('crypto');

const voterSalt = process.env.VOTER_SALT
  || process.env.JWT_SECRET
  || crypto.randomBytes(32).toString('hex');

// Helper function to generate voter identifier from IP
const generateVoterIdentifier = (ip) => {
  return crypto
    .createHash('sha256')
    .update(ip)
    .update(voterSalt)
    .digest('hex');
};

const resolvePollLocation = async ({ locationId, useUserLocation, userId }) => {
  let finalLocationId = locationId ?? null;

  if (useUserLocation) {
    const user = await User.findByPk(userId);
    finalLocationId = user?.locationId ?? null;
  }

  if (finalLocationId != null && typeof finalLocationId !== 'string') {
    return {
      error: {
        status: 400,
        message: 'Invalid location ID format. Location ID must be a string code.'
      }
    };
  }

  return { value: finalLocationId };
};

// Helper function to calculate results
const calculateResults = async (pollId) => {
  const poll = await Poll.findByPk(pollId, {
    include: [
      {
        model: PollOption,
        as: 'options',
        attributes: ['id', 'text', 'photoUrl', 'linkUrl', 'orderIndex']
      }
    ]
  });

  if (!poll) {
    return null;
  }

  const votes = await PollVote.findAll({
    where: { pollId },
    include: [
      {
        model: PollOption,
        as: 'option',
        attributes: ['id', 'text']
      }
    ]
  });

  const totalVotes = votes.length;
  const authenticatedVotes = votes.filter(v => v.isAuthenticated).length;
  const unauthenticatedVotes = totalVotes - authenticatedVotes;

  // Calculate votes per option
  const optionStats = {};
  poll.options.forEach(option => {
    optionStats[option.id] = {
      optionId: option.id,
      text: option.text,
      photoUrl: option.photoUrl,
      linkUrl: option.linkUrl,
      totalVotes: 0,
      authenticatedVotes: 0,
      unauthenticatedVotes: 0,
      percentage: 0
    };
  });

  votes.forEach(vote => {
    if (vote.optionId && optionStats[vote.optionId]) {
      optionStats[vote.optionId].totalVotes++;
      if (vote.isAuthenticated) {
        optionStats[vote.optionId].authenticatedVotes++;
      } else {
        optionStats[vote.optionId].unauthenticatedVotes++;
      }
    }
  });

  // Calculate percentages
  Object.values(optionStats).forEach(stat => {
    stat.percentage = totalVotes > 0 ? (stat.totalVotes / totalVotes * 100).toFixed(2) : 0;
  });

  // Collect free text responses
  const freeTextResponses = votes
    .filter(v => v.freeTextResponse)
    .map(v => ({
      response: v.freeTextResponse,
      isAuthenticated: v.isAuthenticated,
      createdAt: v.createdAt
    }));

  return {
    totalVotes,
    authenticatedVotes,
    unauthenticatedVotes,
    optionStats: Object.values(optionStats).sort((a, b) => b.totalVotes - a.totalVotes),
    freeTextResponses
  };
};

// Create a new poll
exports.createPoll = async (req, res) => {
  try {
    const {
      title,
      description,
      pollType,
      questionType,
      allowUserSubmittedAnswers,
      allowUnauthenticatedVoting,
      allowFreeTextResponse,
      status,
      articleId,
      locationId,
      useUserLocation,
      startsAt,
      endsAt,
      options
    } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    if (!options || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'At least 2 options are required'
      });
    }

    const locationResult = await resolvePollLocation({
      locationId,
      useUserLocation,
      userId: req.user.id
    });
    if (locationResult.error) {
      return res.status(locationResult.error.status).json({
        success: false,
        message: locationResult.error.message
      });
    }
    const finalLocationId = locationResult.value;

    // Create poll
    const pollPayload = {
      title,
      description,
      pollType: pollType || 'simple',
      questionType: questionType || 'single-choice',
      allowUserSubmittedAnswers: allowUserSubmittedAnswers || false,
      allowUnauthenticatedVoting: allowUnauthenticatedVoting || false,
      allowFreeTextResponse: allowFreeTextResponse || false,
      status: status || 'draft',
      creatorId: req.user.id,
      articleId: articleId || null,
      locationId: finalLocationId,
      startsAt: startsAt || null,
      endsAt: endsAt || null
    };
    const poll = await Poll.create(pollPayload).catch(async (error) => {
      if (error?.name !== 'SequelizeForeignKeyConstraintError') {
        throw error;
      }
      console.warn('Poll create failed due to foreign key constraint. Retrying after poll table sync.');
      await Poll.sync();
      await PollOption.sync();
      await PollVote.sync();
      return Poll.create(pollPayload);
    });

    // Create options
    const pollOptions = await Promise.all(
      options.map((option, index) =>
        PollOption.create({
          pollId: poll.id,
          text: option.text,
          photoUrl: option.photoUrl || null,
          linkUrl: option.linkUrl || null,
          orderIndex: option.orderIndex !== undefined ? option.orderIndex : index,
          isUserSubmitted: false,
          submittedByUserId: null
        })
      )
    );

    return res.status(201).json({
      success: true,
      message: 'Poll created successfully',
      data: {
        poll,
        options: pollOptions
      }
    });
  } catch (error) {
    console.error('Create poll error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create poll',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all polls with pagination
exports.getPolls = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const status = req.query.status || 'active';

    const where = {};
    if (status && status !== 'all') {
      where.status = status;
    }

    const { count, rows: polls } = await Poll.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username', 'avatarUrl']
        },
        {
          model: PollOption,
          as: 'options',
          attributes: ['id', 'text', 'photoUrl', 'linkUrl', 'orderIndex']
        }
      ]
    });

    // Add vote counts to each poll
    const pollsWithCounts = await Promise.all(
      polls.map(async (poll) => {
        const voteCount = await PollVote.count({
          where: { pollId: poll.id }
        });
        return {
          ...poll.toJSON(),
          voteCount
        };
      })
    );

    return res.json({
      success: true,
      data: {
        polls: pollsWithCounts,
        pagination: {
          page,
          limit,
          totalPages: Math.ceil(count / limit),
          totalPolls: count
        }
      }
    });
  } catch (error) {
    console.error('Get polls error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch polls',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get a single poll by ID
exports.getPoll = async (req, res) => {
  try {
    const { id } = req.params;

    const poll = await Poll.findByPk(id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username', 'avatarUrl']
        },
        {
          model: PollOption,
          as: 'options',
          attributes: ['id', 'text', 'photoUrl', 'linkUrl', 'orderIndex', 'isUserSubmitted']
        }
      ],
      order: [[{ model: PollOption, as: 'options' }, 'orderIndex', 'ASC']]
    });

    if (!poll) {
      return res.status(404).json({
        success: false,
        message: 'Poll not found'
      });
    }

    // Check if user has voted
    let hasVoted = false;
    if (req.user) {
      const existingVote = await PollVote.findOne({
        where: {
          pollId: id,
          userId: req.user.id
        }
      });
      hasVoted = !!existingVote;
    }

    const voteCount = await PollVote.count({
      where: { pollId: id }
    });

    return res.json({
      success: true,
      data: {
        poll: {
          ...poll.toJSON(),
          voteCount,
          hasVoted
        }
      }
    });
  } catch (error) {
    console.error('Get poll error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch poll',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Submit a vote
exports.submitVote = async (req, res) => {
  try {
    const { id } = req.params;
    const { optionId, ranking, freeTextResponse } = req.body;
    const isAuthenticated = !!req.user;
    const userId = req.user?.id || null;
    const voterIp = req.ip || req.connection.remoteAddress;
    const voterIdentifier = generateVoterIdentifier(voterIp);

    // Get the poll
    const poll = await Poll.findByPk(id, {
      include: [
        {
          model: PollOption,
          as: 'options'
        }
      ]
    });

    if (!poll) {
      return res.status(404).json({
        success: false,
        message: 'Poll not found'
      });
    }

    // Check if poll is active
    if (poll.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Poll is not active'
      });
    }

    // Check if unauthenticated voting is allowed
    if (!isAuthenticated && !poll.allowUnauthenticatedVoting) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required to vote on this poll'
      });
    }

    // Check for existing vote
    if (isAuthenticated) {
      const existingVote = await PollVote.findOne({
        where: { pollId: id, userId }
      });
      if (existingVote) {
        return res.status(400).json({
          success: false,
          message: 'You have already voted on this poll'
        });
      }
    } else {
      // Check for duplicate unauthenticated votes
      const existingVote = await PollVote.findOne({
        where: { pollId: id, voterIdentifier }
      });
      if (existingVote) {
        return res.status(400).json({
          success: false,
          message: 'You have already voted on this poll'
        });
      }
    }

    // Validate vote based on question type
    if (poll.questionType === 'single-choice') {
      if (!optionId && !freeTextResponse) {
        return res.status(400).json({
          success: false,
          message: 'Please select an option or provide a free text response'
        });
      }
      if (optionId) {
        const option = poll.options.find(o => o.id === optionId);
        if (!option) {
          return res.status(400).json({
            success: false,
            message: 'Invalid option selected'
          });
        }
      }
    } else if (poll.questionType === 'ranked-choice') {
      if (!ranking || !Array.isArray(ranking) || ranking.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a ranking'
        });
      }
      // Validate ranking contains valid option IDs
      const validOptionIds = poll.options.map(o => o.id);
      const invalidOptions = ranking.filter(id => !validOptionIds.includes(id));
      if (invalidOptions.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid options in ranking'
        });
      }
    }

    // Validate free text response
    if (freeTextResponse && !poll.allowFreeTextResponse) {
      return res.status(400).json({
        success: false,
        message: 'Free text responses are not allowed for this poll'
      });
    }

    // Create vote
    const vote = await PollVote.create({
      pollId: id,
      userId,
      optionId: poll.questionType === 'single-choice' ? optionId : null,
      ranking: poll.questionType === 'ranked-choice' ? ranking : null,
      freeTextResponse: freeTextResponse || null,
      isAuthenticated,
      voterIdentifier: isAuthenticated ? null : voterIdentifier
    });

    return res.status(201).json({
      success: true,
      message: 'Vote submitted successfully',
      data: { vote }
    });
  } catch (error) {
    console.error('Submit vote error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit vote',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get poll results
exports.getPollResults = async (req, res) => {
  try {
    const { id } = req.params;

    const poll = await Poll.findByPk(id);
    if (!poll) {
      return res.status(404).json({
        success: false,
        message: 'Poll not found'
      });
    }

    const results = await calculateResults(id);

    return res.json({
      success: true,
      data: {
        poll: {
          id: poll.id,
          title: poll.title,
          description: poll.description,
          pollType: poll.pollType,
          questionType: poll.questionType
        },
        results
      }
    });
  } catch (error) {
    console.error('Get poll results error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch poll results',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update poll
exports.updatePoll = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      status,
      allowUserSubmittedAnswers,
      allowUnauthenticatedVoting,
      allowFreeTextResponse,
      locationId,
      useUserLocation,
      startsAt,
      endsAt
    } = req.body;

    const poll = await Poll.findByPk(id);
    if (!poll) {
      return res.status(404).json({
        success: false,
        message: 'Poll not found'
      });
    }

    // Check if user is the creator
    if (poll.creatorId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this poll'
      });
    }

    let resolvedLocationId = locationId;
    if (locationId !== undefined || useUserLocation !== undefined) {
      const locationResult = await resolvePollLocation({
        locationId,
        useUserLocation,
        userId: req.user.id
      });
      if (locationResult.error) {
        return res.status(locationResult.error.status).json({
          success: false,
          message: locationResult.error.message
        });
      }
      resolvedLocationId = locationResult.value;
    }

    // Update poll
    await poll.update({
      title: title || poll.title,
      description: description !== undefined ? description : poll.description,
      status: status || poll.status,
      allowUserSubmittedAnswers: allowUserSubmittedAnswers !== undefined ? allowUserSubmittedAnswers : poll.allowUserSubmittedAnswers,
      allowUnauthenticatedVoting: allowUnauthenticatedVoting !== undefined ? allowUnauthenticatedVoting : poll.allowUnauthenticatedVoting,
      allowFreeTextResponse: allowFreeTextResponse !== undefined ? allowFreeTextResponse : poll.allowFreeTextResponse,
      locationId: resolvedLocationId !== undefined ? resolvedLocationId : poll.locationId,
      startsAt: startsAt !== undefined ? startsAt : poll.startsAt,
      endsAt: endsAt !== undefined ? endsAt : poll.endsAt
    });

    return res.json({
      success: true,
      message: 'Poll updated successfully',
      data: { poll }
    });
  } catch (error) {
    console.error('Update poll error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update poll',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete poll
exports.deletePoll = async (req, res) => {
  try {
    const { id } = req.params;

    const poll = await Poll.findByPk(id);
    if (!poll) {
      return res.status(404).json({
        success: false,
        message: 'Poll not found'
      });
    }

    // Check if user is the creator
    if (poll.creatorId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this poll'
      });
    }

    await poll.destroy();

    return res.json({
      success: true,
      message: 'Poll deleted successfully'
    });
  } catch (error) {
    console.error('Delete poll error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete poll',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Add user-submitted option
exports.addUserOption = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, photoUrl, linkUrl } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Option text is required'
      });
    }

    const poll = await Poll.findByPk(id);
    if (!poll) {
      return res.status(404).json({
        success: false,
        message: 'Poll not found'
      });
    }

    if (!poll.allowUserSubmittedAnswers) {
      return res.status(403).json({
        success: false,
        message: 'User-submitted answers are not allowed for this poll'
      });
    }

    if (poll.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Poll is not active'
      });
    }

    // Get max order index
    const maxOption = await PollOption.findOne({
      where: { pollId: id },
      order: [['orderIndex', 'DESC']]
    });

    const newOrderIndex = maxOption ? maxOption.orderIndex + 1 : 0;

    const option = await PollOption.create({
      pollId: id,
      text,
      photoUrl: photoUrl || null,
      linkUrl: linkUrl || null,
      orderIndex: newOrderIndex,
      isUserSubmitted: true,
      submittedByUserId: req.user?.id || null
    });

    return res.status(201).json({
      success: true,
      message: 'Option added successfully',
      data: { option }
    });
  } catch (error) {
    console.error('Add user option error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to add option',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
