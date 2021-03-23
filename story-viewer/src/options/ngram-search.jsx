import React, { useState } from 'react';
import {RouteComponentProps, withRouter} from "react-router";
import Creatable from 'react-select/creatable';

const NgramSearch = (props) => {
  function buildOptions(items){
      let options = []
      items.forEach(n => {
            options.push({'value': n, 'label': n})
            })
      return options;
  }
    
  function addNgrams(inputValue){
      const ngrams = []
      inputValue.forEach(item => {
          ngrams.push(item.value)
          console.log(item)
          if (item.__isNew__){
              console.log(`${item.value} is new!`)
              props.getData(item.value, props.params)
          }
      })
      console.log(`New ngrams: ${ngrams}`)
      return ngrams
  }
    
  return (
      <div id='ngram-search'>
          <p>{JSON.stringify(props.params.ngrams)}</p>
          <Creatable 
              defaultValue={buildOptions(props.params.ngrams)}
              isMulti={true} 
              formatCreateLabel={(inputValue) => 'Search for "'+inputValue+'"'} 
              placeholder='Search for 1, 2, or 3-word phrases'
              onChange={inputValue => props.setParams({...props.params, 'ngrams': addNgrams(inputValue)})}/>
      </div>
  )
}

export default withRouter(NgramSearch)