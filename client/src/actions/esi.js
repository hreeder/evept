import { API } from 'aws-amplify'

export function addCharacter(code) {
  return dispatch => dispatch({
    type: "esi.addCharacter",
    payload: API.post('evept', '/esi/addchar', {
      body: {
        from: 'react',
        code: code
      }
    })
  })
}