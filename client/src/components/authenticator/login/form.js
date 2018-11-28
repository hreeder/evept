import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Form, FormGroup, Input, Button } from 'reactstrap'

import { logInUser } from '../../../actions/auth'

class LoginForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: "",
      password: ""
    }
  }

  handleSubmit = evt => {
    this.props.logInUser(this.state.username, this.state.password)
    evt.preventDefault()
  }

  render() {
    return (
      <Form className="form-signin" onSubmit={this.handleSubmit}>
        <h1 className='h3 mb-3 font-weight-normal'><small>EVE</small><strong>PT</strong>: Log In</h1>
        <Input
          autoFocus
          type='text'
          name='username'
          id='username'
          placeholder='Username'
          onChange={evt => this.setState({...this.state, username: evt.target.value})}
          value={this.state.username}
        />
        <Input
          type='password'
          name='password'
          id='password'
          placeholder='Password'
          onChange={evt => this.setState({...this.state, password: evt.target.value})}
          value={this.state.password}
        />
        <FormGroup>
          <Button
            block
            size='lg'
            color='primary'
          >
          Log In
          </Button>
        </FormGroup>
      </Form>
    )
  }
}

export default connect((store) => {
  return {
    auth: store.auth
  }
}, (dispatch) => bindActionCreators({
  logInUser: logInUser
}, dispatch))(LoginForm);