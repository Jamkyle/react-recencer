
export const normalizeAge = (value, previousValue) => {
  if (!value) {
   return value
 }
  if( !isNaN(value) && value.length < 3 )
    return value
  else
    return previousValue

}
