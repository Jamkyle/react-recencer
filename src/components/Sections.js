import React, {Component} from 'react'
import _ from 'lodash'
import { helpers, firebase } from 'redux-react-firebase'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import { List } from 'compo/List'
import  { allSections } from 'const/const'
import Loading from 'compo/Loading'
import { Link } from 'react-router'

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

    (bool )? this.setState({message :'cette email est déjà utilisé'})
    :firebase.push('sections', { ...e }, () => this.setState({message : 'a bien été ajouté'}) )
  }
  render() {
    const { routes, firebase, fields: { name, description }, handleSubmit, sections, user } = this.props
    // console.log(sections);
    let sectionsList = (!isLoaded(sections)) ?
                          <Loading />
                        : (isEmpty(sections) ) ?
                              'sections is empty'
                            : _.map(sections, (section, id) => {return <li key={id}>{section.name} - {section.description} <Link to={`/sections/section/${id}`}> editer </Link></li>})
    return user.admin ? (
      <div>
      <form onSubmit = { handleSubmit( (data) => { this.validate(data) } ) }>
      <label>Name</label>
      <input type="text" placeholder="Name" { ...name } required/>
      <label>Description</label>
      <textarea rows='10' cols='30' { ...description}/>
      <button type="submit" >Ajouter Section</button>
      </form>
      <ul>
      { sectionsList }
      </ul>
      <Link to='/'>back</Link>
      {this.props.children}
      </div>
    ) : (
      <div>
      {this.props.children}
      <button onClick={()=>history.goBack()}> back </button>
      </div>
    )
  }

}




export default Sections
