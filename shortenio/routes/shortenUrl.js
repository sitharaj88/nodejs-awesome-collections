const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController');

// @route   POST /api/shorten
// @desc    Create a shortened URL
router.post('/shorten', urlController.createShortUrl);

// @route   GET /api/url/:shortCode
// @desc    Redirect to the original URL
router.get('/url/:shortCode', urlController.redirectToOriginalUrl);

// @route   GET /api/url/:shortCode/analytics
// @desc    Get analytics for a shortened URL
router.get('/url/:shortCode/analytics', urlController.getShortUrlAnalytics);

module.exports = router;
