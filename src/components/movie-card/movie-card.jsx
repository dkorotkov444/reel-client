/*  src/components/movie-card/movie-card.jsx
 * Movie card component
 *
 * (c) 2025 Dmitri Korotkov
 */

// --- Core Node.js modules (none used here) ---

// --- React and other Third-party libraries (none used here) ---

// --- Local application imports (none required) ---

export const MovieCard = ({ movie, onMovieClick }) => {
    return (
      <div
        onClick={() => {
          onMovieClick(movie);
        }}
      >
        {movie.title}
      </div>
    );
  };
