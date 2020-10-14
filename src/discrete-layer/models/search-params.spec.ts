import { Geometry } from 'geojson';
import { searchParams } from './search-params';

const geom: Geometry = {
  type: 'Polygon',
  coordinates: [
    [
      [0, 0],
      [0, 1],
      [1, 1],
      [1, 0],
      [0, 0],
    ],
  ],
};

it('setLocation updates the geojson in the store', () => {
  const store = searchParams.create({});

  store.setLocation(geom);

  expect(store.geojson).toEqual(geom);
});

it('resetLocation sets geojson to be undefined', () => {
  const store = searchParams.create({ geojson: geom });

  store.resetLocation();

  expect(store.geojson).toBeUndefined();
});
