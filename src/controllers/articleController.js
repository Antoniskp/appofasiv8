const { Article, User, Location } = require('../models');
const { Op } = require('sequelize');

const TAG_PATTERN = /^[\p{L}\p{N}][\p{L}\p{N}\s-]{0,39}$/u;
const MAX_TAGS = 10;
const MAX_IMAGE_URL_LENGTH = 500;
const MAX_SOURCE_URL_LENGTH = 500;

const normalizeTags = (tags) => {
  if (tags === undefined) {
    return { value: undefined };
  }
  if (tags === null) {
    return { value: [] };
  }
  if (!Array.isArray(tags)) {
    return { error: 'Tags must be an array.' };
  }

  const cleaned = tags
    .map((tag) => {
      if (typeof tag === 'string') {
        return tag.trim();
      }
      if (typeof tag === 'number' || typeof tag === 'boolean') {
        return String(tag);
      }
      return '';
    })
    .filter(Boolean);

  for (const tag of cleaned) {
    if (tag.length > 40 || !TAG_PATTERN.test(tag)) {
      return { error: 'Tags must be 1-40 characters and use letters, numbers, spaces, or dashes.' };
    }
  }

  const uniqueTags = [...new Set(cleaned)];
  if (uniqueTags.length > MAX_TAGS) {
    return { error: 'A maximum of 10 tags is allowed.' };
  }

  return { value: uniqueTags };
};

const normalizeReadingTime = (readingTimeMinutes) => {
  if (readingTimeMinutes === undefined) {
    return { value: undefined };
  }
  if (readingTimeMinutes === null || readingTimeMinutes === '') {
    return { value: null };
  }
  const parsed = Number(readingTimeMinutes);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 120) {
    return { error: 'Reading time must be an integer between 1 and 120 minutes.' };
  }
  return { value: parsed };
};

const normalizeUrl = (value, fieldName, maxLength) => {
  if (value === undefined) {
    return { value: undefined };
  }
  if (value === null || value === '') {
    return { value: null };
  }
  if (maxLength && value.length > maxLength) {
    return { error: `${fieldName} must be ${maxLength} characters or less.` };
  }
  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol)) {
      return { error: `${fieldName} must start with http or https.` };
    }
    return { value: value };
  } catch (error) {
    return { error: `${fieldName} must be a valid URL.` };
  }
};

