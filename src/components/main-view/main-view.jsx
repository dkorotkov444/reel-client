/*  src/components/main-view/main-view.jsx
 * Main View file of the REEL movie API client
 *
 * (c) 2025 Dmitri Korotkov
 */

// --- Core Node.js modules (none used here) ---

// --- React and other Third-party libraries ---
import { useState } from "react";

// --- Local application imports ---
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";

// Main view component
export const MainView = () => {
    // State to hold list of movies (initially hardcoded sample data)
    const [movies, setMovies] = useState([
        {
            _id: '68cd8259d8540b738fcebeb1',
            movieid: 25,
            title: 'Joker',
            description: 'Arthur Fleck, a mentally ill party clown and aspiring stand-up comedian, finds his way into a life of crime in Gotham City.',
            release_year: 2019,
            image_url: 'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg',
            rating_imdb: 8.3,
            featured: false,
            starring: [
            'Joaquin Phoenix',
            'Robert De Niro',
            'Zazie Beetz',
            'Frances Conroy'
            ],
            director: {
            name: 'Todd Phillips',
            bio: 'Todd Phillips (born Todd Philip Bunzl) is an American filmmaker. He is best known for directing the comedy films Old School (2003) and The Hangover (2009), and the psychological thriller Joker (2019).',
            birth_date: '1970-12-20',
            death_date: null
            },
            genre: {
            name: 'Drama',
            description: 'A genre of storytelling with a serious, rather than humorous, tone. Stories often revolve around compelling characters facing a central conflict, filled with emotional and cathartic moments.'
            }
        },
        {
            _id: '68cd8259d8540b738fcebeb2',
            movieid: 16,
            title: 'The Dark Knight',
            description: 'Batman, Gordon, and Harvey Dent unite to fight the Joker, a criminal mastermind who terrorizes Gotham City.',
            release_year: 2008,
            image_url: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
            rating_imdb: 9.1,
            featured: false,
            starring: [
            'Christian Bale',
            'Heath Ledger',
            'Aaron Eckhart',
            'Michael Caine',
            'Maggie Gyllenhaal',
            'Gary Oldman'
            ],
            director: {
            name: 'Christopher Nolan',
            bio: 'Christopher Nolan is a British-American filmmaker known for his complex narratives and a signature style that pushes the boundaries of filmmaking. His work often explores existential themes like time, memory, and reality, using stunning visuals and non-linear storytelling.',
            birth_date: '1970-07-30',
            death_date: null
            },
            genre: {
            name: 'Action',
            description: 'A genre of fiction where one or more heroes are thrust into a series of challenges that require physical feats, combat, and quick thinking.'
            }
        },
        {
            _id: '68cd8259d8540b738fcebeb4',
            movieid: 18,
            title: 'Goodfellas',
            description: "The life of a New York mobster Henry Hill and his life in the mafia, covering his relationship with his wife Karen and his mob partners Jimmy Conway and Tommy DeVito. It is a film adaptation of Nicolas Pileggi's 1985 nonfiction book Wiseguy.",
            release_year: 1990,
            image_url: 'https://image.tmdb.org/t/p/w500/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg',
            rating_imdb: 8.7,
            featured: false,
            starring: [
            'Robert De Niro',
            'Ray Liotta',
            'Joe Pesci',
            'Lorraine Bracco',
            'Paul Sorvino'
            ],
            director: {
            name: 'Martin Scorsese',
            bio: 'Martin Scorsese is widely considered one of the most important directors of all time. Known for his gritty, meticulous filmmaking style, his films often explore themes of crime, guilt, and redemption, deeply rooted in his Italian-American heritage and experience of growing up in New York City.',
            birth_date: '1942-11-17',
            death_date: null
            },
            genre: {
            name: 'Crime',
            description: 'Crime film is a film belonging to the crime fiction genre. Films of this genre generally involve various aspects of crime.'
            }
        },
        {
            _id: '68cd8259d8540b738fcebeaf',
            movieid: 19,
            title: 'Kill Bill: Vol. 1',
            description: 'After a four-year coma, a former assassin seeks revenge on her ex-boss and his gang who tried to kill her and her unborn child.',
            release_year: 2003,
            image_url: 'https://image.tmdb.org/t/p/w500/v7TaX8kXMXs5yFFGR41guUDNcnB.jpg',
            rating_imdb: 8.2,
            featured: false,
            starring: [
            'Uma Thurman',
            'Lucy Liu',
            'Vivica A. Fox',
            'Michael Madsen',
            'Daryl Hannah'
            ],
            director: {
            name: 'Quentin Tarantino',
            bio: 'Quentin Jerome Tarantino is an American filmmaker, actor, and author. His films are characterized by graphic violence, extended dialogue often featuring much profanity, and references to popular culture. His work has earned a cult following alongside critical and commercial success; he has been named by some as the most influential director of his generation and has received numerous awards and nominations, including two Academy Awards, two BAFTA Awards, and four Golden Globe Awards. His films have grossed more than $1.9 billion worldwide.',
            birth_date: '1963-03-27',
            death_date: null
            },
            genre: {
            name: 'Action',
            description: 'A genre of fiction where one or more heroes are thrust into a series of challenges that require physical feats, combat, and quick thinking.'
            }
        },
        {
            _id: '68cd8259d8540b738fcebeb6',
            movieid: 22,
            title: 'The Wolf of Wall Street',
            description: 'Jordan Belfort rises from a humble stockbroker to a wealthy financier, detailing his reckless life of excess, drugs, and corruption.',
            release_year: 2013,
            image_url: 'https://image.tmdb.org/t/p/w500/kW9LmvYHAaS9iA0tHmZVq8hQYoq.jpg',
            rating_imdb: 8.2,
            featured: false,
            starring: [
            'Leonardo DiCaprio',
            'Jonah Hill',
            'Margot Robbie',
            'Matthew McConaughey'
            ],
            director: {
            name: 'Martin Scorsese',
            bio: 'Martin Scorsese is widely considered one of the most important directors of all time. Known for his gritty, meticulous filmmaking style, his films often explore themes of crime, guilt, and redemption, deeply rooted in his Italian-American heritage and experience of growing up in New York City.',
            birth_date: '1942-11-17',
            death_date: null
            },
            genre: {
            name: 'Drama',
            description: 'A genre of storytelling with a serious, rather than humorous, tone. Stories often revolve around compelling characters facing a central conflict, filled with emotional and cathartic moments.'
            }
        },
    ]);
    const [selectedMovie, setSelectedMovie] = useState(null);

    // Movie view (rendered when a movie has been selected)
    if (selectedMovie) {
        return <MovieView movie={selectedMovie} onBackClick={() => setSelectedMovie(null)}/>;
    }

    // Check if movies array is empty
    if (movies.length === 0) {
        return <div>The movie list is empty!</div>;
    }

    // Main view (rendered when no movie has been selected)
    return (
        <div>
        {movies.map((movie) => (
            <MovieCard
            key={movie._id}     // Added key prop here. movie._id is unique identifier (until API is connected)
            movie={movie}
            onMovieClick={(newSelectedMovie) => {
                setSelectedMovie(newSelectedMovie);
            }}
            />
        ))}
        </div>
    );
};