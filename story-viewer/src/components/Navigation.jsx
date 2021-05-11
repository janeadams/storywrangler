import React from "react";
import {Link, Route, withRouter} from "react-router-dom";
import {viewerOptions} from "./../utils"
import {View} from "./index";
import {metricOptions, pageMeta} from '../defaults.js'

function Navigation(props) {

  const viewerLinks = viewerOptions.map(v => {
    return (
        <li className={`nav-item  ${props.location.pathname === `/${v}` ? "active" : ""}`}>
          <Link key={v} className="nav-link" to={`/${v}`}>{pageMeta(v).title}</Link></li>
    )
  })

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
              {viewerLinks}
              <li
                className={`nav-item  ${
                  props.location.pathname === "/about" ? "active" : ""
                }`}
              >
                <Link className="nav-link" to="/about">
                  About
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
