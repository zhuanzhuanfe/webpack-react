import React from 'react';
import { render } from 'react-dom';
import MyRouter from './router/index';
import Home from './components/Home/Home';
import './assets/css/common.scss';

window.Promise = require('es6-promise').Promise;

render(
  <MyRouter />,
  document.querySelector('#react')
);
