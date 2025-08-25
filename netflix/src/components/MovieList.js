import React from 'react'
import MovieCard from './MovieCard'

const MovieList = ({ title, movies, searchMovie = false, onPlayTrailer }) => {
    if (!movies || movies.length === 0) return null

    return (
        <div className="mb-8 px-6">
            <h2 className="text-white text-xl md:text-2xl font-semibold mb-4">
                {title}
            </h2>

            {searchMovie ? (
               
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {movies.map((movie) => (
                        <MovieCard
                            key={movie.id}
                            movieId={movie.id}
                            posterPath={movie.poster_path}
                            title={movie.title}
                            searchView={true}
                            onPlayTrailer={onPlayTrailer}
                        />
                    ))}
                </div>
            ) : (
                // Horizontal scroll layout for browsing
                <div className="relative overflow-hidden">
                    <div className="flex overflow-x-auto space-x-4 scrollbar-hide pb-2 scroll-smooth">
                        {movies.map((movie) => (
                            <MovieCard
                                key={movie.id}
                                movieId={movie.id}
                                posterPath={movie.poster_path}
                                title={movie.title}
                                searchView={false}
                                onPlayTrailer={onPlayTrailer}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default MovieList
