/*
    Handles /api/pay
*/
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

router.post("/pay",checkToken,addPayment); 
router.get("/pay",checkToken,getTransactions); 

module.exports = router 