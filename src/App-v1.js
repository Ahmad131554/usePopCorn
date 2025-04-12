import { useEffect, useState } from "react";
import StarRating from "./StarRating";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const Key = "6ae31c8";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  function handleMovieSelect(id) {
    setSelectedId(id === selectedId ? null : id);
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatchMovie(movie) {
    setWatched((watched) => [...watched, movie]);
    setSelectedId(null);
  }

  function handleDeleteWatchMovie(id) {
    setWatched((movies) => movies.filter((movie) => movie.ImdbID !== id));
  }

  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setError("");
          setLoading(true);
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${Key}&s=${query}
          `,
            { signal: controller.signal }
          );
          if (!res.ok) throw new Error("Something went wrong...");
          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found...");
          setMovies(data.Search);
          setLoading(false);
        } catch (err) {
          if (error.name !== "AbortError") setError(err.message);
        } finally {
          setLoading(false);
          setError("");
        }
      }

      if (!query.length) {
        setMovies([]);
        setError("");
        setSelectedId(null);
        return;
      }
      fetchMovies();
      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return (
    <>
      <Nav>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <Results movies={movies} />
      </Nav>
      <Main>
        <ListBox>
          {loading ? (
            <Loader />
          ) : error ? (
            <ErrorMessage msg={error} />
          ) : (
            <MovieList movies={movies} onMovieSelect={handleMovieSelect} />
          )}
        </ListBox>
        <ListBox>
          {selectedId ? (
            <MovieDetails
              id={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatchMovie={handleAddWatchMovie}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedList
                watched={watched}
                onDeleteWatchMovie={handleDeleteWatchMovie}
              />
            </>
          )}
        </ListBox>
      </Main>
    </>
  );
}

function Loader() {
  return <p className="loader">Loading...</p>;
}

function ErrorMessage({ msg }) {
  return (
    <p className="error">
      <span>⛔</span>
      {msg}
    </p>
  );
}

function MovieDetails({ id, onCloseMovie, onAddWatchMovie, watched }) {
  const [movie, setMovie] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");
  const isWatched = watched.some((movie) => movie.ImdbID === id);
  const watchedMovieRating = watched
    .filter((movie) => movie.ImdbID === id)
    .at(0)?.UserRating;

  function handleAdd() {
    const newWatchedMovie = {
      ImdbID: id,
      Title: movie.Title,
      Poster: movie.Poster,
      ImdbRating: Number(movie.imdbRating),
      Runtime: Number(movie.Runtime.split(" ").at(0)),
      UserRating: userRating,
    };
    onAddWatchMovie(newWatchedMovie);
  }

  useEffect(
    function () {
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") onCloseMovie();
      });
      return function () {
        document.removeEventListener("keydown", function (e) {
          if (e.key === "Escape") onCloseMovie();
        });
      };
    },
    [onCloseMovie]
  );

  useEffect(
    function () {
      if (!movie.Title) return;
      document.title = movie.Title;

      return function () {
        document.title = "usePopCorn";
      };
    },
    [movie]
  );

  useEffect(
    function () {
      async function fetchDetails() {
        setIsLoading(true);
        const res = await fetch(`http://www.omdbapi.com/?apikey=${Key}&i=${id}
          `);
        const data = await res.json();
        setMovie(data);
        setIsLoading(false);
      }
      fetchDetails();
    },
    [id]
  );

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {" "}
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={movie?.Poster} alt={`Poster of a ${movie?.Title}`} />
            <div className="details-overview">
              <h2>{movie?.Title}</h2>
              <p>
                {movie?.Released} &bull; {movie?.Runtime}
              </p>
              <p>{movie?.genre}</p>
              <p>
                <span>⭐️</span>
                {movie?.imdbRating}
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {userRating && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>
                  You rated this movie with {watchedMovieRating}
                  <span>⭐️</span>
                </p>
              )}
            </div>
            <p>
              <em>{movie.Plot}</em>
            </p>
            <p>{movie.Actors}</p>
            <p>{movie.Director}</p>
          </section>
        </>
      )}
    </div>
  );
}

function Nav({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function Results({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Main({ movies, children }) {
  return <main className="main">{children}</main>;
}

function ListBox({ movies, children }) {
  const [isOpen1, setIsOpen1] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen1((open) => !open)}
      >
        {isOpen1 ? "–" : "+"}
      </button>
      {isOpen1 && children}
    </div>
  );
}

function MovieList({ movies, onMovieSelect }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <li key={movie.imdbID} onClick={() => onMovieSelect(movie.imdbID)}>
          <img src={movie.Poster} alt={`${movie.Title} poster`} />
          <h3>{movie.Title}</h3>
          <div>
            <p>
              <span>🗓</span>
              <span>{movie.Year}</span>
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.ImdbRating));
  const avgUserRating = average(watched.map((movie) => movie.UserRating));
  const avgRuntime = average(watched.map((movie) => movie.Runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(0)} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedList({ watched, onDeleteWatchMovie }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <li key={movie.ImdbID}>
          <img src={movie.Poster} alt={`${movie.Title} poster`} />
          <h3>{movie.Title}</h3>
          <div>
            <p>
              <span>⭐️</span>
              <span>{movie.ImdbRating}</span>
            </p>
            <p>
              <span>🌟</span>
              <span>{movie.UserRating}</span>
            </p>
            <p>
              <span>⏳</span>
              <span>{movie.Runtime} min</span>
            </p>
          </div>
          <button
            onClick={() => onDeleteWatchMovie(movie.ImdbID)}
            className="btn-delete"
          >
            X
          </button>
        </li>
      ))}
    </ul>
  );
}
