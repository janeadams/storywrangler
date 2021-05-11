import React from "react";
import {withRouter} from "react-router";

function Home() {
  return (
    <div className="home">
      <div className="container">
            <h1>Home</h1>
            <p>
              Test
            </p>
      </div>
    </div>
  );
}

export default withRouter(Home);
