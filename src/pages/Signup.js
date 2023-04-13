import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBCardHeader,
  MDBCardFooter
}
from 'mdb-react-ui-kit';
import "../styles/Signup.css";

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
      await userCredential.user.updateProfile({ displayName: username }); // Update the user's display name
      await setDoc(doc(db, "users", userCredential.user.uid), {
        username: username,
      });
      props.history.push("/");
    } catch (err) {
      setError(err.message);
    }
  };


  return (
    <MDBContainer className="signup-container">
      <MDBRow className="justify-content-center">
        <MDBCol md="6">
          <MDBCard>
            <MDBCardHeader>
              <h1 className="text-center mb-4">Sign up</h1>
            </MDBCardHeader>
            <MDBCardBody>
              <form onSubmit={handleSubmit}>
                <MDBInput
                  label="Username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <MDBInput
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <MDBInput
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <MDBInput
                  label="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <MDBBtn type="submit" className="signup">Sign up</MDBBtn>
              </form>
              {error && <p className="error">{error}</p>}
              <MDBCardFooter>
                Already have an account? <Link to="/">Log in</Link>
              </MDBCardFooter>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default Signup;
