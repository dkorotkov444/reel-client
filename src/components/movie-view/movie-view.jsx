/*  src/components/movie-view/movie-view.jsx
 * Movie detail view component
 *
 * (c) 2025 Dmitri Korotkov
 */

// --- Core Node.js modules (none used here) ---
// --- React and other Third-party libraries (none used here) ---
import PropTypes from "prop-types";
import { Card, CardImg } from "react-bootstrap";
// --- React Bootstrap components ---
import Button from "react-bootstrap/Button";
// --- Local application imports (none required) ---

// Movie view component
export const MovieView = ({ movie, onBackClick }) => {
    return (
    <>
        <Card>
            <CardImg src={movie.image_url} className="w-75 mx-auto d-block" alt={`${movie.title} poster`} />
            <Card.Body>
                <Card.Title>{movie.title}</Card.Title>
                <Card.Text>Plot: {movie.description}</Card.Text>
                <Card.Text>Director: {movie.director.name}</Card.Text>
                <Card.Text>Genre: {movie.genre.name}</Card.Text>
                <Card.Text>Release year: {movie.release_year}</Card.Text>
            </Card.Body>
        </Card>
        <Button variant="primary" onClick={onBackClick}>Back</Button>
    </>
    );
  };

// Prop types validation
MovieView.propTypes = {
    movie: PropTypes.shape({
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
    }).isRequired,
    onBackClick: PropTypes.func.isRequired
}; 