import React, {Component} from 'react'
import _ from 'lodash'
import { helpers, firebase } from 'redux-react-firebase'
import { push, replace } from 'react-router-redux'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import { ListUsers } from 'compo/ListUsers'
import { Link } from 'react-router'
import Loading from 'compo/Loading'

import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'

import FirebaseTokenGenerator from 'firebase-token-generator'

import {ERROR_ON_LOGIN, SUCCESS_ON_LOGIN} from 'const/messages'

const tokengenerator = new FirebaseTokenGenerator('RtMBHbOo09RnqR8W8XqI1AUn0hfd3BMjYq6wwYv0')
const { isLoaded, isEmpty, dataToJS } = helpers

@firebase(['users', 'currentUser'])
@connect(
  ({firebase, user}) => ({
    users : dataToJS(firebase, 'users'),
    user
  }),
  (dispatch) => ({
    login : user => dispatch({ type:"CURRENT_USER", user })
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
    const { users, firebase, login} = this.props
    if(users != null)
      for(let i in users)
      {
        if(users[i].email === e.email)
        {
          bool=true
          login({...users[i]})
        }
      }

    // firebase.ref.authWithCustomToken(token, (error, authdata)=>{
    //     console.log(authdata);
    // })

      bool ? this.setState({message : SUCCESS_ON_LOGIN}) : this.setState({message : ERROR_ON_LOGIN})
  }


  render() {
    const { fields: { email }, handleSubmit, user, login, currentUser} = this.props
    const { message } = this.state
    return (
      ( user.email == null )?
      <div>
        <form onSubmit = { handleSubmit( (data) => { this.validate(data) } ) } >
        <TextField
          floatingLabelText="Email"
          { ...email }
          type="email"
        required />
          <FlatButton type="submit" >Se connecter </FlatButton>
          <RaisedButton label='as Guest' primary={true} onMouseDown={ ()=> { login({ firstName: 'Guest', email : 'Guest' }) } } />
        </form>
        <p style={{color : 'red', fontSize: '0.8em'}}>{ message }</p>
      </div>
      : <div><p style={{color : 'red', fontSize: '0.8em'}}>{ message }</p></div>
    )
  }

}




export default Login
