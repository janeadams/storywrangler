import React from 'react';
import Creatable from 'react-select/creatable';

const Search = (props) => {

  /*if (props.options){ console.log(`props.options: ${props.options}`) }*/

  function buildOptions(items){
      let options = []
      items.forEach(n => {
            options.push({'value': n, 'label': n})
            })
      return options;
  }
    
  function addQueries(inputValue){
      const queries = []
      inputValue.forEach(item => {
          queries.push(item.value)
          console.log(item)
          if (item.__isNew__){
              console.log(`${item.value} is new!`)
          }
      })
      return queries
  }
    
  return (
      <div className='search' className="optionContainer">
          <p>{props.prompt}</p>
          {/*<p>{props.param}: {JSON.stringify(props.state)}</p>*/}
          <Creatable
              defaultValue={buildOptions(props.state)}
              isMulti={true}
              formatCreateLabel={(inputValue) => 'Search for "'+inputValue+'"'}
              placeholder='Search for 1, 2, or 3-word phrases'
              onChange={inputValue => props.setState(addQueries(inputValue))}
              options={props.options ? props.options : []}
          />
        </div>
  )
}

export default Search