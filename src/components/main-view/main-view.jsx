/*  
 * src/components/main-view/main-view.jsx
 * Main View file of the REEL movie API client
 *
 * (c) 2025 Dmitri Korotkov
 */

// --- Core Node.js modules (none used here) ---
// --- React and other Third-party libraries ---
import { useState, useEffect } from "react";
// --- React Bootstrap components ---
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Pagination from "react-bootstrap/Pagination";

// --- Local application imports ---
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { SignupView } from "../signup-view/signup-view";
import { LoginView } from "../login-view/login-view";
import { Footer } from "../footer/footer";

// Main view component
export const MainView = () => {
    // --- State variables ---
    // Initialize user and token state from local storage if available
    const storedUser = JSON.parse(localStorage.getItem("username"));
    const storedToken = localStorage.getItem("token");
    // If no user or token in local storage, initialize as null
    const [user, setUser] = useState(storedUser ? storedUser : null);
    const [token, setToken] = useState(storedToken ? storedToken : null);
    // Movies state to hold array of movie objects fetched from API
    const [movies, setMovies] = useState([]);
    // Selected movie state to hold the currently selected movie object
    const [selectedMovie, setSelectedMovie] = useState(null);
    // Pagination state to hold the current page number
    const [currentPage, setCurrentPage] = useState(1); // Start on page 1

    // Boolean constant for Footer visibility - only show Footer when user is logged in and movie posters are on screen
    const showFooter = user && (selectedMovie || movies.length > 0);

    // Constants for pagination
    const cardsPerPage = 8;
    const totalPages = Math.ceil(movies.length / cardsPerPage);

    // Calculate which movies to display
    const startIndex = (currentPage - 1) * cardsPerPage;
    const endIndex = startIndex + cardsPerPage;
    const moviesToShow = movies.slice(startIndex, endIndex);

    // useEffect hook to fetch movie data from API when component mounts
    useEffect(() => {
        // Check if user is logged in, i.e., token is available
        if (!token) return;
        
        // Fetch movie data from API or other source
        fetch('https://reel-movie-api-608b8b4b3a04.herokuapp.com/movies', {
            headers: { Authorization: `Bearer ${token}` },
        })
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
    }, [token]);

    // Render logic
    return (
        <>
            <Row> 
                {!user ? (                                  // Check if user is logged in
                    <Col md={5} className="mx-auto">
                        <LoginView 
                            onLoggedIn={(user, token) => { 
                                setUser(user);
                                setToken(token);
                            }} />
                        or
                        <SignupView/>
                    </Col>
                    ) : selectedMovie ? (
                    <>
                        <Col md={8} className="mx-auto">    
                            <MovieView                  // Movie view (rendered when a movie has been selected)
                                movie={selectedMovie} 
                                onBackClick={() => setSelectedMovie(null)}
                            />
                        </Col>
                        {/* Logout button for the Movie view */}
                        <Col xs={3} className="mb-4">
                            <Button onClick={() => {setUser(null); setToken(null); localStorage.clear();}} variant="primary">Logout</Button>
                        </Col>
                    </>
                    ) : (movies.length === 0) ? (   // Check if movies array is empty
                        <div>The movie list is empty!</div>
                    ) : (
                    <>
                        {moviesToShow.map((movie) => (                        // Main view (rendered when no movie has been selected)
                            <Col className="mb-5" key={movie._id} md={3}>
                                <MovieCard
                                    movie={movie}                             // Pass complete movie data to MovieCard component
                                    onMovieClick={(newSelectedMovie) => {     // Update selected movie state in MainView with data from MovieCard
                                        setSelectedMovie(newSelectedMovie);
                                    }}
                                />
                            </Col>
                        ))}
                        {/* Pagination component */}
                        {totalPages > 1 && (
                            <Row className="justify-content-center mt-4">
                                <Pagination className="justify-content-center">
                                    {/* Generate page numbers */}
                                    {[...Array(totalPages)].map((_, index) => (
                                        <Pagination.Item 
                                            key={index + 1} 
                                            active={index + 1 === currentPage}
                                            onClick={() => setCurrentPage(index + 1)}
                                        >
                                            {index + 1}
                                        </Pagination.Item>
                                    ))}
                                </Pagination>
                            </Row>
                        )}
                    </>
                )}
            </Row>
            {/* Render Footer based on user login status and movie poster visibility */}
            {showFooter && <Footer />}
        </>
    );
};