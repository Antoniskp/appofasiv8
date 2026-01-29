const request = require('supertest');
const app = require('../src/index');
const { sequelize, User, Poll, PollOption, PollVote } = require('../src/models');

describe('Poll API Tests', () => {
  let authToken;
  let userId;
  let pollId;

  beforeAll(async () => {
    // Sync database
    await sequelize.sync({ force: true });

    // Create a test user
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        role: 'editor'
      });

    authToken = response.body.data.token;
    userId = response.body.data.user.id;
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /api/polls', () => {
    it('should create a new poll with authentication', async () => {
      const response = await request(app)
        .post('/api/polls')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Poll',
          description: 'This is a test poll',
          pollType: 'simple',
          questionType: 'single-choice',
          allowUserSubmittedAnswers: false,
          allowUnauthenticatedVoting: true,
          allowFreeTextResponse: false,
          status: 'active',
          options: [
            { text: 'Option 1' },
            { text: 'Option 2' },
            { text: 'Option 3' }
          ]
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.poll).toBeDefined();
      expect(response.body.data.poll.title).toBe('Test Poll');
      expect(response.body.data.options).toHaveLength(3);
      
      pollId = response.body.data.poll.id;
    });

    it('should fail to create poll without authentication', async () => {
      const response = await request(app)
        .post('/api/polls')
        .send({
          title: 'Test Poll',
          options: [
            { text: 'Option 1' },
            { text: 'Option 2' }
          ]
        });

      expect(response.status).toBe(401);
    });

    it('should fail to create poll without minimum options', async () => {
      const response = await request(app)
        .post('/api/polls')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Poll',
          options: [
            { text: 'Option 1' }
          ]
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('At least 2 options are required');
    });
  });

  describe('GET /api/polls', () => {
    it('should get list of polls', async () => {
      const response = await request(app)
        .get('/api/polls')
        .query({ status: 'active' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.polls).toBeDefined();
      expect(Array.isArray(response.body.data.polls)).toBe(true);
    });

    it('should return polls when poll tables are missing and are re-created', async () => {
      const shouldSkip = process.env.SKIP_POLL_TABLE_DROP === 'true';
      if (shouldSkip) {
        return;
      }

      await PollVote.drop();
      await PollOption.drop();
      await Poll.drop();

      await app.ensurePollTables();

      const response = await request(app)
        .get('/api/polls')
        .query({ status: 'active' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.polls)).toBe(true);
    });
  });

  describe('GET /api/polls/:id', () => {
    it('should get a single poll by ID', async () => {
      const response = await request(app)
        .get(`/api/polls/${pollId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.poll).toBeDefined();
      expect(response.body.data.poll.id).toBe(pollId);
      expect(response.body.data.poll.options).toBeDefined();
    });

    it('should return 404 for non-existent poll', async () => {
      const response = await request(app)
        .get('/api/polls/99999');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/polls/:id/vote', () => {
    it('should submit a vote to a poll', async () => {
      // First get the poll to find an option ID
      const pollResponse = await request(app)
        .get(`/api/polls/${pollId}`);
      
      const optionId = pollResponse.body.data.poll.options[0].id;

      const response = await request(app)
        .post(`/api/polls/${pollId}/vote`)
        .send({
          optionId: optionId
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.vote).toBeDefined();
    });

    it('should prevent duplicate votes from same IP', async () => {
      const pollResponse = await request(app)
        .get(`/api/polls/${pollId}`);
      
      const optionId = pollResponse.body.data.poll.options[0].id;

      const response = await request(app)
        .post(`/api/polls/${pollId}/vote`)
        .send({
          optionId: optionId
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('already voted');
    });

    it('should prevent authenticated user from voting twice', async () => {
      // Create another poll for this test
      const createResponse = await request(app)
        .post('/api/polls')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Poll 2',
          status: 'active',
          options: [
            { text: 'Option A' },
            { text: 'Option B' }
          ]
        });

      const newPollId = createResponse.body.data.poll.id;
      const optionId = createResponse.body.data.options[0].id;

      // First vote
      await request(app)
        .post(`/api/polls/${newPollId}/vote`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ optionId });

      // Second vote should fail
      const response = await request(app)
        .post(`/api/polls/${newPollId}/vote`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ optionId });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('already voted');
    });
  });

  describe('GET /api/polls/:id/results', () => {
    it('should get poll results', async () => {
      const response = await request(app)
        .get(`/api/polls/${pollId}/results`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.results).toBeDefined();
      expect(response.body.data.results.totalVotes).toBeGreaterThan(0);
      expect(response.body.data.results.optionStats).toBeDefined();
      expect(Array.isArray(response.body.data.results.optionStats)).toBe(true);
    });
  });

  describe('PUT /api/polls/:id', () => {
    it('should update a poll by creator', async () => {
      const response = await request(app)
        .put(`/api/polls/${pollId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Test Poll',
          status: 'closed'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.poll.title).toBe('Updated Test Poll');
      expect(response.body.data.poll.status).toBe('closed');
    });

    it('should fail to update poll without authentication', async () => {
      const response = await request(app)
        .put(`/api/polls/${pollId}`)
        .send({
          title: 'Updated Test Poll'
        });

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /api/polls/:id', () => {
    it('should delete a poll by creator', async () => {
      // Create a poll to delete
      const createResponse = await request(app)
        .post('/api/polls')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Poll to Delete',
          status: 'draft',
          options: [
            { text: 'Option 1' },
            { text: 'Option 2' }
          ]
        });

      const deletePollId = createResponse.body.data.poll.id;

      const response = await request(app)
        .delete(`/api/polls/${deletePollId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Verify poll is deleted
      const getResponse = await request(app)
        .get(`/api/polls/${deletePollId}`);
      
      expect(getResponse.status).toBe(404);
    });
  });

  describe('Complex Poll Types', () => {
    it('should create a complex poll with photos and links', async () => {
      const response = await request(app)
        .post('/api/polls')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Best City in Greece',
          pollType: 'complex',
          questionType: 'single-choice',
          status: 'active',
          options: [
            {
              text: 'Athens',
              photoUrl: 'https://example.com/athens.jpg',
              linkUrl: 'https://example.com/athens'
            },
            {
              text: 'Thessaloniki',
              photoUrl: 'https://example.com/thessaloniki.jpg',
              linkUrl: 'https://example.com/thessaloniki'
            }
          ]
        });

      expect(response.status).toBe(201);
      expect(response.body.data.poll.pollType).toBe('complex');
      expect(response.body.data.options[0].photoUrl).toBeDefined();
      expect(response.body.data.options[0].linkUrl).toBeDefined();
    });

    it('should create a ranked-choice poll', async () => {
      const response = await request(app)
        .post('/api/polls')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Rank Your Preferences',
          questionType: 'ranked-choice',
          allowUnauthenticatedVoting: true,
          status: 'active',
          options: [
            { text: 'First Choice' },
            { text: 'Second Choice' },
            { text: 'Third Choice' }
          ]
        });

      expect(response.status).toBe(201);
      expect(response.body.data.poll.questionType).toBe('ranked-choice');

      // Test voting with ranking
      const rankPollId = response.body.data.poll.id;
      const optionIds = response.body.data.options.map(o => o.id);

      const voteResponse = await request(app)
        .post(`/api/polls/${rankPollId}/vote`)
        .send({
          ranking: [optionIds[2], optionIds[0], optionIds[1]]
        });

      expect(voteResponse.status).toBe(201);
    });

    it('should allow user-submitted options', async () => {
      const response = await request(app)
        .post('/api/polls')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Poll with User Options',
          allowUserSubmittedAnswers: true,
          status: 'active',
          options: [
            { text: 'Option 1' },
            { text: 'Option 2' }
          ]
        });

      const userPollId = response.body.data.poll.id;

      // Add user-submitted option
      const addOptionResponse = await request(app)
        .post(`/api/polls/${userPollId}/options`)
        .send({
          text: 'User Submitted Option'
        });

      expect(addOptionResponse.status).toBe(201);
      expect(addOptionResponse.body.data.option.text).toBe('User Submitted Option');
      expect(addOptionResponse.body.data.option.isUserSubmitted).toBe(true);
    });

    it('should support free-text responses', async () => {
      const response = await request(app)
        .post('/api/polls')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Poll with Free Text',
          allowFreeTextResponse: true,
          status: 'active',
          options: [
            { text: 'Option 1' },
            { text: 'Option 2' }
          ]
        });

      const freeTextPollId = response.body.data.poll.id;
      const optionId = response.body.data.options[0].id;

      const voteResponse = await request(app)
        .post(`/api/polls/${freeTextPollId}/vote`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          optionId,
          freeTextResponse: 'This is my free text response'
        });

      expect(voteResponse.status).toBe(201);
      expect(voteResponse.body.data.vote.freeTextResponse).toBe('This is my free text response');
    });
  });
});
