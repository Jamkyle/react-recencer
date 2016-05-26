const userMod = (state = {}, action) =>{
  switch (action.type) {
    case "CURRENT_USER_MOD":
      return action.user
      break;
    default: return state

  }
}



export default userMod
