const express = require('express');
const usersRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/users.js");
const Message = require("../models/messages.js");
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
//new user
usersRouter.get("/new", (req, res) => {
    res.render("users/new.ejs", {
        currentUser: req.session.currentUser
    });
});

//post for user creation
usersRouter.post("/",(req,res) => {
    // Hash the password before putting it in the database
    req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    allUsers.findOne({username:req.body.username}, (err, foundUser) => {
     if(foundUser)
     res.render("login.ejs", {message:"User Already Exists!"});

      else
      {
        User.create(req.body, (err, createdUser) => {
          console.log('user is created', createdUser);
          console.log(err);
         /* if (err)
          res.render("login.ejs",{message:"User already exists!"});
          //res.send("successful");
          else */
          res.render("login.ejs", {message:"Signup is Complete."});
        });
      }
    });

});

usersRouter.get("/:id", isAuthenticated, (req, res) => {
    User.findById(req.params.id, (err, foundUser) => {
        console.log('user is found', foundUser);
        console.log(err);
        //res.send("successful");
        Message.find({}, (err, messages) =>{
          //console.log(messages);
          res.render("users/show.ejs", {user: foundUser, currentUser: req.session.currentUser, messages:messages});
        });
        
    });
});

// edit
usersRouter.get('/:id/edit', isAuthenticated, (req, res)=>{
    User.findById(req.params.id, (err, foundUser)=>{ 
        res.render('edit.ejs', {
          user: foundUser, 
          currentUser: req.session.currentUser
        });
    });
  });

// inbox 
usersRouter.get('/:id/inbox', isAuthenticated, (req, res)=>{
  User.findById(req.params.id, (err, foundUser)=>{ 
    Message.find({}, (err, messages) =>{
      //console.log(messages);
      res.render("users/messages.ejs", {user: foundUser, currentUser: req.session.currentUser, messages:messages});
    });
  });
});

//get all users
usersRouter.get('/', isAuthenticated, (req, res)=>{
  User.findOne({ username: req.session.currentUser.username }, (err, foundUser) => {
            req.session.currentUser = foundUser;
            allUsers.find({},(err , users) =>{
                res.render("index.ejs",{currentUser: foundUser,
                    users:users});
            });
      });
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

// update connections
usersRouter.put('/:id/:connectionId/update', isAuthenticated, (req, res)=>{
  User.findByIdAndUpdate(req.params.id, {$push:{userConnections:{connectionId:req.params.connectionId}}}, { new: true}, (err, updatedModel)=> {
    console.log(err); 
    console.log(updatedModel.userConnections); 
    });
  //res.redirect(`../../${req.params.connectionId}`);
  res.redirect(`../../`);
  });


  
//post messages
usersRouter.post("/messages/:from/:to", isAuthenticated, (req,res) => {
req.body.from = req.params.from;
req.body.to = req.params.to;
  Message.create(req.body, (err, createdMessage) => {
      console.log('message is created', createdMessage);
      console.log(err);
      //res.send("successful");
      res.redirect(`/users/${req.params.to}`);
  });
});

//delete user
usersRouter.delete('/:id/', isAuthenticated, (req, res) => {
  User.findByIdAndRemove(req.params.id, { useFindAndModify: false }, (err, data)=>{
    res.redirect(`/`);
  });
});

//delete messages
usersRouter.delete('/messages/:id/:to', isAuthenticated, (req, res) => {
  Message.findByIdAndRemove(req.params.id, { useFindAndModify: false }, (err, data)=>{
    res.redirect(`/users/${req.params.to}`);
  });
});

//delete inbox messages
usersRouter.delete('/inbox/:id/:to', isAuthenticated, (req, res) => {
  Message.findByIdAndRemove(req.params.id, { useFindAndModify: false }, (err, data)=>{
    res.redirect(`/users/${req.params.to}/inbox`);
  });
});

module.exports = usersRouter;