//express, mongoose, methodOverride, session
const express = require("express");
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');

//dotenv, port, URI
require('dotenv').config();
const PORT = process.env.PORT;
const mongodbURI = process.env.MONGODBURI || 'mongodb://localhost/'+ `networkskapp`;;

const app = express();

// middleware to help with the form submission
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));

//session usage
app.use(
    session({
      secret: process.env.SECRET, //a random string do not copy this value or your stuff will get hacked
      resave: false, // default more info: https://www.npmjs.com/package/express-session#resave
      saveUninitialized: false // default  more info: https://www.npmjs.com/package/express-session#resave
    })
  );
  
// mongoose connection logic
  mongoose.connect(mongodbURI, { useNewUrlParser: true, useUnifiedTopology: true } );
  mongoose.connection.once('open', ()=> {
      console.log('connected to mongo');
  });


//Connections controller
const connectionsController = require("./controllers/connections.js");
app.use("/connections", connectionsController); 

// User controller
const userController = require('./controllers/users.js');
app.use('/users', userController); 

// Session controller
const sessionController = require('./controllers/sessions.js');
app.use('/sessions', sessionController);


//get route
app.get("/", (req, res) => {
    res.render("welcome.ejs");
});
// the app running the server
app.listen(PORT, () => {
    console.log('listening')
  });