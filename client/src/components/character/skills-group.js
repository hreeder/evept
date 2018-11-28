import React, { Component } from 'react'
import { connect } from 'react-redux'

import SkillEntry from './skills-entry'

export class SkillGroup extends Component {
  getSkills() {
    const skills = []
    Object.keys(this.props.typeIDs).forEach(key => {
      const item = this.props.typeIDs[key]
      if (item.groupID !== this.props.group.groupID) return
      if (!this.props.characterSkills.hasOwnProperty(key)) return

      let skill = this.props.characterSkills[key]
      skill.name = item.name

      skills.push(skill)
    })
    return skills
  }

  render() {
    const blank = <div></div>

    // bail if the SDE isn't loaded yet
    if (this.props.typeIDs === null) return blank

    const skills = this.getSkills()

    // return if we don't have any skills to show
    if (skills.length === 0) return blank

    return <div>
      <div className="row">
        <div className="col-md-12">
          <h5>{this.props.group.name}</h5>
          {skills.map(skill => <SkillEntry skill={skill} key={`skill-${skill.skill_id}`} />)}
        </div>
      </div>
      <hr />
    </div>
  }
}

export default connect(store => {
  return {
    typeIDs: store.sde.typeIDs
  }
})(SkillGroup)