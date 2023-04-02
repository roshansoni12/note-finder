import React, { useState } from "react";
import { auth } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { withRouter } from "react-router-dom";
import "./Home.css";

const Home = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    await signInWithEmailAndPassword(auth, email, password);
    props.history.push("/welcome");
  } catch (err) {
    setError(err.message);
  }
};

  const redirectToSignup = () => {
    props.history.push("/signup");
  };

  return (
    <div className="container home-container">
      <h1 className="text-center">Log Into Note Finder</h1>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="email">Email address:</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-danger">{error}</p>}
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
      <div className="text-center">
        <button className="btn btn-secondary" onClick={redirectToSignup}>
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default withRouter(Home);
