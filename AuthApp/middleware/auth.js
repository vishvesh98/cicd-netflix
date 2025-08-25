const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

// Authentication middleware
// Auth Middleware - Authorization header only
exports.auth = async (req, res, next) => {
    try {
        // Get token ONLY from Authorization header
        const authHeader = req.header("Authorization");
        
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Access token is missing or invalid format"
            });
        }

        const token = authHeader.replace("Bearer ", "");

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT);
            
            // Check if user still exists
            const user = await User.findById(decoded.id).select('-password -token');
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "User no longer exists"
                });
            }

            // Add user to request object
            req.user = user;
            next();

        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token"
            });
        }

    } catch (error) {
        console.error("Auth middleware error:", error);
        return res.status(500).json({
            success: false,
            message: "Authentication failed"
        });
    }
};

// Admin authorization middleware
exports.isAdmin = async (req, res, next) => {
    try {
        if (req.user.role !== "Admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin privileges required."
            });
        }
        next();
    } catch (error) {
        console.error("Admin middleware error:", error);
        return res.status(500).json({
            success: false,
            message: "Authorization failed"
        });
    }
};

// User authorization middleware (for user-specific operations)
exports.isUser = async (req, res, next) => {
    try {
        if (req.user.role !== "User" && req.user.role !== "Admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. User privileges required."
            });
        }
        next();
    } catch (error) {
        console.error("User middleware error:", error);
        return res.status(500).json({
            success: false,
            message: "Authorization failed"
        });
    }
};

// Check if user is accessing their own resource
exports.isOwnerOrAdmin = async (req, res, next) => {
    try {
        const userId = req.params.userId || req.params.id;
        
        if (req.user.role === "Admin" || req.user._id.toString() === userId) {
            next();
        } else {
            return res.status(403).json({
                success: false,
                message: "Access denied. You can only access your own resources."
            });
        }
    } catch (error) {
        console.error("Owner/Admin middleware error:", error);
        return res.status(500).json({
            success: false,
            message: "Authorization failed"
        });
    }
};