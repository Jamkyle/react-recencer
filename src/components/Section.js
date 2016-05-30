import React, {Component} from 'react'
import _ from 'lodash'
import { helpers, firebase } from 'redux-react-firebase'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import Avatar from 'material-ui/Avatar';
import { Link } from 'react-router'
import {List, ListItem, MakeSelectable} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import {CardHeader} from 'material-ui/Card';

import {style} from 'styles/style'

const {dataToJS, isLoaded, isEmpty, pathToJS} = helpers

let SelectableList = MakeSelectable(List)

@firebase(
  ({params}) => ([
    `sections/${params.sectionId}`,
    'users',
    'sections'
  ])
)
@connect(
  (state, {params}) =>({
    section : dataToJS(state.firebase, `sections/${params.sectionId}`),
    user : state.user,
    users : dataToJS(state.firebase, 'users')
  })
  // (dispatch) => ({ pUser : (user) => dispatch({type:"ADD_USER", user}), pSection : (section) => dispatch({type:"ADD_SECTION", section}) })
)
@reduxForm({
  form: 'section',     // a unique name for this form
  fields: ['name', 'description'], // all the fields in your form
}
)
class Section extends Component {

  render(){
    const { firebase, fields: { name , description }, handleSubmit, section, sections, params, user, users } = this.props
    let content, listUsers, listSections, nameSection ='', descSection = ''

    if(section != undefined )
    {
      nameSection = section.name
      descSection = section.description
      listUsers = _.map(
        users, (user, id) => {
          return _.map(user.sections, (userSection)=> {
            if(section.name === userSection)
            return (
              <Link  key={id} style={ style.noDeco }to={`/user/${id}`}>
                <ListItem>
                   { user.firstName }
                </ListItem>
              </Link>
            )
          })
        }
      )
    }

    listSections = _.map(sections, (section, id) => {
      return <Link key={id} to={`section/${id}`} style={style.noDeco} ><ListItem  primaryText={section.name} secondaryText={section.description}>
      </ListItem><Divider /></Link>
    })

    if(user.admin)
    {
      content = (
        <form onSubmit = { handleSubmit( (data) => { firebase.set(`sections/${params.sectionId}`, {...data}) } ) }>
          <label>Name</label>
          <input type="text" placeholder={ section.name } { ...name } required/>
          <label>Description</label>
          <textarea rows='10' cols='30' { ...description } placeholder={section.description}/>
          <button type="submit" >Update</button>
          <div>
            <h3>Voici les membres de cette section</h3>
            <ul>{listUsers}</ul>
          </div>
        </form>
      )
    }
    else {
      content = (
        <div>
        <Subheader> Membres </Subheader>
        {listUsers}
        </div>
      )
    }

    return (
      <div>
        <CardHeader title={nameSection} subtitle={descSection}/>
        <List>
          {content}
        </List>
      </div>
    )
  }
}

export default Section
