//jshint esversion:6
const sqlite3 = require('sqlite3').verbose();
const path = require('path')
const dbpath = path.join(__dirname, '/db/fadb.db')
module.exports = {
    create : function(data) {
        const myPromise = new Promise((resolve,reject)=>{
            let db = new sqlite3.Database(dbpath);
            db.run(
                'insert into registration(email,password,first_name,last_name,phone_no,signin_type) values (?,?,?,?,?,?)',
                [
                    data.email,
                    data.password,
                    data.first_name,
                    data.last_name,
                    data.phone_no,
                    data.signin_type
                ]
                ,
                function(error){
                    if (error) {
                        reject(error);
                        db.close(); 
                        return; 
                    }
                    resolve(`A row has been inserted with rowid ${this.lastID}`);
                    db.close();
                }
                
                ); // query
        }); 
        return myPromise; 
    }, 

    getUserById : function(userid) {
        const myPromise = new Promise((resolve,reject)=>{
            let db = new sqlite3.Database(dbpath);
            db.all(
                'select * from registration where uid=?',
                [userid],
                function(error,rows) {
                    if (error) {
                        reject(error);
                        db.close(); 
                        return; 
                    }
                    resolve(rows);
                    db.close(); 
                }
            ); //query 
        }); 
        return myPromise; 
    }, 

    getUserByEmail : function(email) {

        const myPromise = new Promise((resolve, reject)=>{
            let db = new sqlite3.Database(dbpath);
            db.all(
                'select * from registration where email=?',
                [email],
                function(error,rows) {
                    if (error) {
                        reject(error);
                        db.close();
                        return; 
                    }
                    resolve(rows);
                    db.close(); 
                }
                ); //query 
        }); 

        return myPromise; 
    }, 
    
    getUsers : function() {
        const myPromise = new Promise((resolve, reject)=>{ 
        let db = new sqlite3.Database(dbpath);
        db.all(
        'select * from registration',
        [],
        function(error,rows) {
            if (error) {
                reject(error);
                db.close(); 
                return; 
            }
            db.close(); 
            resolve(rows);
        }
        ); //query 
        });
        return myPromise; 
    },

    updateUser : function(data) {
        const myPromise = new Promise((resolve, reject)=>{ 
        let db = new sqlite3.Database(dbpath);
        db.run(
            'update registration set password=?,first_name=?,last_name=?,phone_no=? where email=?',
            [
                data.password,
                data.first_name,
                data.last_name,
                data.phone_no,
                data.email 
            ]
            ,
            function(error) {
                if (error) {
                    reject(error);
                    db.close();
                    return; 
                }
                resolve(`Row(s) updated: ${this.changes}`);
                db.close();
            }
            ); //query 
        });
        return myPromise
    },

    addPayment : function(data) {

        const myPromise = new Promise((resolve,reject)=>{
            let db = new sqlite3.Database(dbpath);
            db.run(
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
                function(error) {
                    if (error) {
                        reject(error);
                        db.close();
                        return; 
                    }
                    resolve(`A row has been inserted in transactions table with rowid ${this.lastID}`);
                    db.close(); 
                }
                ); //query 
        }); 

        return myPromise; 
    },

    getTransactionDetails : function(uid) { //get Transaction Details
        const myPromise = new Promise((resolve,reject)=>{
            let db = new sqlite3.Database(dbpath);
            db.all(
                'select * from transactions where uid=?',
                [uid]
                ,
                function(error,rows) {
                    if (error) {
                        reject(error);
                        db.close(); 
                        return; 
                    }
                    resolve(rows);
                    db.close();
                }
            ); // query
        }); 

        return myPromise;      
    }
}

/*
Below is npm mysql implementation 

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

*/