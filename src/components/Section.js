import React, {Component} from 'react'
import _ from 'lodash'
import { helpers, firebase } from 'redux-react-firebase'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import { Link } from 'react-router'

const {dataToJS, isLoaded, isEmpty, pathToJs} = helpers
@firebase(
  ({params}) => ([
    `sections/${params.sectionId}`,
    'users'
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
    const { firebase, fields: { name , description }, handleSubmit, section, params, user, users } = this.props
    let content, listUsers

    listUsers = _.map(
      users, (user, id) => {
        return _.map(user.sections, (userSection)=> {
          if(section.name === userSection) return (<li key={id}><Link to={`/user/${id}`}> { user.firstName } - </Link></li>)
        })
      }
   )
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
        content = (<div>
          <h3>Voici les membres de cette section</h3>
          <ul>{listUsers}</ul>
        </div>)
      }
    return (
      <div>
        {content}
      </div>
    )
  }
}

export default Section
