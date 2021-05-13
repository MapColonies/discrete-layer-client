import { types, Instance } from 'mobx-state-tree';
import { Geometry } from 'geojson';
import { ModelBase } from './ModelBase';
import { RecordType } from './RecordTypeEnum';

export const searchParams = ModelBase
  .props({
    geojson: types.maybe(types.frozen<Geometry>()),
    recordType: types.maybe(types.frozen<RecordType>(RecordType.RECORD_ALL)),
  })
  .actions((self) => ({
    setLocation: function setLocation(geometry: Geometry): void {
      self.geojson = geometry;
    },
    setRecordType: function setRecordType(recordType: RecordType): void {
      self.recordType = recordType;
    },
    resetLocation(): void {
      self.geojson = undefined;
    },
  }));

export interface IConflictSearchParams extends Instance<typeof searchParams> {}
