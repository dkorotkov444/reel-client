/*  
 * src/components/movie-view/movie-view.jsx
 *
 * Movie detail view component
 *
 * (c) 2025 Dmitri Korotkov
 */

// --- Core Node.js modules (none used here) ---
// --- React and other Third-party libraries ---
import PropTypes from "prop-types";
import { Button, Card, CardImg, Carousel, Row, Col } from "react-bootstrap";
import { Heart, HeartFill } from "react-bootstrap-icons";
import { useParams, useLocation, Link } from "react-router-dom";

// --- Local application imports (none required) ---
import { MovieCard } from "../movie-card/movie-card";

// Movie view component
export const MovieView = ({ movies, user, onToggleFavorite }) => {
    const { movieId } = useParams();
    const location = useLocation();
    const backPath = location.state?.from || "/";

    const movie = movies.find(m => m._id === movieId);

    // Guard when movie isn't found
    if (!movie) {
        return (
            <div>
                <p>Movie not found.</p>
                <Button as={Link} to={backPath} variant="secondary">Back</Button>
            </div>
        );
    }

    // Determine favorite status
    const isFavorite = user.favorites && user.favorites.includes(movie._id);

    // Similar movies by genre (robust, case-insensitive match)
    const currentGenreName = movie.genre && movie.genre.name ? String(movie.genre.name).trim().toLowerCase() : null;
    const similarMovies = currentGenreName
        ? movies.filter(m => {
            if (!m.genre || !m.genre.name) return false;
            if (m._id === movie._id) return false;
            return String(m.genre.name).trim().toLowerCase() === currentGenreName;
        })
        : [];

    // Helper to chunk an array into slides
    const chunkArray = (arr, size) => {
        const chunked = [];
        for (let i = 0; i < arr.length; i += size) chunked.push(arr.slice(i, i + size));
        return chunked;
    };

    const moviesPerSlide = 4;
    const similarSlides = chunkArray(similarMovies, moviesPerSlide);

    return (
        <div>
            {/* Upper half: details (left) + poster (right) */}
            <div style={{ height: '50vh' }} className="mb-4">
                <Card className="h-100">
                    {/* Favorite button overlay */}
                    {onToggleFavorite && (
                        <Button
                            variant="link"
                            onClick={() => onToggleFavorite(movie._id, !isFavorite)}
                            aria-pressed={isFavorite}
                            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                            className="text-danger bg-light rounded-circle"
                            style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 2, fontSize: '1.75rem', padding: 0, lineHeight: 1 }}
                        >
                            {isFavorite ? <HeartFill /> : <Heart />}
                        </Button>
                    )}

                    <Row className="g-0 h-100 align-items-center">
                        {/* Left upper quarter: text */}
                        <Col md={6} className="p-4 pe-md-5">
                            <Card.Body className="p-0 h-100 d-flex flex-column">
                                <div>
                                    <Card.Title className="mb-2">{movie.title}</Card.Title>
                                </div>

                                <div className="d-flex justify-content-between mb-2">
                                    <div className="text-start"><strong>Director:</strong> {movie.director?.name}</div>
                                    <div className="text-end"><strong>Genre:</strong> {movie.genre?.name}</div>
                                </div>

                                <div className="mb-2"><Card.Text>{movie.description}</Card.Text></div>

                                <div>
                                    <Card.Text className="mb-1"><strong>Release year:</strong> {movie.release_year}</Card.Text>
                                    <Card.Text className="mb-0"><strong>IMDb Rating:</strong> {movie.rating_imdb ?? 'N/A'}</Card.Text>
                                </div>

                                {/* Back button was here; moved back below the card */}
                            </Card.Body>
                        </Col>

                        {/* Right upper quarter: poster (centered) */}
                        <Col md={6} className="d-flex align-items-center justify-content-center p-3 ps-md-5">
                            <CardImg src={movie.image_url} alt={`${movie.title} poster`} className="img-fluid" style={{ maxHeight: '40vh', objectFit: 'contain' }} />
                        </Col>
                    </Row>
                </Card>
            </div>

            {/* Lower half: similar movies carousel */}
            <div style={{ height: '50vh' }}>
                <h5>Similar movies</h5>
                {similarMovies.length === 0 ? (
                    <p>No similar movies found.</p>
                ) : (
                    <Carousel interval={null} indicators={true} className="favorites-carousel carousel-dark">
                        {similarSlides.map((slide, idx) => (
                            <Carousel.Item key={idx}>
                                <Row className="g-4 justify-content-center py-4">
                                    {slide.map(sm => (
                                        <Col key={sm._id} lg={3} md={4} sm={6} className="mb-4">
                                            <MovieCard
                                                movie={sm}
                                                onToggleFavorite={onToggleFavorite}
                                                isFavorite={user.favorites && user.favorites.includes(sm._id)}
                                                navState={{ from: location.pathname }}
                                            />
                                        </Col>
                                    ))}
                                </Row>
                            </Carousel.Item>
                        ))}
                    </Carousel>
                )}
            </div>
        </div>
    );
};

// Prop types validation
MovieView.propTypes = {
    // Array of movies is required to find the specific movie and similar movies
    movies: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            release_year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            image_url: PropTypes.string.isRequired,
            rating_imdb: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            featured: PropTypes.bool,
            starring: PropTypes.arrayOf(PropTypes.string),
            director: PropTypes.shape({
                name: PropTypes.string.isRequired,
                bio: PropTypes.string,
                birth_date: PropTypes.string,
                death_date: PropTypes.string
            }).isRequired,
            genre: PropTypes.shape({
                name: PropTypes.string.isRequired,
                description: PropTypes.string
            }).isRequired,
        })
    ).isRequired,
    // The user object is required since MovieView is behind the login wall
    user: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        birth_date: PropTypes.string,
        favorites: PropTypes.arrayOf(PropTypes.string), // array of movie IDs
    }).isRequired,
    // The handler is required for favorites functionality
    onToggleFavorite: PropTypes.func.isRequired
    // onBackClick: PropTypes.func.isRequired
}; 