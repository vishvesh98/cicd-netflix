import React from 'react'

const VideoTitle = ({ title, overview, movieId, onPlayTrailer }) => {
    const handlePlayClick = () => {
        if (onPlayTrailer) {
            onPlayTrailer(movieId)
        }
    }

    return (
        <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center px-6 md:px-12 bg-gradient-to-r from-black via-black/70 to-transparent">
            <div className="max-w-lg md:max-w-xl lg:max-w-2xl">
                {/* Netflix Series Badge */}
                <div className="flex items-center mb-4">
                    <div className="text-red-600 text-xl font-black mr-2">N</div>
                    <span className="text-white text-sm font-medium tracking-wider">SERIES</span>
                </div>

                {/* Title */}
                <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                    {title}
                </h1>

                {/* Ranking Badge */}
                <div className="flex items-center mb-4">
                    <div className="bg-red-600 text-white px-2 py-1 rounded text-sm font-bold mr-2">
                        #1
                    </div>
                    <span className="text-white text-sm">in TV Shows Today</span>
                </div>

                {/* Overview */}
                <p className="text-white text-base md:text-lg mb-8 leading-relaxed opacity-90">
                    {overview?.substring(0, 150)}...
                </p>

                {/* Action Buttons */}
                <div className="flex items-center space-x-4">
                    <button 
                        onClick={handlePlayClick}
                        className="bg-white text-black px-8 py-3 rounded flex items-center space-x-2 font-semibold hover:bg-gray-200 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                        <span>Play</span>
                    </button>
                    
                    <button className="bg-gray-600 bg-opacity-70 text-white px-8 py-3 rounded flex items-center space-x-2 font-semibold hover:bg-opacity-60 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>More Info</span>
                    </button>
                </div>
            </div>
        </div>
    )
}
export default VideoTitle