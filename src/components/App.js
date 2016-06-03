import React, {Component} from 'react'
import _ from 'lodash'
import { helpers, firebase } from 'redux-react-firebase'
import { connect } from 'react-redux'
import { browserHistory, push, goBack } from 'react-router-redux'
import { reduxForm } from 'redux-form'
import { Link } from 'react-router'
import Loading from 'compo/Loading'
import Register from 'compo/Register'
import AppBar from 'material-ui/AppBar';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
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
    logout : () => { dispatch({type:'DECONNECT_USER'}) },
    dispatchUser : (user) => dispatch({ type:"CURRENT_USER", user }),
    back : () => dispatch( goBack() ),
    goTo : (path) => dispatch( push(path) )
  })
)
class App extends Component {
  state = {
      open: false
    }

  deconnect(){
    const {logout} = this.props
    this.handleRequestClose();
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

    const {user, location, back, goTo} = this.props;
    let link, welcome, connecter, isAdmin, buttonBack
    if(user.email!=null){
      (user.admin) ? isAdmin='- (admin)' : isAdmin='- (membre)'
      welcome = `Bonjour ${user.firstName} ${isAdmin}`
      connecter = (<MenuItem primaryText='Se déconnecter' onTouchTap={ ()=>{this.deconnect()} } />)
    }
    else {
      if(location.pathname !== '/')
      {
        connecter = (<Link style={style.noDeco} to='/'><MenuItem primaryText="Se connecter" onTouchTap={this.handleRequestClose}/> </Link>)
      }
      welcome = ('Recensement facile et rapide')
    }
      if(user.email!=null){
      link = (<div>
                <Link to='/sections' style={style.noDeco} > <MenuItem primaryText="Sections" onTouchTap={this.handleRequestClose} /> </Link>
                <Link to='/users' style={style.noDeco}> <MenuItem primaryText="Users" onTouchTap={this.handleRequestClose} /> </Link>
                <MenuItem primaryText="Profile" onTouchTap={()=>{ goTo(`/user/${user.id}`); this.handleRequestClose() } } disabled={ (user.email==='Guest')}/>
                <Divider inset={true}/>
              </div>
            )
     }
     (location.pathname !== '/')?
      buttonBack = <FlatButton onMouseDown={ () => back() } className='buttonBack'> back </FlatButton> : null

    return (
      <div>
        <AppBar title={welcome} style={{backgroundColor: style.palette.blue900}} onLeftIconButtonTouchTap={this.showMenu}/>
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
          {buttonBack}
          {
            location.pathname === '/' ? <CardText> cette application a été créé afin de pourvoir avoir une gestion et une communication plus facile aux sein d une association </CardText> : <span>©Copyright 2016 Recenser</span>
          }
        </Card>
      </div>
    )
  }

}
export default App
