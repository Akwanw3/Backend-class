const User = require("../../models/User");
const ErrorResponse = require("../../utils/ErrorResponse");
let referralCodeGenerator = require("referral-code-generator");
const randomize = require('randomatic');
const crypto = require("crypto");
const sendEmail = require("../../utils/sendEmail");
const jwt = require("jsonwebtoken");

const register = async (req, res, next) => {
    // business logic

    const {
        firstname,
        lastname,
        email,
        password,
        phone,
        referredBy
    } = req.body;
    
    let refCode = referralCodeGenerator.custom("lowercase", 6, 3, email);

    const otp = randomize("0", 6);
    
    const converted = crypto.createHash('sha256').update(otp).digest('hex');

    const data = {
        firstname,
        lastname,
        email,
        password,
        phone,
        referralCode: refCode,
        referredBy: referredBy?.toLowerCase() || null,
        verificationCode: converted
    };

    const check = await User.findOne({email: email}).select("_id");
    if(check){
        throw new ErrorResponse("User already existed", 400);
    }

    // FIX: Define message BEFORE using it in sendEmail
    const message = `Welcome to our business.\nPlease verify your email.\nYour One Time Password is: <span>${otp}</span>.`

    // FIX: Fixed the sendEmail parameters - should be options.to not options.email
    await sendEmail({to: email, subject: "Registration Verification", text: '', html: message});

    const saveData = await User.create(data);

    
    return {
        "data": saveData,
        "metaData": {}
    }
}

module.exports = register