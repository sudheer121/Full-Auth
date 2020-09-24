const { 
create,
getUserByEmail,
getUsers,
gTD,
addPayment,
} = require("./user.service");

const { genSaltSync, hashSync, compareSync } = require('bcryptjs'); // for hashing password before storing in db 
const { sign } = require("jsonwebtoken");
const json = require("body-parser/lib/types/json");
const jwtsalt = process.env.JWT_SALT; //inside tokenvalidation also



function addUserToDb(data){
    const myPromise = new Promise((resolve, reject) => {  
        create(data,function(err,result){
            if(err){
                reject("Database connection error while adding user to database");
            }
            else{
                resolve("1");
            }
        });    
    });
    return myPromise; 
}

//google signin verification 
async function verify(extractData,id_token,client_id) {
    const {OAuth2Client} = require('google-auth-library'); // used to verify integrity of id token 
    const client = new OAuth2Client(process.env.CLIENT_ID);
    

    const ticket = await client.verifyIdToken({
        idToken: id_token,
        audience: client_id  // Specify the client_id of the app(frontend) that accesses the backend
    });
    const payload = ticket.getPayload(); // all data of user can also be verified using https://oauth2.googleapis.com/tokeninfo?id_token=XYZ123
    const userid = payload['sub'];       // userid (unique for every  user), not using this for now 
    extractData.email = payload['email'];
    extractData.first_name = payload['given_name'];
    extractData.last_name = payload['family_name']; 
}

var test  = {
    email : 'axdserere',
    password : 'nussfdssdfll',
    first_name : 'fgdfg',
    last_name : 'fgfg',
    phone_no : 'gfg', 
    signin_type : 1  
}

function giveJWT(data){
    const jsontoken = sign({ resultdata: data }, jwtsalt);
    return jsontoken 
}

function checkUserExists(data){ 
    const myPromise = new Promise((resolve, reject) => {  
        getUserByEmail(data.email,function(err,result){
            if(err) {
                reject("Database Connection Error while checking if user exists");
            }
            else if(result) {
                resolve("1"); 
            } else {
                resolve("0"); 
            }
        }); 
    });
    return myPromise; 
}

function getIdfromEmail(email){ 
    const myPromise = new Promise((resolve, reject) => {  
        getUserByEmail(email,function(err,result){
            if(err) {
                reject("Database Connection Error while checking if user exists");
            }
            else if(result) {
                resolve(result.uid); 
            } else {
                reject("User does not exist in database");
            }
        }); 
    });
    return myPromise; 
}

