/*
   Handles /api/login
*/

var express = require('express');
const router = express.Router(); 

router.use(express.json());

const {
    login 
} = require("../Controllers/userLoginController");


router.get("/login", (req, res) => {
    res.render('login',{}); 
});  
router.post("/login", login);

module.exports = router; 