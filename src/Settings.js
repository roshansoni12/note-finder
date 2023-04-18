import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { doc, updateDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { useHistory, Link } from "react-router-dom";
import "./Settings.css";

const Settings = () => {
  const [user, setUser] = useState(null);
  const [newUsername, setNewUsername] = useState("");
  const [editingUsername, setEditingUsername] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        history.push("/");
      }
    });

    return () => {
      unsubscribe();
    };
  }, [history]);

  const handleUsernameEdit = async () => {
    if (!newUsername.trim()) {
      alert("Please enter a valid username.");
      return;
    }

    try {
      await updateProfile(user, { displayName: newUsername });
      await updateDoc(doc(db, "users", user.uid), { username: newUsername });
      setUser({ ...user, displayName: newUsername });
      setEditingUsername(false);
    } catch (err) {
      console.error("Error updating username:", err);
    }
  };

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
      <span className="navbar-brand mx-auto">Settings</span>
      <div className="navbar-nav ml-auto">
        <Link className="btn btn-link nav-link back-button" to="/welcome" title="Back">
          <i className="fa fa-arrow-left" aria-hidden="true"></i>
        </Link>
        <button className="btn btn-link nav-link logout-button" onClick={handleLogout} title="Logout">
          <i className="fa fa-sign-out" aria-hidden="true"></i>
        </button>
      </div>
    </nav>
    <div className="settings-container mt-5">
        {user && (
          <>
            <div className="row mt-4">
              <div className="col-md-6">
                <h5>Email</h5>
                <p>{user.email}</p>
              </div>
              <div className="col-md-6">
                <h5>Username</h5>
                {editingUsername ? (
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                    />
                    <div className="input-group-append">
                      <button
                        className="btn btn-primary"
                        onClick={handleUsernameEdit}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => setEditingUsername(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p>{user.displayName}</p>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        setNewUsername(user.displayName);
                        setEditingUsername(true);
                      }}
                    >
                      Edit
                    </button>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
  };
  
  export default Settings;
  