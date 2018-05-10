import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer, setConfig } from 'react-hot-loader';

import './polyfills';
import './styles/index.scss';

import App from './containers/App';


const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('root')
  );
};

render(App);

if (process.env.NODE_ENV === 'production') {
  require('./pwa');
}
if (process.env.NODE_ENV === 'development') {
  setConfig({ logLevel: 'debug' });
  if (module.hot) {
    module.hot.accept(() => {
      render(App);
    });
  }
}
