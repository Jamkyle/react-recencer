import React from 'react';
import {render} from 'react-dom';
import App from 'compo/App';
import Login from 'compo/Login';
import Sections from 'compo/Sections';
import Section from 'compo/Section';
import Register from 'compo/Register';
import Users from 'compo/Users';
import User from 'compo/User';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { Router, Route, browserHistory, IndexRoute, Redirect } from 'react-router'
import { syncHistoryWithStore, routerReducer as routing, routerMiddleware } from 'react-router-redux'
import users from 'reducers/Users'
import user from 'reducers/User'
import sections from 'reducers/Sections'
import { reducer as formReducer } from 'redux-form'
import {reduxReactFirebase, firebaseStateReducer} from 'redux-react-firebase'
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { localMiddleware } from 'middleware/localMiddleware'

injectTapEventPlugin();

const reducers = combineReducers({
  firebase : firebaseStateReducer,
  form : formReducer,
  users,
  user,
  routing
})


const storeWithFirebase = compose(reduxReactFirebase("https://recenser.firebaseio.com/"))(createStore)

const store = storeWithFirebase(
  reducers,
  applyMiddleware(
    routerMiddleware(browserHistory),
    localMiddleware
  )
)

const history = syncHistoryWithStore(browserHistory, store)

import './main.scss';

const Routes = (
  <MuiThemeProvider muiTheme={
    getMuiTheme()
  }>
    <Provider store={store}>
      <Router history={history}>
        <Route path="/" component={App}>
          <IndexRoute component={Login} />
          <Route path='register' component={Register} />
          <Route path='sections' component={Sections} />
          <Route path='/section/:sectionId' component={Section}/>
          <Route path='users' component={Users} />
          <Route path='/user/:userId' component={User}/>
        </Route>
      </Router>
    </Provider>
  </MuiThemeProvider>
)

render(Routes, document.getElementById('app'));
