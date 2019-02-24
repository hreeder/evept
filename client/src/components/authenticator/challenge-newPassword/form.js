import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Form, FormGroup, Input, Button } from 'reactstrap'

import { challengeResponseNewPassword } from '../../../actions/auth'

class NewPasswordChallengeForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      password: "",
      passwordConfirmation: ""
    }
  }

  handleSubmit = evt => {
    if (this.state.password === this.state.passwordConfirmation) {
      this.props.challengeResponseNewPassword(this.props.auth.login.challengeUser, this.state.password)
    }
    evt.preventDefault()
  }

  render() {
    let errorMessage = ""

    if (
      this.state.password &&
      this.state.passwordConfirmation &&
      this.state.passwordConfirmation !== this.state.password
    ) {
      errorMessage = "Confirmation does not match password"
    }

    return (
      <Form className="form-authenticator" onSubmit={this.handleSubmit}>
        <Input
          type='password'
          name='password'
          id='password'
          placeholder='Password'
          className='form-authenticator-newPassword'
          onChange={evt => this.setState({...this.state, password: evt.target.value})}
          value={this.state.password}
        />
        <Input
          type='password'
          name='passwordConfirmation'
          id='passwordConfirmation'
          placeholder='Confirm Password'
          className='form-authenticator-confirmPassword'
          onChange={evt => this.setState({...this.state, passwordConfirmation: evt.target.value})}
          value={this.state.passwordConfirmation}
        />
        <FormGroup>
          <Button
            block
            size='lg'
            color='primary'
          >
          Set Password
          </Button>
        </FormGroup>

        <span className='text-danger'>&nbsp;{errorMessage}&nbsp;</span>
      </Form>
    )
  }
}

export default connect((store) => {
  return {
    auth: store.auth
  }
}, (dispatch) => bindActionCreators({
  challengeResponseNewPassword: challengeResponseNewPassword
}, dispatch))(NewPasswordChallengeForm);