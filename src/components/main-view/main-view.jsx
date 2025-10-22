/*  
 * src/components/main-view/main-view.jsx
 *
 * Main View file of the REEL movie API client
 *
 * (c) 2025 Dmitri Korotkov
 */

// --- Core Node.js modules (none used here) ---
// --- React and other Third-party libraries ---
import { useState, useEffect } from "react";
import { Col, Row, Pagination } from "react-bootstrap";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// --- Local application imports ---
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import { NavigationBar } from "../navigation-bar/navigation-bar";
import { Footer } from "../footer/footer";
import { ProfileView } from "../profile-view/profile-view";

// Main view component
export const MainView = () => {
    // --- State variables ---
    // Initialize user and token state from local storage if available
    const storedUser = null;
    const storedToken = null;
    try {
        storedUser = JSON.parse(localStorage.getItem("user"));
        storedToken = localStorage.getItem("token");
    } catch (e) {
        // Corrupted localStorage: clear and force login
        localStorage.clear();
    }
    // If no user or token in local storage, initialize as null
    const [user, setUser] = useState(storedUser ? storedUser : null);
    const [token, setToken] = useState(storedToken ? storedToken : null);
    
    const [movies, setMovies] = useState([]);                 // Movies state to hold the list of movies fetched from the API
    const [loading, setLoading] = useState(true);             // Movie loading state
    const [currentPage, setCurrentPage] = useState(1);        // Pagination state to hold the current page number (start on page 1)

    // Boolean constants for visibility
    const showFooter = user && (!loading || movies.length > 0); // Only show Footer when user is logged in and movie posters are on screen
    const showNavbar = !!user;                                  // Only show Navbar when user is logged in

    // Constants for pagination
    const itemsPerPage = 8;
    const totalPages = Math.ceil(movies.length / itemsPerPage);

    // Calculate which movies to display
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const moviesToShow = movies.slice(startIndex, endIndex);

    // --- Favorite Toggle Function ---
    const handleToggleFavorite = (movieId, isAdding) => {
        if (!token || !user || !user.username) return;

        // Use the short path /users/:username/:movieId
        const url = `https://reel-movie-api-608b8b4b3a04.herokuapp.com/users/${user.username}/${movieId}`;
        
        // Conditional method: PATCH for adding, DELETE for removing
        const method = isAdding ? "PATCH" : "DELETE";

        fetch(url, {
            method: method,
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            if (response.status === 401 || response.status === 403) {
                // Unauthorized: clear localStorage and force login
                localStorage.clear();
                setUser(null);
                setToken(null);
                setCurrentPage(1);
                alert("Session expired or unauthorized. Please log in again.");
                throw new Error("Unauthorized");
            }
            if (!response.ok) {
                throw new Error("Could not update favorites.");
            }
            // API returns the updated full user object (publicProfile)
            return response.json(); 
        })
        .then((updatedUser) => {
            // Update state and local storage with the full user object
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
        })
        .catch(error => {
            console.error("Favorite toggle error:", error);
            // Only alert if not already handled above
            if (error.message !== "Unauthorized") {
                alert("Failed to update favorites.");
            }
        });
    };

    // useEffect hook to fetch movie data from API when component mounts
    useEffect(() => {
        // Check if user is logged in, i.e., token is available
        if (!token) {
            setLoading(false);
            return;
        }

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
            {/* Render NavigationBar based on user login status */}
            {showNavbar && <NavigationBar user={user} onLoggedOut={() => {localStorage.clear(); setUser(null); setToken(null); setCurrentPage(1);}} />}

            {/* NEW CONTAINER: Takes up remaining vertical space (vh - Navbar height) and enables vertical centering */}
            <div className="vh-minus-navbar d-flex flex-column"> 

                {/* Content Row: flex-grow-1 makes it fill the space. align-items-center centers the content (the forms) vertically. */}
                <Row className="align-items-center flex-grow-1">
                    <Routes>
                        {/* SIGNUP ROUTE */}
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
                        {/* LOGIN ROUTE */}
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
                        {/* PROFILE ROUTE */}
                        <Route
                            path="/profile"
                            element={
                                <Col md={10} className="mx-auto">
                                    {!user ? ( 
                                        <Navigate to="/login" replace/> 
                                    ) : (
                                        <ProfileView 
                                            user={user}
                                            token={token} 
                                            movies={movies}
                                            onUserUpdate={(updatedUser) => {
                                                   // For sensitive changes (username/password) backend revokes token and frontend forces logout.
                                                   setUser(updatedUser);
                                                   localStorage.setItem("user", JSON.stringify(updatedUser));
                                               }}
                                            onLoggedOut={() => {
                                                setUser(null); 
                                                setToken(null); 
                                                localStorage.clear();
                                                setCurrentPage(1); 
                                            }}
                                            onToggleFavorite={handleToggleFavorite}
                                        />
                                    )}
                                </Col>
                            }
                        />
                        {/* MOVIE VIEW ROUTE */}
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
                                        <MovieView 
                                            movies={movies} 
                                            user={user} //
                                            onToggleFavorite={handleToggleFavorite}
                                        />
                                    </Col>
                                )}
                                </>
                            }
                        />
                        {/* MAIN VIEW ROUTE */}
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
                                                <MovieCard 
                                                    movie={movie}
                                                    onToggleFavorite={handleToggleFavorite}
                                                    // Check for favorite status using the API field: user.favorites
                                                    isFavorite={user.favorites && user.favorites.includes(movie._id)}
                                                    navState={{ from: "/" }}    // Pass the navState for the home page
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