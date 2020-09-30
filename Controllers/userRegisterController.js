const {
    getUserByEmail,
    create 
} = require("../Models/user.service");
const { genSaltSync, hashSync } = require('bcryptjs'); 

module.exports = {
    
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
    }
}