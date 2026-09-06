const express = require("express");

const app = express();

const errorHandler = require('./middleware/errorHandler'); 

app.use(express.json());



app.get("/", (req, res) => {
    res.status(200).json({
        message: "HustleHub API is running"
    });
});

app.use(errorHandler); 

app.use("/api/auth", require("./routes/authRoutes"));

module.exports = app;
