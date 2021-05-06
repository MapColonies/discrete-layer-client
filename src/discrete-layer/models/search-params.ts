import { types, Instance } from 'mobx-state-tree';
import { Geometry } from 'geojson';
import { ModelBase } from "./ModelBase"

export const searchParams = ModelBase
  .props({
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

export interface IConflictSearchParams extends Instance<typeof searchParams> {}
