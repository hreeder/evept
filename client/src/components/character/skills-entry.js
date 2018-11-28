import React, { Component } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-regular-svg-icons'
import { faStar as faSolidStar } from '@fortawesome/free-solid-svg-icons'

class SkillEntry extends Component {
  getStarRating() {
    const numFilledStars = this.props.skill.active_skill_level
    let stars = []

    const numInactiveStars = this.props.skill.trained_skill_level - numFilledStars
    const numEmptyStars = 5 - (numFilledStars + numInactiveStars)

    for (let i=0; i<numFilledStars; i++) {
      stars.push("solid")
    }

    for (let i=0; i<numInactiveStars; i++) {
      stars.push("solid-inactive")
    }

    for (let i=0; i<numEmptyStars; i++) {
      stars.push("regular")
    }

    return <div className='col-md-2'>
      {/* eslint-disable array-callback-return */}
      {stars.map((style, idx) => {
        const key = `skill-stars-${this.props.skill.skill_id}-${idx}`
        if (style === "solid") return <FontAwesomeIcon icon={faSolidStar} key={key} />
        if (style === "solid-inactive") return <FontAwesomeIcon icon={faSolidStar} className="text-warning" key={key} />
        if (style === "regular") return <FontAwesomeIcon icon={faStar} key={key} />
      })}
      {/* eslint-enable array-callback-return */}
    </div>
  }

  getSpInSkill() {
    let spInSkill = this.props.skill.skillpoints_in_skill
    spInSkill = spInSkill.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

    return spInSkill
  }

  render() {
    return <div className="row">
      <div className="col-md-4">
        {this.props.skill.name}
      </div>
      <div className="col-md-6">
        Level: {this.props.skill.trained_skill_level} /
        SP: {this.getSpInSkill()}
      </div>
      {this.getStarRating()}
    </div>
  }
}

export default SkillEntry