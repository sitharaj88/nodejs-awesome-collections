const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://0.0.0.0/todo-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Create a User model
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

// Create a Todo model
const todoSchema = new mongoose.Schema({
  title: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const User = mongoose.model('User', userSchema);
const Todo = mongoose.model('Todo', todoSchema);

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
app.use(passport.initialize());
app.use(passport.session());

// Middleware to ensure user is authenticated
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

// Import routes
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');

// Use routes
app.use('/', indexRouter);
app.use('/', authRouter);

// Start the server
app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});
