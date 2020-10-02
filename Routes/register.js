var express = require('express');
const router = express.Router(); 

router.use(express.json());

const {
    createUser
} = require("../Controllers/userRegisterController"); 

router.post("/register",createUser); // 
router.post("/login", login); // 

moduler.exports = router  