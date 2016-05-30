import _ from 'lodash'

export const localMiddleware = store => next => action => {

  const { user , type, data, path } = action
  const localUser = JSON.parse(localStorage.getItem('currentUser'))
  console.log(action);
  switch (type) {
    case 'CURRENT_USER':
      localStorage.setItem('currentUser', JSON.stringify(user))
      break;
    case 'DECONNECT_USER':
      localStorage.removeItem('currentUser')
      break;
    case '@@reactReduxFirebase/SET':
      if( _.startsWith(path, 'users/') )
        localStorage.setItem(
          'userMod',
          JSON.stringify(
          {
           ...data,
           id: _.split( path, '/', 2 )[1]
          }
         )
        )
      else if( _.startsWith(path, 'sections/') )
        localStorage.setItem(
          'sectionMod',
          JSON.stringify(
          {
           ...data,
           id: _.split( path, '/', 2 )[1]
          }
         )
        )
      break;
    default: return next(action)

  }
  return next(action)
}
