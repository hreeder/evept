import '../../setupTests'

import React from 'react'
import { mount } from 'enzyme'
import SkillEntry from './skills-entry'

describe('the SkillEntry component', () => {
  const skills = {
    lv5: {
      trained_skill_level: 5,
      active_skill_level: 5,
      name: "Test Skill A",
      skillpoints_in_skill: 1280000
    },
    lv5_alpha: {
      trained_skill_level: 5,
      active_skill_level: 3,
      name: "Test Skill B",
      skillpoints_in_skill: 512000
    },
    lv3: {
      trained_skill_level: 3,
      active_skill_level: 3,
      name: "Test Skill C",
      skillpoints_in_skill: 512000
    }
  }

  let level5wrapper, level5alphaWrapper, level3wrapper

  beforeEach(() => {
    level5wrapper = mount(<SkillEntry skill={skills.lv5} />)
    level5alphaWrapper = mount(<SkillEntry skill={skills.lv5_alpha} />)
    level3wrapper = mount(<SkillEntry skill={skills.lv3} />)
  })

  it("shows commas correctly in the SP amount", () => {
    expect(level5wrapper.text()).toContain("SP: 1,280,000")
  })

  it("shows 5 stars", () => {
    expect(level3wrapper.find('svg[data-icon="star"]')).toHaveLength(5)
    expect(level5wrapper.find('svg[data-icon="star"]')).toHaveLength(5)
    expect(level5alphaWrapper.find('svg[data-icon="star"]')).toHaveLength(5)
  })

  it("shows solid stars for a skill's trained level", () => {
    // prefix FAS is FontAwesome Solid
    expect(level3wrapper.find('svg[data-prefix="fas"]')).toHaveLength(3)
    expect(level5wrapper.find('svg[data-prefix="fas"]')).toHaveLength(5)
    expect(level5alphaWrapper.find('svg[data-prefix="fas"]')).toHaveLength(5)
  })

  it("shows empty stars representing untrained levels", () => {
    // prefix FAR is FontAwsome Regular
    expect(level3wrapper.find('svg[data-prefix="far"]')).toHaveLength(2)
  })

  it("shows orange stars for inactive levels (when the character is in alpha state)", () => {
    expect(level5alphaWrapper.find('FontAwesomeIcon.text-warning')).toHaveLength(2)
  })
})