const jwt = require("jsonwebtoken");
const jwtsalt = "secretsalt70395";

module.exports = {
    checkToken: function(req,res,next){
        const token = req.get("authorization");
        if(token){
            token = token.slice(7);
            jwt.verify(token, jwtsalt, function(err,decoded){

                if(err){
                    return res.json(
                        {
                            success: 0,
                            message: "Invalid/Expired Token.."
                        });
                } else {
                    req.decode = decoded;
                    next(); 
                }
            });
        } 
        else {
            res.json({
                success:0,
                message:"Token required for authorization"
            });
        }
    }
};