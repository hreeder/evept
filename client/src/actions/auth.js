import { Auth } from 'aws-amplify'

export function logInUser(username, password){
  return dispatch => dispatch({
    type: "auth.login",
    payload: Auth.signIn(username, password)
  }).then(() => dispatch(getLoggedInUser()))
    .catch(err => {
      // This promise is rejected if we don't have correct credentials
      // We're handling this mostly with the reducer though, so we can
      // safely ignore it here
    })
}

export function logOutUser() {
  return dispatch => dispatch({
    type: "auth.logout",
    payload: Auth.signOut()
  }).then(() => dispatch(getLoggedInUser()))
}

export function getLoggedInUser() {
  return dispatch => dispatch({
    type: "auth.getLoggedInUser",
    payload: Auth.currentAuthenticatedUser()
  }).catch(err => {
    // We expect this to be rejected with "not authenticated" when we're
    // not authenticated. This is primarily handled in the reducer, but
    // we put this here to avoid nasty console messages about unhandled
    // promise rejections
  })
}