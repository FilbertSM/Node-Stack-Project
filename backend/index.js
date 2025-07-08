import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'; // Import dotenv to load environment variables

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; // Use port from environment variable or default to 5000

// Middleware to parse JSON bodies
app.use(express.json());

// --- MongoDB Connection ---
const connectDB = async() => {
    try {
        // Use the MONGO_URI from your .env file
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            // These options are recommended to avoid deprecation warnings
            // and ensure stable connections.
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex: true, // No longer needed in Mongoose 6+
            // useFindAndModify: false // No longer needed in Mongoose 6+
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};

// Call the connectDB function to establish connection when the server starts
connectDB();

// --- Basic Route (for testing) ---
app.get('/', (req, res) => {
    res.send('API is running...');
});

// --- Start the Server ---
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});