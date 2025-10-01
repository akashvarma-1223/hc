const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const db = require("../db"); // Import database connection
require("dotenv").config();

const router = express.Router();

// Initialize Passport
router.use(passport.initialize());

// Google OAuth Strategy
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: "http://localhost:5000/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            if (!profile.emails || profile.emails.length === 0) {
                return done(new Error("No email found"), null);
            }

            const email = profile.emails[0].value;

            try {
                // Check if user exists in database
                db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
                    if (err) {
                        console.error("Database error:", err);
                        return done(err, null);
                    }

                    if (results.length === 0) {
                        // User does not exist, deny access
                        console.log("Unauthorized: User not found in database");
                        return done(null, false, { message: "Unauthorized: User not registered" });
                    }

                    // User exists, fetch details
                    const user = results[0];

                    // Generate JWT Token with database user details
                    const token = jwt.sign(
                        {
                            username: user.name,
                            id: user.id,
                            
                            email: user.email,
                            role: user.role,
                            hostelblock:user.hostelblock,

                        },
                        "manhaasapp",
                        { expiresIn: "1h" }
                    );
                    // console.log(token);

                    done(null, { user, token });
                });
            } catch (error) {
                console.error("OAuth error:", error);
                done(error, null);
            }
        }
    )
);

// Route to Start Google Auth
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback Route
router.get(
    "/google/callback",
    (req, res, next) => {
        console.log("Google OAuth Callback Reached");
        next();
    },
    passport.authenticate("google", { session: false }),
    (req, res) => {
        if (!req.user) {
            return res.status(401).json({ error: "Authentication failed" });
        }

        const { user, token } = req.user;
        

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 60 * 60 * 1000, // 1 hour
        });

        // console.log(res.cookie.token);
        // console.log("Set-Cookie Header:", res.getHeaders()["set-cookie"]);

        res.redirect(`http://localhost:5173/dashboards`);
    }
);

// Logout Route (Clear Token)
router.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
});

// JWT Verification Middleware
const auth = (req, res, next) => {
    const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");
    // console.log(token);

    if (!token) {
        console.log("Unauthorized access");
        return res.status(401).json({ error: "Access denied" });
    }

    try {
        const verified = jwt.verify(token,"manhaasapp");
        req.user = verified;
        next();
    } catch (err) {
        console.log("Invalid token", err.message);
        res.status(400).json({ error: "Invalid token" });
    }
};

// Exclude `/auth/google/*` from JWT middleware if applied globally
const excludeGoogleOAuthRoutes = (req, res, next) => {
    if (req.path.startsWith("/auth/google")) {
        return next();
    }
    auth(req, res, next);
};

module.exports = { auth, router, excludeGoogleOAuthRoutes };
