import React, {Component} from 'react'
import _ from 'lodash'
import { helpers, firebase } from 'redux-react-firebase'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import { List } from 'compo/List'
import {Link} from 'react-router'
import Loading from 'compo/Loading'

const { isLoaded, isEmpty, dataToJS } = helpers

@firebase(['users'])
@connect(({firebase, user}) => ({
  users : dataToJS(firebase, 'users'),
  user
}),
(dispatch) => ({ dispatchUser : (user) => dispatch({ type:"CURRENT_USER", user }) })
)
@reduxForm({
  form: 'login',     // a unique name for this form
  fields: ['email'], // all the fields in your form
})
class User extends Component {
  state = {message : ''}

  validate(e){
    // let bool = false, message

    const { users, firebase, dispatchUser} = this.props
    if(users != null)
      for(let i in users){
        if(users[i].email === e.email)
          {dispatchUser({...users[i], id : i }); this.setState({message : users[i].firstName+' Vous etes Connecter'}) }
      }

        // (bool )? this.setState({message :'cette email est déjà utilisé'})
        // :firebase.push('users', {...e, admin : false}, () => this.setState({message : 'a bien été enregistré'}) )
  }

  render() {
    const { fields: { email}, handleSubmit, user} = this.props
    const { message } = this.state
    // console.log(sections);
    return (
      ( user.email == null )?
      <div>
        <form onSubmit = { handleSubmit( (data) => { this.validate(data) } ) } >
          <label>Email</label>
          <input type="mail" placeholder="email" { ...email } required/>
          <button type="submit" >Connect</button>
        </form>
      </div>
      : <div><p style={{color : 'red', fontSize: '0.8em'}}>{ message }</p></div>
    )
  }

}




export default User
