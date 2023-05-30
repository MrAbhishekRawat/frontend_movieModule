import React, { useState } from "react";
import classes from './AddMovie.module.css'

const AddNewMovie = (props) => {
  const [title, setTitle] = useState("");
  const [openingText, setOpeningText] = useState("");
  const [releaseDate, setReleaseDate] = useState("");

  const titleChangeHandler = (event) => {
    setTitle(event.target.value);
  };

  const openingTextChangeHandler = (event) => {
    setOpeningText(event.target.value);
  };

  const releaseDateChangeHandler = (event) => {
    setReleaseDate(event.target.value);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const movieData = {
      title: title,
      openingText: openingText,
      releaseDate: releaseDate,
    };

    props.onAddMovie(movieData);

    setTitle("");
    setOpeningText("");
    setReleaseDate("");
  };

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={titleChangeHandler}
        />
      </div>
      <div className={classes.control}>
        <label htmlFor="openingText">Opening Text:</label>
        <textarea
          id="openingText"
          rows="5"
          value={openingText}
          onChange={openingTextChangeHandler}
        ></textarea>
      </div>
      <div className={classes.control}>
        <label htmlFor="releaseDate">Release Date:</label>
        <input
          type="text"
          id="releaseDate"
          value={releaseDate}
          onChange={releaseDateChangeHandler}
        />
      </div>
      <button type="submit">Add Movie</button>
    </form>
  );
};

export default AddNewMovie;
