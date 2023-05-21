const Url = require('../models/Url');

const calculateExpiry = () => {
  const expiryDate = new Date();
  expiryDate.setMinutes(expiryDate.getMinutes() + 1); // Adding 1 minute to the current time
  return expiryDate;
};

// Helper function to generate a short code
const generateShortCode = () => {
  // Generate a random alphanumeric string of length 6
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let shortCode = '';
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    shortCode += characters[randomIndex];
  }
  return shortCode;
};

// @desc    Create a shortened URL
// @route   POST /api/shorten
// @access  Public
exports.createShortUrl = async (req, res) => {
  const { url } = req.body;

  // Generate a short code (e.g., abc123)
  let shortCode;

  try {

    // Use RegExp to match the exact string code
    const regex = new RegExp(`^${url}$`, 'i');
    // Check if the URL already exists in the database
    let urlDocument = await Url.findOneAndUpdate(
      { originalUrl: regex },
      {
        $set: {
          expiresAt: calculateExpiry(),
        },
      },
      { new: true, upsert: true }
    );

    if (!urlDocument.shortUrl) {
      shortCode = generateShortCode();
      urlDocument.originalUrl = url;
      urlDocument.shortUrl = shortCode
      // Save the document
      await urlDocument.save();
    } else {
      shortCode = urlDocument.shortUrl;
    }

    // Construct the shortened URL
    const shortUrl = `http://localhost:3000/api/url/${shortCode}`;

    // Return the shortened URL and expiration date
    res.json({
      originalUrl: urlDocument.originalUrl,
      shortUrl,
      expiresAt: urlDocument.expiresAt,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};


// @desc    Redirect to the original URL
// @route   GET /api/url/:shortCode
// @access  Public
exports.redirectToOriginalUrl = async (req, res) => {

  try {
    const { shortCode } = req.params;
    const { referer } = req.headers;

    // Find the URL document with the given short code
    const url = await Url.findOne({ shortCode });

    if (url) {
      // Check if the URL has expired
      if (url.expiresAt && url.expiresAt <= Date.now()) {
        // URL has expired, delete it from the database
        await url.delete();

        return res.status(410).json({ message: 'URL has expired and has been deleted' });
      }

      url.clicks++;
      // Add the referer to the URL document's referrers array
      if (referer) {
        url.referrers.push(referer);
      }

      await url.save();

      // Redirect to the original URL
      res.redirect(url.originalUrl);
    } else {
      res.status(404).json({ message: 'URL not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get analytics for a shortened URL
// @route   GET /api/url/:shortCode/analytics
// @access  Public
exports.getShortUrlAnalytics = async (req, res) => {
  const { shortCode } = req.params;

  try {
    const regex = new RegExp(`^${shortCode}$`, 'i');

    // Find the URL document by short code
    const urlData = await Url.findOne({ shortUrl: regex });

    if (!urlData) {
      return res.status(404).json({ error: 'URL not found' });
    }

    // Return the URL analytics data
    res.json({
      originalUrl: urlData.originalUrl,
      shortUrl: `http://localhost:3000/api/url/${shortCode}`,
      clicks: urlData.clicks,
      referrers: urlData.referrers,
      createdAt: urlData.createdAt,
      updatedAt: urlData.updatedAt,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Helper function to calculate the expiration date (7 days from now)
const calculateExpirationDate = () => {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 7);
  return expirationDate;
};
