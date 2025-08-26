import React, { useState } from 'react'
import Header from './Header';
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from '../redux/userSlice';

const NetflixLogin = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Base URL for your backend API
    const API_BASE_URL = 'http://localhost:5000/api/v1';

    const loginHandler = () => {
        setIsLogin(!isLogin);
        setIsForgotPassword(false);
        // Clear form data when switching modes
        setFullName("");
        setEmail("");
        setPassword("");
    }

    const forgotPasswordHandler = () => {
        setIsForgotPassword(!isForgotPassword);
        setIsLogin(false);
        // Clear form data
        setFullName("");
        setEmail("");
        setPassword("");
    }

    // API call for user login
    const loginUser = async (loginData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Important for cookies
                body: JSON.stringify(loginData)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Store user data in Redux
                dispatch(setUser(data.user));
                
                // Store token in localStorage if needed
                if (data.token) {
                    localStorage.setItem('token', data.token);
                }
                
                toast.success(data.message || "Login successful!");
                navigate("/browse");
            } else {
                toast.error(data.message || "Login failed!");
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error("Network error. Please try again.");
        }
    };

    // API call for user signup
    const signupUser = async (signupData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(signupData)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                toast.success(data.message || "Registration successful! Please login.");
                setIsLogin(true);
                setIsForgotPassword(false);
                // Clear form
                setFullName("");
                setEmail("");
                setPassword("");
            } else {
                toast.error(data.message || "Registration failed!");
            }
        } catch (error) {
            console.error('Signup error:', error);
            toast.error("Network error. Please try again.");
        }
    };

    // API call for forgot password
    const forgotPasswordRequest = async (forgotData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/forgetPassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(forgotData)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                toast.success(data.message || "Password reset link sent to your email!");
                setIsForgotPassword(false);
                setIsLogin(true);
                setEmail("");
            } else {
                toast.error(data.message || "Failed to send reset link!");
            }
        } catch (error) {
            console.error('Forgot password error:', error);
            toast.error("Network error. Please try again.");
        }
    };

    // Form validation
    const validateForm = () => {
        if (isForgotPassword) {
            if (!email) {
                toast.error("Please enter your email address");
                return false;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                toast.error("Please enter a valid email address");
                return false;
            }
            return true;
        }

        if (isLogin) {
            if (!email || !password) {
                toast.error("Please fill in all fields");
                return false;
            }
        } else {
            if (!fullName || !email || !password) {
                toast.error("Please fill in all fields");
                return false;
            }
            if (password.length < 6) {
                toast.error("Password must be at least 6 characters long");
                return false;
            }
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address");
            return false;
        }

        return true;
    };

   const getInputData = async () => {
    if (!validateForm()) return;

    // 🚨 Bypass check (hardcoded admin login)
    if (isLogin && email === "abc@gmail.com" && password === "123456") {
        toast.success("Direct login successful!");
        dispatch(setUser({ email: "abc@gmail.com", name: "Demo User" }));
        navigate("/browse");
        return; // stop further execution
    }

    setIsLoading(true);
    dispatch(setLoading(true));

    try {
        if (isForgotPassword) {
            // Forgot Password
            await forgotPasswordRequest({ email });
        } else if (isLogin) {
            // Normal Login
            await loginUser({ email, password });
        } else {
            // Signup
            await signupUser({ 
                name: fullName, 
                email, 
                password,
                role: "User" 
            });
        }
    } catch (error) {
        console.error('Form submission error:', error);
        toast.error("Something went wrong. Please try again.");
    } finally {
        setIsLoading(false);
        dispatch(setLoading(false));
    }
};


    const getFormTitle = () => {
        if (isForgotPassword) return "Reset Password";
        return isLogin ? "Sign In" : "Sign Up";
    };

    const getButtonText = () => {
        if (isLoading) return "Loading...";
        if (isForgotPassword) return "Send Reset Link";
        return isLogin ? "Sign In" : "Sign Up";
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Netflix Logo */}
            <div className="absolute top-6 left-6 z-20">
                <div className="text-red-600 text-4xl font-black tracking-tight">
                    NETFLIX
                </div>
            </div>

            {/* Background with movie posters */}
            <div className="absolute inset-0">
                {/* Background grid of movie posters */}
                <div className="absolute inset-0 z-0">
                    <img 
                        className="w-full h-full object-cover"
                        src="https://assets.nflxext.com/ffe/siteui/vlv3/8200f588-2e93-4c95-8eab-ebba17821657/web/IN-en-20250616-TRIFECTA-perspective_9cbc87b2-d9bb-4fa8-9f8f-a4fe8fc72545_small.jpg" 
                        alt="Netflix Background" 
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                </div>
                
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-60"></div>
                
                {/* Gradient overlay for better text contrast */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50"></div>
            </div>

            {/* Login Form Container */}
            <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
                <div className="w-full max-w-md">
                    <div className="bg-black bg-opacity-75 p-12 pb-16 rounded-lg">
                        <h1 className="text-white text-3xl font-bold mb-7">
                            {getFormTitle()}
                        </h1>
                        
                        <div className="space-y-4">
                            {/* Full Name field - only for signup */}
                            {!isLogin && !isForgotPassword && (
                                <div className="relative">
                                    <input 
                                        value={fullName} 
                                        onChange={(e) => setFullName(e.target.value)} 
                                        type="text" 
                                        placeholder="Full Name"
                                        className="w-full h-14 px-4 pt-4 pb-1 bg-gray-700 text-white rounded border-0 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            )}
                            
                            {/* Email field */}
                            <div className="relative">
                                <input 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    type="email" 
                                    placeholder={isForgotPassword ? "Enter your email address" : "Email or mobile number"}
                                    className="w-full h-14 px-4 pt-4 pb-1 bg-gray-700 text-white rounded border-0 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            
                            {/* Password field - not for forgot password */}
                            {!isForgotPassword && (
                                <div className="relative">
                                    <input 
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)} 
                                        type="password" 
                                        placeholder="Password"
                                        className="w-full h-14 px-4 pt-4 pb-1 bg-gray-700 text-white rounded border-0 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            )}
                            
                            {/* Submit Button */}
                            <button 
                                type="button" 
                                onClick={getInputData}
                                disabled={isLoading}
                                className="w-full h-12 bg-red-600 hover:bg-red-700 text-white rounded font-semibold text-base transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-8"
                            >
                                {getButtonText()}
                            </button>
                        </div>

                        {/* Login specific options */}
                        {isLogin && !isForgotPassword && (
                            <>
                                {/* OR divider */}
                                <div className="flex items-center justify-center my-6">
                                    <span className="text-gray-400 text-sm">OR</span>
                                </div>

                                {/* Use sign-in code button */}
                                <button 
                                    type="button"
                                    className="w-full h-12 bg-gray-600 bg-opacity-50 hover:bg-opacity-70 text-white rounded font-medium text-base transition-colors mb-6"
                                    disabled={isLoading}
                                >
                                    Use a sign-in code
                                </button>

                                {/* Forgot password */}
                                <div className="text-center mb-4">
                                    <button 
                                        type="button"
                                        onClick={forgotPasswordHandler}
                                        className="text-white hover:underline text-sm"
                                        disabled={isLoading}
                                    >
                                        Forgot password?
                                    </button>
                                </div>

                                {/* Remember me checkbox */}
                                <div className="flex items-center mb-6">
                                    <input 
                                        type="checkbox" 
                                        id="remember-me"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="w-4 h-4 mr-3"
                                        disabled={isLoading}
                                    />
                                    <label htmlFor="remember-me" className="text-gray-300 text-sm">
                                        Remember me
                                    </label>
                                </div>
                            </>
                        )}

                        {/* Forgot password specific options */}
                        {isForgotPassword && (
                            <div className="mt-6 text-gray-400 text-sm">
                                <p>Enter your email address and we'll send you a link to reset your password.</p>
                            </div>
                        )}

                        {/* Sign up/Sign in link */}
                        {!isForgotPassword && (
                            <div className="text-gray-400 text-base">
                                {isLogin ? "New to Netflix? " : "Already have an account? "}
                                <button 
                                    type="button"
                                    onClick={loginHandler} 
                                    className="text-white hover:underline font-medium"
                                    disabled={isLoading}
                                >
                                    {isLogin ? "Sign up now." : "Sign in"}
                                </button>
                            </div>
                        )}

                        {/* Back to login from forgot password */}
                        {isForgotPassword && (
                            <div className="text-gray-400 text-base">
                                Remember your password? 
                                <button 
                                    type="button"
                                    onClick={() => {
                                        setIsForgotPassword(false);
                                        setIsLogin(true);
                                        setEmail("");
                                    }} 
                                    className="text-white hover:underline font-medium ml-1"
                                    disabled={isLoading}
                                >
                                    Sign in
                                </button>
                            </div>
                        )}

                        {/* reCAPTCHA text */}
                        <div className="text-gray-500 text-xs mt-4">
                            <p>
                                This page is protected by Google reCAPTCHA to ensure you're not a bot.{" "}
                                <a href="#" className="text-blue-500 hover:underline">
                                    Learn more.
                                </a>
                            </p>
                        </div>

                        {/* API endpoint info - only show in development */}
                        {process.env.NODE_ENV === 'development' && isLogin && !isForgotPassword && (
                            <div className="mt-6 p-3 bg-blue-900 bg-opacity-30 border border-blue-600 rounded text-sm">
                                <p className="font-semibold text-blue-400 mb-1">API Endpoints:</p>
                                <p className="text-blue-200 text-xs">Login: POST {API_BASE_URL}/login</p>
                                <p className="text-blue-200 text-xs">Signup: POST {API_BASE_URL}/signup</p>
                                <p className="text-blue-200 text-xs">Forgot: POST {API_BASE_URL}/forgetPassword</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NetflixLogin
