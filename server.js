//jshint esversion:6
require('dotenv').config();
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const https = require('https');
var jwt = require('jsonwebtoken'); 
//const CLIENT_ID = '244496231967-2jf7lel0i19vb0uo8moaf63uet2e28ks.apps.googleusercontent.com'; // google sign in 
const userRouter = require("./api/users/user.router"); 

var cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/Public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname);

//app.use(express.json()); //convert json object to js object
app.use("/api",userRouter); 


app.get("/", function(req, res){
  console.log('Cookies /: ', req.cookies);
  res.render(__dirname + '/home.html'); 
});

// Authentication/Login 
app.get("/login", function(req, res){
  console.log('Cookies: /login :', req.cookies['grishmat']);
  res.render(__dirname + '/login.html'); 
});

app.get("/register", function(req, res){
  res.render(__dirname + '/register.html'); 
});
app.listen(3000, function(){
  console.log("Server started on port 3000.");
});
//const lib = require('./dbwork.js'); 
//lib.calledme(45); 