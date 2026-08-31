const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");


const createToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "1h"
        }
    );
};


const register = async (req, res, next) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({
                error: "Full name, email and password are required."
            });
        }

        if ( typeof fullName !== "string" || typeof email !== "string" ||
            typeof password !== "string"
        ) {
            return res.status(400).json({
                error: "Full name, email and password must be text values."
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                error: "Password must be at least 8 characters."
            });
        }

        

        const existingUser = await User.findOne({
            email: email.toLowerCase().trim()
        });

        if (existingUser) {
            return res.status(409).json({ error: "User already exists."
            });
        }

       const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 12;
       const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        const user = await User.create({
            fullName: fullName.trim(),
            email: email.toLowerCase().trim(),
            passwordHash
        });

        return res.status(201).json({
            message: "User registered",
            data: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        next(error);
    }
};

// login
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;


        if (!email || !password) {
            return res.status(400).json({
                error: "Email and password are required."
            });
        }
        
        if (
            typeof email !== "string" ||
            typeof password !== "string"
        ) {
            return res.status(400).json({
                error: "Email and password must be text values."
            });
        }


        
        const user = await User.findOne({
            email: email.toLowerCase().trim()
        }).select("+passwordHash");

        // User doesn't exist
        if (!user) {
            return res.status(401).json({
                error: "Invalid credentials."
            });
        }

        
        const passwordMatches = await bcrypt.compare(
            password,
            user.passwordHash
        );

        if (!passwordMatches) {
            return res.status(401).json({
                error: "Invalid credentials."
            });
        }

        
        const token = createToken(user);

    
        return res.status(200).json({
            message: "Login successful.",
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login
};
