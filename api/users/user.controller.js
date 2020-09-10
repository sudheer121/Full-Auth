const { 
create,
getUserByEmail,
getUsers
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

module.exports = {
    googleSignIn : function(req,res) {
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
                returnObj.token = giveJWT(extractData);
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
        const body = req.body; 
        console.log(body.email + " " + body.password); 
        getUserByEmail(body.email,function(err,result){
            if(err){
                console.log(err);
            }
            if(!result){
                return res.json({
                    success: 0,
                    message: "User doesn't exist" 
                });
            }
            const passed = compareSync(body.password, result.password); //boolean 
            if(passed) {
                //result.password = undefined; //for not sending password in token 
                const jsontoken = sign({ resultdata: result }, jwtsalt, {
                    expiresIn: "7d"
                });
                return res.json({
                    success: 1,
                    message: "login successfull",
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
    googlleSignIn : function(req,res) {
        const body = req.body; 
        var id_token = body.id_token;
        var client_id = body.client_id;
        
        const {OAuth2Client} = require('google-auth-library'); // used to verify integrity of id token 
        const client = new OAuth2Client(process.env.CLIENT_ID);
        var extractData  = {
            email : null,
            password : null,
            first_name : null,
            last_name : null,
            phone_no : null, 
            signin_type : 1 // signin type : 0 -> regular , 1 -> google , 2 -> facebook 
        }
        
        
        verify();
        async function userCheck() {
            await verify(); 
        }
        /*
        .catch(
        console.error
        ); */
        console.log("X");
        return res.json({
            success: 0,
            message: JSON.stringify(extractData)
        });
    },

}