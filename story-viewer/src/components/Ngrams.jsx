import React, { useState } from 'react';
import {RouteComponentProps, withRouter} from "react-router";
import ScaleDropdown from "./../options/scale-dropdown"
import NgramSearch from "./../options/ngram-search"
import RT from "./../options/rt"
import Timeline from "./../visualizations/timeline"
import useQueryString from "./../useQueryString";

const Ngrams = (props) => {
      
      return (
        <div className="ngrams">
            <section className="options">
                <h1>Ngrams</h1>
                <form>
                    <NgramSearch params={props.params} setParams={props.setParams} getData={props.getData}/>
                    <ScaleDropdown params={props.params} setParams={props.setParams}/>
                    <RT params={props.params} setParams={props.setParams}/>
                </form>
          </section>
            <section className="viz">
                <Timeline
                    data={props.params.data}
                />
            </section>
            <p>{'RT?: '+JSON.stringify(props.params.rt)}</p>
            <p>{'scale: '+JSON.stringify(props.params.scale)}</p>
        </div>
      )
}

export default withRouter(Ngrams);
