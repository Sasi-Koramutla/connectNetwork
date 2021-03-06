const express = require('express');
const bcrypt = require('bcrypt');

const User = require('../models/users');
const allUsers = require('../models/users');
const sessionRouter = express.Router();
sessionRouter.use(express.static('public'));

sessionRouter.get('/new', (req, res) => {
    res.render('sessions/new.ejs', {
        currentUser: req.session.currentUser
    });
});

sessionRouter.post('/', (req, res) => {
    // Look for a user with the requested username
    User.findOne({ username: req.body.username }, (err, foundUser) => {
        if (!foundUser) {
            // Let the client know if no user exists with that username
            res.render("sessions/error.ejs", {message:"User does not Exist"});
        } else {
            // Check the found user's password agains input password
            if (bcrypt.compareSync(req.body.password, foundUser.password)) {
                // If correct, set the session information
                req.session.currentUser = foundUser;
                allUsers.find({},(err , users) =>{
                    res.render("index.ejs",{currentUser: foundUser,
                        users:users});
                });

            } else {
                // Let the client know if the password was incorrect
                res.render("sessions/error.ejs", {message:"Incorrect Password"});
            }
        }
    });
});

sessionRouter.delete('/', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

module.exports = sessionRouter;