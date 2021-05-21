import React from "react";
import {trackPromise} from "react-promise-tracker";

React.useEffect(async () => {
    const endpoint = `http://hydra.uvm.edu:3000/api/${viewer}/`
    let apicall = endpoint+query
    if (APIparams){
        let formattedAPIparams = []
        for (const [key, value] of Object.entries(APIparams)) {
            formattedAPIparams.push(key+"="+value)
        }
        apicall = apicall.concat('?'+formattedAPIparams.join('&'))
    }
    console.log('Formatted API call as:')
    console.log(apicall)
    const response = await trackPromise(fetch(apicall));
    const json = await trackPromise(response.json());
    if (json) { setData(json.data) }
}, [query, APIparams]);