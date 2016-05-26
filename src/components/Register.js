import React, {Component} from 'react'
import _ from 'lodash'
import { helpers, firebase } from 'redux-react-firebase'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import { List } from 'compo/List'
import {Link} from 'react-router'
import Loading from 'compo/Loading'

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
  state = {message : ''}

  validate(e){
    let bool = false

    const { users, firebase} = this.props
    if(users != null)
      for(let i in users){
        if(users[i].email === e.email)
          bool = true
      }

        (bool )? this.setState({message :'cette email est déjà utilisé'})
        :firebase.push('users', {...e, admin : false}, () => this.setState({message : 'a bien été enregistré'}) )
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
          <label>First Name</label>
          <input type="text" placeholder="First Name" { ...firstName } required/>
          <label>Last Name</label>
          <input type="text" placeholder="Last Name" { ...lastName } required/>
          <label>Email</label>
          <input type="mail" placeholder="email" { ...email } required/>
          <label>Sections</label>
          <ObjectSelect multiple option={ allSections } {...sections}/>
          <button type="submit" >{buttonName}</button>
        </form>
        <p style={{color : 'red', fontSize: '0.8em'}}>{ message }</p>

      </div>
    )
  }

}


export class ObjectSelect extends Component {

  getValues(e){
    let sections = []
    for(let i in e.options){
      if(e.options[i].selected){
        sections.push(e.options[i].value)
      }
    }
    return sections
  }

  render(){
    const { option, multiple, onBlur, onChange, options, value, ...rest } = this.props
    return (
      <select multiple onChange = { event =>  { onChange( this.getValues(event.target) ) } }  value = { [...value] } {...rest}>
      {option.map((section, id) => <option key={id} value={section.name} >{section.name}</option>)}
      </select>
    )
  }
}



export default Register
