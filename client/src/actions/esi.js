import getAxios from '../axios'

export function addCharacter(code) {
  return dispatch => dispatch({
    type: "esi.addCharacter",
    payload: getAxios().post('/rolodex/esi/addchar', {
      code: code
    })
  })
}