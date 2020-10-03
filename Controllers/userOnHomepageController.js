/*
    Displays name of user when user logs in 
*/

module.exports = {
    onHome : function(req,res) {

        if(req.decode) {
            
            const first_name = req.decode.resultdata.first_name;  // .decode object is attached after validating the jwt token 
            const last_name = req.decode.resultdata.last_name;
            const signin_type = req.decode.resultdata.signin_type;
            const login_method = ['Form Sign In','Google Sign In','Facebook Sign In']; 
            const str = "Logged In as " + first_name + " " + last_name + " via " + login_method[signin_type]; 
            console.log(str);
            res.render('home',{name: str }); 
        } else {
            res.render('home',{name:'You are not logged in'}); 
        }
        
    }
}
