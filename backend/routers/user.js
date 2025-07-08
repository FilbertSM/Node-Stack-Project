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
router.post("/login", (req, res, next) => {
    // Custom callback for passport.authenticate to handle responses explicitly
    passport.authenticate("local", { session: false }, (err, user, info) => {
        // Step 1: Handle any server-side errors during authentication process
        if (err) {
            console.error("Passport Local Strategy Error:", err);
            // Don't send sensitive error details to the client directly unless for debugging
            return res.status(500).json({ message: "An unexpected server error occurred during login." });
        }

        // Step 2: Handle authentication failure (user not found or password incorrect)
        if (!user) {
            // 'info' object from 'done(null, false, info)' contains the message
            const errorMessage = info && info.message ? info.message : "Authentication failed. Please check your credentials.";
            return res.status(401).json({ message: errorMessage });
        }

        // Step 3: Handle successful authentication
        // Log in the user to establish a session, even if session: false. This populates req.user.
        req.logIn(user, { session: false }, (loginErr) => {
            if (loginErr) {
                console.error("Error during req.logIn:", loginErr);
                return res.status(500).json({ message: "An error occurred after successful authentication." });
            }

            // User is successfully authenticated, generate JWT
            const payload = { _id: user._id }; // Use 'user._id' directly

            const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
                expiresIn: "1d",
            });

            // Set the JWT token as an HTTP-only cookie
            res.cookie("token", token, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24, // 1 day
                // secure: process.env.NODE_ENV === 'production', // Uncomment in production for HTTPS
                // sameSite: 'strict' // CSRF protection
            });

            // Send success response with user details (excluding password)
            const userToSend = {
                _id: user._id,
                username: user.username,
                email: user.email,
                registerType: user.registerType,
                socialId: user.socialId,
            };
            return res.json({ message: "Login successful!", user: userToSend });
        });
    })(req, res, next); // IMPORTANT: Invoke the middleware chain
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
    passport.authenticate("jwt", { session: false }),
    async(req, res) => {
        try {
            // req.user is populated by passport.authenticate if JWT is valid
            if (!req.user) {
                // This case should ideally be caught by passport.authenticate itself
                // but as a fallback, ensure we send JSON
                return res.status(401).json({ message: "Not authenticated for profile access." });
            }

            // If authenticated, send user data
            res.json({
                id: req.user._id,
                username: req.user.username,
                email: req.user.email,
                registerType: req.user.registerType,
                socialId: req.user.socialId,
                createdAt: req.user.createdAt,
            });
        } catch (err) {
            console.error("Error fetching user profile:", err);
            // Send a JSON error response for internal server errors
            res.status(500).json({ message: "Server error while fetching profile." });
        }
    }
);

// @desc    Get all users
// @route   GET /api/users
// @access  Private (requires authentication)
router.get(
    "/",
    passport.authenticate("jwt", { session: false }),
    async(req, res) => {
        try {
            const users = await User.find().sort({ createdAt: -1 });
            res.json(users);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
);

export default router;