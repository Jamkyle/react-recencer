import React, {Component} from 'react'
import _ from 'lodash'
import { helpers, firebase } from 'redux-react-firebase'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import { ListUsers } from 'compo/ListUsers'
import {List, ListItem, MakeSelectable} from 'material-ui/List';
import  { allSections } from 'const/const'
import Loading from 'compo/Loading'
import { Link } from 'react-router'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import {ERROR_ON_LOGIN} from 'const/messages'
const { isLoaded, isEmpty, dataToJS } = helpers

@firebase(['sections'])
@connect(({firebase, user}) => ({
  sections : dataToJS(firebase, 'sections'),
  user
})
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
      firebase.push('sections', { ...e } )
      this.setState({ message : SUCCESS_ADD_SECTION })
    }
  }

  render() {
    const { routes, firebase, fields: { name, description }, handleSubmit, sections, user } = this.props
    // console.log(sections);
    let title = '', form = null
    let sectionsList = (!isLoaded(sections)) ?
                          <Loading />
                        : (isEmpty(sections) ) ?
                              'sections is empty'
                            : _.map(sections, (section, id) => {
                               return <ListItem key={id}>{section.name} - {section.description} {(user.admin)? <Link to={`section/${id}`}> editer </Link> : null} </ListItem> })
      if(user.admin)
       {
        title = 'Gestionnaire de Sections'
        form =(
          <form onSubmit = { handleSubmit( (data) => { this.validate(data) } ) }>
          <label>Name</label>
          <input type="text" placeholder="Name" { ...name } required/>
          <label>Description</label>
          <textarea rows='10' cols='30' { ...description}/>
          <button type="submit" >Ajouter Section</button>
          </form>
       )
      }
       else title = 'Sections'


    return (
      <div>
          <CardHeader title={title} subtitle='liste des sections' />
          {form}
          <List>
            { sectionsList }
          </List>
          <Link to='/'>back</Link>
        </div>
    )
  }

}




export default Sections
