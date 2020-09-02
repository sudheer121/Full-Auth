const { 
create,
getUserByEmail,
getUsers,
} = require("./user.service");

const { genSaltSync, hashSync, compareSync } = require('bcryptjs');
const { sign } = require("jsonwebtoken");
const jwtsalt = "secretsalt70395"; //inside tokenvalidation also

module.exports = {

    createUser: function(req,res) {
        const body = req.body; 
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt); //encrypting password before storing in dp   
        create(body,function(err,result){
            if(err){
                console.log(err); 
                return res.status(500).json({
                    success: 0,
                    message: "Database Connection Error"
                });
            } 
            return res.status(200).json({
                success: 1,
                data : result
            })
        })
    },
    login : function(req,res){
        //console.log(req);
        // console.log(req.body); 
        //console.log("Req" + typeof(req));
        //console.log("ReqBody" + typeof(req.body));

        const body = req.body; //JSON.parse(req.body);
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
            const passed = compareSync(body.password, result.password); 
            if(passed) {
                //result.password = undefined; //for not sending password in token 
                console.log(result); 
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
    }
}