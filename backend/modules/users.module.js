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
        minlength: [6, 'Password must be at least 6 characters long'],
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Mongoose Middleware to Hash Password Before Saving
UserSchema.pre('save', async function(next) {
    // Only run this function if password was actually modified (or is new)
    if (!this.isModified('password') || !this.password) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10); // Generate a salt
        this.password = await bcrypt.hash(this.password, salt); // Hash the password
        next();
    } catch (error) {
        next(error);
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

const User = mongoose.model('User', UserSchema);

export default User;