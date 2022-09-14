import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import {applyMiddleware, createStore, compose} from 'redux';
import allReducer from './reducers';
import {Provider} from 'react-redux';
import './firebase';
import thunk from 'redux-thunk';


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(
  allReducer,
  composeEnhancers(
  applyMiddleware(thunk)
  )
  //window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );


ReactDOM.render(
  <React.StrictMode>

    <Provider store={store}>
      <App />
    </Provider>

  </React.StrictMode>,
  document.getElementById('root')
);

// import { createStore } from 'redux';

// const reducer = (state = 0, action) => {


//   switch(action.type) {
//     case 'INCREMENT':
//       return state + 1;

//     default:
//     return state;
//   }
// };

// const store = createStore(reducer);

// store.subscribe(() => {
//   console.log('current state', store.getState());
// });

// store.dispatch({
//   type: 'INCREMENT'
// });

// store.dispatch({
//   type: 'INCREMENT'
// });

// store.dispatch({
//   type: 'DECREMENT'
// });