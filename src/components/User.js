import React, {Component} from 'react'
import _ from 'lodash'
import { helpers, firebase } from 'redux-react-firebase'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { reduxForm } from 'redux-form'
import { ListUsers } from 'compo/ListUsers'
import Register from 'compo/Register'
import { Link } from 'react-router'
import Loading from 'compo/Loading'
import {ObjectSelect} from 'compo/ObjectSelect'
import {style} from 'styles/style'

import { List, ListItem } from 'material-ui/List';
import TextField from 'material-ui/TextField';
import CheckBox from 'material-ui/CheckBox';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentCreate from 'material-ui/svg-icons/content/create';

import {ERROR_ON_REGISTER} from 'const/messages'

const { isLoaded, isEmpty, dataToJS } = helpers
const localMod = JSON.parse(localStorage.getItem('userMod')) || {}

@firebase(
  ({params}) => ([ 'sections', 'users' ])
)
@connect(
  ({firebase, user}, {params}) => ({
    modUser : dataToJS(firebase, `users/${params.userId}`) || localMod,
    currentUser : user,
    Sections : dataToJS(firebase, 'sections')
  }),
  (dispatch) => ({ goTo : (path) => dispatch( push(path) ) })
)
@reduxForm({
  form: 'user',     // a unique name for this form
  fields: ['firstName', 'lastName', 'email', 'sections', 'admin'], // all the fields in your form
},
(state, props) => ({ initialValues : dataToJS(state.firebase, `users/${props.params.userId}`) || localMod})
)
class User extends Component {

  render() {
      const { back, Sections,  params, currentUser, modUser, goTo} = this.props
      let form, buttonModif

      let allSections = (isEmpty(Sections) ) ?
      [{id: 0, name : 'aucun', description : 'aucun element'}]
      : _.map(Sections)

      let listSections = _.map(
        Sections, (section, id) => {
            if( _.indexOf( modUser.sections, section.name)!== -1 )
              return (
              <ListItem
               key={id}
               onTouchTap={
                 () => goTo(`/section/${id}`)
               }
              >
                { section.name }
              </ListItem>)
            }
          )

      if(currentUser.id === params.userId || currentUser.admin )
      {
        buttonModif = <CardHeader
          title={
            <FloatingActionButton >
              <ContentCreate />
            </FloatingActionButton>
          }
          actAsExpander={true}
         />
        form = (
          <CardText expandable={true} >
            <Register id={params.userId} button={'Modifier'} localMod={localMod}/>
          </CardText>
        )
      }

      return (
        <Paper style={ { position : 'relative' } } zDepth={3}>
          <Card style={style.profile} >
            <CardHeader
            title="Profile"
            subtitle={`${modUser.firstName} ${modUser.lastName}`}
            avatar="http://lorempixel.com/people/100/100/"
            />
            <div>Fait parti de(s) section(s): {listSections}</div>
          {buttonModif}
          {form}
          </Card>
        </Paper>
      )

    }
  }


  export default User
