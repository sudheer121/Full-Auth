const { 
create,
getUserByEmail,
getUsers,
gTD,
addPayment,
} = require("../Models/user.service");


const { genSaltSync, hashSync, compareSync } = require('bcryptjs'); // for hashing password before storing in db 
const { sign } = require("jsonwebtoken");
const json = require("body-parser/lib/types/json");
const jwtsalt = process.env.JWT_SALT; //inside tokenvalidation also


function getIdfromEmail(email){ 
    const myPromise = new Promise((resolve, reject) => {
        
        getUserByEmail(email)
        .then((result)=>{
            if(result) {
                //console.log(result)
                resolve(result[0].uid);
            } else {
                reject("User does not exist in database");
            }
        })
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
    /*
    createUser: function(req,res) {
        const body = req.body; 
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt); //encrypting password before storing in dp   
        
        var returnObj = {
            success : 0,
            message : "There was a problem"
        }

        getUserByEmail(body.email) // first check if user already exists 
        .then((result)=>{
            
            // result is an array 
            if(result.length > 0){
                returnObj.success = 0;
                returnObj.message = "User already exists";
                return Promise.resolve(); 
            }
            else {  // array is empty in case user doesn't exist, so create user 
                return create(body)    
            }
        })
        .then((result)=>{
            
            if(result){
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
        
        getUserByEmail(body.email)
        .then((result)=>{

            if(result.length === 0 || result.password==null){
            
                res.json({
                    success: 0,
                    message: "User doesn't exist" 
                });
            
            } else if (compareSync(body.password, result.password)) { //compareSync returns a boolean 
                
                const jsontoken = sign({ resultdata: result }, jwtsalt, {
                    expiresIn: process.env.JWT_EXPDATE
                }); 
                res.cookie('grishmat', jsontoken, options); // options is optional
                res.json({
                    success: 1,
                    message: "login successful",
                    token: jsontoken
                });
            
            } else {
                res.json({
                    success: 0,
                    message: "invalid email or password"
                });
            }

        })
        .catch((err)=>{
            console.log(err);
            res.json({
                success: 0,
                message: "Login Failed"
            }); 
        });
    
    }, */
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
    fbSignIn : function(req,res) {

        //options for cookie 
        let options = {
            expires: new Date(Date.now() + parseInt(process.env.JWT_EXPDATE)),//new Date(Date.now() + process.env.JWT_EXPDATE),
            secure: false, // set to true if your using https
            httpOnly: false, // The cookie only accessible by the web server
            // signed: true // Indicates if the cookie should be signed
        }

        const body = req.body;
        const token_to_inspect = body.accessToken;
        const dataObject = body.dataObject; // has email name and userId
        const returnObj = { 
            success : 0, 
            message : "Facebook Signin Failed"
        };
        const extractData  = {
            email : dataObject.email,
            password : null,
            first_name : null,
            last_name : null,
            phone_no : null, 
            signin_type : 2 // signin type : 0 -> regular , 1 -> google , 2 -> facebook 
        };

        const fullName = dataObject.name.split(' ');
        extractData.first_name = fullName[0];
        extractData.last_name = fullName[1];

        //link to fetch our app token
        const getAppToken = 'https://graph.facebook.com/oauth/access_token' + '?client_id=' + process.env.FB_APP_ID + '&client_secret=' + process.env.FB_APP_SECRET + '&grant_type=client_credentials';
        
        axios.get(getAppToken)
        .then((response) => {
            // response has our app token 
            return Promise.resolve(response.data.access_token);
        })
        .then((access_token) => {
            const url = 'https://graph.facebook.com/debug_token?' + 'input_token=' + token_to_inspect + '&access_token=' + access_token;
            return axios.get(url);
        })
        .then((result)=>{
            
            if( result.data.data.is_valid === true) {
                return Promise.resolve(); 
            } else {
                return Promise.reject("Error, input token is invalid"); 
            }
            
        })
        .then(() => {
            return getUserByEmail(extractData.email); 
        })
        .then((result)=>{

            if(result.length === 0) { //checking if user exists
                return create(extractData); 
            } else {
                return "1"; 
            }
        })
        .then((result)=>{
            if(result.length){
                const jsontoken = sign({ resultdata: extractData }, process.env.JWT_SALT, {
                    expiresIn: process.env.JWT_EXPDATE
                });
                res.cookie('grishmat', jsontoken,options); // options is optional
                returnObj.success = 1;
                returnObj.message = "User logged in by Facebook sign In";
            }
            res.json(returnObj); 
        })
        .catch((error) => {
             console.log("Error in verifying facebook tokens using api");
             res.json(returnObj);
            //console.log(error);
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
            return getUserByEmail(extractData.email);
        })
        .then((result)=>{
            if(result.length === 0) { //checking if user exists, if not then length of result will be zero. 
                return create(extractData); 
            } else {
                return "1"; 
            }
        })
        .then((result)=>{
            if(result.length){
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
    */
    /*
Complete get user from email 
Complete transaction parts

    */

}

/*

Will work on setting cookies from browser side later 

*/ 