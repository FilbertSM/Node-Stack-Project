import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import passport from "passport";
import cookieParser from "cookie-parser";
import cors from "cors";
import passportConfig from "./config/passport.js";
import userRoutes from "./routers/user.js";
import cardRouter from "./routers/card.js"; // Import the card router

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:5173", // Allow requests from your frontend's URL
        credentials: true, // Allow cookies (for JWT token) to be sent with requests
    })
);
// --- Passport Initialization ---
// 1. Initialize Passport middleware
app.use(passport.initialize());

// 2. Configure Passport strategies (THIS IS WHAT WAS LIKELY MISSING/MISPLACED)
passportConfig(passport); // <--- Ensure this line is present and called AFTER passport.initialize()

// --- MongoDB Connection ---
const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};
connectDB();

// --- Routes ---
app.get("/", (req, res) => {
    res.send("API is running...");
});

app.use("/api/users", userRoutes); // Your user routes (should be AFTER Passport config)
app.use("/api/cards", cardRouter); // Register the card router
app.use((err, req, res, next) => {
    if (err && err.name === 'UnauthorizedError') { // Or similar specific Passport error handling
        return res.status(401).json({ message: 'Authentication required or invalid token.' });
    }
    // Generic error handler
    if (err) {
        console.error(err.stack); // Log the error stack for debugging
        return res.status(500).json({ message: 'Something broke!' });
    }
    next();
});
// --- Start the Server ---
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});