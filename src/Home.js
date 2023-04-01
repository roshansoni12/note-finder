import React from "react";
import { withRouter } from "react-router-dom";
import "./Home.css";

const Home = (props) => {
  const redirectToTuner = () => {
    props.history.push("/tuner");
  };

  return (
    <div className="container home-container">
      <h1 className="text-center">Welcome to NoteFinder</h1>
      <div className="text-center">
        <button className="btn btn-primary" onClick={redirectToTuner}>
          Begin
        </button>
      </div>
    </div>
  );
};

export default withRouter(Home);
