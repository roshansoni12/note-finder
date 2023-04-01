import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./Home";
import Tuner from "./Tuner";

const App = () => {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/tuner" component={Tuner} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
