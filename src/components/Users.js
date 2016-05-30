import React, {Component} from 'react'
import _ from 'lodash'
import { helpers, firebase } from 'redux-react-firebase'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import { ListUsers } from 'compo/ListUsers'
import {List, ListItem, MakeSelectable} from 'material-ui/List';
import Register from 'compo/Register'
import {Link} from 'react-router'
import Loading from 'compo/Loading'
import {Card, CardHeader, CardTitle, CardText} from 'material-ui/Card';

const { isLoaded, isEmpty, dataToJS } = helpers



@firebase([ 'users', 'sections' ])
@connect(({firebase, user}) => ({
  user,
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
    const { Sections, firebase, fields: { firstName, lastName, email, sections }, handleSubmit, users, user } = this.props
    // console.log(sections);
    let title = 'Utilisateurs';
    (user.admin)? title= "Gestionnaire d'utilisateurs" : null;
    let usersList = (!isLoaded(users)) ?
                          <Loading />
                        : (isEmpty(users) ) ?
                              'users is empty'
                            : <ListUsers users={ users } admin={user.admin}/>

    return (
      <div>
      <CardHeader title={title} subtitle='listes des utilisateurs' />
        {user.admin ? <Register button={'ajouter utilisateur'}/> : null}
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
