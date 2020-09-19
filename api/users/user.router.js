const { 
    createUser,
    login,
    googleSignIn,
    getAllUsers,
    onHome,
    addPayment,
    getTD
} = require("./user.controller");
const { checkToken } = require("../../tokenauth/tokenvalidation");


var express = require('express');
const router = express.Router(); 

router.use(express.json());
router.post("/register",createUser); 
router.post("/login", login);
//router.post("/byemail", login);
router.post("/gsignin", googleSignIn);
router.get("/getallusers",checkToken, getAllUsers);
router.get("/onhome",checkToken, onHome);

router.post("/pay",checkToken,addPayment); 
router.get("/pay",checkToken,getTD); 


module.exports = router 