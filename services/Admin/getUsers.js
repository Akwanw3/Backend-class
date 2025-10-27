const User = require("../../models/User");
const ErrorResponse = require("../../utils/ErrorResponse");

const getUser = async (req, res, next)=>{
    const {limit =10, page = 1} = req.query;
    const skip = limit * (page - 1);
    const user =await User.find().limit(limit).skip(skip);
    const countUser =await User.countDocuments();
    if(!user){
        throw new ErrorResponse(`User not found`, 400);
    }
    const metaData = {
        totalPages: countUser,
        limit: limit,
        pages: ceil(countUser/limit),
        currentPage:page

    }
    return{
        data: user,
        metaData
    }
}
module.exports = getUser;
