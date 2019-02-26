import React, { Component } from "react";
import axios from "axios";
const parseJSON = require('parse-json');
const checkStatus = require('node-status-check');

class App extends Component {


function(search(query) {
  return fetch(`/api/onegrams/=${query}`, {
    accept: 'application/json',
  }).then(checkStatus)
    .then(parseJSON);
})

render(){
return console.log(search('christmas'))
}

};

export default App;