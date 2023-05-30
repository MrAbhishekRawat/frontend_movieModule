import React, { useState, useEffect, useCallback } from "react";
import MoviesList from "./components/MoviesList";
import "./App.css";
import AddNewMovie from "./components/AddMovie";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setIsRetrying(false);

    try {
      const response = await fetch(
        "https://frontend-movie-database-default-rtdb.firebaseio.com/movies.json"
      );
      if (!response.ok) {
        throw new Error("Something went wrong....Retrying");
      }

      const data = await response.json();

      const loadedMovies = [];

      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        });
      }

      setMovies(loadedMovies);
    } catch (error) {
      if (isRetrying) {
        setRetryCount((prevRetryCount) => prevRetryCount + 1);
      } else {
        setError(error.message);
      }
    }

    setIsLoading(false);
  }, [isRetrying]);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  useEffect(() => {
    if (retryCount > 0) {
      const timer = setTimeout(fetchMoviesHandler, 5000);
      return () => clearTimeout(timer);
    }
  }, [retryCount, fetchMoviesHandler]);

  const handleRetryClick = useCallback(() => {
    setRetryCount(1);
    setIsRetrying(true);
  }, []);

  const handleCancelClick = useCallback(() => {
    setRetryCount(0);
    setIsRetrying(false);
  }, []);

  const addMovieHandler = async (movie) => {
    try {
      const response = await fetch(
        "https://frontend-movie-database-default-rtdb.firebaseio.com/movies.json",
        {
          method: "POST",
          body: JSON.stringify(movie),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add movie.");
      }

      const data = await response.json();
      const movieData = {
        id: data.name,
        title: movie.title,
        openingText: movie.openingText,
        releaseDate: movie.releaseDate,
      };

      setMovies((prevMovies) => [...prevMovies, movieData]);
    } catch (error) {
      setError(error.message);
    }
  };

  const deleteMovieHandler = async (movieId) => {
    try {
      const response = await fetch(
        `https://frontend-movie-database-default-rtdb.firebaseio.com/movies/${movieId}.json`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete movie.");
      }

      setMovies((prevMovies) =>
        prevMovies.filter((movie) => movie.id !== movieId)
      );
    } catch (error) {
      setError(error.message);
    }
  };

  let content = <p>No movies found.</p>;
  if (movies.length > 0) {
    content = (
      <MoviesList movies={movies} onDeleteMovie={deleteMovieHandler} />
    );
  }
  if (error) {
    content = (
      <div>
        <p>{error}</p>
        <button onClick={handleRetryClick}>Retry</button>
        <button onClick={handleCancelClick}>Cancel</button>
      </div>
    );
  }
  if (isLoading) {
    content = <p>....LOADING....</p>;
  }

  return (
    <React.Fragment>
      <AddNewMovie onAddMovie={addMovieHandler} />
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
