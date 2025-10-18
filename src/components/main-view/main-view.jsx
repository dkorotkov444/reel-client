/*  
 * src/components/main-view/main-view.jsx
 * Main View file of the REEL movie API client
 *
 * (c) 2025 Dmitri Korotkov
 */

// --- Core Node.js modules (none used here) ---
// --- React and other Third-party libraries ---
import { useState, useEffect } from "react";
import { Col, Row, Pagination } from "react-bootstrap";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

// --- Local application imports ---
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import { NavigationBar } from "../navigation-bar/navigation-bar";
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
    
    const [movies, setMovies] = useState([]);                 // Movies state to hold the list of movies fetched from the API
    const [loading, setLoading] = useState(true);             // Movie loading state
    const [currentPage, setCurrentPage] = useState(1);        // Pagination state to hold the current page number (start on page 1)

    // Boolean constant for Footer visibility - only show Footer when user is logged in and movie posters are on screen
    const showFooter = user && (!loading || movies.length > 0);

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

        // Set loading state to true before fetching
        setLoading(true);

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
                setLoading(false); // Set loading state to false after data is fetched
            })
            .catch((error) => {
                console.error('Error fetching movies:', error);
                setLoading(false); // Set loading state to false in case of error
            });
    }, [token]);

    // Render logic
    return (
        <BrowserRouter>
            <NavigationBar user={user} onLoggedOut={() => {setUser(null); setToken(null); localStorage.clear();}} />

            {/* NEW CONTAINER: Takes up remaining vertical space (vh - Navbar height) and enables vertical centering */}
            <div className="vh-minus-navbar d-flex flex-column"> 

                {/* Content Row: flex-grow-1 makes it fill the space. align-items-center centers the content (the forms) vertically. */}
                <Row className="align-items-center flex-grow-1">
                    <Routes>
                        <Route
                            path="/signup"
                            element={
                                <>
                                {user ? ( 
                                    <Navigate to="/" /> 
                                ) : (   
                                    <Col md={5} className="mx-auto">
                                        <SignupView/>
                                    </Col>
                                )}
                                </>
                            }
                        />
                        <Route
                            path="/login"
                            element={
                                <>
                                {user ? ( 
                                    <Navigate to="/" /> 
                                ) : (   
                                    <Col md={5} className="mx-auto">
                                        <LoginView onLoggedIn={(user, token) => { setUser(user); setToken(token); }} />
                                    </Col>
                                )}
                                </>
                            }
                        />
                        <Route
                            path="/movies/:movieId"
                            element={
                                <>
                                {!user ? ( 
                                    <Navigate to="/login" replace/> 
                                ) : loading ? (     // If loading state is true, show loading message
                                    <Col>Loading movies...</Col>
                                ) : (movies.length === 0) ? (   // If not loading, check if movies array is empty
                                    <Col>The movie list is empty!</Col>
                                ) : (
                                    <Col md={8} className="mx-auto">
                                        {/* Movie view (rendered when a movie has been selected) */}
                                        <MovieView movies={movies}   />
                                    </Col>
                                )}
                                </>
                            }
                        />
                        <Route
                            path="/"
                            element={
                                <>
                                {!user ? ( 
                                    <Navigate to="/login" replace/> 
                                ) : loading ? (     // If loading state is true, show loading message
                                    <Col>Loading movies...</Col>
                                ) : (movies.length === 0) ? (   // If not loading, check if movies array is empty
                                    <Col>The movie list is empty!</Col>
                                ) : (
                                    <>
                                        {/* Main view - movie cards (rendered when no movie selected) */}
                                        {moviesToShow.map((movie) => (                        
                                            <Col className="mb-5" key={movie._id} md={3}>
                                                {/* Pass complete movie data to MovieCard component */}
                                                <MovieCard movie={movie} />
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
                                </>
                            }
                        />
                    </Routes>
                </Row>
            </div>

            {/* Render Footer based on user login status and movie poster visibility */}
            {showFooter && <Footer />}

        </BrowserRouter>
    );
};