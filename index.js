//jshint esversion:6

require('dotenv').config();
var express = require('express');
var app = express();
//var bodyParser = require('body-parser');
const https = require('https');
var cookieParser = require("cookie-parser");


app.use(cookieParser());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/Public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs'); 

const home = require("./Routes/onHome"); 
const oAuthSignIn = require("./Routes/oAuthSignIn"); 
const login = require("./Routes/login");
const register = require("./Routes/register"); 
const paymentRoutes = require("./Routes/paymentRoutes");

const fs = require('fs'); // for ssl certificate 

app.use("/", home);
app.use("/",login); 
app.use("/",register);

/* Requests from all buttons(except login/register) pass thorough path '/api' */ 
app.use("/api",oAuthSignIn); 
app.use("/api",paymentRoutes); 

app.listen(process.env.PORT || 3000,function(){
  console.log("Server running on post 3000"); 
});


//postgresql-aerodynamic-23734