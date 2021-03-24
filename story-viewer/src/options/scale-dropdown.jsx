import React from "react";
import {RouteComponentProps, withRouter} from "react-router";
import Select from 'react-select';

const ScaleDropdown = (props) => {
    
  function getName(s){
      console.log(`scale options input: ${s}`)
      if (s.lower=='lin'){
          return 'Linear'
      }
      else {
          return 'Logarithmic'
      }
  }
    
  return (
      <div id='scale-dropdown'>
          <Select
          className="basic-single"
          classNamePrefix="select"
          defaultValue={{'value': props.params.scale, 'label': getName(props.params.scale)}}
          options={[{'value': 'log', 'label': 'Logarithmic'}, {'value': 'lin', 'label': 'Linear'}]}
          onChange={selection => props.setParams({...props.params, 'scale': selection.value})}
        />
     </div>
  )
}

export default withRouter(ScaleDropdown)