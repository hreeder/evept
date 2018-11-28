import '../../setupTests'

import React from 'react'
import { mount } from 'enzyme'
import configureMockStore from 'redux-mock-store'
import CharacterIcon, { CharacterIcon as RawCharacterIcon } from './icon'

import { MemoryRouter } from 'react-router-dom'
import Character from '../../models/character'
import { CardImg, CardTitle } from 'reactstrap'

const mockStore = configureMockStore();

describe('the CharacterIcon component', () => {
  let wrapper, bareCharacter, store

  beforeEach(() => {
    // these four resources are the bare minimum the back end stores in the database
    // and if a character has only just been added, this is all that will exist there
    bareCharacter = new Character().fromJSON({
      resourceType: "evept:test_123:character",
      resourceIdentifier: "445518960",
      characterName: "Sklullus Dromulus",
      characterId: "445518960"
    })
  })

  it('displays the right character image', () => {
    wrapper = mount(<MemoryRouter><RawCharacterIcon character={bareCharacter} /></MemoryRouter>)
    const image = <CardImg top width="100%" src="https://image.eveonline.com/Character/445518960_512.jpg" />

    expect(wrapper).toContainReact(image)
  })

  it('displays the correct character name', () => {
    wrapper = mount(<MemoryRouter><RawCharacterIcon character={bareCharacter} /></MemoryRouter>)
    const name = <CardTitle>Sklullus Dromulus</CardTitle>

    expect(wrapper).toContainReact(name)
  })

  it('links to the character dashboard', () => {
    wrapper = mount(<MemoryRouter><RawCharacterIcon character={bareCharacter} /></MemoryRouter>)

    expect(wrapper.find('a').at(0)).toHaveProp('href', '/character/445518960')
    expect(wrapper.find('a').at(0)).toMatchSelector('.btn.btn-secondary.btn-block')
  })

  it('declares not yet updated', () => {
    wrapper = mount(<MemoryRouter><RawCharacterIcon character={bareCharacter} /></MemoryRouter>)

    expect(wrapper.find('small').at(0).html()).toContain('Last updated: Not Yet Updated')
  })

  it('(when provided a populated character) shows total skillpoints', () => {
    const character = new Character().fromJSON({
      resourceType: "evept:test_123:character",
      resourceIdentifier: "445518960",
      characterName: "Sklullus Dromulus",
      characterId: "445518960",
      total_sp: 5100000
    })
    wrapper = mount(<MemoryRouter><RawCharacterIcon character={character} /></MemoryRouter>)
    expect(wrapper.find('p').at(0).html()).toContain('5.1M SP')
  })

  it('does not render child elements when the SDE has not yet fetched', () => {
    store = mockStore({
      sde: null
    })

    wrapper = mount(<CharacterIcon store={store} character={bareCharacter} />)
    const item = wrapper.children(0).at(0)

    expect(item).toHaveHTML('<div class="col-md-3"></div>')
  })
})