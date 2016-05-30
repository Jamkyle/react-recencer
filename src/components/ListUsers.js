import React, {Component} from 'react'
import {Link} from 'react-router'
import {List, ListItem, MakeSelectable} from 'material-ui/List';


export class ListUsers extends Component{
  render(){
    const {users, admin} = this.props
    // console.log(users)
    // let usersList = users.map((user, i) => {console.log(user);
    //   let section = user.sections.map((section)=> { return <span key={section}>{section} </span>})
    //     return <li key={i}>Prenom : {user.firstName} Nom : {user.lastName} email : {user.email} Sections : {section} </li>
    // })
    let usersList = _.map(users, (user, id) => { return <ListItem key={id}>Prenom : {user.firstName} Nom : {user.lastName} email : {user.email} Sections : {_.map(user.sections, el => el+" ")} {(admin)? <Link to={`/user/${id}`}> editer</Link> : null} </ListItem>})

    return (<div> <ul> {usersList} </ul> </div>)
  }
}
