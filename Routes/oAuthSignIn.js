var express = require('express');
const router = express.Router(); 

router.use(express.json());

const {
    googleSignIn
} = require("../Controllers/googleSignInController");

const {
    fbSignIn
} = require("../Controllers/facebookSignInController");

router.post("/gsignin", googleSignIn);  
router.post("/fbsignin", fbSignIn);    

module.exports = router; 