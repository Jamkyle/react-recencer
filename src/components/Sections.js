import React, {Component} from 'react'
import _ from 'lodash'
import { helpers, firebase } from 'redux-react-firebase'
import { connect } from 'react-redux'
import { goBack, push } from 'react-router-redux'
import { reduxForm } from 'redux-form'
import { ListUsers } from 'compo/ListUsers'
import  { allSections } from 'const/const'
import Loading from 'compo/Loading'
import { Link } from 'react-router'

import {List, ListItem, MakeSelectable} from 'material-ui/List';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton'
import ActionAssignment from 'material-ui/svg-icons/action/assignment'
import ActionVisibility from 'material-ui/svg-icons/action/visibility'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import {ERROR_ON_LOGIN, SUCCESS_ADD_SECTION, ERROR_ADD_SECTION} from 'const/messages'
const { isLoaded, isEmpty, dataToJS } = helpers

@firebase(['sections', 'users'])
@connect(({firebase, user}) => ({
  sections : dataToJS(firebase, 'sections'),
  users : dataToJS(firebase, 'users'),
  user
}),
(dispatch)=> ({goTo : (id) => dispatch(push(`/section/${id}`)) })
)
@reduxForm({
  form: 'sections',     // a unique name for this form
  fields: ['name', 'description'], // all the fields in your form
})
class Sections extends Component {
  state = {message : ''}
  validate(e){
    let bool = false, message

    const { sections, firebase } = this.props
    if(sections != null)
      for(let i in sections){
        if(sections[i].name === e.name)
          bool = true
      }

    if (bool )
      this.setState({message : ERROR_ADD_SECTION })
    else {
      let ref = firebase.push('sections')
      ref.set({...e, id:ref.key()})
      this.setState({ message : SUCCESS_ADD_SECTION })
    }
  }

  render() {
    const { routes, firebase, fields: { name, description }, handleSubmit, sections, user, users, back, goTo } = this.props
    // console.log(sections);
    let title = '', form = null
    let sectionsList = (!isLoaded(sections)) ?
                          <Loading />
                        : (isEmpty(sections) ) ?
                              'sections is empty'
                            : _.map(sections, (section, id) => {
                               return (
                                 <ListItem
                                  key={id}
                                  nestedItems={
                                    _.map(users, (user, i)=>{
                                      return (
                                        _.indexOf(user.sections, section.name)!== -1 ) ?
                                        <ListItem key={i}> { user.firstName } </ListItem>
                                        : null
                                    })
                                  }
                                  primaryTogglesNestedList={true}
                                  primaryText={section.name}
                                  secondaryText={section.description}
                                  rightIconButton={
                                    (user.admin)?
                                    <IconButton
                                       tooltip='editer'
                                       onClick={
                                         ()=> { goTo(id) }
                                       }
                                     >
                                      <ActionAssignment />
                                     </IconButton>
                                     :<IconButton
                                        tooltip='voir'
                                        onClick={
                                          ()=> { goTo(id) }
                                        }
                                      >
                                       <ActionVisibility />
                                      </IconButton>
                                   }
                                  >{/*ListItem*/}

                                 </ListItem>
                                )
                              })
      if(user.admin)
       {
        title = 'Gestionnaire de Sections'
        form =(
          <form onSubmit = { handleSubmit( (data) => { this.validate(data) } ) }>
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
            <RaisedButton type="submit" >Ajouter</RaisedButton>
          </form>
       )
      }
       else title = 'Sections'


    return (
      <div>
        <CardHeader title={title}/>
        {form}
        <Subheader>Liste de toutes les sections</Subheader>
        <List>
          { sectionsList }
        </List>
      </div>
    )
  }

}




export default Sections
