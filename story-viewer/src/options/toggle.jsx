import React, { useState } from 'react';

const Toggle = (props) => {
  return (
      <div className='toggle' className="optionContainer">
          <label htmlFor="toggle">
              {props.prompt}
          </label>
          <input 
              type="checkbox" 
              name={props.param}
              id={props.param}
              checked={props.state}
              onChange={e => props.setState(e.target.checked)}
          />
      </div>
  )
}

export default Toggle