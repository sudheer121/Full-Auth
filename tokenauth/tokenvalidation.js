const jwt = require("jsonwebtoken");
const jwtsalt = process.env.JWT_SALT;

module.exports = {
    checkToken: function(req,res,next){
        token = req.cookies['grishmat']; 
        if(token){
            jwt.verify(token, jwtsalt, function(err,decoded){
                if(err){
                    req.message = "Invalid/Expired Token"
                    next();
                } else {
                    req.decode = decoded; // attaching decoded info in req 
                    next(); 
                }
            });
        } else {
            req.message = "Please login first";
            next();
        }
    }
};
/*
Decode property is attached to request(req) object if token decoding was successful
Message property is attached otherwise.
*/