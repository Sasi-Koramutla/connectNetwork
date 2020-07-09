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

/* // new
router.get('/new', isAuthenticated, (req, res) => {
  res.render('new.ejs', {
    currentUser: req.session.currentUser
  });
})

// post
router.post('/', isAuthenticated, (req, res)=>{
  if(req.body.readyToEat === 'on'){ //if checked, req.body.readyToEat is set to 'on'
    req.body.readyToEat = true;
  } else { //if not checked, req.body.readyToEat is undefined
    req.body.readyToEat = false;
  }
  Fruit.create(req.body, (error, createdFruit)=>{
    res.redirect('/fruits');
  })
})

// edit
router.get('/:id/edit', isAuthenticated, (req, res)=>{
  Fruit.findById(req.params.id, (err, foundFruit)=>{ //find the fruit
      res.render('edit.ejs', {
        fruit: foundFruit, //pass in found fruit
        currentUser: req.session.currentUser
      })
  })
})

// update
router.put('/:id', isAuthenticated, (req, res)=>{
  if(req.body.readyToEat === 'on'){
      req.body.readyToEat = true;
  } else {
      req.body.readyToEat = false;
  }
  Fruit.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, updatedModel)=> {
    res.redirect('/fruits');
  })
})

// show
router.get('/:id', isAuthenticated, (req, res) =>{
  Fruit.findById(req.params.id, (err, foundFruit)=>{
    res.render('show.ejs', {
      fruit: foundFruit,
      currentUser: req.session.currentUser
    })
  })
})

// delete
router.delete('/:id', isAuthenticated, (req, res) => {
  Fruit.findByIdAndRemove(req.params.id, { useFindAndModify: false }, (err, data)=>{
    res.redirect('/fruits') //redirect back to fruits index
  })
}) */

module.exports = router;