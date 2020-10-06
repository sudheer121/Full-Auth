/*
    Handles /api/register 
*/

var express = require('express');
const router = express.Router(); 

router.use(express.json());

const {
    createUser
} = require("../Controllers/userRegisterController"); 

router.get("/register", (req, res) => {
  res.render('register',{}); 
});

router.post("/register",createUser); 

module.exports = router  