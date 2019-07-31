import React from 'react'

import { auth } from '../../App'

const Auth0Callback = props => {
  console.log(props)
  if (props.location.hash) {
    auth.handleAuth()
  }
  return (
    <div>
      Auth Callback
    </div>
  )
}

export default Auth0Callback