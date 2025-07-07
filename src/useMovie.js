import { useEffect } from "react";
import { useState } from "react";

const Key = "6ae31c8";

export function useMovie(query) {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setError("");
          setLoading(true);
          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${Key}&s=${query}
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
        // setSelectedId(null);
        return;
      }
      //   handleCloseMovie();
      fetchMovies();
      return function () {
        controller.abort();
      };
    },
    [query, error.name]
  );

  return { movies, error, loading };
}
