import React, { useState } from 'react'
import { TMDB_IMG_URL } from '../utils/constant';
import { useDispatch } from "react-redux";
import { getId, setOpen } from '../redux/movieSlice';
import { IoPlay, IoAdd, IoThumbsUp } from "react-icons/io5";

const MovieCard = ({ posterPath, movieId, title, searchView = false }) => {
    const dispatch = useDispatch();
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    if (!posterPath && !imageError) return null;

    const handleOpen = () => {
        dispatch(getId(movieId));
        dispatch(setOpen(true));
    }

    const cardClasses = searchView 
        ? "group cursor-pointer transition-transform duration-300 hover:scale-105"
        : "flex-shrink-0 w-36 sm:w-44 lg:w-48 group cursor-pointer transition-transform duration-300 hover:scale-105 hover:z-10";

    return (
        <div className={cardClasses} onClick={handleOpen}>
            <div className="relative overflow-hidden rounded-lg shadow-lg">
                {/* Movie Poster */}
                {!imageError ? (
                    <img 
                        src={`${TMDB_IMG_URL}${posterPath}`} 
                        alt={title || "Movie poster"}
                        className={`w-full h-auto transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={() => setImageLoaded(true)}
                        onError={() => setImageError(true)}
                    />
                ) : (
                    // Fallback for missing images
                    <div className="w-full aspect-[2/3] bg-gray-800 flex items-center justify-center">
                        <div className="text-gray-400 text-center p-4">
                            <div className="text-2xl mb-2">🎬</div>
                            <div className="text-sm font-medium">{title || "No Image"}</div>
                        </div>
                    </div>
                )}
                
                {/* Loading placeholder */}
                {!imageLoaded && !imageError && (
                    <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center">
                        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex space-x-3">
                        <button 
                            className="p-2 bg-white rounded-full hover:bg-gray-200 transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleOpen();
                            }}
                        >
                            <IoPlay className="text-black text-lg" />
                        </button>
                        <button 
                            className="p-2 bg-gray-800 bg-opacity-80 rounded-full hover:bg-gray-700 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <IoAdd className="text-white text-lg" />
                        </button>
                        <button 
                            className="p-2 bg-gray-800 bg-opacity-80 rounded-full hover:bg-gray-700 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <IoThumbsUp className="text-white text-lg" />
                        </button>
                    </div>
                </div>

                {/* Movie Title - Show on hover for browse view */}
                {!searchView && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <h3 className="text-white text-sm font-semibold truncate">{title}</h3>
                    </div>
                )}
            </div>

            {/* Movie Title - Always visible for search view */}
            {searchView && title && (
                <div className="mt-2 px-1">
                    <h3 className="text-white text-sm font-medium line-clamp-2 leading-tight">
                        {title}
                    </h3>
                </div>
            )}
        </div>
    )
}

export default MovieCard;