import React, { useEffect, useState } from "react";
import { useHistory, Link, Route } from "react-router-dom";
import { auth } from "./firebase";

const Welcome = () => {
  const [displayName, setDisplayName] = useState("");
  const history = useHistory();

  useEffect(() => {
    console.log("point A")
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log(user)
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
console.log(displayName);
  return (
    <div className="container">
      <h1 className="text-center">Welcome {displayName}</h1>
      <div className="text-center">
        <Link to="/tuner" className="btn btn-primary">
          Begin
        </Link>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
        <Link to="/settings" className="btn btn-secondary">
          Settings
        </Link>
      </div>
    </div>
  );
};

export default Welcome;
