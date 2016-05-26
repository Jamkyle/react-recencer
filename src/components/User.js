import React, {Component} from 'react'
import _ from 'lodash'
import { helpers, firebase } from 'redux-react-firebase'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import { List } from 'compo/List'
import Register from 'compo/Register'
import { Link } from 'react-router'
import Loading from 'compo/Loading'

const { isLoaded, isEmpty, dataToJS } = helpers

@firebase(
  ({params}) => ([ `users/${params.userId}`, 'sections' ])
)
@connect(({firebase, user, userMod}, {params}) => ({
  modUser : dataToJS(firebase, `users/${params.userId}`),
  currentUser: user,
  Sections : dataToJS(firebase, 'sections')
})
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
    // if(users != null)
    //   for(let i in users){
    //     if(users[i].email === e.email)
    //       bool = true
    //   }

    bool ? this.setState({message :'cette email est déjà utilisé'})
    :firebase.set(`users/${params.userId}`, {...e}, () => this.setState({message : 'a bien été modifié'}) )

  }

  render() {
    const { Sections, fields: { firstName, lastName, email, sections, admin },currentUser, modUser, handleSubmit} = this.props
    const { message } = this.state
    let adminLabel = null, userMod = currentUser
    let allSections = (isEmpty(Sections) ) ?
    [{id: 0, name : 'aucun', description : 'aucun element'},]
    : _.map(Sections)
    if(currentUser.admin){
      userMod = modUser
      adminLabel = <label>
      admin <input type="checkbox" { ...admin } defaultChecked={ userMod.admin }/>
      </label>
    }

    let listSections = _.map(
      Sections, (section, id) => {
        return _.map(userMod.sections, (userSection)=> {
          if(section.name === userSection) return (<Link key={id} to={`/sections/section/${id}`}> { userSection } - </Link>)
        })
      }
   )
    return (
      <div>

        <div>
          <h1>{userMod.firstName} {userMod.lastName} Profile</h1>
          <div>Fait parti de(s) section(s): <ul>{listSections}</ul></div>
        </div>
        <form onSubmit = { handleSubmit( (data) => { this.validate(data) } ) } >
        <label>First Name</label>
        <input type="text" placeholder={userMod.firstName} { ...firstName } required/>
        <label>Last Name</label>
        <input type="text" placeholder={userMod.lastName} { ...lastName } required/>
        <label>Email</label>
        <input type="mail" placeholder={userMod.email} { ...email } required/>
        {adminLabel}
        <label>Sections</label>
        <ObjectSelect multiple option={ allSections } {...sections}/>
        <button type="submit" >Modifier</button>
        </form>
        <p style={{color : 'red', fontSize: '0.8em'}}>{ message }</p>
        <Link to={'/Users'} > return </Link>
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
