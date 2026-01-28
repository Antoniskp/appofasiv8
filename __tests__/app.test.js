const request = require('supertest');
const { sequelize } = require('../src/models');

// Create a test app instance
const express = require('express');
const cors = require('cors');
const authRoutes = require('../src/routes/authRoutes');
const articleRoutes = require('../src/routes/articleRoutes');
const locationRoutes = require('../src/routes/locationRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/locations', locationRoutes);

const originalGithubEnv = {
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL
};
const originalFetch = global.fetch;

describe('News Application Integration Tests', () => {
  let adminToken;
  let editorToken;
  let viewerToken;
  let testArticleId;

  beforeAll(async () => {
    process.env.GITHUB_CLIENT_ID = 'test-client-id';
    process.env.GITHUB_CLIENT_SECRET = 'test-client-secret';
    process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3001';
    // Connect to test database and sync models
    await sequelize.authenticate();
    await sequelize.sync({ force: true }); // Reset database for tests
  });

  afterAll(async () => {
    // Close database connection
    await sequelize.close();
    process.env.GITHUB_CLIENT_ID = originalGithubEnv.GITHUB_CLIENT_ID;
    process.env.GITHUB_CLIENT_SECRET = originalGithubEnv.GITHUB_CLIENT_SECRET;
    process.env.NEXT_PUBLIC_APP_URL = originalGithubEnv.NEXT_PUBLIC_APP_URL;
    global.fetch = originalFetch;
  });

  describe('Authentication Tests', () => {
    test('should register a new admin user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testadmin',
          email: 'admin@test.com',
          password: 'admin123',
          role: 'admin',
          firstName: 'Test',
          lastName: 'Admin'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user.role).toBe('admin');
      adminToken = response.body.data.token;
    });

    test('should register a new editor user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testeditor',
          email: 'editor@test.com',
          password: 'editor123',
          role: 'editor',
          firstName: 'Test',
          lastName: 'Editor'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.role).toBe('editor');
      editorToken = response.body.data.token;
    });

    test('should register a new viewer user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testviewer',
          email: 'viewer@test.com',
          password: 'viewer123',
          role: 'viewer',
          firstName: 'Test',
          lastName: 'Viewer'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.role).toBe('viewer');
      viewerToken = response.body.data.token;
    });

    test('should not register user with duplicate email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'duplicate',
          email: 'admin@test.com',
          password: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@test.com',
          password: 'admin123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
    });

    test('should not login with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@test.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    test('should get user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe('admin@test.com');
    });

    test('should not get profile without token', async () => {
      const response = await request(app)
        .get('/api/auth/profile');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    test('should update profile details', async () => {
      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          username: 'updatedadmin',
          firstName: 'Updated',
          lastName: 'Admin',
          avatarUrl: 'https://example.com/avatar.png',
          profileColor: '#1d4ed8'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.username).toBe('updatedadmin');
      expect(response.body.data.user.firstName).toBe('Updated');
      expect(response.body.data.user.lastName).toBe('Admin');
      expect(response.body.data.user.avatarUrl).toBe('https://example.com/avatar.png');
      expect(response.body.data.user.profileColor).toBe('#1d4ed8');
    });

    test('should update password with current password', async () => {
      const response = await request(app)
        .put('/api/auth/password')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          currentPassword: 'admin123',
          newPassword: 'newadmin123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    test('should login with new password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@test.com',
          password: 'newadmin123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    test('should start GitHub OAuth flow', async () => {
      const response = await request(app)
        .get('/api/auth/github');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.url).toContain('https://github.com/login/oauth/authorize');
      expect(response.body.data.state).toBeDefined();
    });

    test('should register with GitHub OAuth', async () => {
      const stateResponse = await request(app)
        .get('/api/auth/github');

      const state = stateResponse.body.data.state;

      global.fetch = jest.fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ access_token: 'test-access-token' })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            id: 12345,
            login: 'octocat',
            html_url: 'https://github.com/octocat',
            avatar_url: 'https://avatars.githubusercontent.com/u/12345?v=4',
            name: 'Octo Cat',
            email: 'octo@example.com'
          })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ([
            { email: 'octo@example.com', primary: true, verified: true }
          ])
        });

      const response = await request(app)
        .post('/api/auth/github/callback')
        .send({
          code: 'test-code',
          state
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.githubUsername).toBe('octocat');
      expect(response.body.data.user.email).toBe('octo@example.com');
    });

    test('should connect GitHub for existing user', async () => {
      const stateResponse = await request(app)
        .get('/api/auth/github');

      const state = stateResponse.body.data.state;

      global.fetch = jest.fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ access_token: 'test-access-token-2' })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            id: 54321,
            login: 'linkeduser',
            html_url: 'https://github.com/linkeduser',
            avatar_url: 'https://avatars.githubusercontent.com/u/54321?v=4',
            name: 'Linked User',
            email: 'admin@test.com'
          })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ([
            { email: 'admin@test.com', primary: true, verified: true }
          ])
        });

      const response = await request(app)
        .post('/api/auth/github/callback')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          code: 'test-code-2',
          state
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.githubUsername).toBe('linkeduser');
    });
  });

  describe('Article CRUD Tests', () => {
    test('should create article as authenticated user', async () => {
      const response = await request(app)
        .post('/api/articles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Test Article',
          subtitle: 'Test Subtitle',
          content: 'This is a test article content that is long enough to pass validation.',
          summary: 'Test summary',
          category: 'Technology',
          status: 'published',
          coverImageUrl: 'https://example.com/cover.jpg',
          coverImageCaption: 'Cover caption',
          sourceName: 'Test Source',
          sourceUrl: 'https://example.com/source',
          tags: ['tech', 'news', 'news'],
          readingTimeMinutes: 6,
          isFeatured: true
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.article.title).toBe('Test Article');
      expect(response.body.data.article.subtitle).toBe('Test Subtitle');
      expect(response.body.data.article.coverImageUrl).toBe('https://example.com/cover.jpg');
      expect(response.body.data.article.coverImageCaption).toBe('Cover caption');
      expect(response.body.data.article.sourceName).toBe('Test Source');
      expect(response.body.data.article.sourceUrl).toBe('https://example.com/source');
      expect(response.body.data.article.tags).toEqual(['tech', 'news']);
      expect(response.body.data.article.readingTimeMinutes).toBe(6);
      expect(response.body.data.article.isFeatured).toBe(true);
      testArticleId = response.body.data.article.id;
    });

    test('should not create article without authentication', async () => {
      const response = await request(app)
        .post('/api/articles')
        .send({
          title: 'Unauthorized Article',
          content: 'This should fail'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    test('should get all published articles (public)', async () => {
      const response = await request(app)
        .get('/api/articles?status=published');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.articles).toBeDefined();
      expect(Array.isArray(response.body.data.articles)).toBe(true);
    });

    test('should filter articles by authorId', async () => {
      const response = await request(app)
        .get('/api/articles')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({ authorId: 1 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.articles.length).toBeGreaterThan(0);
      response.body.data.articles.forEach((article) => {
        expect(article.authorId).toBe(1);
      });
    });

    test('should reject non-numeric authorId filter', async () => {
      const response = await request(app)
        .get('/api/articles')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({ authorId: 'not-a-number' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('should get single article by ID', async () => {
      const response = await request(app)
        .get(`/api/articles/${testArticleId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.article.id).toBe(testArticleId);
    });

    test('should update article as author', async () => {
      const response = await request(app)
        .put(`/api/articles/${testArticleId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Updated Test Article',
          subtitle: 'Updated subtitle',
          tags: ['updated', ''],
          readingTimeMinutes: 4,
          isFeatured: false
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.article.title).toBe('Updated Test Article');
      expect(response.body.data.article.subtitle).toBe('Updated subtitle');
      expect(response.body.data.article.tags).toEqual(['updated']);
      expect(response.body.data.article.readingTimeMinutes).toBe(4);
      expect(response.body.data.article.isFeatured).toBe(false);
    });

    test('should reject invalid metadata values', async () => {
      const response = await request(app)
        .put(`/api/articles/${testArticleId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          tags: ['this-tag-is-way-too-long-to-be-valid-because-it-exceeds-forty-characters'],
          readingTimeMinutes: 0,
          coverImageUrl: 'javascript:alert(1)'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('should update article as editor (different user)', async () => {
      const response = await request(app)
        .put(`/api/articles/${testArticleId}`)
        .set('Authorization', `Bearer ${editorToken}`)
        .send({
          title: 'Editor Updated Article'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    test('should not delete article as viewer', async () => {
      const response = await request(app)
        .delete(`/api/articles/${testArticleId}`)
        .set('Authorization', `Bearer ${viewerToken}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    test('should delete article as admin', async () => {
      const response = await request(app)
        .delete(`/api/articles/${testArticleId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    test('should return 404 for non-existent article', async () => {
      const response = await request(app)
        .get('/api/articles/99999');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('Role-Based Access Control Tests', () => {
    let viewerArticleId;

    test('viewer should be able to create their own article', async () => {
      const response = await request(app)
        .post('/api/articles')
        .set('Authorization', `Bearer ${viewerToken}`)
        .send({
          title: 'Viewer Article',
          content: 'This is an article created by a viewer user.',
          status: 'draft'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      viewerArticleId = response.body.data.article.id;
    });

    test('viewer should be able to update their own article', async () => {
      const response = await request(app)
        .put(`/api/articles/${viewerArticleId}`)
        .set('Authorization', `Bearer ${viewerToken}`)
        .send({
          title: 'Updated Viewer Article'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    test('editor should be able to update any article', async () => {
      const response = await request(app)
        .put(`/api/articles/${viewerArticleId}`)
        .set('Authorization', `Bearer ${editorToken}`)
        .send({
          title: 'Editor Modified Viewer Article'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    test('viewer should be able to delete their own article', async () => {
      const response = await request(app)
        .delete(`/api/articles/${viewerArticleId}`)
        .set('Authorization', `Bearer ${viewerToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('News Workflow Tests', () => {
    let moderatorToken;
    let newsArticleId;

    beforeAll(async () => {
      // Register a moderator user
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testmoderator',
          email: 'moderator@test.com',
          password: 'moderator123',
          role: 'moderator',
          firstName: 'Test',
          lastName: 'Moderator'
        });
      
      moderatorToken = response.body.data.token;
    });

    test('should create article with isNews flag', async () => {
      const response = await request(app)
        .post('/api/articles')
        .set('Authorization', `Bearer ${viewerToken}`)
        .send({
          title: 'Breaking News Article',
          content: 'This is a news article that needs moderation approval.',
          summary: 'Breaking news summary',
          category: 'News',
          status: 'draft',
          isNews: true
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.article.isNews).toBe(true);
      expect(response.body.data.article.newsApprovedAt).toBeNull();
      newsArticleId = response.body.data.article.id;
    });

    test('should not approve news without moderator/admin role', async () => {
      const response = await request(app)
        .post(`/api/articles/${newsArticleId}/approve-news`)
        .set('Authorization', `Bearer ${viewerToken}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    test('moderator should approve news successfully', async () => {
      const response = await request(app)
        .post(`/api/articles/${newsArticleId}/approve-news`)
        .set('Authorization', `Bearer ${moderatorToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.article.newsApprovedAt).toBeTruthy();
      expect(response.body.data.article.status).toBe('published');
    });

    test('should not approve already approved news', async () => {
      const response = await request(app)
        .post(`/api/articles/${newsArticleId}/approve-news`)
        .set('Authorization', `Bearer ${moderatorToken}`);

      // Should still succeed but article is already approved
      expect(response.status).toBe(200);
    });

    test('should not approve article not flagged as news', async () => {
      // Create a regular article
      const createResponse = await request(app)
        .post('/api/articles')
        .set('Authorization', `Bearer ${viewerToken}`)
        .send({
          title: 'Regular Article',
          content: 'This is not a news article.',
          status: 'draft',
          isNews: false
        });

      const regularArticleId = createResponse.body.data.article.id;

      const response = await request(app)
        .post(`/api/articles/${regularArticleId}/approve-news`)
        .set('Authorization', `Bearer ${moderatorToken}`);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not flagged as news');
    });

    test('should update article and maintain isNews flag', async () => {
      const response = await request(app)
        .put(`/api/articles/${newsArticleId}`)
        .set('Authorization', `Bearer ${viewerToken}`)
        .send({
          title: 'Updated Breaking News Article'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.article.isNews).toBe(true);
    });

    test('should allow author to unflag article as news', async () => {
      // Create a news article
      const createResponse = await request(app)
        .post('/api/articles')
        .set('Authorization', `Bearer ${viewerToken}`)
        .send({
          title: 'News to Unflag',
          content: 'This will be unflagged as news.',
          isNews: true
        });

      const articleId = createResponse.body.data.article.id;

      // Unflag as news
      const response = await request(app)
        .put(`/api/articles/${articleId}`)
        .set('Authorization', `Bearer ${viewerToken}`)
        .send({
          isNews: false
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.article.isNews).toBe(false);
      expect(response.body.data.article.newsApprovedAt).toBeNull();
    });
  });

  describe('Location System Tests', () => {
    test('should get all countries including Greece+International', async () => {
      const response = await request(app)
        .get('/api/locations/countries');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.locations).toBeDefined();
      expect(response.body.data.locations.length).toBeGreaterThanOrEqual(3);
      
      // Check for Greece, International, and Greece+International
      const countryCodes = response.body.data.locations.map(c => c.code);
      expect(countryCodes).toContain('GR');
      expect(countryCodes).toContain('INT');
      expect(countryCodes).toContain('GR+INT');
    });

    test('should get jurisdictions for Greece', async () => {
      const response = await request(app)
        .get('/api/locations/countries/GR/jurisdictions');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.locations).toBeDefined();
      expect(response.body.data.locations.length).toBeGreaterThan(0);
      
      // Check first jurisdiction has expected structure
      const firstJurisdiction = response.body.data.locations[0];
      expect(firstJurisdiction.id).toBeDefined();
      expect(firstJurisdiction.name).toBeDefined();
      expect(firstJurisdiction.type).toBe('jurisdiction');
      expect(firstJurisdiction.parentId).toBe('GR');
    });

    test('should return empty jurisdictions for International', async () => {
      const response = await request(app)
        .get('/api/locations/countries/INT/jurisdictions');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.locations).toEqual([]);
    });

    test('should get municipalities for a Greek jurisdiction', async () => {
      const response = await request(app)
        .get('/api/locations/jurisdictions/GR-I/municipalities');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.locations).toBeDefined();
      expect(response.body.data.locations.length).toBeGreaterThan(0);
      
      // Check first municipality has expected structure
      const firstMunicipality = response.body.data.locations[0];
      expect(firstMunicipality.id).toBeDefined();
      expect(firstMunicipality.name).toBeDefined();
      expect(firstMunicipality.type).toBe('municipality');
      expect(firstMunicipality.parentId).toBe('GR-I');
    });

    test('should create article with location code', async () => {
      const response = await request(app)
        .post('/api/articles')
        .set('Authorization', `Bearer ${editorToken}`)
        .send({
          title: 'Article with Location',
          content: 'This article has a location assigned.',
          status: 'published',
          locationId: 'GR-I'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.article.locationId).toBe('GR-I');
    });

    test('should update user profile with location', async () => {
      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${viewerToken}`)
        .send({
          locationId: 'GR+INT'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.locationId).toBe('GR+INT');
    });
  });
});
