import React from 'react';
import { shallow } from 'enzyme';
// eslint-disable-next-line
import '../../../__mocks__/confEnvShim';
import { MapContainer } from './map-container';
import { MapWrapper } from './map-wrapper';


const polygonSelectedFn = jest.fn();
const polygonResetFn = jest.fn();
const DEFAULT_FILTERS_NUM =1;

describe('MapContainer component', () => {
  
  afterEach(() => {
    polygonSelectedFn.mockClear();
    polygonResetFn.mockClear();
  });

  it('renders correctly', () => {
    const wrapper = shallow(
      <MapContainer
        handlePolygonSelected={polygonSelectedFn}
        handlePolygonReset={polygonResetFn}
        filters={[]}
        mapContent={(<span>test</span>)}
      />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('FILTERS has only ONE element when additional filters not passed', () => {
    const wrapper = shallow(
      <MapContainer
        handlePolygonSelected={polygonSelectedFn}
        handlePolygonReset={polygonResetFn}
        filters={undefined}
        mapContent={(<span>test</span>)}
      />
    );

    expect(wrapper.find('.filtersContainer').children()).toHaveLength(DEFAULT_FILTERS_NUM); 
  });

  it('transfered FILTERS added to container with default one', () => {
    const filtersArr = [<span>fliter1</span>, <span>fliter2</span>]
    const wrapper = shallow(
      <MapContainer
        handlePolygonSelected={polygonSelectedFn}
        handlePolygonReset={polygonResetFn}
        filters={filtersArr}
        mapContent={(<span>test</span>)}
      />
    );

    expect(wrapper.find('.filtersContainer').children()).toHaveLength(DEFAULT_FILTERS_NUM + filtersArr.length); 
  });

  it('MapContent prop elements transfered to MapWrapper component', () => {
    const wrapper = shallow(
      <MapContainer
        handlePolygonSelected={polygonSelectedFn}
        handlePolygonReset={polygonResetFn}
        filters={undefined}
        mapContent={(<span>test</span>)}
      />
    );

    expect(wrapper.find(MapWrapper).children()).toHaveLength(1); 
  });
});
