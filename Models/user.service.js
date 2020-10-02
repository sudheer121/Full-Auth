const pool = require("../config/database");

module.exports = {

    create : function(data) {
        const myPromise = new Promise((resolve,reject)=>{
            pool.query(
                'insert into registration(email,password,first_name,last_name,phone_no,signin_type) values(?,?,?,?,?,?)',
                [
                    data.email,
                    data.password,
                    data.first_name,
                    data.last_name,
                    data.phone_no,
                    data.signin_type
                ]
                ,
                function(error,result,fields){
                    if (error) {
                        reject(error);
                        return; 
                    }
                    resolve(result);
                }
                
                ); // query
        }); 
        return myPromise; 
    },
    
    getUserById : function(userid) {
        const myPromise = new Promise((resolve,reject)=>{
            pool.query(
                'select * from registration where uid=?',
                [userid],
                function(error,result,fields) {
                    if (error) {
                        reject(error);
                        return; 
                    }
                    resolve(result);
                }
                ); //query 
        }); 
        return myPromise; 
    }, 

    getUserByEmail : function(email) {

        const myPromise = new Promise((resolve, reject)=>{
            pool.query(
                'select * from registration where email=?',
                [email],
                function(error,result,fields) {
                    if (error) {
                        reject(error);
                        return; 
                    }
                    resolve(result);
                }
                ); //query 
        }); 

        return myPromise; 
    }, 

    getUsers : function(callback) {
        pool.query(
        'select * from registration',
        [],
        function(error,result,fields) {
            if(error) {
                return callback(error,null);
            }
            return callback(null,result)
        }
        );//query
    },

    updateUser : function(data,callback) {
        pool.query(
            'update registration set password=?,first_name=?,last_name=?,phone_no=? where email=?',
            [
                data.password,
                data.first_name,
                data.last_name,
                data.phone_no,
                data.email 
            ]
            ,
            function(error,result,fields){
                if(error) {
                    return callback(error,null);
                }
                return callback(null,result)
            }
            
            ); // query
    },

    addPayment : function(data) {

        const myPromise = new Promise((resolve,reject)=>{
            pool.query(
                'insert into transactions(uid,pname,pid,pprice,tdate,ttime) values(?,?,?,?,?,?)',
                [
                    data.uid,
                    data.product_name,
                    data.product_id,
                    data.product_price,
                    data.tdate,
                    data.ttime
                ]
                ,
                function(error,result,fields) {
                    if (error) {
                        reject(error);
                        return; 
                    }
                    resolve(result);
                }
            ); // query
        }); 

        return myPromise; 
    },

    getTransactionDetails : function(uid) { //get Transaction Details
        const myPromise = new Promise((resolve,reject)=>{
            pool.query(
                'select * from transactions where uid=?',
                [uid]
                ,
                function(error,result,fields) {
                    if (error) {
                        reject(error);
                        return; 
                    }
                    resolve(result);
                }
            ); // query
        }); 

        return myPromise;      
    }
}