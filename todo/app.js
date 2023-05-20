const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const flash = require('express-flash');

const User = require('./models/user');


const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://0.0.0.0/todo-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));



// Configure passport
passport.use(new LocalStrategy((username, password, done) => {
  User.findOne({ username: username }, async (err, user) => {
    if (err) return done(err);
    if (!user) return done(null, false, { message: 'Incorrect username' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return done(null, false, { message: 'Incorrect password' });
    return done(null, user);
  });
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// Set up Express middleware
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


// Import routes
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');

// Use routes
app.use('/', indexRouter);
app.use('/auth', authRouter);

// Prevent page navigation from browser history after logout
app.use((req, res, next) => {
  if (req.path === '/auth/logout') {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Expires', '0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Content-Language', 'en');
    res.removeHeader('ETag');
    res.removeHeader('Date');
    res.removeHeader('X-Powered-By');

    const redirectURL = '/auth/login';
    res.redirect(redirectURL);
    return;
  }
  next();
});


// Start the server
app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});
