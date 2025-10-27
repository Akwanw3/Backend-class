const ErrorResponse = require("../../utils/ErrorResponse");


const login = async (req, res, next) => {
    try{
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if(user)
        return ({
            "data": [],
            "metaData": {}
        })
    }catch(error){
        console.log(error);
        throw new ErrorResponse(`Login Error: ${error.message}`, 500);
    }
}

module.exports = login