import React from "react";
import { withRouter } from "react-router-dom";

const Home = (props) => {
  const redirectToTuner = () => {
    props.history.push("/tuner");
  };

  return (
    <div>
      <h1>Welcome to the Music Tuner</h1>
      <button onClick={redirectToTuner}>Begin</button>
    </div>
  );
};

export default withRouter(Home);
