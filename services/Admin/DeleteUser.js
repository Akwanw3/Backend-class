const User = require("../../models/User");
const ErrorResponse = require("../../utils/ErrorResponse");

const deletUser = async (req, res, next)=>{
    const {userId} = req.query;
    const checkuser = await User.findById(userId);
    if(!checkuser){
        throw new ErrorResponse(`User not found`, 400);
    }
    const user = await User.findByIdAndDelete(userId)
    const metaData = {}
    return{
        data: `user deleted`,
        metaData
    }
}
module.exports = deletUser;
