import React, { useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { auth } from "./firebase";
import "./Welcome.css";

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
    <div className="container">
      <nav className="navbar navbar-expand navbar-light bg-light">
        <span className="navbar-brand mx-auto">Welcome {displayName}</span>
        <div className="navbar-nav ml-auto">
          <button className="btn btn-link nav-link logout-button" onClick={handleLogout} title="Logout">
            <i className="fa fa-sign-out" aria-hidden="true"></i>
          </button>
          <Link to="/settings" className="btn btn-link nav-link settings-button" title="Settings">
            <i className="fa fa-cog" aria-hidden="true"></i>
          </Link>
        </div>
      </nav>
      <div className="button-container text-center">
        <Link to="/tuner" className="btn btn-primary begin-button">
          Begin
        </Link>
      </div>
    </div>
  );
};

export default Welcome;
