const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const authMiddleware = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

// Public routes
router.get('/', articleController.getAllArticles);
router.get('/:id', articleController.getArticleById);

// Protected routes - require authentication
router.post('/', authMiddleware, articleController.createArticle);

// Update - author can update their own, admin/editor can update all
router.put('/:id', authMiddleware, articleController.updateArticle);

// Delete - author can delete their own, admin can delete all
router.delete('/:id', authMiddleware, articleController.deleteArticle);

module.exports = router;
