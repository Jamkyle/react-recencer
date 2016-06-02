import React, {Component} from 'react'
import _ from 'lodash'
import { helpers, firebase } from 'redux-react-firebase'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import {Link} from 'react-router'
import Loading from 'compo/Loading'
import {ObjectSelect} from 'compo/ObjectSelect'

import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Menu from 'material-ui/Menu';
import DropDownMenu from 'material-ui/DropDownMenu';
import Popover from 'material-ui/Popover';

import {SUCCESS_ON_REGISTER} from 'const/messages'
import styles from 'styles/style'
const { isLoaded, isEmpty, dataToJS } = helpers

@firebase([ 'users', 'sections' ])
@connect(({firebase}) => ({
  users : dataToJS(firebase, 'users'),
  Sections : dataToJS(firebase, 'sections')
})
// (dispatch) => ({ pUser : (user) => dispatch({type:"ADD_USER", user}), pSection : (section) => dispatch({type:"ADD_SECTION", section}) })
)
@reduxForm({
  form: 'register',     // a unique name for this form
  fields: ['firstName', 'lastName', 'email', 'sections'], // all the fields in your form
  initialValues : {
    sections : []
  }
})
class Register extends Component {
  state = { message : '' }

  validate(e){
    let bool = false

    const { users, firebase} = this.props
    if(users != null)
      for(let i in users){
        if(users[i].email === e.email)
          bool = true
      }

        if(bool )
          this.setState({message :ERROR_ON_REGISTER})
        else {
          let ref = firebase.push('users')
          ref.set({ ...e, id:ref.key() })
          this.setState({message : SUCCESS_ON_REGISTER})
        }
  }

  render() {
    const { Sections, fields: { firstName, lastName, email, sections }, handleSubmit, button} = this.props
    let buttonName = button || 'Enregistrer'
    const { message } = this.state
    // console.log(sections);

    let allSections = (isEmpty(Sections) ) ?
    [{id: 0, name : 'aucun', description : 'aucun element'},]
    : _.map(Sections)
    return (
      <div>
        <form onSubmit = { handleSubmit( (data) => { this.validate(data) } ) } >
          <TextField
            floatingLabelText="Prénom"
            { ...firstName }
          required /><br/>
          <TextField
            floatingLabelText="Nom"
            { ...lastName }
          required /><br/>
          <TextField
            floatingLabelText="Email"
            { ...email }
            type="email"
          required /><br/>
          <ObjectSelect multiple array={ allSections } title='section' field={'name'} {...sections}/>
          <RaisedButton type="submit" >{buttonName}</RaisedButton>
        </form>
        <p style={{color : 'red', fontSize: '0.8em'}}>{ message }</p>

      </div>
    )
  }

}



export default Register
