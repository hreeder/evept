import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import './styles.css'

import PageHeading from '../pageheading'
import CharacterIcon from './icon'
import { Plus } from 'react-feather'
import { getAuthURI } from '../../esi'

import { getCharacters } from '../../actions/characters'



class CharacterList extends Component {
  componentDidMount() {
    const diff = Date.now() - this.props.characters.updated_at
    if (diff > 60000) {   // Only ask the back-end once per minute
      this.props.getCharacters()
    }
  }

  render() {
    const addCharacterURL = getAuthURI()
    var inner = "";
    if (this.props.characters.loading || this.props.sde.loadingTypeIDs) {
      inner = "Loading... Please Wait"
    } else {
      const characters = this.props.characters.characters.sort((a, b) => {
        if (!a.hasOwnProperty('total_sp')) return 1
        if (!b.hasOwnProperty('total_sp')) return -1
        return b.total_sp - a.total_sp
      })

      inner = characters.map(character => (
        <CharacterIcon
          key={character.resourceIdentifier}
          character={character}
        />
      ))
    }

    return (
      <div className="row">
        <main className="col-md-8 offset-md-2 px-4" role="main">
          <PageHeading title="Characters">
            <a href={addCharacterURL} className="btn btn-outline-secondary"><Plus /></a>
          </PageHeading>
          <div className='row'>
            {inner}
          </div>
        </main>
      </div>
    )
  }
}

export default connect((store) => {
  return {
    characters: store.characters,
    sde: store.sde
  }
}, (dispatch) => bindActionCreators({
  getCharacters: getCharacters
}, dispatch))(CharacterList)