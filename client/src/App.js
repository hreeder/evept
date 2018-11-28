import Amplify, { Auth } from 'aws-amplify'
import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.min.css';

import Authenticator from './components/authenticator'
import MainApp from './components/mainApp'

import store from './reducers'

Amplify.configure({
  Auth: {
    region: 'eu-west-1',
    userPoolId: 'eu-west-1_men0NN1Iy',
    userPoolWebClientId: '6jvja8nvrtb9n6fj33e2qj0in8',
    mandatorySignIn: false
  },
  API: {
    endpoints: [
      {
        name: "evept",
        endpoint: "https://tzyfg24wz4.execute-api.eu-west-1.amazonaws.com/dev",
        custom_header: async () => {
          return { Authorization: (await Auth.currentSession()).idToken.jwtToken }
        }
      }
    ]
  }
})

class App extends Component { 
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Switch>
              <Route path="/auth" component={Authenticator} />

              <Route component={MainApp} />
            </Switch>
          </div>
        </Router>
      </Provider>
    )
  }
}

export default App
