const User = require("../../models/User");
const ErrorResponse = require("../../utils/ErrorResponse");

const getUser = async (req, res, next) => {
    const { limit = 10, page = 1 } = req.query;
    
    // FIX: Convert limit and page to numbers
    const limitNum = parseInt(limit);
    const pageNum = parseInt(page);
    
    const skip = limitNum * (pageNum - 1);
    
    const user = await User.find().limit(limitNum).skip(skip);
    const countUser = await User.countDocuments();
    
    if (!user || user.length === 0) {
        throw new ErrorResponse(`Users not found`, 404);
    }
    
    const metaData = {
        totalUsers: countUser, // FIX: Renamed from totalPages for clarity
        limit: limitNum,
        totalPages: Math.ceil(countUser / limitNum), // FIX: Changed from 'pages' and added Math.ceil
        currentPage: pageNum
    }
    
    return {
        data: user,
        metaData
    }
}

module.exports = getUser;