module.exports = {
    addPayment : function(req,res) {
        var email = req.decode.resultdata.email;
        var data = req.body;
        getIdfromEmail(email).
        then((result) => {
            data.uid = result;
            var currentdate = new Date(); 
            var tdate_ = currentdate.getDate() + "/"+ (currentdate.getMonth()+1)  + "/"  + currentdate.getFullYear() ; 
            var ttime_ =  currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
            data.tdate = tdate_;
            data.ttime = ttime_; 
            addPayment(data, function(err,result){
                if(err) throw err; 
                else {
                    res.json({
                        success : 1,
                        message : "Transaction registered"
                    });
                }
            });
        })
        .catch((err) => {
            console.log("Error while registering transaction : "+err);
            res.json({
                success : 0,
                message : "Couldn't process transaction"
            });
        }); 

    },

    getTD : function(req,res) {
        var email = req.decode.resultdata.email;  
        getIdfromEmail(email).
        then((result) => {
            gTD(result, function(err,result){
                if(err) throw err; 
                else {
                    res.json({
                        success : 1,
                        message : "Fetch Successful",
                        data : result
                    });
                }
            });
        })
        .catch((err) => {
            console.log("Error while all  transactions "+err);
            res.json({
                success : 0,
                message : "Couldn't get transaction details"
            });
        }); 
    },

    googleSignIn : function(req,res) {

        //options for cookie 
        let options = {
            expires: new Date(Date.now() + parseInt(process.env.JWT_EXPDATE)),//new Date(Date.now() + process.env.JWT_EXPDATE),
            secure: false, // set to true if your using https
            httpOnly: false, // The cookie only accessible by the web server
            // signed: true // Indicates if the cookie should be signed
        }
        
        const body = req.body; 
        var id_token = body.id_token;
        var client_id = body.client_id;
        var extractData  = {
            email : null,
            password : null,
            first_name : null,
            last_name : null,
            phone_no : null, 
            signin_type : 1 // signin type : 0 -> regular , 1 -> google , 2 -> facebook 
        }

        var returnObj = {
            success : 0,
            message : "There was a problem"
        }

        verify(extractData,id_token,client_id)
        .then((result) => {
            return checkUserExists(extractData);
        })
        .then((result)=>{
            if(result === "0") {
                return addUserToDb(extractData);
            } else {
                return "1"; 
            }
        })
        .then((result)=>{
            if(result === "1"){
                const jsontoken = sign({ resultdata: extractData }, jwtsalt, {
                    expiresIn: process.env.JWT_EXPDATE
                });
                res.cookie('grishmat', jsontoken,options); // options is optional
                returnObj.token = jsontoken;
                returnObj.success = 1;
                returnObj.message = "User logged in by Google sign In";
            }
            return res.json(returnObj); 
        })
        .catch((error)=>{
            console.log("There was an error " + error); 
            returnObj.success = 0;
            returnObj.message = "There was a problem";
            return res.json(returnObj); 
        });
    },
    createUser: function(req,res) {
        const body = req.body; 
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt); //encrypting password before storing in dp   
        
        var returnObj = {
            success : 0,
            message : "There was a problem"
        }

        checkUserExists(body)
        .then((result)=>{
            if(result === "1"){
                returnObj.success = 0;
                returnObj.message = "User already exists";
                return Promise.resolve("2"); 
            }
            if(result === "0") {
                return addUserToDb(body);
            }
        })
        .then((result)=>{
            if(result === "1"){
                returnObj.success = 1;
                returnObj.message = "Registered successfully, you can login now";
            }
            return res.json(returnObj); 
        })
        .catch((error)=>{
            console.log("There was an error in sign up : " + error); 
            returnObj.success = 0;
            returnObj.message = "There was a problem";
            return res.json(returnObj); 
        });
        
    },
    login : function(req,res){
        
        //options for cookie 
        let options = {
            expires: new Date(Date.now() + parseInt(process.env.JWT_EXPDATE)),//new Date(Date.now() + process.env.JWT_EXPDATE),
            secure: false, // set to true if your using https
            httpOnly: false, // The cookie only accessible by the web server
            // signed: true // Indicates if the cookie should be signed
        }
        
        const body = req.body; 
        console.log("User trying to login via normal login" + body.email + " " + body.password); 
        getUserByEmail(body.email,function(err,result){
            if(err){
                console.log(err);
            }
            if(!result || result.password==null){
                return res.json({
                    success: 0,
                    message: "User doesn't exist" 
                });
            }
            
            const passed = compareSync(body.password, result.password); //boolean 
            if(passed) {
                //result.password = undefined; //for not sending password in token 
                
                const jsontoken = sign({ resultdata: result }, jwtsalt, {
                    expiresIn: process.env.JWT_EXPDATE
                }); 
                res.cookie('grishmat', jsontoken,options); // options is optional
                return res.json({
                    success: 1,
                    message: "login successful",
                    token: jsontoken
                });
            } 
            else {
                return res.json({
                    success: 0,
                    message: "invalid email or password",
                });
            }
        });
    },
    getAllUsers : function(req,res) {
        getUsers(function(err,result){
            if(err) {
                console.log(err); 
                return;
            } 
            else 
            {
                res.json({
                    success : 1,
                    data : result
                }); 
            }
        });
    },
    onHome : function(req,res) {
        var dataObj = {
            first_name : req.decode.resultdata.first_name,
            last_name : req.decode.resultdata.last_name,
            signin_type : req.decode.resultdata.signin_type
        }
        res.json({
            success : 1,
            data : dataObj
        }); 
    },
  
    /*
Complete get user from email 
Complete transaction parts

    */

}

/*

Will work on setting cookies from browser side later 

*/ 