import React, { useState } from 'react';
import {RouteComponentProps, withRouter} from "react-router";
import ScaleDropdown from "./../options/scale-dropdown"
import NgramSearch from "./../options/ngram-search"
import RT from "./../options/rt"
import Timeline from "./../visualizations/Timeline"
import useQueryString from "./../useQueryString";
import * as d3 from "d3"

const Ngrams = (props) => {

    let i = 0
    const parseDate = d3.timeParse("%Y-%m-%d")
    const formatDate = d3.timeFormat("%Y-%m-%d")
    const dateAccessor = d => {
        return parseDate(d.date)
    }
    const metricAccessor = d => {
        return d.count
    }
      
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
                    xAccessor={dateAccessor}
                    yAccessor={metricAccessor}
                />
            </section>
            <p>{'RT?: '+JSON.stringify(props.params.rt)}</p>
            <p>{'scale: '+JSON.stringify(props.params.scale)}</p>
        </div>
      )
}

export default withRouter(Ngrams);
