import React, {Component} from 'react'
import _ from 'lodash'
import { helpers, firebase } from 'redux-react-firebase'
import { push, replace } from 'react-router-redux'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import { ListUsers } from 'compo/ListUsers'
import { Link } from 'react-router'
import Loading from 'compo/Loading'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'

import {ERROR_ON_LOGIN, SUCCESS_ON_LOGIN} from 'const/messages'

const { isLoaded, isEmpty, dataToJS } = helpers

@firebase(['users', 'currentUser'])
@connect(
  ({firebase, user}) => ({
    users : dataToJS(firebase, 'users'),
    user
  }),
  (dispatch) => ({
    dispatchUser : (user) => dispatch({ type:"CURRENT_USER", user }),
    login : (id)=>dispatch(replace(`/user/${id}`))
  })
)
@reduxForm({
  form: 'login',     // a unique name for this form
  fields: ['email'], // all the fields in your form
})
class Login extends Component {
  state ={ message : ''}
  validate(e){
    let bool = false
    const { users, firebase, dispatchUser, login} = this.props
    if(users != null)
      for(let i in users)
      {
        if(users[i].email === e.email)
        {
          bool=true
          firebase.set('currentUser', {...users[i], id : i })
          dispatchUser({...users[i], id : i })
          login(i)

        }
      }

      bool ? this.setState({message : SUCCESS_ON_LOGIN}) : this.setState({message : ERROR_ON_LOGIN})
  }


  render() {
    const { fields: { email }, handleSubmit, user, dispatchUser, currentUser} = this.props
    const { message } = this.state
    return (
      ( user.email == null )?
      <div>
        <form onSubmit = { handleSubmit( (data) => { this.validate(data) } ) } >
          <label>Email</label>
          <input type="mail" placeholder="email" { ...email } required/>
          <FlatButton type="submit" >Se connecter </FlatButton>
        </form>
        <RaisedButton label='as Guest' primary={true} linkButton={true} href='/users' onMouseDown={ ()=> dispatchUser({firstName: 'Guest', email : 'Guest'}) } />
        <p style={{color : 'red', fontSize: '0.8em'}}>{ message }</p>
      </div>
      : <div><p style={{color : 'red', fontSize: '0.8em'}}>{ message }</p></div>
    )
  }

}




export default Login
