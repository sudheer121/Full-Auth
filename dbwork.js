var mysql = require('mysql');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "grishma_db1"
});

function execQuery(sql,msg) { // Execute SQL query for which we dont neet resultset(eg: INSERT) 
  con.connect();
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(msg);
  });
  con.end(); 
}

// CALLBACK HELLLLLLLL 
function giveResult(sql,callback) // result is passed to callback function
{ 
  con.connect(); 
  con.query(sql, function (err, result) {
    if (err) throw err;
    callback(result); 
  });
  con.end(); 
}

var result = ""; 
var sql = "SELECT * FROM CUSTOMERS";  
function giveans(sql)
{ 
  giveResult(sql,function(returndata){
    console.log(returndata);
    result = returndata; 
  }); 
} 
//giveans(sql);  
//console.log(result); 



//createtable(); 
function putUP(username,password){  
  var sql = "INSERT INTO customers (email, password) VALUES ('" + username + "','" + password + "')";  
  var msg = "Username password entered"; 
  execQuery(sql,msg); 
}
putUP("sdffhhe","ssdsds");
//putUP("X","ssdsds");
//putUP("Y","ssdsds");
//putUP("sudhehhe","ssdsds");
//x(); 
// function calledme(x) {
//   console.log(x + "called me"); 
// }

// module.exports = {
//   calledme
// }

/*
function createtable(){
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    var sql = "CREATE TABLE customer_data (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,email VARCHAR(255), password VARCHAR(255), phone_no INT)";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Table created");
    });
  });
}
*/