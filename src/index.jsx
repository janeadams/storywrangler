import React from 'react';
import ReactDOM from 'react-dom';
import HelloWorld from './components/HelloWorld';
import XYFrame from './components/xyframe';
import './styles/app.scss'
ReactDOM.render(
   <XYFrame />,
   document.getElementById('app')
);
