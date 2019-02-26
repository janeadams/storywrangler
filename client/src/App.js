import React, { Component } from "react";
import axios from "axios";

class App extends Component {


search(query) {
  return fetch(`/api/onegrams/=${query}`, {
    accept: 'application/json',
  }).then(checkStatus)
    .then(parseJSON);
};
    console.log(search('christmas'))
};

export default App;