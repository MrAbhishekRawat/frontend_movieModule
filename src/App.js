import React, { useState, useEffect, useCallback } from "react";
import MoviesList from "./components/MoviesList";
import "./App.css";

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
      const response = await fetch("https://swapi.dev/api/films/");
      if (!response.ok) {
        throw new Error("Something went wrong....Retrying");
      }

      const data = await response.json();

      const transformedData = data.results.map((movieData) => ({
        id: movieData.episode_id,
        title: movieData.title,
        openingText: movieData.opening_crawl,
        releaseDate: movieData.release_date,
      }));

      setMovies(transformedData);
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

  let content = <p>No movies found.</p>;
  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
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
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
