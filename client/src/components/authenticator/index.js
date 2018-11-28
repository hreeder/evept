import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import './authenticator.css'
import { getLoggedInUser } from '../../actions/auth'

import Login from './login'

class Authenticator extends Component {
  componentDidMount() {
    this.props.getLoggedInUser()
  }

  render() {
    return (
      <div className='authenticator'>
        <Route path={`${this.props.match.path}/login`} component={Login} />
      </div>
    )
  }
}

export default connect((store) => {
  return {

  }
}, (dispatch) => bindActionCreators({
  getLoggedInUser: getLoggedInUser
}, dispatch))(Authenticator)