import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import "./Signup.css";

function Signup(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: username });
      await setDoc(doc(db, "users", userCredential.user.uid), {
        username: username,
      });
      // Sign the user out immediately after signing up
      await auth.signOut();
      props.history.push("/");
    } catch (err) {
      console.error(err)
      setError(err.message);
    }
  };



  return (
    <div className="Signup">
      <h2>Sign up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="submit">Sign up</button>
      </form>
      {error && <p className="error">{error}</p>}
      <p>
        Already have an account? <Link to="/">Log in</Link>
      </p>
    </div>
  );
}

export default Signup;
