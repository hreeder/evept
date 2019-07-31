import getAxios from '../axios'

export function getCharacters() {  
  return async dispatch => {

    dispatch({
      type: "characters.getCharacters",
      payload: getAxios().get('/rolodex/characters')
    })
}
}

export function toggleQueue() {
  return dispatch => dispatch({type: "characters.toggleQueue"})
}