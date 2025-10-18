/*  src/components/movie-view/movie-view.jsx
 * Movie detail view component
 *
 * (c) 2025 Dmitri Korotkov
 */

// --- Core Node.js modules (none used here) ---
// --- React and other Third-party libraries ---
import PropTypes from "prop-types";
import { Button, Card, CardImg } from "react-bootstrap";
import { Heart, HeartFill } from "react-bootstrap-icons";
import { useParams } from "react-router";
import { Link } from "react-router-dom";

// --- Local application imports (none required) ---

// Movie view component
export const MovieView = ({ movies, user, onToggleFavorite }) => {
    const { movieId } = useParams();
    const movie = movies.find(m => m._id === movieId);
    // Determine favorite status
    const isFavorite = user.favorites && user.favorites.includes(movie._id);

    return (
    <>
        <Card>

            {/* FAVORITE button -  conditional button overlay */}
            {onToggleFavorite && (
                <Button 
                    variant="link" 
                    // Call handler, passing the movie ID and the action (true for adding, false for removing)
                    onClick={() => onToggleFavorite(movie._id, !isFavorite)}
                    style={{ 
                        position: 'absolute', 
                        top: '10px', 
                        right: '10px', 
                        zIndex: 1, 
                        fontSize: '1.75rem', 
                        padding: 0, 
                        lineHeight: 1 
                    }}
                    className="text-danger bg-light rounded-circle border border-secondary" 
                >
                    {/* Conditional Icon Rendering */}
                    {isFavorite ? <HeartFill /> : <Heart />}
                </Button>
            )}

            <CardImg src={movie.image_url} className="w-50 mx-auto d-block" alt={`${movie.title} poster`} />
            <Card.Body>
                <Card.Title>{movie.title}</Card.Title>
                <Card.Text>Plot: {movie.description}</Card.Text>
                <Card.Text>Director: {movie.director.name}</Card.Text>
                <Card.Text>Genre: {movie.genre.name}</Card.Text>
                <Card.Text>Release year: {movie.release_year}</Card.Text>
            </Card.Body>
        </Card>

        <Link to={"/"}>
            <Button variant="back-button">Back</Button>
        </Link>
    </>
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
            release_year: PropTypes.string.isRequired,
            image_url: PropTypes.string.isRequired,
            rating_imdb: PropTypes.string,
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