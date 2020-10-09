const {
    getUserByEmail,
    addPayment,
    getTransactionDetails 
} = require("../Models/user.service");

module.exports = {

    // adds payment details to database 
    addPayment : function(req,res) {

        if(req.message) {
            res.json({
                success : 0,
                message : req.message
            });
            return; 
        }

        var email = req.decode.resultdata.email;
        var data = req.body;
        getUserByEmail(email).
        then((result) => {
            data.uid = result[0].uid;
            var currentdate = new Date(); 
            var tdate_ = currentdate.getDate() + "/"+ (currentdate.getMonth()+1)  + "/"  + currentdate.getFullYear() ; 
            var ttime_ =  currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
            data.tdate = tdate_;
            data.ttime = ttime_; 
            return addPayment(data); 
        })
        .then((result)=>{
                res.json({
                    success : 1,
                    message : "Payment was successful"
                })
        })
        .catch((err) => {
            console.log("Error while registering transaction : "+err);
            res.json({
                success : 0,
                message : "Couldn't process transaction"
            });
        }); 

    },

    getTransactions : function(req,res) {

        if(req.message) {
            res.json({
                success : 0,
                message : req.message
            });
            return; 
        }

        const email = req.decode.resultdata.email;  
        getUserByEmail(email)
        .then((result)=>{
            if(result) {
                return getTransactionDetails(result[0].uid); 
            } else {
                reject("User does not exist in database");
            }
        })
        .then((result)=>{
            
            // result is an array of objects 
            res.render('transactionsTable',{resultArr:result});
            /*
            res.json({
                success : 1,
                message : "Fetch successful",
                data : result 
            });
            */
        })
        .catch((err)=>{
            console.log("Error " + err); 

            res.json({
                success : 0,
                message : "There was a problem",
                data : null 
            });

        }); 
    }
}