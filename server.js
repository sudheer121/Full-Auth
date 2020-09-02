//jshint esversion:6
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const https = require('https');
var jwt = require('jsonwebtoken'); 
const CLIENT_ID = '244496231967-2jf7lel0i19vb0uo8moaf63uet2e28ks.apps.googleusercontent.com';
const userRouter = require("./api/users/user.router"); 


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/Public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname);

//app.use(express.json()); //convert json object to js object
app.use("/api",userRouter); 


app.get("/", function(req, res){
  res.render(__dirname + '/home.html'); 
});

// Authentication/Login 
app.get("/login", function(req, res){
  res.render(__dirname + '/auth.html'); 
});

app.post('/login', function(req, res){
  const email_ = req.body.inputEmail;
  const password_ = req.body.inputPassword;
  res.sendFile( __dirname + "/home.html");
});

app.get("/gsignin", function(req, res){
  res.render(__dirname + '/auth.html'); 
});

app.post('/gsignin', function(req, res){
  console.log("Hearing"); 
  var strdat = '';
	req.on('data', function (chunk) {
        strdat += chunk;
  });
	
	req.on('end', function()
	{  
    var data = JSON.parse(strdat);
    var id_token = data.id_token;
    var client_id = data.client_id;
    var flag = 0; 
    //console.log(id_token); 
    //console.log("Id token recived" + client_id);
    const {OAuth2Client} = require('google-auth-library'); // used to verify integrity of id token 
    const client = new OAuth2Client(CLIENT_ID);
    async function verify() {
      const ticket = await client.verifyIdToken({
          idToken: id_token,
          audience: client_id ,  // Specify the client_id of the app(frontend) that accesses the backend
      });
      const payload = ticket.getPayload(); // all data of user can also be verified using https://oauth2.googleapis.com/tokeninfo?id_token=XYZ123
      const userid = payload['sub'];       // userid (unique for every  user)
      console.log(payload); 
      console.log(userid);  
      console.log("Here"); 
      // console.log(userid); 
    }
    verify().catch(
      console.error
    ); // Occurs when there is a difference in client ids, don't know how to handle ?  
    
    

    res.setHeader("Content-Type", "text/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.end(JSON.stringify("success"));		
  });
  
});

/*
const {getUserByEmail} = require("./api/users/user.service"); 
getUserByEmail("absc",function(err,resp){
  if(err){ 
    console.log(err);
  }
  else{
    console.log(resp); 
  }
});
*/
//Registration left, part where user data is stored in database 

app.listen(3000, function(){
  console.log("Server started on port 3000.");
});
//const lib = require('./dbwork.js'); 
//lib.calledme(45); 