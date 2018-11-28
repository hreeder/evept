import React, { Component } from 'react'
import queryString from 'query-string'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import PageHeading from './pageheading'
import { Redirect } from 'react-router-dom'

import { addCharacter } from '../actions/esi'

class ESIAuthCallback extends Component {
  componentDidMount() {
    const qstring = queryString.parse(this.props.location.search)
    const esiCode = qstring.code
    this.props.addCharacter(esiCode)
  }

  render() {
    if (this.props.esi.done) return <Redirect to={{ pathname: "/characters" }} />
    return (
      <div className="row">
        <main className="col-md-8 offset-md-2 px-4" role="main">
          <PageHeading title="Characters" />
          <div className="row">
            <h3>Adding Character...</h3>
          </div>
          <div className="row">
            <h6>Please Wait - You will be redirected to the characters screen when the character has been added</h6>
          </div>
        </main>
      </div>
    )
  }
}

export default connect((store) => {
  return {
    esi: store.esi
  }
}, (dispatch) => bindActionCreators({
  addCharacter: addCharacter
}, dispatch))(ESIAuthCallback)