import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import './authenticator.css'
import { getLoggedInUser } from '../../actions/auth'

import Login from './login'
import NewPasswordChallenge from './challenge-newPassword'

class Authenticator extends Component {
  componentDidMount() {
    this.props.getLoggedInUser()
  }

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
      <div className='authenticator'>
        <Route path={`${this.props.match.path}/login`} component={Login} />

        <Route path={`${this.props.match.path}/challenge/newPassword`} component={NewPasswordChallenge} />

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
  getLoggedInUser: getLoggedInUser
}, dispatch))(Authenticator)