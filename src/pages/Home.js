import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { withRouter } from "react-router-dom";
import "../styles/Home.css";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBTypography,
  MDBCardHeader,
  MDBCardFooter
}
from 'mdb-react-ui-kit';

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
    <MDBContainer className="home-container">
      <MDBRow className="justify-content-center">
        <MDBCol md="6">
          <MDBCard>
            <MDBCardBody>
            <MDBCardHeader>
              <h1 className="text-center mb-4">Welcome to NoteFinder</h1>
            </MDBCardHeader>
              <form onSubmit={handleLogin}>
                <MDBInput
                  className="email"
                  type="email"
                  id="email"
                  label="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <MDBInput
                  type="password"
                  id="password"
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {error && (
                  <MDBTypography note className="text-danger mt-3 mb-0">
                    {error}
                  </MDBTypography>
                )}
                <MDBBtn type="submit" color="primary" className="mt-3">
                  Login
                </MDBBtn>
              </form>
              <MDBCardFooter className="text-center mt-3">
                <div className="mt-3">
                  <MDBTypography note>
                    Don't have an account yet? Sign up to create one.
                  </MDBTypography>
                </div>
                <MDBBtn
                  color="secondary"
                  onClick={redirectToSignup}
                >
                  Sign Up
                </MDBBtn>
              </MDBCardFooter>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default withRouter(Home);
