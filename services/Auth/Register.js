const User = require("../../models/User");
const ErrorResponse = require("../../utils/ErrorResponse");
let referralCodeGenerator = require("referral-code-generator");
const randomize = require('randomatic');
const crypto = require("crypto");
const sendEmail = require("../../utils/SendEmail");

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
        referredBy: referredBy?.lowercase() || null,
        verificationCode: converted
    };

    const check = await User.findOne({email: email}).select("_id");
    if(check){
        throw new ErrorResponse("User already existed", 400);
    }

    const saveData = await User.create(data);

    const message = `Welcome to our business.\nPlease verify you email.\nYour One Time Password is: <span>${otp}</span>.`

    await sendEmail({to: email, subject: "Registration Verification", text: '', html: message}, []);

    return {
        "data": saveData,
        "metaData": {}
    }
}

module.exports = register