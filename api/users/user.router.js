const { 
    createUser,
    login
} = require("./user.controller");
const { checkToken } = require("../../tokenauth/tokenvalidation");


var express = require('express');
const router = express.Router(); 

router.use(express.json());
router.post("/register",createUser); 
router.post("/login", login);
module.exports = router 