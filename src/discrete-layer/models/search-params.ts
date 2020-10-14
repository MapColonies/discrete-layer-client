import { types, Instance } from 'mobx-state-tree';
import { Geometry } from 'geojson';

export const searchParams = types
  .model({
    geojson: types.maybe(types.frozen<Geometry>()),
  })
  .actions((self) => ({
    setLocation: function setLocation(geometry: Geometry): void {
      self.geojson = geometry;
    },

    resetLocation(): void {
      self.geojson = undefined;
    },
  }));

export interface IConflictSearchParams
  extends Instance<typeof searchParams> {}
