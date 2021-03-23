import React from "react";
import { all, desc, op, table } from 'arquero';

const Timeline = (props) => {
  return (
      <div>
          <div>{table(props.data['no']).toHTML()}</div>
      </div>
   )
}

export default Timeline