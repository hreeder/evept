import React from 'react'

import { auth } from '../../App'

const Auth0Callback = props => {
  if (props.location.hash) {
    auth.handleAuth()
  }
  return (
    <div>
      Loading...
    </div>
  )
}

export default Auth0Callback