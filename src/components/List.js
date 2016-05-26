import React, {Component} from 'react'
import {Link} from 'react-router'


export class List extends Component{
  render(){
    const {users} = this.props
    // console.log(users)
    // let usersList = users.map((user, i) => {console.log(user);
    //   let section = user.sections.map((section)=> { return <span key={section}>{section} </span>})
    //     return <li key={i}>Prenom : {user.firstName} Nom : {user.lastName} email : {user.email} Sections : {section} </li>
    // })
    let usersList = _.map(users, (user, id) => { return <li key={user.email}>Prenom : {user.firstName} Nom : {user.lastName} email : {user.email} Sections : {_.map(user.sections, el => el+" ")} <Link to={`/user/${id}`}> editer</Link> </li>})
    return (<div> <ul> {usersList} </ul> </div>)
  }
}
