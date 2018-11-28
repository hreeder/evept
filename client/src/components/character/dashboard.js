import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import PageHeading from '../pageheading'
import { Progress } from 'reactstrap'
import SkillHighlight from './dashboard-skills'
import TimeAgo from 'timeago-react'

import { toggleQueue } from '../../actions/characters'

import './styles.css'

export class CharacterDashboard extends Component {
  render() {
    let character = null
    this.props.characters.forEach(_character => {
      if (parseInt(_character.characterId) === parseInt(this.props.match.params.charid)) {
        character = _character
      }
    })

    const queue = character.getSkillQueue()

    let currently_training = character.getCurrentlyTrainingSkill()
    let clone_state = 'unknown'
    if (character.isOmega() !== undefined) clone_state = "αlpha"
    if (character.isOmega()) clone_state = "Ωmega"

    return (
      <div>
        <PageHeading title={character.characterName} subHeading="Character Dashboard" />
        <div className="row">
          <div className="col-md-3">
            <img className="img-responsive img-thumbnail rounded" alt="Character Portrait" src={`https://image.eveonline.com/Character/${character.characterId}_512.jpg`}></img>
          </div>
          <div className="col-md-9">
            <div className="row">
              <div className="col-md-4">
                <ul>
                  <li><b>Skill Points</b>: {character.total_sp.toLocaleString()}</li>
                </ul>
              </div>
              <div className="col-md-4">
                <ul>
                  <li><b>Clone State</b>: {clone_state}</li>
                </ul>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                {currently_training != null && <div>
                  <h3>Currently Training: {this.props.sde.typeIDs[currently_training['skill_id']].name} {currently_training['level']}</h3>
                  <Progress striped animated value={currently_training.progress}>{currently_training.progress} %</Progress>
                  Finishes <TimeAgo datetime={currently_training.finishes_at} /> <span className="text-muted">({currently_training.remaining_days} Days)</span>
                </div>}
                <h3>Queue ({queue.length}) <button className="btn btn-sm btn-light" onClick={this.props.toggleQueue}>{this.props.viewPreferences.expandQueue ? "Collapse" : "Expand"}</button></h3>
                {this.props.viewPreferences.expandQueue && <ul>
                  {queue.map((skill, i) => <li key={i}>{this.props.sde.typeIDs[skill.skill_id].name} {skill.level} <span className="text-muted">(Finishes {skill.remaining_days} days from now)</span></li>)}
                </ul>}
              </div>
            </div>
          </div>
        </div>
        <br />
        <SkillHighlight character={character} typeIDs={this.props.sde.typeIDs} />
      </div>
    )
  }
}

export default connect((store) => {
  return {
    characters: store.characters.characters,
    viewPreferences: store.characters.viewPreferences,
    sde: store.sde
  }
}, (dispatch) => bindActionCreators({
  toggleQueue: toggleQueue
}, dispatch))(CharacterDashboard)