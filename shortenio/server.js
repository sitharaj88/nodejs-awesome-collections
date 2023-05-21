const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const shortenUrlRouter = require('./routes/shortenUrl');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Enable CORS
app.use(cors());

// Parse JSON body
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });

// Define routes
app.use('/api', shortenUrlRouter);

// Redirect root route to API documentation
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server error' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
