import React, {Component} from 'react'
import _ from 'lodash'
import { helpers, firebase } from 'redux-react-firebase'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import {Link} from 'react-router'
import Loading from 'compo/Loading'
import {ObjectSelect} from 'compo/ObjectSelect'

import TextField from 'material-ui/TextField';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import CheckBox from 'material-ui/CheckBox';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Menu from 'material-ui/Menu';
import DropDownMenu from 'material-ui/DropDownMenu';
import Popover from 'material-ui/Popover';

import {SUCCESS_ON_REGISTER, ERROR_ON_REGISTER} from 'const/messages'
import styles from 'styles/style'
const { isLoaded, isEmpty, dataToJS } = helpers

@firebase([ 'users', 'sections' ])
@connect(({firebase, user}, props) => ({
  modUser : dataToJS(firebase, `users/${props.id}`) || props.localMod,
  currentUser : user,
  users : dataToJS(firebase, 'users'),
  Sections : dataToJS(firebase, 'sections')
})
// (dispatch) => ({ pUser : (user) => dispatch({type:"ADD_USER", user}), pSection : (section) => dispatch({type:"ADD_SECTION", section}) })
)
@reduxForm({
  form: 'register',     // a unique name for this form
  fields: ['firstName', 'lastName', 'email', 'sections', 'age', 'gender', 'admin'], // all the fields in your form
}
,
(state, props) => ({ initialValues : dataToJS(state.firebase, `users/${props.id}`) || props.localMod || { sections :[] } })
)
class Register extends Component {
  state = { message : '' }

  validate(e){
    let bool = false, sections, user

    const { users, firebase, resetForm, id, modUser } = this.props

    if(e.admin === undefined)
      e.admin = false

    if(users != null)
      {
        if(id === undefined){
          console.log('record');
          for(let i in users){
            if(users[i].email === e.email)
              bool = true
          }
          if(bool )
            this.setState({message :ERROR_ON_REGISTER})
          else {
            let ref = firebase.push('users')
              ref.set({ ...e, id:ref.key() }, ()=>{ resetForm() })
            this.setState({message : SUCCESS_ON_REGISTER})
          }
        }
        else{
          console.log('modif');
          sections = _.compact(e.sections)
          user = {...modUser, ...e, sections}

          for(let i in users){
            if(users[i].email === e.email && i != id)
              bool = true
          }
          if(bool)
            this.setState({message : ERROR_ON_REGISTER })
          else {
            firebase.set(`users/${id}`, user )
              this.setState({ message : 'a bien été modifié' })
          }
        }
      }
  }

  render() {
    const { currentUser, Sections, fields: { firstName, lastName, email, sections, age, gender, admin }, handleSubmit,onChange, button} = this.props
    let buttonName = button || 'Enregistrer'
    const { message } = this.state
    // console.log(sections);

    let allSections = (isEmpty(Sections) ) ?
    [{id: 0, name : 'aucun', description : 'aucun element'},]
    : _.map(Sections, (section) => { if(!section.delete)return section })
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
          <TextField
            floatingLabelText="Age"
            { ...age }
          required /><br/>
          <RadioButtonGroup
            name='Genre'
            valueSelected={ gender.value }
            onChange={ (e, v) => gender.onChange(v) }
            required
          >
            <RadioButton label='M.' value='M'/>
            <RadioButton label='Mme.' value='F'/>
          </RadioButtonGroup>
          {currentUser.admin ? <CheckBox label='admin' defaultChecked={ admin.checked } onCheck={ e => admin.onChange(e.target.checked) }/> : ''}<br/>
          <ObjectSelect multiple array={ allSections } title='section' field={'name'} {...sections}/>
          <RaisedButton type="submit" >{buttonName}</RaisedButton>
        </form>
        <p style={{color : 'red', fontSize: '0.8em'}}>{ message }</p>

      </div>
    )
  }

}



export default Register
