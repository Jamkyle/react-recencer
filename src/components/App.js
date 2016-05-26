import React, {Component} from 'react'
import _ from 'lodash'
import { helpers, firebase } from 'redux-react-firebase'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import { List } from 'compo/List'
import { Link } from 'react-router'
import Loading from 'compo/Loading'
import Register from 'compo/Register'

const { isLoaded, isEmpty, dataToJS } = helpers

@connect( ({user}) => ({
    user
  }),
  (dispatch)=>({ reset : () => dispatch({type:'DECONNECT_USER'}) })
)
class App extends Component {

  render() {
    const {user, reset} = this.props

    let link, welcome, connecter, isAdmin
    if(user.email!=null){
      (user.admin) ? isAdmin=<span>(admin)</span> : null
      welcome = (<h1>Bonjour {user.firstName} {isAdmin}</h1>)
      connecter = (<div onClick={()=>reset()} ><Link to='/' > Se déconnecter </Link></div>)
    }else {
      welcome = (<h1>Connectez vous ou Recensez vous</h1>)
      connecter = (<div><Link to='/' >Se connecter</Link></div>)
    }
    if(user.admin)
      link = (<div><Link to='/sections' > Sections </Link> <Link to='/users' > Users </Link></div>)
    else if(user.email!=null){

      link = (<div> <Link to={`/user/${user.id}`}> Profile </Link> </div>)

     }

    return (
      <div>
        {welcome}
        <Link to='/register' > Se recenser</Link>
        {connecter}
        {link}
        {this.props.children}
      </div>
    )
  }

}
export default App
