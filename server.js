//jshint esversion:6

require('dotenv').config();
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const https = require('https');
var cookieParser = require("cookie-parser");


const userRouter = require("./Routes/user.router"); 
const home = require("./Routes/onHome"); 

const fs = require('fs'); // for ssl certificate 

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/Public'));

/*
app.set('views', __dirname + "/Views"); // views folder 
//app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html'); 
*/
app.set('view engine', 'ejs'); 


app.use("/api",userRouter); 
app.use("/", home);



// Authentication/Login 
app.get("/login", function(req, res){
  res.render('login',{}); 
});

app.get("/register", function(req, res){
  res.render('register',{}); 
});

https.createServer({ 
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem'),
  passphrase: 'Tripathi31'
}, app)
.listen(3000);



/*
app.listen(3000, function(){
  console.log("Server started on port 3000.");
});*/

//const lib = require('./dbwork.js'); 
//lib.calledme(45); 

/*

https://www.cronj.com/blog/mvc-architecture-in-node-js/

https://github.com/H-GhaziSultan/Video-Note-App
https://blog.soshace.com/how-to-architect-a-node-js-project-from-ground-up/

https://bocoup.com/blog/adapter-pattern-a-must-for-vendor-service-integrations


https://codeburst.io/node-js-mysql-and-async-await-6fb25b01b628
https://bezkoder.com/deploy-node-js-app-heroku-cleardb-mysql/
https://stackoverflow.com/questions/36547292/use-promise-to-process-mysql-return-value-in-node-js

Home should be an ejs file which needs to be rendered 
*/