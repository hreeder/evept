import axios from 'axios'

export function getTypeIDs() {
  return dispatch => dispatch({
    type: "sde.getTypeIDs",
    payload: axios.get('/sde/typeIDs.json')
  })
}

export function getGroupIDs() {
  return dispatch => dispatch({
    type: "sde.getGroupIDs",
    payload: axios.get('/sde/groupIDs.json')
  })
}