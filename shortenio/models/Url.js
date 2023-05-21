const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true,
    unique: true,
  },

  expiresAt: {
    type: Date,
    default: null,
  },
  clicks: {
    type: Number,
    default: 0
  },

  referrers: {
    type: [String],
    default: []
  },

}, {
  timestamps: true, // Enable automatic updating of createdAt and updatedAt fields
});

module.exports = mongoose.model('Url', urlSchema);
