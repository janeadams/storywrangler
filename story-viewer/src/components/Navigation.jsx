import React, {useState, useEffect} from "react";
import {Link, Route, withRouter} from "react-router-dom";
import {viewerOptions} from "./../utils"
import {View} from "./index";
import {metricOptions, pageMeta} from '../defaults.js'
import logo from "./../img/storywrangler_wordmark.svg"

function Navigation(props) {

  const viewerLinks = viewerOptions.map(v => {
    return (
        <li className={`nav-item  ${props.location.pathname === `/${v}` ? "active" : ""}`}>
          <Link key={v} className="nav-link" to={`/${v}`}>{pageMeta(v).title}</Link></li>
    )
  })

  const [navClass, setNavClass] = useState("")

  const toggleState = () => {
    return navClass==="" ? "responsive" : ""
  }

  return (
      <nav>
          <Link to="/">
            <img id="logo" src={logo}/>
          </Link>
            <ul id="navList" className={navClass}>
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
              <a href="javascript:void(0);" className="icon" onClick={() => setNavClass(toggleState())}>
                <i className="fa fa-bars"></i></a>
            </ul>
      </nav>
  );
}

export default withRouter(Navigation);
