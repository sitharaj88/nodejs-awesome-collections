const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

// Initialize Express App
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://0.0.0.0:27017/sample', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error:', err));

// Create the User schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

const User = mongoose.model('User', userSchema);

app.use(bodyParser.json());

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
}

// Apply the authenticateToken middleware to all routes except /login and /register
app.use((req, res, next) => {
    if (req.path === '/login' || req.path === '/register') {
        return next();
    }
    authenticateToken(req, res, next);
});

// Secret Key for JWT
const secretKey = 'hello secrete key';

// Register Route
// Register route
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ error: 'Username already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new User({ username, password: hashedPassword });
        await user.save();

        res.json({ message: 'Registration successful' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }

});

// Login route
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find the user in the database
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Compare the password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ username: user.username }, secretKey, { expiresIn: '30m' });

        // Send the token as the response
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Protected Route
app.get('/hello', (req, res) => {
    try {
        // Access user information from the request object
        const username = req.body.user.username;

        // Send response with username
        res.json({ message: `Hello, ${username}! This is a protected route.` });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
