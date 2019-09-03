import React, { Component } from "react";
import "./App.css";
import BarChart from "./visualizations/BarChart";
import Chart from "./visualizations/Chart";

class App extends Component {
  state = {
    ranks: {},
    storyon: "halloween" // city whose temperatures to show
  };

  componentDidMount() {
    Promise.all([
      fetch(`http://dev.universalities.com/onegrams/json_from_api/halloween.json`),
      fetch(`http://dev.universalities.com/onegrams/json_from_api/superbowl.json`)
    ])
      .then(responses => Promise.all(responses.map(resp => resp.json())))
      .then(([halloween, superbowl]) => {
        halloween.forEach(day => (day.date = new Date(day.date)));
        superbowl.forEach(day => (day.date = new Date(day.date)));

        this.setState({ ranks: { halloween, superbowl } });
      });
  }

  updateStoryon = e => {
    this.setState({ storyon: e.target.value });
  };

  render() {
    const data = this.state.ranks[this.state.storyon];
    console.log(data);

    return (
      <div className="App">
        <h1>
          Ranks for
          <select name="storyon" onChange={this.updateStoryon}>
            {[
              { label: "Halloween", value: "halloween" },
              { label: "Superbowl", value: "superbowl" },
              { label: "Christmas", value: "christmas" },
              { label: "Easter", value: "easter" }
            ].map(option => {
              return (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              );
            })}
          </select>
        </h1>
        <p>
        </p>
        <BarChart data={data} />
        <Chart data={data} />
      </div>
    );
  }
}

export default App;
