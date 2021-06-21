import React from 'react';
import { shallow } from 'enzyme';
import { NotchLabel } from './notch-label';

const text = 'Test label';

describe('NotchLabel component', () => {
  it('renders correctly', () => {

    const wrapper = shallow(
      <NotchLabel text={text} />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('notch label renders as SPAN', () => {
    const wrapper = shallow(
      <NotchLabel text={text} />
    );

    const labelContainer = wrapper.find('span');
    expect(labelContainer.text()).toBe(text); 
  });

});
