// authMiddleware.js

// Middleware function to check if user is authenticated
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next(); // User is authenticated, proceed to the next middleware or route handler
  }

  // User is not authenticated, redirect to login page or handle it as per your app's requirements
  res.redirect('/auth/login');
};

module.exports = { ensureAuthenticated };
