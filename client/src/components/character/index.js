import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

import { Sidebar, SidebarHeading, SidebarGroup, SidebarItem } from '../sidebar'
import { Home, FileText, List as ListIcon } from 'react-feather'
import { Route, Redirect } from 'react-router-dom'

import CharacterDashboard from './dashboard'
import CharacterSkills from './skills'

import { getCharacters, getCharacterSkills } from '../../actions/characters'

export class Character extends Component {
  componentDidMount() {
    if (this.props.characters.characters.length === 0 && !this.props.characters.loaded && !this.props.characters.loading) {
      this.props.getCharacters()
    }
  }

  render() {
    const charBasePath =`/character/${this.props.match.params.charid}`

    let main = <main className="col-md-9 ml-sm-auto col-lg-10 px-4" role="main">
      <Route exact path={`${this.props.match.path}`} component={CharacterDashboard} />
      <Route path={`${this.props.match.path}/skills`} component={CharacterSkills} />
    </main>

    if (this.props.characters.characters.length === 0 && !this.props.characters.loaded) {
      main = ""
    }

    let character = null
    this.props.characters.characters.forEach(_character => {
      if (parseInt(_character.characterId) === parseInt(this.props.match.params.charid)) {
        character = _character
      }
    })
    if (character === null && this.props.characters.loaded) return <Redirect to={{ pathname: "/characters" }} />
    if (character !== null && character.getSkills().length === 0) this.props.getCharacterSkills(character.characterId)

    return (
      <div className="row">
        <Sidebar>
          <SidebarGroup>
            <SidebarItem icon={Home} to={charBasePath}>Character Dashboard</SidebarItem>
            <SidebarItem icon={ListIcon} to={`${charBasePath}/skills`}>Skills</SidebarItem>
          </SidebarGroup>
          <SidebarHeading>Second Grouping</SidebarHeading>
          <SidebarGroup>
            <SidebarItem icon={FileText} to={{}}>
              Second Group Item
            </SidebarItem>
          </SidebarGroup>
        </Sidebar>
        {main}
      </div>
    )
  }
}

export default connect((store) => {
  return {
    characters: store.characters
  }
}, (dispatch) => bindActionCreators({
  getCharacters: getCharacters,
  getCharacterSkills: getCharacterSkills
}, dispatch))(Character)