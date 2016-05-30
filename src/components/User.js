import React, {Component} from 'react'
import _ from 'lodash'
import { helpers, firebase } from 'redux-react-firebase'
import { connect } from 'react-redux'
import { goBack } from 'react-router-redux'
import { reduxForm } from 'redux-form'
import { ListUsers } from 'compo/ListUsers'
import Register from 'compo/Register'
import { Link } from 'react-router'
import Loading from 'compo/Loading'

import {ERROR_ON_REGISTER} from 'const/messages'

const { isLoaded, isEmpty, dataToJS } = helpers
const localMod = JSON.parse(localStorage.getItem('userMod')) || {}

@firebase(
  ({params}) => ([ `users/${params.userId}`, 'sections' ])
)
@connect(
  ({firebase, user}, {params}) => ({
    modUser : dataToJS(firebase, `users/${params.userId}`) || localMod,
    currentUser : user,
    Sections : dataToJS(firebase, 'sections')
  }),
  (dispatch) =>({ back : ()=> dispatch(goBack()) })
)
@reduxForm({
  form: 'user',     // a unique name for this form
  fields: ['firstName', 'lastName', 'email', 'sections', 'admin'], // all the fields in your form
}
)
class User extends Component {

  state = {message : ''}
  validate(e){
    const { users, firebase, params } = this.props
    let bool = false, message
    e.admin = false
    if(users != null)
      for(let i in users){
        if(users[i].email === e.email && i != params.userId)
          bool = true
      }
    if(bool)
      this.setState({message : ERROR_ON_REGISTER })
    else {
      firebase.set(`users/${params.userId}`, {...e} )
      this.setState({message : 'a bien été modifié'})
    }
  }

  render() {
      const { back, Sections, fields: { firstName, lastName, email, sections, admin },params, currentUser, modUser, handleSubmit} = this.props
      const { message } = this.state
      let form
      let allSections = (isEmpty(Sections) ) ?
      [{id: 0, name : 'aucun', description : 'aucun element'},]
      : _.map(Sections)

      let listSections = _.map(
        Sections, (section, id) => {
          return _.map(modUser.sections, (userSection)=> {
            if(section.name === userSection) return <Link key={id} to={`/section/${id}`}> { userSection } - </Link>
          })
        }
      )

      if(currentUser.id === params.userId )
      {
        form = (
          <div>
            <form onSubmit = { handleSubmit( (data) => { this.validate(data) } ) } >
              <label>First Name</label>
              <input type="text" placeholder={modUser.firstName} { ...firstName } required/>
              <label>Last Name</label>
              <input type="text" placeholder={modUser.lastName} { ...lastName } required/>
              <label>Email</label>
              <input type="mail" placeholder={modUser.email} { ...email } required/>
              {currentUser.admin ? <label>admin <input type="checkbox" { ...admin } defaultChecked={ currentUser.admin }/></label> : ''}
              <label>Sections</label>
              <ObjectSelect multiple option={ allSections } {...sections}/>
              <button type="submit" >Modifier</button>
            </form>
          </div>
        )
      }

      return (
        <div>
          <div>
            <h1>{modUser.firstName} {modUser.lastName} Profile</h1>
            <div>Fait parti de(s) section(s): {listSections}</div>
          </div>
          {form}
          <p style={{color : 'red', fontSize: '0.8em'}}>{ message }</p>
          <button onClick={()=>{ back() } }> back </button>
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

  export default User
