require("dotenv").config();

// --- Added by Saheel Bhugwandeen ---
// Validate required env vars (JWT_SECRET, MONGO_URI) and secret strength
// BEFORE the app starts - fails fast with a clear error instead of running
// with broken/insecure auth
const validateEnv = require("./config/validateEnv");
validateEnv();

const app = require("./app");
const connectDB = require("./config/db");

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});