import React, { useState } from 'react'
import { IoIosArrowDropdown } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux"
import { setUser } from '../redux/userSlice';
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { setToggle } from '../redux/movieSlice';

const Header = () => {
    const user = useSelector((store) => store.app.user);
    const toggle = useSelector(store => store.movie.toggle);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);

    const logoutHandler = () => {
        dispatch(setUser(null));
        toast.success("Logged out successfully");
        navigate("/");
    }

    const toggleHandler = () => {
        dispatch(setToggle());
    }

    return (
        <div className="absolute z-20 w-full">
            <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 bg-gradient-to-b from-black via-black/80 to-transparent">
                {/* Netflix Logo */}
                <div className="flex-shrink-0">
                    <img 
                        className="h-6 sm:h-8 lg:h-10 w-auto cursor-pointer" 
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1198px-Netflix_2015_logo.svg.png" 
                        alt="Netflix" 
                        onClick={() => user && navigate("/browse")}
                    />
                </div>

                {/* Navigation - Desktop */}
                {user && (
                    <div className="hidden lg:flex items-center space-x-8 text-white text-sm">
                        <span className="cursor-pointer hover:text-gray-300 transition-colors">Home</span>
                        <span className="cursor-pointer hover:text-gray-300 transition-colors">TV Shows</span>
                        <span className="cursor-pointer hover:text-gray-300 transition-colors">Movies</span>
                        <span className="cursor-pointer hover:text-gray-300 transition-colors">New & Popular</span>
                        <span className="cursor-pointer hover:text-gray-300 transition-colors">My List</span>
                    </div>
                )}

                {/* User Profile Section */}
                {user && (
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        {/* Search Toggle Button - Mobile */}
                        <button
                            onClick={toggleHandler}
                            className="lg:hidden bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                            {toggle ? "Home" : "Search"}
                        </button>

                        {/* Search Toggle Button - Desktop */}
                        <button
                            onClick={toggleHandler}
                            className="hidden lg:block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                        >
                            {toggle ? "Home" : "Search Movies"}
                        </button>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <div 
                                className="flex items-center space-x-2 cursor-pointer"
                                onClick={() => setShowDropdown(!showDropdown)}
                            >
                                {/* Profile Avatar */}
                                <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center text-white text-sm font-semibold">
                                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                                </div>
                                
                                {/* Username - Hidden on mobile */}
                                <span className="hidden sm:block text-white text-sm font-medium">
                                    {user.fullName}
                                </span>
                                
                                <IoIosArrowDropdown 
                                    size="20px" 
                                    color="white" 
                                    className={`transform transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                                />
                            </div>

                            {/* Dropdown Menu */}
                            {showDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-black bg-opacity-90 rounded-lg shadow-xl border border-gray-700 py-2">
                                    <div className="px-4 py-2 text-white text-sm border-b border-gray-700">
                                        <div className="font-semibold">{user.fullName}</div>
                                        <div className="text-gray-400 text-xs">{user.email}</div>
                                    </div>
                                    
                                    <div className="py-1">
                                        <button className="w-full text-left px-4 py-2 text-white text-sm hover:bg-gray-800 transition-colors">
                                            Manage Profiles
                                        </button>
                                        <button className="w-full text-left px-4 py-2 text-white text-sm hover:bg-gray-800 transition-colors">
                                            Account
                                        </button>
                                        <button className="w-full text-left px-4 py-2 text-white text-sm hover:bg-gray-800 transition-colors">
                                            Help Center
                                        </button>
                                        <hr className="border-gray-700 my-1" />
                                        <button 
                                            onClick={logoutHandler}
                                            className="w-full text-left px-4 py-2 text-white text-sm hover:bg-gray-800 transition-colors"
                                        >
                                            Sign out of Netflix
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Header