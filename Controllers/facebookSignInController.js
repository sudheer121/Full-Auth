const {
    getUserByEmail,
    create
    } = require("../Models/user.service");
const { sign } = require("jsonwebtoken");
const axios = require('axios'); // for promise based https requests 

module.exports = {
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
                 
    }
}

