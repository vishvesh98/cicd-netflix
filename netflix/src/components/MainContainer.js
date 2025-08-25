import React from 'react'
import VideoTitle from './VideoTitle'
import VideoBackground from './VideoBackground'
import { useSelector } from "react-redux"

const MainContainer = ({ onPlayTrailer }) => {
    const movie = useSelector(store => store.movie?.nowPlayingMovies)
    
    if (!movie) return null
    console.log("movie in main container", movie)
    // Assuming movie is an array and we want to display the first movie's details
    // If movie is an object, you can directly access its properties
    // If movie is an array, you might want to handle it differently based on your requirements

    
    const { overview, id, title } = movie[4] || movie[0]
    
    return (
        <div className="relative">
            <VideoBackground movieId={id}/>
            <VideoTitle 
                title={title} 
                overview={overview} 
                movieId={id}
                // onPlayTrailer={onPlayTrailer}
            />
        </div>
    )
}
export default MainContainer