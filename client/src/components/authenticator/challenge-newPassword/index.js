import React from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'

import NewPasswordChallengeForm from './form'

class NewPasswordChallenge extends React.Component {
  render() {
    return (
      <div>
        <h1 className='h3 mb-3 font-weight-normal'><small>EVE</small><strong>PT</strong>: Set Your Password</h1>
        <NewPasswordChallengeForm />
      </div>
    )
  }
}

export default connect((store) => {
  return {
    auth: store.auth
  }
}, (dispatch) => bindActionCreators({
}, dispatch))(NewPasswordChallenge)