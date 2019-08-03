import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import './style.css'

import { Route } from 'react-router-dom'
import { NavLink } from 'reactstrap'
import { NavLink as RRNavLink } from 'react-router-dom'

import Character from '../character'
import CharacterList from '../characterList'
import ESIAuthCallback from '../esiCallbacks'

import { getLoggedInUser, logOutUser } from '../../actions/auth'
import { getTypeIDs, getGroupIDs } from '../../actions/sde'

import { auth } from '../../App'

class MainApp extends Component {
  componentDidMount() {
    this.props.getTypeIDs()
    this.props.getGroupIDs()
  }

  onClickLogOut = () => {
    auth.logout()
  }
  
  render() {
    // As this is the main class for our app, this is where we will check if the user is authenticated
    // If they are, the login component will send them back here
    if (!localStorage.getItem('auth0')) {
      auth.login()
      return <div>Not Authenticated, Redirecting</div>
    }

    return (
      <div>
        <nav className='navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 navbar-expand-lg'>
          <a href="/" className="navbar-brand col-sm-3 col-md-2 mr-0"><small>EVE</small><strong>PT</strong></a>
          <ul className="navbar-nav mr-auto px-3">
            <li className="nav-item text-nowrap"><NavLink to="/characters" tag={RRNavLink} activeClassName="active">Characters</NavLink></li>
          </ul>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap"><a href="#logout" onClick={this.onClickLogOut} className="nav-link">Log Out</a></li> 
          </ul>
        </nav>

        <div className="container-fluid">
          <Route path="/characters" component={CharacterList} />
          <Route path="/character/:charid" component={Character} />

          <Route path='/esi/callback' component={ESIAuthCallback} />
        </div>
      </div>
    )
  }
}

export default connect((store) => {
  return {
    auth: store.auth
  }
}, (dispatch) => bindActionCreators({
  getLoggedInUser: getLoggedInUser,
  logOutUser: logOutUser,
  // SDE
  getTypeIDs: getTypeIDs,
  getGroupIDs: getGroupIDs
}, dispatch))(MainApp)