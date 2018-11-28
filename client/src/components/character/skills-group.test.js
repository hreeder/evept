import '../../setupTests'

import React from 'react'
import { shallow } from 'enzyme'
import { SkillGroup } from './skills-group'

describe('the SkillGroup component', () => {
  let dummyGroup, typeIDs, characterSkills

  beforeEach(() => {
    dummyGroup = {
      name: "Group Under Test",
      groupID: 1
    }
    typeIDs = {
      1: {
        name: "Dummy Skill",
        groupID: 1
      },
      2: {
        name: "Another Skill",
        groupID: 2
      }
    }
    characterSkills = {
      1: { skill_id: 1 },
      2: { skill_id: 2 }
    }
  })

  it("renders blank when the SDE isn't loaded yet", () => {
    const wrapper = shallow(<SkillGroup group={dummyGroup} typeIDs={null} characterSkills={characterSkills} />)
    expect(wrapper.html()).toBe("<div></div>")
  })

  it("ignores skills not in this group", () => {
    const secondaryGroup = {
      name: "Group Under Test",
      groupID: 2
    }
    const item = new SkillGroup({
      group: secondaryGroup,
      typeIDs: typeIDs,
      characterSkills: characterSkills
    })
    expect(item.getSkills()).toHaveLength(1)
  })

  it("does not render when the character doesn't have any skills in the group", () => {
    const wrapper = shallow(<SkillGroup group={dummyGroup} typeIDs={typeIDs} characterSkills={{}} />)
    expect(wrapper.html()).not.toContain("<h5>Group Under Test</h5>")
  })

  it('renders a row', () => {
    const wrapper = shallow(<SkillGroup group={dummyGroup} typeIDs={typeIDs} characterSkills={characterSkills} />)
    expect(wrapper.find('div.row')).toExist()
  })
})