const express = require('express');
const usersRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/users.js");

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
        res.redirect("/");
    });


});

usersRouter.get("/:id", (req, res) => {
    
});

module.exports = usersRouter;