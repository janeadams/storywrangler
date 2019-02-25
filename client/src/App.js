import React, { Component } from "react";
import axios from "axios";

class App extends Component {


  getDataFromDb = () => {
    fetch("http://localhost:3001/api/onegrams/christmas")
      .then(response => response.json())
      .then(data => {
        this.setState({ data: data });
      })
      .catch(err => console.error(this.props.url, err.toString()))
  }
  
  constructor(props) {
    super(props);
    this.state = { data: null }; // initialize with null
  }


  componentDidMount() {
    this.getDataFromDb();
  }

  // here is our UI
  // it is easy to understand their functions when you 
  // see them render into our screen
  render() {
    const { data } = this.state;
    <ul>
        // if data not loaded null will render nothing
        // if data is not null, we iterate data.results with map
        {data && data.results.map(function (time, count) {
          // film is an object, just one or more properties to render
          return <li key={count}>{time.headline}</li>;
        })}
      </ul>
    );
  }
}

export default App;