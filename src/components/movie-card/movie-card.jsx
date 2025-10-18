/*  src/components/movie-card/movie-card.jsx
 * Movie card component
 *
 * (c) 2025 Dmitri Korotkov
 */

// --- Core Node.js modules (none used here) ---
// --- React and other Third-party libraries ---
import PropTypes from "prop-types";
import { Button, Card } from "react-bootstrap";
import { Heart, HeartFill } from "react-bootstrap-icons";
import { Link } from "react-router-dom";

// --- Local application imports (none required) ---

// Movie card component
export const MovieCard = ({ movie, onToggleFavorite, isFavorite }) => {
    const { title, description, image_url, genre } = movie;
    return (
        <Card className="h-100">

            {/* FAVORITE button - conditional button overlay */}
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

            <Card.Img className="card-img-fixed-height" variant="top" src={image_url} alt={`${title} poster`} />
            <Card.Body className="card-body-compact">
                <Card.Title>{title}</Card.Title>
                <Card.Text className="description-clamp">{description}</Card.Text>
                <Card.Text className="text-end">{genre.name}</Card.Text>
                <Link to={`/movies/${encodeURIComponent(movie._id)}`}>
                    <Button variant="link">Open</Button>
                </Link>
            </Card.Body>
        </Card>
    );
};

// Prop types validation
MovieCard.propTypes = {
    movie: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        release_year: PropTypes.string,
        image_url: PropTypes.string.isRequired,
        rating_imdb: PropTypes.string,
        featured: PropTypes.bool,
        starring: PropTypes.arrayOf(PropTypes.string),
        director: PropTypes.shape({
            name: PropTypes.string,
            bio: PropTypes.string,
            birth_date: PropTypes.string,
            death_date: PropTypes.string
        }).isRequired,
        genre: PropTypes.shape({
            name: PropTypes.string.isRequired,
            description: PropTypes.string
        }).isRequired,
    }).isRequired,
    onToggleFavorite: PropTypes.func,
    isFavorite: PropTypes.bool,
    // onMovieClick: PropTypes.func.isRequired  // If I decide to click on card instead of link
}; 