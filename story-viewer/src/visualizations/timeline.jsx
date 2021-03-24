import React from "react";
import { all, desc, op, table } from 'arquero';
import {vl} from 'vega-lite-api';
import {VegaLite} from 'react-vega';

const Timeline = (props) => {
    
  if (props.data) {
      console.log(props.data)
      const dt = table(props.data['haha']).data();
      console.log(dt)
      return (
          <div>
              <VegaLite data={{'values': dt}} spec={{'data': {'name':'dt'}, 'mark':'line', 'encoding': {'x': {'field':'freq','type':'quantitative'}, 'y':{'field':'count', 'type':'quantitative'}}}}/>
          </div>
       )
  }
  else { 
      console.log(`props.data is null. Props:`)
      console.log(props)
      return (
          <div>Props data is null</div>
          )
  }
}

export default Timeline