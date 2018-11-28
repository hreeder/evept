import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import './styles.css'

import LoginForm from './form'
import { Redirect } from 'react-router-dom'

class Login extends React.Component {
  render() {
    const { from } = this.props.location.state || { from: { pathname: "/" } }
    if (this.props.auth.user !== null) {
      return <Redirect to={from} />
    }

    let errorMessage = ""
    if (this.props.auth.login.fail) {
      errorMessage = `Login Failed: ${this.props.auth.login.fail_message}`
    }

    return (
      <div>
        <LoginForm onSubmit={this.onSubmit} />
        <span className='text-danger'>&nbsp;{errorMessage}&nbsp;</span>
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