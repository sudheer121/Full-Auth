const { createPool } = require('mysql');

const pool = createPool({
    port:3306,
    host: "localhost",
    user: "root",
    password: "password",
    database: "grishma_db1",
    connectionLimit: 100 
})

module.exports = pool; 


/*
Table 

registration(uid,email,password,first_name,last_name,phone_no,signin_type)

transactions(uid,pname,pid,pprice,tdate,ttime)

*/