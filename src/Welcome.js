import React, { useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { auth } from "./firebase";

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
      <h1 className="text-center">Welcome {displayName}</h1>
      <div className="text-center">
        <Link to="/tuner" className="btn btn-primary">
          Begin
        </Link>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Welcome;
