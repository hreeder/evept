import '../setupTests'

import React from 'react'
import { shallow, mount } from 'enzyme'
import { Sidebar, SidebarGroup, SidebarHeading, SidebarItem } from './sidebar';
import { FileText, Home } from 'react-feather';
import { MemoryRouter } from 'react-router-dom';

describe('sidebar', () => {
  it('is a nav', () => {
    const wrapper = shallow(<Sidebar />)
    expect(wrapper).toHaveDisplayName('nav')
  })

  it('is sticky', () => {
    const wrapper = shallow(<Sidebar />)
    expect(wrapper.find('div').at(0)).toHaveClassName('sidebar-sticky')
  })

  it('renders children', () => {
    const wrapper = shallow(<Sidebar><h2>SYSTEM UNDER TEST</h2></Sidebar>)
    expect(wrapper).toContainReact(<h2>SYSTEM UNDER TEST</h2>)
  })
})

describe('sidebar group', () => {
  it('is an unordered list', () => {
    const wrapper = shallow(<SidebarGroup />)
    expect(wrapper).toHaveDisplayName('ul')
  })

  it('renders children', () => {
    const wrapper = shallow(<SidebarGroup><h2>SYSTEM UNDER TEST</h2></SidebarGroup>)
    expect(wrapper).toContainReact(<h2>SYSTEM UNDER TEST</h2>)
  })
})

describe('sidebar heading', () => {
  it('is formatted correctly', () => {
    const wrapper = shallow(<SidebarHeading />)
    expect(wrapper).toHaveDisplayName('h6')
    expect(wrapper).toHaveClassName('sidebar-heading')
    expect(wrapper).toHaveClassName('justify-content-between')
    expect(wrapper).toHaveClassName('align-items-center')
    expect(wrapper).toHaveClassName('text-muted')
  })

  it('renders children', () => {
    const wrapper = shallow(<SidebarHeading>SYSTEM UNDER TEST</SidebarHeading>)
    expect(wrapper.text()).toContain('SYSTEM UNDER TEST')
  })
})

describe('sidebar item', () => {
  it('defaults to FileText icon', () => {
    const wrapper = shallow(<SidebarItem />)
    expect(wrapper).toContainReact(<FileText />)
  })

  it('renders a given icon', () => {
    const wrapper = mount(<MemoryRouter><SidebarItem icon={Home} to={{}} /></MemoryRouter>)
    expect(wrapper).toContainReact(<Home />)
  })

  it('links correctly', () => {
    const destination = "/this/is/a/test/path"
    const wrapper = mount(<MemoryRouter><SidebarItem to={destination} /></MemoryRouter>)
    expect(wrapper).toContainMatchingElement('li.nav-item')
    expect(wrapper.find('a').at(0)).toHaveClassName('nav-link')
    expect(wrapper.find('a').at(0)).toHaveProp('href', destination)
  })
})