import React, {Component} from 'react'
import _ from 'lodash'
import { helpers, firebase } from 'redux-react-firebase'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import { List } from 'compo/List'
import Register from 'compo/Register'
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
  form: 'users',     // a unique name for this form
  fields: ['firstName', 'lastName', 'email', 'sections'], // all the fields in your form
  initialValues : {
    sections : []
  }
})
class Users extends Component {

  render() {
    const { Sections, firebase, fields: { firstName, lastName, email, sections }, handleSubmit, users } = this.props
    // console.log(sections);
    let usersList = (!isLoaded(users)) ?
                          <Loading />
                        : (isEmpty(users) ) ?
                              'users is empty'
                            : <List users={ users }/>

    return (
      <div>
      <Register button={'ajouter utilisateur'}/>
      { usersList }

      <Link to={'/'} > home </Link>
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

export default Users
