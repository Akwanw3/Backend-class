const express = require('express');
const router = express.Router();

const {
    login, 
    register,
} = require("../controller/Auth");

const { validateLoginObj, validateRegisterObj } = require('../validators/auth');


router.post('/login', validateLoginObj,  login);
router.post('/register', validateRegisterObj, register);

module.exports = router;