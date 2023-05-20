const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

// Home route
router.get('/', ensureAuthenticated, todoController.getTodos);

// Create todo route
router.get('/create', ensureAuthenticated, todoController.getCreateTodo);
router.post('/create', ensureAuthenticated, todoController.postCreateTodo);

// Edit todo route
router.get('/edit/:id', ensureAuthenticated, todoController.getEditTodo);
router.post('/edit/:id', ensureAuthenticated, todoController.postEditTodo);

// Delete todo route
router.get('/delete/:id', ensureAuthenticated, todoController.deleteTodo);

module.exports = router;
