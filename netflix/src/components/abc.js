import React, { useState } from 'react'
import Header from './Header';
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from '../redux/userSlice';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const isLoading = useSelector(store => store.app.isLoading);

    const loginHandler = () => {
        setIsLogin(!isLogin);
    }

    const getInputData = async (e) => {
        e.preventDefault();
        dispatch(setLoading(true));

        // Simulate loading
        setTimeout(() => {
            if (isLogin) {
                // Mock login validation
                if (email === "abc@gmail.com" && password === "123456") {
                    const user = {
                        fullName: "John Doe",
                        email: email,
                        id: "user123"
                    };
                    dispatch(setUser(user));
                    toast.success("Login successful!");
                    navigate("/browse");
                } else {
                    toast.error("Invalid credentials! Use abc@gmail.com / 123456");
                }
            } else {
                // Mock registration
                if (fullName && email && password) {
                    toast.success("Registration successful! Please login.");
                    setIsLogin(true);
                } else {
                    toast.error("Please fill all fields");
                }
            }
            dispatch(setLoading(false));
        }, 1000);

        setFullName("");
        setEmail("");
        setPassword("");
    }

    return (
        <div className="min-h-screen">
            <Header />
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img 
                    className="w-full h-full object-cover"
                    src="https://assets.nflxext.com/ffe/siteui/vlv3/dc1cf82d-97c9-409f-b7c8-6ac1718946d6/14a8fe85-b6f4-4c06-8eaf-eccf3276d557/IN-en-20230911-popsignuptwoweeks-perspective_alpha_website_medium.jpg" 
                    alt="Netflix Background" 
                />
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            </div>

            {/* Login Form */}
            <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
                <form 
                    onSubmit={getInputData} 
                    className="w-full max-w-md bg-black bg-opacity-75 p-8 sm:p-12 rounded-lg shadow-2xl"
                >
                    <h1 className="text-3xl sm:text-4xl text-white mb-8 font-bold text-center">
                        {isLogin ? "Sign In" : "Sign Up"}
                    </h1>
                    
                    <div className="space-y-4">
                        {!isLogin && (
                            <input 
                                value={fullName} 
                                onChange={(e) => setFullName(e.target.value)} 
                                type="text" 
                                placeholder="Full Name" 
                                className="w-full p-4 rounded bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:border-red-500 focus:outline-none transition-colors"
                                required
                            />
                        )}
                        
                        <input 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            type="email" 
                            placeholder="Email or phone number" 
                            className="w-full p-4 rounded bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:border-red-500 focus:outline-none transition-colors"
                            required
                        />
                        
                        <input 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            type="password" 
                            placeholder="Password" 
                            className="w-full p-4 rounded bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:border-red-500 focus:outline-none transition-colors"
                            required
                        />
                        
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full bg-red-600 hover:bg-red-700 text-white p-4 rounded font-semibold text-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Loading..." : (isLogin ? "Sign In" : "Sign Up")}
                        </button>
                    </div>

                    {/* Demo Credentials */}
                    {isLogin && (
                        <div className="mt-4 p-3 bg-gray-800 rounded text-sm text-gray-300">
                            <p className="font-semibold text-yellow-400 mb-1">Demo Credentials:</p>
                            <p>Email: abc@gmail.com</p>
                            <p>Password: 123456</p>
                        </div>
                    )}

                    <div className="mt-6 text-center">
                        <p className="text-gray-400">
                            {isLogin ? "New to Netflix?" : "Already have an account?"}{" "}
                            <span 
                                onClick={loginHandler} 
                                className="text-red-500 hover:text-red-400 cursor-pointer font-semibold transition-colors"
                            >
                                {isLogin ? "Sign up now" : "Sign in"}
                            </span>
                        </p>
                    </div>

                    <div className="mt-4 text-xs text-gray-500 text-center">
                        <p>This page is protected by Google reCAPTCHA to ensure you're not a bot.</p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login