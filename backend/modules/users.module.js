// node-stack/backend/modules/users.module.js
import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs"; // IMPORTANT: Use bcryptjs if that's what you installed

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.*@.*\..*/, "Please fill a valid email address"],
    },
    password: {
        type: String,
    },
    registerType: {
        // Essential for Google OAuth: differentiates 'normal' from 'google' users
        type: String,
        enum: ["normal", "google"],
        default: "normal",
        required: true,
    },
    socialId: {
        // Essential for Google OAuth: stores the unique ID from Google
        type: String,
        unique: true,
        sparse: true, // Allows null values for 'normal' users
    },
    createdAt: {
        // Keeping createdAt as per your request
        type: Date,
        default: Date.now,
    },
});

// Mongoose Middleware to Hash Password Before Saving
UserSchema.pre("save", async function(next) {
    // Only hash if password exists AND (it's a new document OR password has been modified)
    // AND the user is a 'normal' registration type (not Google)
    if (
        this.password &&
        (this.isNew || this.isModified("password")) &&
        this.registerType === "normal"
    ) {
        try {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next(); // Proceed without hashing if condition not met
    }
});

// Method to Compare Password (for Login)
UserSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        // 'this.password' refers to the hashed password in the database
        // 'candidatePassword' is the plain-text password provided by the user
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error(error);
    }
};

const User = mongoose.model("User", UserSchema);

export default User;