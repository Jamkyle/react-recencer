import _ from 'lodash'

const sections = (state = [], action) =>{
  switch (action.type) {
    case "ADD_SECTION":
      return _.uniq([...state, action.section])
      break;
    default: return state
  }
}
export default sections
