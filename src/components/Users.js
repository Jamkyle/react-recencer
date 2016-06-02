import React, {Component} from 'react'
import _ from 'lodash'
import { helpers, firebase } from 'redux-react-firebase'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import { ListUsers } from 'compo/ListUsers'
import {List, ListItem, MakeSelectable} from 'material-ui/List';
import Register from 'compo/Register'
import ObjectSelect from 'compo/ObjectSelect'

import {Link} from 'react-router'
import Loading from 'compo/Loading'
import {Card, CardHeader, CardTitle, CardText} from 'material-ui/Card';

import {style} from 'styles/style'

const { isLoaded, isEmpty, dataToJS } = helpers



@firebase([ 'users' ])
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

      </div>
    )
  }

}

export default Users
