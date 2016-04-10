import './app.css';
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { Provider } from 'react-redux';
import createLogger from 'redux-logger';

import Root from './Root';
import reducer from './reducer';
import saga from './saga';

const logger = createLogger({
    collapsed: true
});

const store = createStore(
    reducer,
    applyMiddleware(createSagaMiddleware(saga), logger)
);

ReactDOM.render(
    <Provider store={store}>
        <Root />
    </Provider>,
    document.getElementById('root')
)
