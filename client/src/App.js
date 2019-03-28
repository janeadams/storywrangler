// Thanks https://www.robinwieruch.de/react-fetching-data/

import React, { Component } from "react";

const API = 'http://localhost:443/api/onegrams/';
const DEFAULT_QUERY = 'christmas';

class App extends Component {
    

constructor(props) {
    super(props);

    this.state = {
      count: [],
    };
  }
    
componentDidMount() {
    fetch(API + DEFAULT_QUERY)
      .then(response => response.json())
      .then(data => this.setState({ count: data.count }));
  }
    
  render() {
    const { count } = this.state;

    return (
      <ul>
        {hits.map(hit =>
          <li key={hit.objectID}>
            <a href={hit.url}>{hit.title}</a>
          </li>
        )}
      </ul>
    )
    }
}