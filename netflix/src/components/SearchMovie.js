import React, { useState } from 'react';
import axios from "axios";
import { SEARCH_MOVIE_URL, options } from '../utils/constant';
import { useDispatch, useSelector } from "react-redux";
import { setSearchMovieDetails } from '../redux/searchSlice';
import { setLoading } from '../redux/userSlice';
import MovieList from './MovieList';
import { IoSearch, IoClose } from "react-icons/io5";

const SearchMovie = () => {
    const [searchMovie, setSearchMovie] = useState("");
    const dispatch = useDispatch();
    const isLoading = useSelector(store => store.app.isLoading);
    const { movieName, searchedMovie } = useSelector(store => store.searchMovie);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!searchMovie.trim()) return;

        dispatch(setLoading(true));
        try {
            const res = await axios.get(`${SEARCH_MOVIE_URL}${searchMovie}&include_adult=false&language=en-US&page=1`, options);
            const movies = res?.data?.results;
            dispatch(setSearchMovieDetails({ searchMovie, movies }));
        } catch (error) {
            console.log(error);
        } finally {
            dispatch(setLoading(false));
        }
    }

    const clearSearch = () => {
        setSearchMovie("");
        dispatch(setSearchMovieDetails({ searchMovie: "", movies: [] }));
    }

    return (
        <div className="min-h-screen bg-black pt-20 px-4 sm:px-6 lg:px-8">
            {/* Search Header */}
            <div className="max-w-4xl mx-auto mb-8">
                <form onSubmit={submitHandler} className="relative">
                    <div className="relative flex items-center">
                        <IoSearch className="absolute left-4 text-gray-400 text-xl z-10" />
                        <input
                            value={searchMovie}
                            onChange={(e) => setSearchMovie(e.target.value)}
                            className="w-full pl-12 pr-16 py-4 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-red-500 focus:outline-none text-lg placeholder-gray-400"
                            type="text"
                            placeholder="Search for movies, TV shows, and more..."
                        />
                        {searchMovie && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="absolute right-16 text-gray-400 hover:text-white transition-colors"
                            >
                                <IoClose size={24} />
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={isLoading || !searchMovie.trim()}
                            className="absolute right-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-md transition-colors"
                        >
                            {isLoading ? (
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span className="hidden sm:inline">Searching...</span>
                                </div>
                            ) : (
                                <span>Search</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Search Results */}
            <div className="max-w-7xl mx-auto">
                {searchedMovie && searchedMovie.length > 0 ? (
                    <div>
                        <MovieList 
                            title={`Results for "${movieName}"`} 
                            searchMovie={true} 
                            movies={searchedMovie}
                        />
                    </div>
                ) : searchedMovie && searchedMovie.length === 0 && movieName ? (
                    <div className="text-center py-16">
                        <div className="text-white text-2xl mb-4">No results found</div>
                        <div className="text-gray-400 text-lg mb-8">
                            We couldn't find any movies matching "{movieName}"
                        </div>
                        <div className="text-gray-500">
                            <p>Try different keywords or check your spelling</p>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="text-white text-2xl mb-4">Discover Movies</div>
                        <div className="text-gray-400 text-lg">
                            Search for your favorite movies and TV shows
                        </div>
                    </div>
                )}
            </div>

            {/* Popular Searches */}
            {!searchedMovie && (
                <div className="max-w-7xl mx-auto mt-12">
                    <h2 className="text-white text-xl sm:text-2xl font-semibold mb-6">Popular Searches</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Thriller', 'Adventure', 'Animation', 'Crime', 'Documentary', 'Fantasy', 'Sci-Fi'].map((genre) => (
                            <button
                                key={genre}
                                onClick={() => {
                                    setSearchMovie(genre);
                                    submitHandler({ preventDefault: () => {} });
                                }}
                                className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-3 rounded-lg transition-colors text-sm sm:text-base"
                            >
                                {genre}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default SearchMovie