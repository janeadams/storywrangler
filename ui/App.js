import React, { Component } from "react";
import * from d3;
import LineChart from "components/linechart";
import cors;

const API = 'http://dev.universalities.com/onegrams/json_from_api/';
const DEFAULT_QUERY = 'christmas';

class App extends Component {

// Enable cross-origin request service
var cors = require('cors');

constructor(props) {
    super(props);

    this.state = {
      count: [],
    };
  }
    
componentDidMount() {
    fetch(API + DEFAULT_QUERY + ".json")
      .then(response => response.json())
      .then(data => this.setState({ times: data.times }));
  }
    
  render() {
    const { times } = this.state;

    return (
      <ul>
        {times.map(time =>
          <li>
            <p>{time}</p>
          </li>
        )}
      </ul>
    )
    }
}