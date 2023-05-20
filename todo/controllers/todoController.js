const Todo = require('../models/todo');

// Get all todos for the logged-in user
exports.getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user }).sort({ updatedAt: -1 });
    res.render('index', { user: req.user, todos });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

// Get the create todo form
exports.getCreateTodo = (req, res) => {
  res.render('create');
};

// Create a new todo
exports.postCreateTodo = async (req, res) => {
  try {
    const { title, content } = req.body;

    const todo = new Todo({
      title,
      content,
      user: req.user,
    });

    await todo.save();
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

// Get the edit todo form
exports.getEditTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    res.render('edit', { todo });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

// Update a todo
exports.postEditTodo = async (req, res) => {
  try {
    const { title, content } = req.body;

    await Todo.findByIdAndUpdate(req.params.id, {
      title,
      content,
      updatedAt: Date.now(),
    });

    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

// Delete a todo
exports.deleteTodo = async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};
