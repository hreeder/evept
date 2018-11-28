import { API } from 'aws-amplify'

export function getCharacters() {
  return dispatch => dispatch({
    type: "characters.getCharacters",
    payload: API.get('evept', '/characters', {})
  })
}

export function toggleQueue() {
  return dispatch => dispatch({type: "characters.toggleQueue"})
}