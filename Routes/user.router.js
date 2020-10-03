const { 
    getAllUsers,
} = require("../Controllers/user.controller");

const {
    googleSignIn
} = require("../Controllers/googleSignInController");

const {
    fbSignIn
} = require("../Controllers/facebookSignInController");

const {
    login 
} = require("../Controllers/userLoginController");

const {
    onHome
} = require("../Controllers/userOnHomepageController");

const {
    createUser
} = require("../Controllers/userRegisterController");
const { checkToken } = require("../tokenauth/tokenvalidation");

const {
    addPayment
} = require("../Controllers/userTransactionsController"); 

const {
    getTransactions
} = require("../Controllers/userTransactionsController");


var express = require('express');
const router = express.Router(); 

router.use(express.json());
router.post("/register",createUser); // 
router.post("/login", login); // 
router.post("/gsignin", googleSignIn);  //
router.post("/fbsignin", fbSignIn);     //


router.get("/getallusers",checkToken, getAllUsers);
router.get("/onhome",checkToken, onHome);

router.post("/pay",checkToken,addPayment); 
router.get("/pay",checkToken,getTransactions); 


module.exports = router 