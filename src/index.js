import React from 'react';
import {render} from 'react-dom';
import App from 'compo/App';
import Login from 'compo/Login';
import Sections from 'compo/Sections';
import Section from 'compo/Section';
import Register from 'compo/Register';
import Users from 'compo/Users';
import User from 'compo/User';
import Pages from 'compo/Pages';

import 'compo/styles/style.scss'

// redux
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { Router, Route, browserHistory, IndexRoute, Redirect } from 'react-router'
import { syncHistoryWithStore, routerReducer as routing, routerMiddleware } from 'react-router-redux'
import users from 'reducers/Users'
import user from 'reducers/User'
import sections from 'reducers/Sections'
import { reducer as formReducer } from 'redux-form'
import {reduxReactFirebase, firebaseStateReducer} from 'redux-react-firebase'
// material
import {blue900} from 'material-ui/styles/colors';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// middleware
import { localMiddleware } from 'middleware/localMiddleware'

injectTapEventPlugin();

const reducers = combineReducers({
  firebase : firebaseStateReducer,
  form : formReducer,
  users,
  user,
  routing
})

const store = createStore(
  reducers,
  compose(
    reduxReactFirebase("https://recenser.firebaseio.com/"),
    applyMiddleware(
      routerMiddleware(browserHistory),
      localMiddleware
    )
  )
)

const history = syncHistoryWithStore(browserHistory, store)

import './main.scss';

const requiredAuth = (nextState, replace) => {
  if( !store.getState().user.isAuth){
    console.log('not logged');
    replace({
      pathname : '/',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

const Routes = (

    <Provider store={store}>
      <MuiThemeProvider muiTheme={
        getMuiTheme({
          appBar : {
            height :50,
            background: blue900
          }
        })
      }>
        <Router history={history}>
            <Route path='/' component={App}>
              <IndexRoute component={Login} />
              <Route path='/register' component={Register} />
              <Route path='/' component={Pages} onEnter={requiredAuth}>
                <Route path='sections' component={Sections} />
                <Route path='/section/:sectionId' component={Section}/>
                <Route path='users' component={Users} />
                <Route path='/user/:userId' component={User}/>
              </Route>
          </Route>
        </Router>
      </MuiThemeProvider>
    </Provider>

)

render(Routes, document.getElementById('app'));
