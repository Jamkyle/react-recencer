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
import { syncHistoryWithStore, routerReducer, routerReducer as routing } from 'react-router-redux'
import users from 'reducers/Users'
import user from 'reducers/User'
import userMod from 'reducers/UserMod'
import sections from 'reducers/Sections'
import { reducer as formReducer } from 'redux-form'
import {reduxReactFirebase, firebaseStateReducer} from 'redux-react-firebase'


const reducers = combineReducers({
  firebase : firebaseStateReducer,
  form : formReducer,
  users,
  user,
  userMod,
  routing
})


const storeWithFirebase = compose(reduxReactFirebase("https://recenser.firebaseio.com/"),)(createStore)

const store = storeWithFirebase(
  reducers,
  {
    users : [],
    user : {},
    userMod : {}
  }
)

const history = syncHistoryWithStore(browserHistory, store)

import './main.scss';

const Routes = (
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRoute component={Login} />
        <Route path='register' component={Register} />
        <Route path='sections' component={Sections} >
          <Route path='/sections/section/:sectionId' component={Section}/>
        </Route>
        <Route path='users' component={Users} />
        <Route path='/user/:userId' component={User}/>
      </Route>
    </Router>
  </Provider>
)

render(Routes, document.getElementById('app'));
