import React from 'react';
import { shallow } from 'enzyme';
import { Polygon } from 'geojson';
import { DrawInteraction, DrawType, VectorLayer } from '@map-colonies/react-components';
import { MapWrapper } from './map-wrapper';


const polygonSelection = jest.fn();
const selectionPolygon:Polygon = {
  type: 'Polygon',
  coordinates: [
    [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0],
      [100.0, 1.0], [100.0, 0.0] ]
    ]
  };

describe('MapWrapper component', () => {
  it('renders correctly', () => {
    const wrapper = shallow(
      <MapWrapper
        children={(<span>test</span>)}
        onPolygonSelection={polygonSelection}
        drawType={DrawType.BOX}
        selectionPolygon={selectionPolygon}
      />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('VectorLayer not rendered when no selectionPolygon', () => {
    const wrapper = shallow(
      <MapWrapper
        children={(<span>test</span>)}
        onPolygonSelection={polygonSelection}
        drawType={DrawType.BOX}
        selectionPolygon={undefined}
      />
    );

    expect(wrapper.find(VectorLayer)).toEqual({}); 
  });

  it('DrawInteraction not rendered when no DrawType defined', () => {
    const wrapper = shallow(
      <MapWrapper
        children={(<span>test</span>)}
        onPolygonSelection={polygonSelection}
        drawType={undefined}
        selectionPolygon={undefined}
      />
    );

    expect(wrapper.find(DrawInteraction)).toEqual({}); 
  });

  it('children SPAN rendered with proper content', () => {
    const childrenContent = 'test';
    const chilComponent = <span>{childrenContent}</span>;
    const wrapper = shallow(
      <MapWrapper
        children={chilComponent}
        onPolygonSelection={polygonSelection}
        drawType={undefined}
        selectionPolygon={undefined}
      />
    );

    expect(wrapper.find('span')).toBeDefined();
    expect(wrapper.find('span').prop('children')).toEqual(childrenContent); 
  });


});
