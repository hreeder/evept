import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Card, CardBody, CardTitle, CardImg, CardSubtitle, CardText, Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import TimeAgo from 'timeago-react'

export class CharacterIcon extends Component {
  render() {
    // Bail out if we don't have the typeIDs from the SDE yet
    if (this.props.sde === null) return <div className="col-md-3"></div>

    const character = this.props.character

    let corp = ""
    if (character.hasOwnProperty('corporation') && character.corporation.hasOwnProperty('name')) corp = character.corporation.name

    let alliance = ''
    if (character.hasOwnProperty('alliance') && character.alliance.hasOwnProperty('name')) alliance = character.alliance.name

    let total_skillpoints = character.totalSpShortForm()

    let last_updated = 'Not Yet Updated'
    if (character.hasOwnProperty('updated_at')) {
      last_updated = <TimeAgo datetime={character.updated_at} />
    }

    const _training = character.getCurrentlyTrainingSkill()
    const training = _training ? `${this.props.sde.typeIDs[_training['skill_id']].name} ${_training['level']}` : "No Skill in Training"

    let omega_text = ''
    if (character.isOmega() !== undefined) omega_text = "αlpha"
    if (character.isOmega()) omega_text = "Ωmega"

    return (
      <div className="col-md-3">
        <Card>
          <CardImg top width="100%" src={`https://image.eveonline.com/Character/${character.characterId}_512.jpg`} />
          <CardBody>
            <CardTitle>{character.characterName}</CardTitle>
            <CardSubtitle>{corp}</CardSubtitle>
            {alliance === '' ? '' : (<CardSubtitle>{this.props.alliance}</CardSubtitle>)}
            <CardText>{total_skillpoints} {omega_text}</CardText>
            <CardText>{training}</CardText>
            <CardText>{character.walletAmountShortForm()}</CardText>
            <CardText>
              <small className="text-muted">Last updated: {last_updated}</small>
            </CardText>
            <Button tag={Link} to={`/character/${character.resourceIdentifier}`} block>Select</Button>
          </CardBody>
        </Card>
        <br />
      </div>
    )
  }
}

export default connect(store => {
  return {
    sde: store.sde
  }
})(CharacterIcon)