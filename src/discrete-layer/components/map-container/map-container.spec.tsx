import React from 'react';
import { shallow } from 'enzyme';
// eslint-disable-next-line
import '../../../__mocks__/confEnvShim';
import { MapContainer } from './map-container';

// Enzyme doesn’t work properly with hooks in general, especially for `shallow` so this is the way to mock `react-intl` module.
// Enspired by https://github.com/formatjs/formatjs/issues/1477
jest.mock('react-intl', () => {
  /* eslint-disable */
  const reactIntl = require.requireActual('react-intl');
  const MESSAGES = require.requireActual('../../../common/i18n');
  const intl = reactIntl.createIntl({
    locale: 'en',
    messages: MESSAGES.default['en'],
  });

  return {
    ...reactIntl,
    useIntl: () => intl,
  };
  /* eslint-enable */
});

const polygonSelectedFn = jest.fn();
const polygonResetFn = jest.fn();

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
        mapContent={<span>test</span>}
      />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('MapContent prop elements transfered to MapWrapper component', () => {
    const wrapper = shallow(
      <MapContainer
        handlePolygonSelected={polygonSelectedFn}
        handlePolygonReset={polygonResetFn}
        mapContent={<span>test</span>}
      />
    );

    expect(wrapper.children()).toHaveLength(2); // one is drawing layer, second is transfered
  });
});
