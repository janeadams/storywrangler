import React from "react";
import Select from 'react-select';

const Dropdown = (props) => {

  let dropdownOptions = []
    Object.entries(props.options).forEach(([key, value]) =>
        dropdownOptions.push({'value': key, 'label': value})
    )
    
  return (
      <div className='dropdown' className='optionContainer'>
          <p>{props.prompt}</p>
          <Select
          className="basic-single"
          classNamePrefix="select"
          defaultValue={{'value': props.state, 'label': props.options[props.state]}}
          options={dropdownOptions}
          onChange={selection => props.setState(selection.value)}
        />
     </div>
  )
}

export default Dropdown