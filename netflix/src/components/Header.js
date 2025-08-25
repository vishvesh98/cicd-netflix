import React from 'react'
import { useSelector, useDispatch } from "react-redux"
import { setToggle } from '../redux/movieSlice'

const Header = () => {
    const user = useSelector(store => store.app.user)
    console.log("user is ",user);
    
    const toggle = useSelector(store => store.movie.toggle)
    const dispatch = useDispatch()

    const toggleHandler = () => {
        dispatch(setToggle())
    }

    return (
        <div className='absolute w-full px-6 py-4 bg-gradient-to-b from-black via-black/50 to-transparent z-20 flex items-center justify-between'>
            <div className="flex items-center space-x-8">
                {/* Netflix Logo */}
                <div className="text-red-600 text-2xl font-black tracking-tight">
                    NETFLIX
                </div>
                
                {/* Navigation */}
                <nav className="hidden md:flex items-center space-x-6 text-white text-sm">
                    <a href="/browse" className="hover:text-gray-300 transition-colors">Home</a>
                    <a href="#" className="hover:text-gray-300 transition-colors">TV Shows</a>
                    <a href="#" className="hover:text-gray-300 transition-colors">Movies</a>
                    <a href="#" className="hover:text-gray-300 transition-colors">New & Popular</a>
                    <a href="#" className="hover:text-gray-300 transition-colors">My List</a>
                    <a href="#" className="hover:text-gray-300 transition-colors">Browse by Languages</a>
                </nav>
            </div>

            <div className="flex items-center space-x-4">
                {/* Search Button */}
                <button 
                    onClick={toggleHandler}
                    className="text-white hover:text-gray-300 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>

                {/* User Profile */}
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                            {user?.email?.charAt(0) || 'Uhello'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Header