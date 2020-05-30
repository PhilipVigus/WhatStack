import React, { useState } from "react";
import { Link } from "react-router-dom";

const Join = () => {
  const [name, setName] = useState("");
  return (
    <div>
      <h1>Join</h1>
      <Link
        onClick={(event) => (!name ? event.preventDefault() : null)}
        to={`/chat?name=${name}`}
      >
        <input
          placeholder="name"
          type="text"
          onChange={(event) => {
            setName(event.target.value);
          }}
        ></input>
        <button type="submit">Join</button>
      </Link>
      <button
        onClick={() => {
          window.location.href = "http://localhost:5000/login";
        }}
      >
        Github login
      </button>
    </div>
  );
};

export default Join;
