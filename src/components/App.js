import React, {Component} from 'react'
import _ from 'lodash'
import { helpers, firebase } from 'redux-react-firebase'
import { connect } from 'react-redux'
import { browserHistory, push, go } from 'react-router-redux'
import { reduxForm } from 'redux-form'
import { Link } from 'react-router'
import Loading from 'compo/Loading'
import Register from 'compo/Register'
import AppBar from 'material-ui/AppBar';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import {Popover, PopoverAnimationVertical} from 'material-ui/Popover';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

import { style } from 'styles/style'

const { isLoaded, isEmpty, dataToJS } = helpers
const localUser = JSON.parse(localStorage.getItem('currentUser')) || {}
@firebase(['currentUser'])
@connect(
  ({firebase, user}) => ({
    currentUser: dataToJS(firebase, 'currentUser'),
    user
  }),
  (dispatch)=>({
    logout : () => dispatch(push('/')),
    reset : () => dispatch({type:'DECONNECT_USER'}),
    dispatchUser : (user) => dispatch({ type:"CURRENT_USER", user }),
  })
)
class App extends Component {
  state = {
      open: false
    }

  deconnect(){
    const {reset, logout} = this.props
      reset()
      logout()
  }

  showMenu = (event) => {
    event.preventDefault();
    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  }

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  }

  render() {

    const {user, location} = this.props;
    let link, welcome, connecter, isAdmin
    if(user.email!=null){
      (user.admin) ? isAdmin='- (admin)' : isAdmin='- (membre)'
      welcome = `Bonjour ${user.firstName} ${isAdmin}`
      connecter = (<MenuItem primaryText='Se déconnecter' onTouchTap={()=>{this.handleRequestClose();this.deconnect()}} />)
    }
    else {
      if(location.pathname != '/')
        connecter = (<Link style={style.noDeco} to='/'><MenuItem primaryText="Se connecter" onTouchTap={this.handleRequestClose}/> </Link>)
      welcome = ('Recensement facile et rapide')
    }
      if(user.email!=null){
      link = (<div>
                <Link to='/sections' style={style.noDeco} > <MenuItem primaryText="Sections" onTouchTap={this.handleRequestClose} /> </Link>
                <Link to='/users' style={style.noDeco}> <MenuItem primaryText="Users" onTouchTap={this.handleRequestClose} /> </Link>
                <Link to={`/user/${user.id}`} style={style.noDeco}> <MenuItem primaryText="Profile" onTouchTap={this.handleRequestClose} /> </Link>
              </div>
            )
     }

    return (
      <div>
        <AppBar title={welcome} onLeftIconButtonTouchTap={this.showMenu}/>
        <Popover open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this.handleRequestClose}
          animation={PopoverAnimationVertical}>
          <Menu>
            {link}
            <Link to='/register' style={style.noDeco}><MenuItem primaryText="Se recenser" onTouchTap={this.handleRequestClose} /></Link>
            {connecter}
          </Menu>
        </Popover>
        <Card style={style.card}>
        {this.props.children}
        </Card>
      </div>
    )
  }

}
export default App
