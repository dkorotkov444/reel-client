/*  src/components/main-view/main-view.jsx
 * Main View file of the REEL movie API client
 *
 * (c) 2025 Dmitri Korotkov
 */

// --- Core Node.js modules (none used here) ---A

// --- React and other Third-party libraries ---
import { useState, useEffect } from "react";

// --- Local application imports ---
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";

// Main view component
export const MainView = () => {
    // State to hold list of movies (initially hardcoded sample data)
    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    
    // useEffect hook to fetch movie data from API when component mounts
    useEffect(() => {
        // Fetch movie data from API or other source
        fetch('https://reel-movie-api-608b8b4b3a04.herokuapp.com/movies')
            .then((response) => response.json())
            .then((data) => {
                const moviesFromApi = data.map((doc) => {
                    return {
                        _id: doc._id,
                        title: doc.title,
                        description: doc.description,
                        release_year: doc.release_year,
                        image_url: doc.image_url,
                        rating_imdb: doc.rating_imdb,
                        featured: doc.featured,
                        starring: doc.starring,
                        director: {
                            name: doc.director.name,
                            bio: doc.director.bio,
                            birth_date: doc.director.birth_date,
                            death_date: doc.director.death_date
                        },
                        genre: {
                            name: doc.genre.name,
                            description: doc.genre.description
                        }
                    };
                });
                setMovies(moviesFromApi);
            })
            .catch((error) => {
                console.error('Error fetching movies:', error);
            });
    }, []);

    // Check if movies array is empty
    if (movies.length === 0) {
        return <div>The movie list is empty!</div>;
    }

    // Movie view (rendered when a movie has been selected)
    if (selectedMovie) {
        return <MovieView movie={selectedMovie} onBackClick={() => setSelectedMovie(null)}/>;
    }

    // Main view (rendered when no movie has been selected)
    return (
        <div>
        {movies.map((movie) => (
            <MovieCard
            key={movie._id}     // Added key prop here. movie._id is unique identifier (until API is connected)
            movie={movie}       // Pass complete movie data to MovieCard component
            onMovieClick={(newSelectedMovie) => {       // Update selected movie state in MainView with data from MovieCard
                setSelectedMovie(newSelectedMovie);
            }}
            />
        ))}
        </div>
    );
};