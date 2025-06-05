const express = require('express');
const router = express.Router();

// Placeholder user object for demo purposes
let dummyUser = {
  username: 'admin',
  password: 'admin123' // Never store passwords like this in real apps
};

// Middleware: Attach current user (for session tracking)
exports.current_user = (req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
};

// Route: GET /
exports.index = (req, res) => {
  res.render('index', { title: 'Home' });
};

// Route: GET /login
exports.login = (req, res) => {
  res.render('login', { error: null });
};

// Route: POST /login
exports.loginHandler = (req, res) => {
  const { username, password } = req.body;

  if (username === dummyUser.username && password === dummyUser.password) {
    req.session.user = dummyUser;
    res.redirect('/admin');
  } else {
    res.render('login', { error: 'Invalid username or password' });
  }
};

// Route: GET /admin
exports.admin = (req, res) => {
  res.render('admin', { user: req.session.user });
};

// Auth check middleware
exports.isLoggedIn = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login');
};

// Route: GET /logout
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};

// Other placeholder routes
exports.get_account_details = (req, res) => {
  res.render('account_details', { user: req.session.user });
};

exports.save_account_details = (req, res) => {
  // Save logic (dummy)
  res.redirect('/account_details');
};

exports.create = (req, res) => {
  // Create logic
  res.send('Created!');
};

exports.destroy = (req, res) => {
  res.send(`Destroyed item with ID ${req.params.id}`);
};

exports.edit = (req, res) => {
  res.send(`Edit item with ID ${req.params.id}`);
};

exports.update = (req, res) => {
  res.send(`Updated item with ID ${req.params.id}`);
};

exports.import = (req, res) => {
  res.send('Import complete');
};

exports.about_new = (req, res) => {
  res.render('about_new');
};

// Chat demo logic
exports.chat = {
  get: (req, res) => res.send('Chat GET'),
  add: (req, res) => res.send('Chat ADD'),
  delete: (req, res) => res.send('Chat DELETE')
};
