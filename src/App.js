import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import Home from "./pages/Home";
import Tuner from "./pages/Tuner";
import Signup from "./pages/Signup";
import Welcome from "./pages/Welcome";
import { auth } from "./firebase";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <Router>
      <div>
        {isAuthenticated === null ? null : isAuthenticated ? (
          <>
            <Route path="/welcome" component={Welcome} />
            <Route path="/tuner" component={Tuner} />
            <Redirect to="/welcome" />
          </>
        ) : (
          <>
            <Route exact path="/" component={Home} />
            <Route path="/signup" component={Signup} />
          </>
        )}
      </div>
    </Router>
  );
};

export default App;
