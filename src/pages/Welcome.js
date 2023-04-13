import React, { useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { auth } from "../firebase";
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBCard, MDBCardBody } from "mdb-react-ui-kit";
import "../styles/Welcome.css";

const Welcome = () => {
  const [displayName, setDisplayName] = useState("");
  const history = useHistory();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setDisplayName(user.displayName);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      history.push("/");
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  return (
    <MDBContainer className="welcome-container">
      <MDBRow className="justify-content-center">
        <MDBCol md="auto">
          <MDBCard>
            <MDBCardBody>
              <h1 className="text-center">Welcome {displayName}</h1>
              <div className="text-center">
                <Link to="/tuner">
                  <MDBBtn color="primary">Begin</MDBBtn>
                </Link>
                <MDBBtn color="danger" onClick={handleLogout}>
                  Logout
                </MDBBtn>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default Welcome;