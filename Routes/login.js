var express = require('express');
const router = express.Router(); 

router.use(express.json());

const {
    login 
} = require("../Controllers/userLoginController");

router.post("/login", login);

moduler.exports = router; 