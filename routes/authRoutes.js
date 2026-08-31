const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const { register, login } = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");

// --- Added by Saheel Bhugwandeen ---
// Rate limiter for login attempts - protects against brute-force password
// guessing. Limits each IP to 5 login attempts per 15-minute window;
// further attempts get a 429 response instead of hitting the login logic.
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window per IP
    message: {
        error: "Too many login attempts. Please try again in 15 minutes."
    },
    standardHeaders: true,
    legacyHeaders: false
});

router.post("/register", register);
router.post("/login", loginLimiter, login);
router.get("/me", protect, (req, res) => {
    res.status(200).json({
        message: "You are authenticated.",
        user: req.user
    });
});

module.exports = router;