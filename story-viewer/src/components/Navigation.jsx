import React from "react";
import { Link, withRouter } from "react-router-dom";

function Navigation(props) {
  return (
    <div className="navigation">
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">
            StoryWrangler
          </Link>
          <div>
            <ul className="navbar-nav ml-auto">
              <li
                className={`nav-item  ${
                  props.location.pathname === "/" ? "active" : ""
                }`}
              >
                <Link className="nav-link" to="/">
                  Home
                  <span className="sr-only">(current)</span>
                </Link>
              </li>
              <li
                className={`nav-item  ${
                  props.location.pathname === "/ngrams" ? "active" : ""
                }`}
              >
                <Link className="nav-link" to="/ngrams">
                  Ngrams
                </Link>
              </li>
              <li
                className={`nav-item  ${
                  props.location.pathname === "/realtime" ? "active" : ""
                }`}
              >
                <Link className="nav-link" to="/realtime">
                  Realtime
                </Link>
              </li>
              <li
                className={`nav-item  ${
                  props.location.pathname === "/zipf" ? "active" : ""
                }`}
              >
                <Link className="nav-link" to="/zipf">
                  Zipf
                </Link>
              </li>
              <li
                className={`nav-item  ${
                  props.location.pathname === "/rtd" ? "active" : ""
                }`}
              >
                <Link className="nav-link" to="/rtd">
                  RTD
                </Link>
              </li>
              <li
                className={`nav-item  ${
                  props.location.pathname === "/languages" ? "active" : ""
                }`}
              >
                <Link className="nav-link" to="/languages">
                  Languages
                </Link>
              </li>
              <li
                className={`nav-item  ${
                  props.location.pathname === "/about" ? "active" : ""
                }`}
              >
                <Link className="nav-link" to="/about">
                  About
                </Link>
              </li>
              <li
                className={`nav-item  ${
                  props.location.pathname === "/contact" ? "active" : ""
                }`}
              >
                <Link className="nav-link" to="/contact">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default withRouter(Navigation);
