import '../setupTests'

import React from 'react'
import { shallow } from 'enzyme'

import PageHeading from './pageheading'

describe('page heading', () => {
  it('shows an empty subheading when not passed one', () => {
    const wrapper = shallow(<PageHeading title="TEST" />)

    expect(wrapper.html()).toContain('<h2>TEST </h2>')
  })

  it('shows the subheading when passed one', () => {
    const wrapper = shallow(<PageHeading title="TEST" subHeading="system under" />)

    expect(wrapper.html()).toContain('<h2>TEST <small>- system under</small></h2>')
  })
})