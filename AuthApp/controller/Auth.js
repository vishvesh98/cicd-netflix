const bcrypt = require('bcryptjs');
const User = require("../models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');

const sendResetPasswordMail = async (name, email, token) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            service: "gmail",
            requireTLS: true,
            secure: false,
            auth: {
                user: process.env.emailUser,
                pass: process.env.emailPassword
            }
        });

        const mailOptions = {
            from: process.env.emailUser,
            to: email,
            subject: "Reset Password",
            html: `
                <h2>Password Reset Request</h2>
                <p>Hello ${name},</p>
                <p>You requested to reset your password. Click the link below to reset your password:</p>
                <a href="http://localhost:5000/api/v1/resetpassword?token=${token}" 
                   style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                   Reset Password
                </a>
                <p>If you didn't request this, please ignore this email.</p>
                <p>This link will expire in 1 hour.</p>
            `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("Email error:", error);
            } else {
                console.log("Email sent:", info.response);
            }
        });
    } catch (error) {
        console.log("Send mail error:", error.message);
    }
};

// Signup Controller
exports.signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields (name, email, password)",
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email address",
            });
        }

        // Password validation
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long",
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User with this email already exists",
            });
        }

        // Hash password
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 12);
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Error in hashing password",
            });
        }

        // Create user
        const user = await User.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            role: role || "User"
        });

        // Remove password from response
        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            watchlist: user.watchlist,
            createdAt: user.createdAt
        };

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: userResponse
        });

    } catch (err) {
        console.error("Signup error:", err);
        
        // Handle duplicate key error
        if (err.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "User with this email already exists",
            });
        }

        return res.status(500).json({
            success: false,
            message: "User registration failed. Please try again later",
        });
    }
};

// Login Controller
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide both email and password",
            });
        }

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Create JWT payload
        const payload = {
            id: user._id,
            email: user.email,
            role: user.role,
        };

        // Generate JWT token
        const token = jwt.sign(payload, process.env.JWT, {
            expiresIn: "24h"
        });

        // Cookie options
        const cookieOptions = {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        };

        // User response (without password)
        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            watchlist: user.watchlist,
            createdAt: user.createdAt
        };

        res.cookie("token", token, cookieOptions).status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: userResponse
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "Login failed. Please try again later",
        });
    }
};

// Forget Password Controller
exports.forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Please provide email address",
            });
        }

        // Find user
        const userData = await User.findOne({ email: email.toLowerCase() });
        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "No user found with this email address",
            });
        }

        // Generate reset token
        const resetToken = randomstring.generate(32);
        
        // Update user with reset token
        await User.updateOne(
            { email: email.toLowerCase() },
            { $set: { token: resetToken } }
        );

        // Send reset email
        await sendResetPasswordMail(userData.name, email, resetToken);

        res.status(200).json({
            success: true,
            message: "Password reset link sent to your email",
        });

    } catch (error) {
        console.error("Forget password error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to process password reset request",
        });
    }
};

// Reset Password Controller
exports.resetPassword = async (req, res) => {
    try {
        const token = req.query.token;
        const { password } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Reset token is required",
            });
        }

        if (!password) {
            return res.status(400).json({
                success: false,
                message: "New password is required",
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long",
            });
        }

        // Find user with reset token
        const userData = await User.findOne({ token });
        if (!userData) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset link",
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Update password and clear token
        await User.updateOne(
            { token },
            { 
                $set: { 
                    password: hashedPassword, 
                    token: "" 
                } 
            }
        );

        res.status(200).json({
            success: true,
            message: "Password reset successfully",
        });

    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to reset password. Please try again",
        });
    }
};

// Logout Controller
exports.logout = async (req, res) => {
    try {
        res.clearCookie("token").status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({
            success: false,
            message: "Logout failed",
        });
    }
};

// Get User Profile Controller
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('-password -token')
            .populate('watchlist');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Profile retrieved successfully",
            data: user
        });

    } catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve profile",
        });
    }
};

// Update User Profile Controller
exports.updateProfile = async (req, res) => {
    try {
        const { name } = req.body;
        const userId = req.user.id;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Name is required",
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name: name.trim() },
            { new: true, runValidators: true }
        ).select('-password -token');

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: updatedUser
        });

    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update profile",
        });
    }
};