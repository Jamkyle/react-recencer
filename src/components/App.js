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
const localUser = JSON.parse(localStorage.getItem('currentUser')) || {}
@firebase(['currentUser'])
@connect( ({user, firebase}) => ({
    currentUser: dataToJS(firebase, 'currentUser'),
    user
  }),
  (dispatch)=>({ reset : () => dispatch({type:'DECONNECT_USER'}), dispatchUser : (user) => dispatch({ type:"CURRENT_USER", user }) })
)
class App extends Component {

  deconnect(){
    const {firebase, reset, currentUser} = this.props
      reset()
      if(localUser != null)
        localStorage.removeItem('currentUser')
  }

  componentDidMount(){
    const {user, dispatchUser} = this.props;
    (!isEmpty(localUser) && isEmpty(user) )? dispatchUser(localUser) : null
  }

  render() {
    const {user} = this.props;



    let link, welcome, connecter, isAdmin
    if(user.email!=null){
      (user.admin) ? isAdmin=<span>(admin)</span> : null
      welcome = (<h1>Bonjour {user.firstName} {isAdmin}</h1>)
      connecter = (<div onClick={()=> this.deconnect()} ><Link to='/' > Se déconnecter </Link></div>)
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
