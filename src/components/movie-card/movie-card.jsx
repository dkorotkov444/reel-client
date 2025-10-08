/*  src/components/movie-card/movie-card.jsx
 * Movie card component
 *
 * (c) 2025 Dmitri Korotkov
 */

// --- Core Node.js modules (none used here) ---
// --- React and other Third-party libraries (none used here) ---
import PropTypes from "prop-types";
// --- Local application imports (none required) ---

// Movie card component
export const MovieCard = ({ movie, onMovieClick }) => {
    const { title, description, image_url, genre } = movie;
    return (
        <div
            onClick={() => {
                onMovieClick(movie);  // Call onMovieClick prop function passed from MainView, passing movie data back up
            }}
        >
            {title} {genre.name} {description} {image_url}
        </div>
    );
};

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