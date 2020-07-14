const express = require('express');
const router = express.Router();

const User = require('../models/users.js');

const isAuthenticated = (req, res, next) => {
  if (req.session.currentUser) {
    return next();
  } else {
    res.redirect('/sessions/new');
  }
}

// ROUTES
// index
// show
router.get('/', isAuthenticated, (req, res) =>{
    User.find({}, (err, users)=>{
      res.render('index.ejs', {
        users: users,
        currentUser: req.session.currentUser
      })
    })
  });

module.exports = router;