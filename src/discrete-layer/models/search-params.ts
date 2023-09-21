import { types, Instance } from 'mobx-state-tree';
import { Geometry } from 'geojson';
import CONFIG from '../../common/config';
import { ModelBase } from './ModelBase';
import { RecordType } from './RecordTypeEnum';
import { FilterField } from './RootStore.base';

export const searchParams = ModelBase
  .props({
    geojson: types.maybe(types.frozen<Geometry>()),
    recordType: types.maybe(types.frozen<RecordType>(CONFIG.SERVED_ENTITY_TYPES[0] as RecordType)),
    catalogFilters: types.frozen<FilterField[]>([]),
  })
  .actions((self) => ({
    setLocation: function setLocation(geometry: Geometry): void {
      self.geojson = geometry;
    },
    setRecordType: function setRecordType(recordType: RecordType): void {
      self.recordType = recordType;
    },
    setCatalogFilters: function setCatalogFilters(filters: FilterField[]): void {
      self.catalogFilters = filters;
    },
    resetCatalogFilters: function resetCatalogFilters(): void {
      self.catalogFilters = [];
    },
    resetLocation(): void {
      self.geojson = undefined;
    },
  }));

export interface IConflictSearchParams extends Instance<typeof searchParams> {}
