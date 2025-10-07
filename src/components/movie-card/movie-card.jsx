/*  src/components/movie-card/movie-card.jsx
 * Movie card component
 *
 * (c) 2025 Dmitri Korotkov
 */

// --- Core Node.js modules (none used here) ---

// --- React and other Third-party libraries (none used here) ---
import PropTypes from "prop-types";

// --- Local application imports (none required) ---

export const MovieCard = ({ 
    movie: { title, description, image_url, genre }, 
    onMovieClick
}) => {
    return (
        <div
            onClick={() => {
                onMovieClick({ title, description, image_url, genre });
            }}
        >
            {image_url} {title} {description} {genre.name}
        </div>
    );
};

MovieCard.propTypes = {
    movie: PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        image_url: PropTypes.string.isRequired,
        genre: PropTypes.shape({
            name: PropTypes.string.isRequired,
        }).isRequired,
    }),
    onMovieClick: PropTypes.func.isRequired
}; 