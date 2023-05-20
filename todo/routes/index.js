const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

// Home route
router.get('/', ensureAuthenticated, todoController.getTodos);

// Create todo route
router.get('/todos/create', ensureAuthenticated, todoController.getCreateTodo);
router.post('/todos/create', ensureAuthenticated, todoController.postCreateTodo);

// Edit todo route
router.get('/todos/edit/:id', ensureAuthenticated, todoController.getEditTodo);
router.post('/todos/edit/:id', ensureAuthenticated, todoController.postEditTodo);

// Delete todo route
router.get('/todos/delete/:id', ensureAuthenticated, todoController.deleteTodo);




module.exports = router;
