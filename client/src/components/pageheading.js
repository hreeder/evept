import React, { Component } from 'react'

class PageHeading extends Component {
  render() {
    const subHeading = this.props.subHeading === '' ? "" : <small>- {this.props.subHeading}</small>
    return (
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h2>{this.props.title} {subHeading}</h2>
        {this.props.children}
      </div>
    )
  }
}

PageHeading.defaultProps = {
  subHeading: ''
}

export default PageHeading