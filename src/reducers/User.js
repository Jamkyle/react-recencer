
const localUser = JSON.parse(localStorage.getItem('currentUser'))
const user = (state = localUser || {}, action) =>{
  switch (action.type) {
    case "CURRENT_USER":
      return {...action.user, isAuth : true}
      break;
    case "DECONNECT_USER":
      return {}
      break;
    case "UPDATE_USER":
      return {...action.user, isAuth : true}
      break;
    default: return state

  }
}



export default user
