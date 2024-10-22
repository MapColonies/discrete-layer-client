/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from "mobx-state-tree"
import { QueryBuilder } from "mst-gql"
import { ModelBase } from "./ModelBase"
import { RootStoreType } from "./index"


/**
 * PolygonPartRecordBase
 * auto generated base class for the model PolygonPartRecordModel.
 */
export const PolygonPartRecordModelBase = ModelBase
  .named('PolygonPartRecord')
  .props({
    __typename: types.optional(types.literal("PolygonPartRecord"), "PolygonPartRecord"),
    partId: types.union(types.undefined, types.string),
    sourceId: types.union(types.undefined, types.string),
    sourceName: types.union(types.undefined, types.string),
    description: types.union(types.undefined, types.null, types.string),
    resolutionDegree: types.union(types.undefined, types.number),
    resolutionMeter: types.union(types.undefined, types.number),
    sourceResolutionMeter: types.union(types.undefined, types.number),
    horizontalAccuracyCE90: types.union(types.undefined, types.number),
    countries: types.union(types.undefined, types.null, types.array(types.string)),
    cities: types.union(types.undefined, types.null, types.array(types.string)),
    sensors: types.union(types.undefined, types.array(types.string)),
    imagingTimeBeginUTC: types.union(types.undefined, types.frozen()),
    imagingTimeEndUTC: types.union(types.undefined, types.frozen()),
    footprint: types.union(types.undefined, types.frozen()),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class PolygonPartRecordModelSelector extends QueryBuilder {
  get partId() { return this.__attr(`partId`) }
  get sourceId() { return this.__attr(`sourceId`) }
  get sourceName() { return this.__attr(`sourceName`) }
  get description() { return this.__attr(`description`) }
  get resolutionDegree() { return this.__attr(`resolutionDegree`) }
  get resolutionMeter() { return this.__attr(`resolutionMeter`) }
  get sourceResolutionMeter() { return this.__attr(`sourceResolutionMeter`) }
  get horizontalAccuracyCE90() { return this.__attr(`horizontalAccuracyCE90`) }
  get countries() { return this.__attr(`countries`) }
  get cities() { return this.__attr(`cities`) }
  get sensors() { return this.__attr(`sensors`) }
  get imagingTimeBeginUTC() { return this.__attr(`imagingTimeBeginUTC`) }
  get imagingTimeEndUTC() { return this.__attr(`imagingTimeEndUTC`) }
  get footprint() { return this.__attr(`footprint`) }
}
export function selectFromPolygonPartRecord() {
  return new PolygonPartRecordModelSelector()
}

export const polygonPartRecordModelPrimitives = selectFromPolygonPartRecord().partId.sourceId.sourceName.description.resolutionDegree.resolutionMeter.sourceResolutionMeter.horizontalAccuracyCE90.countries.cities.sensors.imagingTimeBeginUTC.imagingTimeEndUTC.footprint
