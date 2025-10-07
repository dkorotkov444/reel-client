/*  src/components/movie-view/movie-view.jsx
 * Movie detail view component
 *
 * (c) 2025 Dmitri Korotkov
 */

// --- Core Node.js modules (none used here) ---

// --- React and other Third-party libraries (none used here) ---
import PropTypes from "prop-types";

// --- Local application imports (none required) ---

export const MovieView = ({ movie, onBackClick }) => {
    return (
      <div>
        <div>
          <img src={movie.image_url} />
        </div>
        <div>
          <span>Title: </span>
          <span>{movie.title}</span>
        </div>
        <div>
          <span>Description: </span>
          <span>{movie.description}</span>
        </div>
        <div>
          <span>Director: </span>
          <span>{movie.director.name}</span>
        </div>
        <div>
          <span>Genre:</span>
          <span>{movie.genre.name}</span>
        </div>
        <div>
          <span>Release year: </span>
          <span>{movie.release_year}</span>
        </div>
        <button onClick={onBackClick}>Back</button>
      </div>
    );
  };

MovieView.propTypes = {
    movie: PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        image_url: PropTypes.string.isRequired,
        director: PropTypes.shape({
            name: PropTypes.string.isRequired,
            bio: PropTypes.string,
            birth_date: PropTypes.string,
            death_date: PropTypes.string
        }).isRequired,
        release_year: PropTypes.string.isRequired
    }),
    onBackClick: PropTypes.func.isRequired
}; 