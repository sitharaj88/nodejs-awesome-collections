```markdown
# Shortenio ✂️

Shortenio is a fast and efficient URL shortener service built with Express.js and MongoDB. It empowers you to transform long and cumbersome URLs into short, elegant, and easy-to-share links. With Shortenio, managing and tracking your shortened URLs becomes a breeze.

![Shortenio Demo](https://github.com/sitharaj88/nodejs-awesome-collections/raw/main/shortenio/demo.gif)

## 🚀 Features

- ✂️ Shorten long URLs into concise, custom-generated links.
- 📊 Access detailed analytics for each shortened URL, including click counts, referrers, and more.
- ⏱️ Set custom expiration dates for shortened URLs to control their lifespan.
- 📡 Simple and user-friendly RESTful API for seamless integration with other applications.

## 🛠️ Installation

1. Clone the repository:

   ```shell
   git clone https://github.com/sitharaj88/nodejs-awesome-collections.git
   ```

2. Install the dependencies:

   ```shell
   cd ./nodejs-awesome-collections/shortenio
   npm install
   ```

3. Configure the environment variables:
   
   - Rename `.env.example` file to `.env`.
   - Set the appropriate values for the environment variables in the `.env` file.

4. Start the application:

   ```shell
   npm start
   ```

5. The application should now be running on `http://localhost:3000`.

## 🚀 API Endpoints

### Shorten URL

Creates a shortened URL from the provided original URL.

- **Endpoint:** `POST /api/shorten`
- **Request Body:**
  ```json
  {
    "url": "https://example.com/very-long-url"
  }
  ```
- **Response:**
  ```json
  {
    "originalUrl": "https://example.com/very-long-url",
    "shortUrl": "http://localhost:3000/api/url/abc123",
    "expiresAt": "2023-05-31T00:00:00.000Z"
  }
  ```

### Redirect to Original URL

Redirect the original URL associated with the provided short url.

- **Endpoint:** `GET http://localhost:3000/api/url/abc123`

### Get Shortened URL Analytics

Retrieves analytics data for the specified shortened URL.

- **Endpoint:** `GET /api/url/:shortCode/analytics`
- **Response:**
  ```json
  {
    "originalUrl": "https://example.com/very-long-url",
    "shortUrl": "http://localhost:3000/abc123",
    "clicks": 10,
    "referrers": [
      {
        "referrer": "https://google.com",
        "count": 5
      },
      {
        "referrer": "https://bing.com",
        "count": 3
      },
      {
        "referrer": "https://yahoo.com",
        "count": 2
      }
    ],
    "createdAt": "2023-05-21T12:00:00.000Z",
    "updatedAt": "2023-05-22T06:00:00.000Z"
  }
  ```

## 🤝 Contributing

Contributions are welcome! If you would like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create your feature branch: `git checkout -b feature/my-feature`.
3. Commit your changes: `git commit -am 'Add some feature'`.
4. Push the branch to your forked repository: `git push origin feature/my-feature`.
5. Submit a pull request.

## 📝 License

This project is licensed under the [MIT License](LICENSE).

## 📧 Contact

For any inquiries or feedback, please reach out to Sitharaj Seenivasan:
- Email: sitharaj.info@gmail.com
- GitHub: [@sitharaj88](https://github.com/sitharaj88)
```

Feel free to modify and personalize the content further to match your app's branding and style.