const articleController = {
  // Create a new article
  createArticle: async (req, res) => {
    try {
      const {
        title,
        content,
        summary,
        subtitle,
        category,
        status,
        isNews,
        locationId,
        useUserLocation,
        coverImageUrl,
        coverImageCaption,
        sourceName,
        sourceUrl,
        tags,
        readingTimeMinutes,
        isFeatured
      } = req.body;

      // Validate required fields
      if (!title || !content) {
        return res.status(400).json({
          success: false,
          message: 'Title and content are required.'
        });
      }

      // Determine which locationId to use
      let finalLocationId = locationId;
      if (useUserLocation) {
        const user = await User.findByPk(req.user.id);
        finalLocationId = user.locationId;
      }

      // Validate locationId if provided
      if (finalLocationId !== null && finalLocationId !== undefined) {
        const location = await Location.findByPk(finalLocationId);
        if (!location) {
          return res.status(400).json({
            success: false,
            message: 'Invalid location ID. Location does not exist.'
          });
        }
      }

      const normalizedTags = normalizeTags(tags);
      if (normalizedTags.error) {
        return res.status(400).json({
          success: false,
          message: normalizedTags.error
        });
      }

      const normalizedReadingTime = normalizeReadingTime(readingTimeMinutes);
      if (normalizedReadingTime.error) {
        return res.status(400).json({
          success: false,
          message: normalizedReadingTime.error
        });
      }

      const normalizedCoverImageUrl = normalizeUrl(
        coverImageUrl,
        'Cover image URL',
        MAX_IMAGE_URL_LENGTH
      );
      if (normalizedCoverImageUrl.error) {
        return res.status(400).json({
          success: false,
          message: normalizedCoverImageUrl.error
        });
      }

      const normalizedSourceUrl = normalizeUrl(
        sourceUrl,
        'Source URL',
        MAX_SOURCE_URL_LENGTH
      );
      if (normalizedSourceUrl.error) {
        return res.status(400).json({
          success: false,
          message: normalizedSourceUrl.error
        });
      }

      // Create article
      const article = await Article.create({
        title,
        content,
        summary,
        subtitle,
        category,
        status: status || 'draft',
        authorId: req.user.id,
        publishedAt: status === 'published' ? new Date() : null,
        isNews: isNews || false,
        locationId: finalLocationId || null,
        coverImageUrl: normalizedCoverImageUrl.value,
        coverImageCaption,
        sourceName,
        sourceUrl: normalizedSourceUrl.value,
        tags: normalizedTags.value,
        readingTimeMinutes: normalizedReadingTime.value,
        isFeatured: isFeatured || false
      });

      // Fetch article with author info
      const articleWithAuthor = await Article.findByPk(article.id, {
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'username', 'firstName', 'lastName']
          },
          {
            model: Location,
            as: 'location',
            attributes: ['id', 'name', 'code', 'type']
          }
        ]
      });

      res.status(201).json({
        success: true,
        message: 'Article created successfully.',
        data: { article: articleWithAuthor }
      });
    } catch (error) {
      console.error('Create article error:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating article.',
        error: error.message
      });
    }
  },

  // Get all articles
  getAllArticles: async (req, res) => {
    try {
      const { status, category, authorId, page = 1, limit = 10 } = req.query;
      
      const where = {};
      
      // Filter by status (default to published for non-authenticated users)
      if (status) {
        where.status = status;
      } else if (!req.user) {
        where.status = 'published';
      }
      
      // Filter by category
      if (category) {
        where.category = category;
      }

      if (authorId !== undefined) {
        const parsedAuthorId = parseInt(authorId, 10);
        if (Number.isNaN(parsedAuthorId)) {
          return res.status(400).json({
            success: false,
            message: 'Author ID must be a number.'
          });
        }
        where.authorId = parsedAuthorId;
      }

      const offset = (page - 1) * limit;

      const { count, rows: articles } = await Article.findAndCountAll({
        where,
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'username', 'firstName', 'lastName']
          },
          {
            model: Location,
            as: 'location',
            attributes: ['id', 'name', 'code', 'type']
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      res.status(200).json({
        success: true,
        data: {
          articles,
          pagination: {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(count / limit)
          }
        }
      });
    } catch (error) {
      console.error('Get articles error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching articles.',
        error: error.message
      });
    }
  },

  // Get single article by ID
  getArticleById: async (req, res) => {
    try {
      const { id } = req.params;

      const article = await Article.findByPk(id, {
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'username', 'firstName', 'lastName']
          },
          {
            model: Location,
            as: 'location',
            attributes: ['id', 'name', 'code', 'type']
          }
        ]
      });

      if (!article) {
        return res.status(404).json({
          success: false,
          message: 'Article not found.'
        });
      }

      // Check if user has permission to view unpublished articles
      if (article.status !== 'published' && (!req.user || (req.user.id !== article.authorId && req.user.role !== 'admin'))) {
        return res.status(403).json({
          success: false,
          message: 'Access denied.'
        });
      }

      res.status(200).json({
        success: true,
        data: { article }
      });
    } catch (error) {
      console.error('Get article error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching article.',
        error: error.message
      });
    }
  },

  // Update article
  updateArticle: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        title,
        content,
        summary,
        subtitle,
        category,
        status,
        isNews,
        locationId,
        useUserLocation,
        coverImageUrl,
        coverImageCaption,
        sourceName,
        sourceUrl,
        tags,
        readingTimeMinutes,
        isFeatured
      } = req.body;

      const article = await Article.findByPk(id);

      if (!article) {
        return res.status(404).json({
          success: false,
          message: 'Article not found.'
        });
      }

      // Check permissions: author can edit their own, admin and editor can edit all
      if (article.authorId !== req.user.id && !['admin', 'editor'].includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to update this article.'
        });
      }

      const normalizedTags = normalizeTags(tags);
      if (normalizedTags.error) {
        return res.status(400).json({
          success: false,
          message: normalizedTags.error
        });
      }

      const normalizedReadingTime = normalizeReadingTime(readingTimeMinutes);
      if (normalizedReadingTime.error) {
        return res.status(400).json({
          success: false,
          message: normalizedReadingTime.error
        });
      }

      const normalizedCoverImageUrl = normalizeUrl(
        coverImageUrl,
        'Cover image URL',
        MAX_IMAGE_URL_LENGTH
      );
      if (normalizedCoverImageUrl.error) {
        return res.status(400).json({
          success: false,
          message: normalizedCoverImageUrl.error
        });
      }

      const normalizedSourceUrl = normalizeUrl(
        sourceUrl,
        'Source URL',
        MAX_SOURCE_URL_LENGTH
      );
      if (normalizedSourceUrl.error) {
        return res.status(400).json({
          success: false,
          message: normalizedSourceUrl.error
        });
      }

      // Update fields
      if (title) article.title = title;
      if (content) article.content = content;
      if (summary !== undefined) article.summary = summary;
      if (subtitle !== undefined) article.subtitle = subtitle;
      if (category !== undefined) article.category = category;
      if (status) {
        article.status = status;
        if (status === 'published' && !article.publishedAt) {
          article.publishedAt = new Date();
        }
      }
      
      // Allow author, admin, editor, or moderator to set/unset isNews flag
      if (isNews !== undefined && (article.authorId === req.user.id || ['admin', 'editor', 'moderator'].includes(req.user.role))) {
        article.isNews = isNews;
        // Clear approval if user unflags as news
        if (!isNews) {
          article.newsApprovedAt = null;
          article.newsApprovedBy = null;
        }
      }

      if (normalizedCoverImageUrl.value !== undefined) {
        article.coverImageUrl = normalizedCoverImageUrl.value;
      }
      if (coverImageCaption !== undefined) article.coverImageCaption = coverImageCaption;
      if (sourceName !== undefined) article.sourceName = sourceName;
      if (normalizedSourceUrl.value !== undefined) {
        article.sourceUrl = normalizedSourceUrl.value;
      }
      if (normalizedTags.value !== undefined) article.tags = normalizedTags.value;
      if (normalizedReadingTime.value !== undefined) {
        article.readingTimeMinutes = normalizedReadingTime.value;
      }
      if (isFeatured !== undefined) article.isFeatured = isFeatured;

      // Handle location update
      if (useUserLocation) {
        const user = await User.findByPk(req.user.id);
        article.locationId = user.locationId;
      } else if (locationId !== undefined) {
        // Validate locationId if provided
        if (locationId !== null) {
          const location = await Location.findByPk(locationId);
          if (!location) {
            return res.status(400).json({
              success: false,
              message: 'Invalid location ID. Location does not exist.'
            });
          }
        }
        article.locationId = locationId;
      }

      await article.save();

      // Fetch updated article with author info
      const updatedArticle = await Article.findByPk(id, {
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'username', 'firstName', 'lastName']
          },
          {
            model: Location,
            as: 'location',
            attributes: ['id', 'name', 'code', 'type']
          }
        ]
      });

      res.status(200).json({
        success: true,
        message: 'Article updated successfully.',
        data: { article: updatedArticle }
      });
    } catch (error) {
      console.error('Update article error:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating article.',
        error: error.message
      });
    }
  },

  // Delete article
  deleteArticle: async (req, res) => {
    try {
      const { id } = req.params;

      const article = await Article.findByPk(id);

      if (!article) {
        return res.status(404).json({
          success: false,
          message: 'Article not found.'
        });
      }

      // Check permissions: author can delete their own, admin can delete all
      if (article.authorId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to delete this article.'
        });
      }

      await article.destroy();

      res.status(200).json({
        success: true,
        message: 'Article deleted successfully.'
      });
    } catch (error) {
      console.error('Delete article error:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting article.',
        error: error.message
      });
    }
  },

  // Approve article as news (moderator/admin only)
  approveNews: async (req, res) => {
    try {
      const { id } = req.params;

      const article = await Article.findByPk(id);

      if (!article) {
        return res.status(404).json({
          success: false,
          message: 'Article not found.'
        });
      }

      // Check if article is flagged as news
      if (!article.isNews) {
        return res.status(400).json({
          success: false,
          message: 'Article is not flagged as news.'
        });
      }

      // Approve news and publish article
      article.newsApprovedAt = new Date();
      article.newsApprovedBy = req.user.id;
      article.status = 'published';
      if (!article.publishedAt) {
        article.publishedAt = new Date();
      }

      await article.save();

      // Fetch updated article with author and approver info
      const updatedArticle = await Article.findByPk(id, {
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'username', 'firstName', 'lastName']
          },
          {
            model: Location,
            as: 'location',
            attributes: ['id', 'name', 'code', 'type']
          }
        ]
      });

      res.status(200).json({
        success: true,
        message: 'News approved and published successfully.',
        data: { article: updatedArticle }
      });
    } catch (error) {
      console.error('Approve news error:', error);
      res.status(500).json({
        success: false,
        message: 'Error approving news.',
        error: error.message
      });
    }
  }
};

module.exports = articleController;
