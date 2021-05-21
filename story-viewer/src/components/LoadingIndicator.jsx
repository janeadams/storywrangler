import React from 'react';
import { usePromiseTracker } from "react-promise-tracker"
import Loader from 'react-loader-spinner'

const LoadingIndicator = () => {
    const { promiseInProgress } = usePromiseTracker()
    return (
        promiseInProgress && <div style={{
            width: "100%",
            height: "100",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute"
            }}>
        <Loader type="ThreeDots" color="#666" height="100" width="100" /></div>
    )
 }

 export default LoadingIndicator;