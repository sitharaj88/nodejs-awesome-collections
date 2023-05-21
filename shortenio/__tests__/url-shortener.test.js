const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server.js'); // assuming your server file is named 'server.js'
const Url = require('../models/Url.js');

// Mocking the database connection
jest.mock('mongoose', () => ({
  connect: jest.fn(),
  disconnect: jest.fn(),
}));

describe('URL Shortener App', () => {
  beforeAll(() => {
    // Connecting to the mock database
    mongoose.connect.mockResolvedValue();
  });

  afterAll(() => {
    // Disconnecting from the mock database
    mongoose.disconnect.mockResolvedValue();
  });

  beforeEach(async () => {
    // Clearing the database before each test
    await Url.deleteMany();
  });

  describe('POST /shorten', () => {
    test('should shorten a valid URL', async () => {
      const originalUrl = 'https://www.google.com';

      const response = await request(app)
        .post('/shorten')
        .send({ originalUrl })
        .expect(200);

      expect(response.body).toHaveProperty('originalUrl', originalUrl);
      expect(response.body).toHaveProperty('shortUrl');

      const savedUrl = await Url.findOne({ originalUrl });
      expect(savedUrl).toBeTruthy();
    });

    test('should return 400 for an invalid URL', async () => {
      const invalidUrl = 'not_a_url';

      const response = await request(app)
        .post('/shorten')
        .send({ originalUrl: invalidUrl })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Invalid URL');

      const savedUrl = await Url.findOne({ originalUrl: invalidUrl });
      expect(savedUrl).toBeFalsy();
    });
  });

  describe('GET /:shortUrl', () => {
    test('should redirect to the original URL for a valid short URL', async () => {
      const originalUrl = 'https://www.google.com';
      const shortUrl = 'abc123';

      // Creating a test Url instance
      const url = new Url({
        originalUrl,
        shortUrl,
      });
      await url.save();

      const response = await request(app).get(`/${shortUrl}`).expect(302);

      expect(response.header.location).toBe(originalUrl);
    });

    test('should return 404 for a non-existent short URL', async () => {
      const nonExistentShortUrl = 'xyz789';

      const response = await request(app)
        .get(`/${nonExistentShortUrl}`)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'URL not found');
    });

    test('should return 410 for an expired short URL', async () => {
      const originalUrl = 'https://www.google.com';
      const shortUrl = 'def456';

      // Creating an expired test Url instance
      const url = new Url({
        originalUrl,
        shortUrl,
        expiresAt: new Date('2022-01-01'), // Assuming the expiry date is in the past
      });
      await url.save();

      const response = await request(app)
        .get(`/${shortUrl}`)
        .expect(410);

      expect(response.body).toHaveProperty('error', 'URL has expired');
    });
  });
});
