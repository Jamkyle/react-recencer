import React, {Component} from 'react'
import _ from 'lodash'
import { helpers, firebase } from 'redux-react-firebase'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
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
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import ContentAdd from 'material-ui/svg-icons/content/add';
import SocialGroupAdd from 'material-ui/svg-icons/social/group-add';


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
    users : dataToJS(state.firebase, 'users'),
    firebaseRef: state.firebase
  }),
  (dispatch)=>({
    update : (user) => dispatch({ type:'UPDATE_USER', user }),
    goTo : (path) => dispatch(push(path))
    // addSectionUser : (section, user) => dispatch({ type:'ADD_SECTION_USER', user, section })
  })
)
@reduxForm({
    form: 'section',     // a unique name for this form
    fields: ['name', 'description'], // all the fields in your form
  },
  ({firebase}, {params}) => ({ initialValues: dataToJS(firebase, `sections/${params.sectionId}`) || localSection})
)
class Section extends Component {
  state = { message: '' }
  // delete a section with it's id
  deleteSection = (section) => {
    const {params, firebase, goTo} = this.props
    firebase.set(`sections/${section.id}`, {...section, delete:true })
    goTo('/sections')
  }
  // add a Section in an User and update
  addSectionToUser = (section, user) => {
    const {firebase} = this.props
    if(user.sections)
      firebase.set(`users/${user.id}/sections`, _.compact([...user.sections, section.name]), ()=> this.updateUser() )
    else
      firebase.set(`users/${user.id}/sections`, [section.name], ()=> this.updateUser(user) )
  }

  // render the list take in param
  listUsersRender = ( aList ) => {
    const { section } = this.props
    return _.map(
      aList, (user) => {
        return  <MenuItem
                  key={user.id}
                  primaryText={ user.firstName+' '+user.lastName}
                  onTouchTap={ ()=> this.addSectionToUser(section, user) }
                />
      }
    )
  }

  updateUser = () => {
    const { firebaseRef, update, user } = this.props
      update( dataToJS(firebaseRef, `users/${user.id}`) ) // dispatch the currentUser
  }

  validate(e){
    let bool = false, message

    const { sections, firebase, resetForm, section } = this.props
    if(sections != null)
    for(let i in sections){
      if(_.lowerCase(sections[i].name) === _.lowerCase(e.name) && i != section.id)
        bool = true
    }

    if (bool )
      this.setState({message : 'Ce nom est déjà pris' })
    else {
      firebase.set(
        `sections/${section.id}` ,
        {...section, ...e},
        () => this.setState({ message : 'Cette section à bien été mise à jour' })
      )
    }
  }

  render(){
    const {
      firebase,
      fields: { name , description },
      handleSubmit,
      section,
      params,
      user,
      users,
      update
    } = this.props
    let content, listUsers = {}, add

      listUsers = _.compact(_.map(
        users, user => {
           if( _.indexOf(user.sections, section.name)!== -1 ){
             return { ...user }
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
        <form onSubmit = { handleSubmit( (data) => { this.validate(data) } ) }>
        <TextField
          floatingLabelText="Name"
          { ...name }
        required /><br/>
        <TextField
          floatingLabelText="Description"
          multiLine
          rows={ 2 }
          { ...description }
        required /><br/>
          <RaisedButton type="submit" > Update </RaisedButton>
          <RaisedButton onClick={ ()=> this.deleteSection(section) } > Delete this section </RaisedButton>
        </form>
      )
    }
    return (
      <Card style={ style.card }>
        <CardHeader title={ section.name } subtitle={ section.description }/>
        <List>
          {content}
          {this.state.message}
          <Divider />
          <div>
            <Subheader> Membres </Subheader>
            <ul>
              {/* Button s'ajouter */}
              <IconButton
                tooltip={_.indexOf(user.sections, section.name)==-1 ? 'Faire parti de cette section' : 'Vous faites déjà parti de la section'}
                onClick={ () => this.addSectionToUser(section, user) }
                disabled = { user.email=='Guest'|| _.indexOf(user.sections, section.name)!==-1 }
              >
                <SocialGroupAdd />
              </IconButton>
              <ListUsers users={listUsers} admin={ user.admin } section={ section }/>
              {/* Button admin ajouter un utilisateur */}
              {add}
            </ul>
          </div>
        </List>

      </Card>
    )
  }
}

export default Section
