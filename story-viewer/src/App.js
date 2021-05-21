import React, { useState, useCallback, useEffect, useContext, useReducer } from "react";
import { Helmet } from "react-helmet";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useHistory, useLocation } from 'react-router-dom'
import { Navigation, Footer, Home, View, About, Contact } from "./components";
import {formatDate, mostrecent, viewerOptions, formatURLParams} from "./utils"

function App() {

    const [viewer, setViewer] = useState('ngrams')

    const viewerRoutes = viewerOptions.map(v => {
        return <Route path={`/${v}`} exact component={() => <View viewer={v}/>} />
    })
         
  return (
    <div className="App">
      <Helmet>
        <meta charSet="utf-8"/>
        <title>StoryWrangler - Twitter Ngram Search</title>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
      </Helmet>
      <Router>
        <Navigation />
            <Switch>
              <Route path="/" exact component={() => <Home />} />
                {viewerRoutes}
            <Route path="/about" exact component={() => <About />} />
            <Route path="/contact" exact component={() => <Contact />} />
            </Switch>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
