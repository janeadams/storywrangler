import React, { useState, useCallback, useEffect } from "react";
import {Helmet} from "react-helmet";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Navigation, Footer, Home, Ngrams, Zipf, Realtime, Rtd, Languages, About, Contact } from "./components";
import { useQueryString } from "./useQueryString";

function App() {
  
  const [params, setParams] = useState({
      'viewer': 'ngrams',
      'url': window.location.pathname,
      'ngrams' : ['haha','ok'],
      'language': 'en',
      'rt': true,
      'scale': 'log',
      'metric': 'rank',
      'data': null
  })
  
  React.useEffect(function effectData() {
       async function getData() {
           const endpoint = `http://hydra.uvm.edu:3000/api/${params.viewer}/`
            let apiparams = []
            for (const [key, value] of Object.entries(params)) {
              if (!(['viewer','data','url','ngrams'].includes(key)) && (![null,'',[]].includes(value))){
                  apiparams.push(key+"="+value)
              }
            }
            let apicall = endpoint+params.ngrams+'?'+apiparams.join('&')
            console.log('Formatted API call as:')
            console.log(apicall)
           const response = await fetch(apicall);
           const json = await response.json();
           setParams({...params, 'data': json.data})
       }
       getData()
          console.log({params})
   }, [params.ngrams]);
         
  return (
    <div className="App">
      <Helmet>
        <meta charSet="utf-8"/>
        <title>StoryWrangler - Twitter Ngram Search</title>
      </Helmet>
      <Router>
        <Navigation />
        <Switch>
          <Route path="/" exact component={() => <Home />} />
          <Route path="/ngrams" exact component={() => <Ngrams params={params} setParams={setParams}/>} />
          <Route path="/realtime" exact component={() => <Realtime />} />
          <Route path="/zipf" exact component={() => <Zipf />} />
          <Route path="/rtd" exact component={() => <Rtd />} />
          <Route path="/languages" exact component={() => <Languages />} />
          <Route path="/about" exact component={() => <About />} />
          <Route path="/contact" exact component={() => <Contact />} />
        </Switch>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
