const express = require('express');
const usersRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/users.js");
const allUsers = require('../models/users');
const methodOverride = require('method-override');

// middleware to help with the form submission
usersRouter.use(express.urlencoded({extended:true}));
usersRouter.use(methodOverride('_method'));
usersRouter.use(express.static('public'));

const isAuthenticated = (req, res, next) => {
    if (req.session.currentUser) {
      return next();
    } else {
      res.redirect('/sessions/new');
    }
  };

usersRouter.get("/new", (req, res) => {
    res.render("users/new.ejs", {
        currentUser: req.session.currentUser
    });
});

usersRouter.post("/",(req,res) => {
    // Hash the password before putting it in the database
    req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    User.create(req.body, (err, createdUser) => {
        console.log('user is created', createdUser);
        console.log(err);
        //res.send("successful");
        res.render("login.ejs");
    });


});

usersRouter.get("/:id", isAuthenticated, (req, res) => {
    User.findById(req.params.id, (err, foundUser) => {
        console.log('user is found', foundUser);
        console.log(err);
        //res.send("successful");
        res.render("users/show.ejs", {user: foundUser, currentUser: req.session.currentUser});
    });
});

// edit
usersRouter.get('/:id/edit', isAuthenticated, (req, res)=>{
    User.findById(req.params.id, (err, foundUser)=>{ 
        res.render('edit.ejs', {
          user: foundUser, 
          currentUser: req.session.currentUser
        })
    })
  });


// update
usersRouter.put('/:id', isAuthenticated, (req, res)=>{
    User.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, updatedModel)=> {
        allUsers.find({},(err , users) =>{
            res.render("index.ejs",{currentUser: updatedModel,
                users:users});
        });
    });
    });
  
  // ROUTES
  // index
  // show
/*   router.get('/', isAuthenticated, (req, res) =>{
      User.find({}, (err, users)=>{
        res.render('index.ejs', {
          users: users,
          currentUser: req.session.currentUser
        })
      })
    });
   */
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

module.exports = usersRouter;