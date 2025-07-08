// node-stack/backend/routers/user.js
import { Router } from "express";
import User from "../modules/users.module.js"; // Path to your User model
import passport from "passport"; // Import passport
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const router = Router();

// @desc    Register a new user (Signup)
// @route   POST /api/users/signup
// @access  Public
router.post("/signup", async(req, res) => {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
        return res
            .status(400)
            .json({ message: "Please provide all required fields." });
    }

    try {
        // Check if user already exists by email or username
        let userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res
                .status(400)
                .json({ message: "User with that email or username already exists." });
        }

        // Create a new user instance (password hashing handled by pre-save hook in model)
        const newUser = new User({
            username,
            email,
            password,
            registerType: "normal", // Explicitly set provider for local users
        });

        // Save the user to the database
        const savedUser = await newUser.save();

        // Respond with success
        res.status(201).json({
            message: "User registered successfully.",
            user: {
                id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email,
            },
        });
    } catch (error) {
        console.error("Error during user signup:", error);
        res.status(500).json({ message: "Server error during signup." });
    }
});

// @desc    Authenticate user (Login)
// @route   POST /api/users/login
// @access  Public
router.post(
    "/login",
    passport.authenticate("local", {
        session: false, // Crucial for JWT-based authentication
    }),
    (req, res) => {
        // If authentication succeeds, req.user will be populated by Passport
        if (req.user) {
            const _id = req.user._id;
            const payload = { _id };

            // Sign the JWT token
            const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
                expiresIn: "1d",
            }); // Token expires in 1 day

            // Set the JWT token as an HTTP-only cookie
            res.cookie("token", token, {
                httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
                maxAge: 1000 * 60 * 60 * 24, // Cookie expires in 1 day (same as token)
                // secure: process.env.NODE_ENV === 'production', // Use secure: true in production (HTTPS)
                // sameSite: 'strict' // CSRF protection
            });

            // Send success response with user details (excluding sensitive info)
            const userToSend = {
                _id: req.user._id,
                username: req.user.username,
                email: req.user.email,
                registerType: req.user.registerType, // Include registerType
                socialId: req.user.socialId, // Include socialId
            };
            res.json({ message: "Login successful!", user: userToSend });
        } else {
            // This else block should be reached if authentication fails
            res.status(401).json({ message: "Authentication failed." });
        }
    }
);

// @desc    Logout user
// @route   POST /api/users/logout
// @access  Public
router.post("/logout", (req, res) => {
    res.clearCookie("token"); // Clear the JWT token cookie
    res.json({ message: "Logout successful!" });
});

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private (requires authentication)
router.get(
    "/profile",
    // Use Passport's JWT strategy to protect this route
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        // req.user is available here because Passport's JWT strategy populated it
        res.json({
            id: req.user._id,
            username: req.user.username,
            email: req.user.email,
            registerType: req.user.registerType,
            socialId: req.user.socialId,
            createdAt: req.user.createdAt,
        });
    }
);

export default router;