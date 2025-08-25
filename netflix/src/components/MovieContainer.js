import React from 'react'
import MovieList from './MovieList'
import { useSelector } from "react-redux"

const MovieContainer = ({ onPlayTrailer }) => {
    const movie = useSelector(store => store.movie)
    console.log(movie);
    
    
    return (
        <div className='bg-black relative z-10 -mt-32 pt-32'>
            <div className="space-y-8 pb-12">
                <MovieList 
                    title={"Popular on Netflix"} 
                    movies={movie.popularMovie}
                    onPlayTrailer={onPlayTrailer}
                />
                <MovieList 
                    title={"Now Playing Movies"} 
                    movies={movie.nowPlayingMovies}
                    onPlayTrailer={onPlayTrailer}
                />
                <MovieList 
                    title={"Top Rated Movies"} 
                    movies={movie.topRatedMovies}
                    onPlayTrailer={onPlayTrailer}
                />
                <MovieList 
                    title={"Upcoming Movies"} 
                    movies={movie.upcomingMovies}
                    onPlayTrailer={onPlayTrailer}
                />
            </div>
        </div>
    )
}
export default MovieContainer