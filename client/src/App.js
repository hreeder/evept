import React from "react"
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import auth0 from 'auth0-js';

import 'bootstrap/dist/css/bootstrap.min.css';

import Auth0Callback from './components/auth0/callback'
import MainApp from './components/mainApp'

import store from './reducers'

class Auth {
  constructor() {
    this.auth0 = new auth0.WebAuth({
      domain: process.env.REACT_APP_AUTH0_DOMAIN,
      clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
      redirectUri: `${process.env.REACT_APP_ROOT_PATH}/auth0/callback`,
      audience: process.env.REACT_APP_AUTH0_AUDIENCE,
      responseType: 'token id_token',
      scope: 'openid profile email'
    })
  }

  login = () => this.auth0.authorize()

  handleAuth = () => {
    this.auth0.parseHash((err, authResult) => {
      if (authResult) {
        localStorage.setItem('auth0', JSON.stringify({
          ...authResult,
          expiresAt: authResult.expiresIn * 1000 + new Date().getTime()
        }))
      } else {
        console.log("handleAuth FAILED")
        console.log(err)
        localStorage.removeItem('auth0')
      }
    })
  }

  logout = () => localStorage.removeItem('auth0')
}

export const auth = new Auth()

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Switch>
            <Route path='/auth0/callback' component={Auth0Callback} />
            <Route component={MainApp} />
          </Switch>
        </div>
      </Router>
    </Provider>
  )
}

export default App
