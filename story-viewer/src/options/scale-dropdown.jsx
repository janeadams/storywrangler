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
          value={props.params.scale}
          name="scale"
          placeholder={"Select scale..."}
          options={[{'value': 'log', 'label': 'Logarithmic'},{'value': 'lin', 'label': 'Linear'}]}
          onChange={value => props.setParams({...props.params, 'scale': value.value})}
        />
     </div>
  )
}

export default withRouter(ScaleDropdown)