// node-stack/backend/routers/user.js
import { Router } from "express";
// Adjust the path to your User model file:
// Assuming 'routers' and 'modules' are siblings inside 'backend'
import User from "../modules/users.module.js"; // Import your User model

const router = Router();

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
router.post('/register', async(req, res) => {
    const { username, email, password } = req.body;

    // Basic validation to ensure all required fields are present
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    try {
        // Check if a user with the given email already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User with that email already exists' });
        }

        // Check if the username is already taken
        user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'Username is already taken' });
        }

        // Create a new user instance. The password will be hashed
        // automatically by the pre-save hook in your User model before saving.
        const newUser = new User({
            username,
            email,
            password,
        });

        // Save the new user document to the database
        const savedUser = await newUser.save();

        // Respond with a success message and basic user info
        res.status(201).json({
            message: 'User registered successfully.',
            user: {
                id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email,
            }
        });

    } catch (error) {
        console.error('Error during user registration:', error); // Log the full error for debugging
        // Handle specific Mongoose duplicate key error (code 11000)
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Duplicate field value entered (email or username)' });
        }
        // Generic server error
        res.status(500).json({ message: 'Server error during registration' });
    }
});

export default router;