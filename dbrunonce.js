
const path = require('path')
const dbpath = path.join(__dirname, 'Models/db/fadb.db')
// database name fadb (meaning full auth db)
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database(dbpath); //created if doesn't exist. 
db.run("CREATE TABLE IF NOT EXISTS registration ( uid  INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, password TEXT, first_name TEXT, last_name TEXT, phone_no TEXT, signin_type INTEGER )");
db.run(" CREATE TABLE IF NOT EXISTS transactions ( uid TEXT, pname TEXT, pid TEXT, pprice TEXT, tdate TEXT, ttime TEXT ) ");
db.close();

/*
CREATE TABLE IF NOT EXISTS registration (
    uid  INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT,
    password TEXT,
    first_name TEXT,
    last_name TEXT,
    phone_no TEXT,
    signin_type INTEGER
);
CREATE TABLE IF NOT EXISTS transactions (
    uid TEXT,
    pname TEXT,
    pid TEXT,
    pprice TEXT,
    tdate TEXT,
    ttime TEXT
);
INSERT INTO registration(email) VALUES ("assdsd");
SELECT * FROM registration

*/