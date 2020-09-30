const {
getUserByEmail,
create
} = require("../Models/user.service");
const { sign } = require("jsonwebtoken");

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

module.exports = {
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
                const jsontoken = sign({ resultdata: extractData }, process.env.JWT_SALT, {
                    expiresIn: process.env.JWT_EXPDATE
                });
                res.cookie('grishmat', jsontoken, options); // options is optional
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
}