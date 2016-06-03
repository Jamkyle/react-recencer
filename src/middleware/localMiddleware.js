import _ from 'lodash'
import {push} from 'react-router-redux'
import { firebase, helpers } from 'redux-react-firebase'


const { toJS } = helpers

export const localMiddleware = store => next => action => {

  const { user , type, data, form, section } = action
  const { dispatch , getState } = store

  switch (type) {
    case 'CURRENT_USER':
      localStorage.setItem( 'currentUser', JSON.stringify({ ...user, isAuth : true }) )
      next(action)
      if (user.id) {
        dispatch(push(`/user/${user.id}`))
      }else {
        dispatch(push('/sections'))
      }
      break;
    case 'DECONNECT_USER':
      localStorage.removeItem('currentUser')
      localStorage.removeItem('userMod')
      localStorage.removeItem('sectionMod')
      dispatch(push('/'))
      break;
    case 'UPDATE_USER' :
      next(action)
      localStorage.setItem( 'currentUser', JSON.stringify({ ...user, isAuth : true }) )
      break;
    case 'ADD_SECTION_USER' :
      next(action)
      localStorage.setItem( 'currentUser', JSON.stringify({ ...user, isAuth : true }) )
      break;
    case 'redux-form/INITIALIZE':
      let aData = {
       ...data
      }
      if( form === 'user' )
        localStorage.setItem(
          'userMod',
          JSON.stringify(aData)
        )
      else if(form === 'section' )
        localStorage.setItem(
          'sectionMod',
          JSON.stringify(aData)
        )
      break;
    default: return next(action)

  }
  return next(action)
}
