import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt"; // Import JWT Strategy
import User from "../modules/users.module.js"; // Adjust path to your User model
import bcrypt from "bcryptjs"; // Ensure this matches your bcrypt library
import dotenv from "dotenv"; // Import dotenv to load environment variables

dotenv.config(); // Load environment variables here as well for JWT_SECRET_KEY

const passportConfig = (passport) => {
    // Local Strategy for username/email and password authentication
    passport.use(
        new LocalStrategy({ usernameField: "email" },
            async(email, password, done) => {
                try {
                    const user = await User.findOne({ email }).select("+password");

                    if (!user) {
                        return done(null, false, {
                            message: "That email is not registered",
                        });
                    }

                    const isMatch = await user.comparePassword(password);

                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: "Password incorrect" });
                    }
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    // JWT Strategy for token-based authentication
    passport.use(
        new JwtStrategy({
                jwtFromRequest: (req) => {
                    let token = null;
                    if (req && req.cookies) {
                        token = req.cookies.token; // Correctly looking for a cookie named 'token'
                    }
                    return token;
                },
                secretOrKey: process.env.JWT_SECRET_KEY,
            },
            async(jwt_payload, done) => {
                try {
                    const user = await User.findById(jwt_payload._id).select("-password");
                    if (user) {
                        return done(null, user);
                    } else {
                        // This path means the JWT was valid, but the user ID in the payload doesn't exist
                        return done(null, false, { message: "User not found." });
                    }
                } catch (error) {
                    return done(error, false); // Database or other server error during user lookup
                }
            })
    );

    // Passport Session Management (required by Passport, even with JWT)
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async(id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    });
};

export default passportConfig;