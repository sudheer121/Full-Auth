//jshint esversion:6

require('dotenv').config();
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const https = require('https');
var cookieParser = require("cookie-parser");


const home = require("./Routes/onHome"); 
const oAuthSignIn = require("./Routes/oAuthSignIn"); 
const login = require("./Routes/login");
const register = require("./Routes/register"); 
const paymentRoutes = require("./Routes/paymentRoutes");

const fs = require('fs'); // for ssl certificate 

app.use(cookieParser());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/Public'));

app.set('view engine', 'ejs'); 

app.use("/", home);
app.use("/",login); 
app.use("/",register);

/* Requests from all buttons(except login/register) pass thorough path '/api' */ 
app.use("/api",oAuthSignIn); 
app.use("/api",paymentRoutes); 


https.createServer({ 
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem'),
  passphrase: 'Tripathi31'
}, app)
.listen(3000);

