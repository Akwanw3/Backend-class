const mongoose = require("mongoose");
mongoose.set('strictQuery', true);
require('dotenv').config({ path: "./config/.env"});
const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDB connected successfully");
    }catch(error){
        console.error("MongoDB connection failed:", error);
    }
}
module.exports = connectDB;