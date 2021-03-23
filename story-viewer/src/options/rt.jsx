import React, { useState } from 'react';
import {RouteComponentProps, withRouter} from "react-router";

const RT = (props) => {
  return (
      <div id='rt-toggle'>
          <label htmlFor="rt">
              Include retweets?
          </label>
          <input 
              type="checkbox" 
              name="rt" 
              id="rt" 
              checked={props.params.rt} 
              onChange={e => props.setParams({...props.params, 'rt': e.target.checked})}
          />
      </div>
  )
}

export default withRouter(RT)