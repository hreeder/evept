import getAxios from '../axios'

export function getCharacters() {
  return dispatch => dispatch({
    type: "characters.getCharacters",
    payload: getAxios().get('/rolodex/characters')
  })
}

export function getCharacterSkills(characterID) {
  return dispatch => dispatch({
    type: "characters.getCharacterSkills",
    payload: getAxios().get(`/rolodex/characters/${characterID}/skills`)
  })
}

export function toggleQueue() {
  return dispatch => dispatch({ type: "characters.toggleQueue" })
}