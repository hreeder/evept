import '../../setupTests'

import React from 'react'
import { shallow } from 'enzyme'
import SkillHighlight from './dashboard-skills'

describe('the SkillHighlight component', () => {
  it('can select the right colour based on skill level', () => {
    const component = new SkillHighlight()
    expect(component.getColour("X")).toBe("dark")
    expect(component.getColour(0)).toBe("danger")
    expect(component.getColour(1)).toBe("danger")
    expect(component.getColour(2)).toBe("danger")
    expect(component.getColour(3)).toBe("danger")
    expect(component.getColour(4)).toBe("warning")
    expect(component.getColour(5)).toBe("success")
  })

  it('renders a statement if the skill ID is missing from the sde', () => {
    const component = new SkillHighlight({
      character: { skills: [{ skill_id: 1, trained_skill_level: 5 }] },
      typeIDs: { 1: { name: "Test Skill" } }
    })

    const output = component.getLevel(2)
    expect(output).toBe('')
  })

  // this feels super messy (testing the react component properties without using react itself)
  // todo: work out a way to make this less messy
  it('show badges with correct levels for skills when showing the name', () => {
    const component = new SkillHighlight({
      character: { skills: [{ skill_id: 1, trained_skill_level: 5 }] },
      typeIDs: { 1: { name: "Test Skill" } }
    })

    const output = component.getLevel(1, true)
    
    expect(output).toHaveProperty('type', 'span')
    expect(output).toHaveProperty('props')
    expect(output.props).toHaveProperty('className', 'skill-badge badge badge-success')
    expect(output.props).toHaveProperty('children', [ 'Test Skill', ': ', 5])
  })

  it('shows badges with correct levels for skills when not showing the name', () => {
    const component = new SkillHighlight({
      character: { skills: [{ skill_id: 1, trained_skill_level: 5 }] },
      typeIDs: { 1: { name: "Test Skill" } }
    })

    const output = component.getLevel(1)

    expect(output).toHaveProperty('type', 'div')
    expect(output).toHaveProperty('props')
    expect(output.props).toHaveProperty('children')
    
    const children = output.props.children
    expect(children).toHaveLength(2)

    const span = children[0]
    expect(span).toHaveProperty('type', 'span')
    expect(span).toHaveProperty('props')
    expect(span.props).toHaveProperty('id', 'tooltips-1')
    expect(span.props).toHaveProperty('className', 'skill-badge badge badge-success')
    expect(span.props).toHaveProperty('children', 5)

    const tooltip = children[1]
    expect(tooltip).toHaveProperty('props')
    expect(tooltip.props).toHaveProperty('placement', 'top')
    expect(tooltip.props).toHaveProperty('target', 'tooltips-1')
    expect(tooltip.props).toHaveProperty('children', 'Test Skill')
  })

  it('uses a level of "X" when the skill is missing from the character', () => {
    const component = new SkillHighlight({
      character: { skills: [{}] },
      typeIDs: { 1: { name: "Test Skill" } }
    })

    const output = component.getLevel(1)
    
    expect(output).toHaveProperty('props')
    expect(output.props).toHaveProperty('children')
    expect(output.props.children[0]).toHaveProperty('props')
    expect(output.props.children[0].props).toHaveProperty('children', "X")
  })

  it('has a magic 14 section', () => {
    const character = {
      skills: [{  }]
    }
    const typeIDs = {}
    const wrapper = shallow(<SkillHighlight character={character} typeIDs={typeIDs} />)
    
    expect(wrapper.html()).toContain("https://wiki.eveuniversity.org/The_Magic_14")
  })
})