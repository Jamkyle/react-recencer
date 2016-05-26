const user = (state = {}, action) =>{
  switch (action.type) {
    case "CURRENT_USER":
      return action.user
      break;
    case "DECONNECT_USER":
      return {}
      break;

    default: return state

  }
}



export default user
