/*  src/components/movie-card/movie-card.jsx
 * Movie card component
 *
 * (c) 2025 Dmitri Korotkov
 */

// --- Core Node.js modules (none used here) ---
// --- React and other Third-party libraries ---
import PropTypes from "prop-types";
import { Button, Card } from "react-bootstrap";
// --- Local application imports (none required) ---

// Movie card component
export const MovieCard = ({ movie, onMovieClick }) => {
    const { title, description, image_url, genre } = movie;
    return (
        <Card onClick={() => onMovieClick(movie)} variant="link">
            <Card.Img variant="top" src={image_url} alt={`${title} poster`} />
            <Card.Body>
                <Card.Title>{title}</Card.Title>
                <Card.Text>{description}</Card.Text>
                <Card.Text>{genre.name}</Card.Text>
            </Card.Body>
        </Card>
    );
};

// Prop types validation
MovieCard.propTypes = {
    movie: PropTypes.shape({
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
    onMovieClick: PropTypes.func.isRequired
}; 