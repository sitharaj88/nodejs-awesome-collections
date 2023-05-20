const User = require('../models/user');
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Display login form
exports.getLogin = (req, res) => {
  const messages = ['Message 1', 'Message 2', 'Message 3'];

  res.render('login', {messages});
};

// Process login form
exports.postLogin = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true
  })(req, res, next);
};

// Display registration form
exports.getRegister = (req, res) => {
  const messages = ['Message 1', 'Message 2', 'Message 3'];

  res.render('register', {messages});
};

// Process registration form
exports.postRegister = (req, res) => {
  const { username, password } = req.body;

  // Validation logic goes here

  // Check if user already exists
  User.findOne({ username: username })
    .then(user => {
      if (user) {
        req.flash('error_msg', 'Username already exists');
        res.redirect('/auth/register');
      } else {
        // Create a new user
        const newUser = new User({
          username: username,
          password: password
        });

        // Hash the password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash('success_msg', 'Registration successful. You can now log in');
                res.redirect('/auth/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
};

// Logout
exports.logout = (req, res) => {
  req.logout();
  req.flash('success_msg', 'You have been logged out');
  req.session.destroy();
  res.redirect('/auth/login');
};
