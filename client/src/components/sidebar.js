import React, { Component } from 'react'

import { NavItem, NavLink } from 'reactstrap'
import { Link as RRLink } from 'react-router-dom'
import { FileText } from 'react-feather'

class Sidebar extends Component {
  render() {
    return (
      <nav className="col-md-2 d-none d-md-block bg-light sidebar">
        <div className="sidebar-sticky">
          {this.props.children}
        </div>
      </nav>
    )
  }
}

class SidebarGroup extends Component {
  render() {
    return (
      <ul className='nav flex-column mb-2'>
        {this.props.children}
      </ul>
    )
  }
}

class SidebarHeading extends Component {
  render() {
    return (
      <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
        {this.props.children}
      </h6>
    )
  }
}

class SidebarItem extends Component {
  render() {
    let Icon = this.props.icon || FileText
    return (
      <NavItem>
        <NavLink tag={RRLink} to={this.props.to}>
          <Icon /> {this.props.children}
        </NavLink>
      </NavItem>
    )
  }
}

export { Sidebar, SidebarGroup, SidebarHeading, SidebarItem }