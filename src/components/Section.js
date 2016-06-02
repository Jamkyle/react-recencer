import React, {Component} from 'react'
import _ from 'lodash'
import { helpers, firebase } from 'redux-react-firebase'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import Avatar from 'material-ui/Avatar';
import { Link } from 'react-router';
import { ObjectSelect } from 'compo/ObjectSelect';
import { ListUsers } from 'compo/ListUsers';
// material
import {List, ListItem, MakeSelectable} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import {CardHeader, Card, CardText} from 'material-ui/Card';
import IconMenu from 'material-ui/IconMenu'
import IconButton from 'material-ui/IconButton'
import MenuItem from 'material-ui/MenuItem'
import FloatingActionButton from 'material-ui/FloatingActionButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import ContentAdd from 'material-ui/svg-icons/content/add';


import {style} from 'styles/style'
import { SUCCESS_ADD_SECTION, ERROR_ADD_SECTION } from 'const/messages'

const {dataToJS, isLoaded, isEmpty, pathToJS} = helpers

const localSection = JSON.parse(localStorage.getItem('sectionMod')) || {}
let SelectableList = MakeSelectable(List)

@firebase(
  ({params}) => ([
    'users'
  ])
)
@connect(
  (state, {params}) =>({
    section : dataToJS(state.firebase, `sections/${params.sectionId}`) || localSection,
    user : state.user,
    users : dataToJS(state.firebase, 'users')
  })
)
@reduxForm({
    form: 'section',     // a unique name for this form
    fields: ['name', 'description'], // all the fields in your form
  },
  ({firebase}, {params}) => ({ initialValues: dataToJS(firebase, `sections/${params.sectionId}`) || localSection})
)
class Section extends Component {

  addSection = (section, user) => {
    const {firebase} = this.props
    if(user.sections)
      firebase.set(`users/${user.id}/sections`, _.compact([...user.sections, section.name]) )
    else firebase.set(`users/${user.id}/sections`, [section.name] )

  }

  listUsersRender = ( aList ) => {
    const { section } = this.props
    return _.map(
      aList, (user) => {
        return  <MenuItem
                  key={user.id}
                  primaryText={ user.firstName+' '+user.lastName}
                  onTouchTap={ ()=> this.addSection(section, user) }
                />
      }
    )
  }

  render(){
    const { firebase, fields: { name , description }, handleSubmit, section, params, user, users } = this.props
    let content, listUsers = {}, add

      listUsers = _.compact(_.map(
        users, user => {
           if( _.indexOf(user.sections, section.name)!== -1 ){
             return {...user}
           }
        }
      ))

      let allUsers = _.differenceBy( _.toArray(users), listUsers, 'id' )

    if(user.admin)
    { add = (
        <IconMenu
          iconButtonElement={<FloatingActionButton mini children={ <ContentAdd /> } />}
          anchorOrigin={{horizontal: 'right', vertical: 'center'}}
          targetOrigin={{horizontal: 'right', vertical: 'top'}}
        >
          {this.listUsersRender(allUsers)}
        </IconMenu>
      )
      content = (
        <form onSubmit = { handleSubmit( (data) => { firebase.set(`sections/${params.sectionId}`, {...data}) } ) }>
        <TextField
          floatingLabelText="Name"
          { ...name }
        required /><br/>
        <TextField
          floatingLabelText="Description"
          multiLine
          rows={2}
          { ...description }
        required /><br/>
          <RaisedButton type="submit" >Update</RaisedButton>
        </form>
      )
    }
    return (
      <Card style={style.card}>
        <CardHeader title={section.name} subtitle={section.description}/>
        <List>
          {content}
          <Divider />
          <div>
            <Subheader> Membres </Subheader>
            <ul>
              <ListUsers users={listUsers} admin={user.admin} section={section}/>
              {add}
            </ul>
          </div>
        </List>

      </Card>
    )
  }
}

export default Section
