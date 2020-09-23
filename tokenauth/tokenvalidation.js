const jwt = require("jsonwebtoken");
const jwtsalt = "secretsalt70395";

module.exports = {
    checkToken: function(req,res,next){
        //console.log('Cookies at tokenauth:', req.cookies['grishmat']);
        var token = req.get("authorization");
        //var token = req.cookies['grishmat'];
        if(token){
            token = token.slice(7);
            token = req.cookies['grishmat']; // ressigning here checking 
            jwt.verify(token, jwtsalt, function(err,decoded){
                token = req.cookies['grishmat'];
                if(err){
                    return res.json(
                        {
                            success: 0,
                            message: "Invalid/Expired Token.."
                        });
                } else {
                    req.decode = decoded; // attaching decoded info in req 
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