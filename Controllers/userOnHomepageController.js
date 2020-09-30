/*
    Displays name of user when user logs in 
*/

module.exports = {
    onHome : function(req,res) {
        var dataObj = {
            first_name : req.decode.resultdata.first_name,  // .decode object is attached after validating the jwt token 
            last_name : req.decode.resultdata.last_name,
            signin_type : req.decode.resultdata.signin_type
        }
        res.json({
            success : 1,
            data : dataObj
        }); 
    }
}
