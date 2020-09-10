const pool = require("../../config/database");

module.exports = {
    create : function(data,callback) {
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
            if(error) {
                return callback(error,null);
            }
            return callback(null,result)
        }
        
        ); // query
    },
    
    getUserById : function(userid,callback) {
        pool.query(
        'select * from registration where uid=?',
        [userid],
        function(error,result,fields) {
            if(error) {
                return callback(error,null);
            }
            return callback(null,result[0])
        }
        ); //query 
    }, 

    getUserByEmail : function(email,callback) {
        pool.query(
        'select * from registration where email=?',
        [email],
        function(error,result,fields) {
            if(error) {
                return callback(error,null);
            }
            return callback(null,result[0])
        }
        ); //query 
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
    }
}