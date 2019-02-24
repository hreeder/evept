import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import LoginForm from './form'
import { Redirect } from 'react-router-dom'

class Login extends React.Component {
  render() {
    if (this.props.auth.login.challenge !== null) {
      switch(this.props.auth.login.challenge) {
        case "NEW_PASSWORD_REQUIRED": {
          return <Redirect to="/auth/challenge/newPassword" />
        }
        default: {}
      }
    }

    return (
      <div>
        <h1 className='h3 mb-3 font-weight-normal'><small>EVE</small><strong>PT</strong>: Log In</h1>
        <LoginForm />
      </div>
    )
  }
}

export default connect((store) => {
  return {
    auth: store.auth
  }
}, (dispatch) => bindActionCreators({
}, dispatch))(Login)