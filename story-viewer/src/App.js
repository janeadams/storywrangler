import React, { useState, useCallback, useEffect, useContext, useReducer } from "react";
import { Helmet } from "react-helmet";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useHistory, useLocation } from 'react-router-dom'
import { Navigation, Footer, Home, View, Contact } from "./components";
import { useQueryString } from "./useQueryString";
import {formatDate, mostrecent, viewerOptions, formatURLParams, updateURL} from "./utils"
import getDatasetNamesFromSpec from "react-vega/lib/utils/getDatasetNamesFromSpec";

function App() {

    const [URLparams, setURLparams] = useState({})
    const [viewer, setViewer] = useState('ngrams')

    const viewerRoutes = viewerOptions.map(v => {
        return <Route path={`/${v}${formatURLParams(URLparams)}`} exact component={() => <View viewer={v} setState={setURLparams}/>} />
    })
         
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
                {viewerRoutes}
              <Route path="/contact" exact component={() => <Contact />} />
            </Switch>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
