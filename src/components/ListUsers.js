import React, {Component} from 'react'
import {Link} from 'react-router'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'
import { helpers, firebase } from 'redux-react-firebase'
import _ from 'lodash'

import {style} from 'styles/style'

import {List, ListItem, MakeSelectable} from 'material-ui/List';
import ContentRemoveCircle from 'material-ui/svg-icons/content/remove-circle';
import IconButton from 'material-ui/IconButton'

const { dataToJS } = helpers

@firebase([
  'users'
])
@connect((state, props) => ({
    section : props.section || {},
    currentUser : state.user,
    firebaseRef : state.firebase
  }),
  (dispatch) => ({
    goTo : (id) => dispatch(push(`/user/${id}`)),
    update : (user) => dispatch({ type:'UPDATE_USER', user })
  })
)
export class ListUsers extends Component{

  updateUser = () => {
    const { firebaseRef, currentUser, update } = this.props
    update( dataToJS(firebaseRef, `users/${currentUser.id}`) )

  }

  render(){

    const {users, admin, firebase, goTo, section, currentUser} = this.props
    // console.log(users)
    // let usersList = users.map((user, i) => {console.log(user);
    //   let section = user.sections.map((section)=> { return <span key={section}>{section} </span>})
    //     return <li key={i}>Prenom : {user.firstName} Nom : {user.lastName} email : {user.email} Sections : {section} </li>
    // })

    let usersList = _.map(users,
      user => {
        let index
        if(admin || user.id === currentUser.id){ index  = _.findIndex(user.sections, (aSection) => aSection == section.name) }

        return (
          <ListItem
          key={user.id}
            onTouchTap={
              () => goTo(user.id)
            }
            rightIconButton={
               ( (admin || user.id === currentUser.id) && location.pathname!=='/users' ) ? <IconButton
                          tooltip='retirer'
                          onClick={
                            ()=> {
                              firebase.remove( `users/${user.id}/sections/${index}`, () => this.updateUser() );
                            }
                          }
                        >
                          <ContentRemoveCircle />
                        </IconButton>
                        : null
            }
          >
           {user.firstName} {user.lastName}
         </ListItem>
        )
      }
     )

    return (<div> <ul> {usersList} </ul> </div>)
  }
}
