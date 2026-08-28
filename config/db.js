const mongoose = require("mongoose");  // import mongoose so api can connect to the database

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI); // connection string in .env file

        console.log("MongoDB Connected");

    } catch (error) {
        console.error("MongoDb connection failed", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
