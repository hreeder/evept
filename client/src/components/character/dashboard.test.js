import '../../setupTests'

import React from 'react'
import { mount } from 'enzyme'
import { CharacterDashboard } from './dashboard'

describe('the CharacterDashboard component', () => {
  let match, character, typeIDs, wrapper, viewPreferences

  beforeEach(() => {
    match = {
      params: { charid: 1 }
    }
    character = {
      characterId: 1,
      characterName: "Test Character",
      total_sp: 52000000,
      isOmega: () => true,
      getSkillQueue: () => [],
      getCurrentlyTrainingSkill: () => null
    }
    typeIDs = {}
    viewPreferences = {
      expandQueue: true
    }

    wrapper = mount(<CharacterDashboard match={match} characters={[character]} sde={{typeIDs: typeIDs}} viewPreferences={viewPreferences} />)
  })

  it("has the character's name", () => {
    expect(wrapper.html()).toContain("Test Character")
  })

  it("shows clone state", () => {
    expect(wrapper.html()).toContain("<b>Clone State</b>: Ωmega")
  })

  it("shows alpha clone state", () => {
    character.isOmega = () => false
    wrapper = mount(<CharacterDashboard match={match} characters={[character]} sde={{typeIDs: typeIDs}} viewPreferences={viewPreferences} />)
    expect(wrapper.html()).toContain("<b>Clone State</b>: αlpha")
  })

  it("shows unknown clone state", () => {
    character.isOmega = () => undefined
    wrapper = mount(<CharacterDashboard match={match} characters={[character]} sde={{typeIDs: typeIDs}} viewPreferences={viewPreferences} />)
    expect(wrapper.html()).toContain("<b>Clone State</b>: unknown")
  })
})