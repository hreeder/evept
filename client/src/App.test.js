import './setupTests'

import React from 'react';
import { shallow } from 'enzyme'
import App from './App';

describe('overall app', () => {
  it('renders without crashing', () => {
    const app = shallow(<App />);
    expect(app).toBeTruthy()  // FIXME: THIS IS SUPER SUPER SUPER HACKY
  })
})