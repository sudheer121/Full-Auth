const {
    onHome
} = require("../Controllers/userOnHomepageController");

const { checkToken } = require("../tokenauth/tokenvalidation");

var express = require('express');
const router = express.Router(); 

router.use(express.json());

router.get("/",checkToken, onHome); 
module.exports = router 

