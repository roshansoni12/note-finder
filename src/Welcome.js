import React, { useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { auth } from "./firebase";
import "./Welcome.css";

const Welcome = () => {
  const [displayName, setDisplayName] = useState("");
  const history = useHistory();
  const [backgroundImage, setBackgroundImage] = useState("");

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

  const changeBackground = (instrument) => {
    setBackgroundImage(`url(/images/${instrument}.jpg)`);
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
        <button onClick={() => changeBackground("piano")} className="btn btn-primary instrument-button">
          Piano
        </button>
        <button onClick={() => changeBackground("guitar")} className="btn btn-primary instrument-button">
          Guitar
        </button>
        <button onClick={() => changeBackground("violin")} className="btn btn-primary instrument-button">
          Violin
        </button>
        <button onClick={() => changeBackground("saxophone")} className="btn btn-primary instrument-button">
          Saxophone
        </button>
        <Link to="/tuner" className="btn btn-primary begin-button">
          Begin
        </Link>
      </div>
    </div>
  );
};

export default Welcome;