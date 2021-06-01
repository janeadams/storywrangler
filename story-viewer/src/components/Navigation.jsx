import React, {useState} from "react";
import {Link, withRouter} from "react-router-dom";
import {viewerOptions} from "./../utils"
import {pageMeta} from '../defaults.js'
import logo from "./../img/storywrangler_large.svg"

function Navigation(props) {

  const [navClass, setNavClass] = useState("")

  const toggleState = () => {
    return navClass==="" ? "responsive" : ""
  }

  const viewerLinks = viewerOptions.map(v => {
    return (
        <li className={`nav-item  ${props.location.pathname === `/${v}` ? "active" : ""}`}>
          <Link key={v} className="nav-link" to={`/${v}`} onClick={() => setNavClass(toggleState())}>{pageMeta(v).title}</Link></li>
    )
  })

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
                <Link className="nav-link" to="/" onClick={() => setNavClass(toggleState())}>
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
                <Link className="nav-link" to="/about" onClick={() => setNavClass(toggleState())}>
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
