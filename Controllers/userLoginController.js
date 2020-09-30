/*
Handles the logic when user logs in 
*/

const {
    getUserByEmail,
} = require("../Models/user.service");
const { compareSync } = require('bcryptjs'); // for hashing password before storing in db 
const { sign } = require("jsonwebtoken");

module.exports = {
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
            if(result.length === 0 || result[0].password==null){
            
                res.json({
                    success: 0,
                    message: "User doesn't exist" 
                });
            
            } else if (compareSync(body.password, result[0].password)) { //compareSync returns a boolean 
                
                const jsontoken = sign({ resultdata: result[0] }, process.env.JWT_SALT , {
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
    
    },
}