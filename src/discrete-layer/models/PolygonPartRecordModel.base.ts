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
    id: types.union(types.undefined, types.string),
    classification: types.union(types.undefined, types.string),
    name: types.union(types.undefined, types.string),
    description: types.union(types.undefined, types.null, types.string),
    imagingTimeBeginUTC: types.union(types.undefined, types.frozen()),
    imagingTimeEndUTC: types.union(types.undefined, types.frozen()),
    horizontalAccuracyCE90: types.union(types.undefined, types.number),
    sensors: types.union(types.undefined, types.array(types.string)),
    countries: types.union(types.undefined, types.null, types.array(types.string)),
    cities: types.union(types.undefined, types.null, types.array(types.string)),
    resolutionDegree: types.union(types.undefined, types.number),
    resolutionMeter: types.union(types.undefined, types.number),
    geometry: types.union(types.undefined, types.frozen()),
    recordId: types.union(types.undefined, types.string),
    version: types.union(types.undefined, types.null, types.string),
    ingestionDateUTC: types.union(types.undefined, types.frozen()),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class PolygonPartRecordModelSelector extends QueryBuilder {
  get id() { return this.__attr(`id`) }
  get classification() { return this.__attr(`classification`) }
  get name() { return this.__attr(`name`) }
  get description() { return this.__attr(`description`) }
  get imagingTimeBeginUTC() { return this.__attr(`imagingTimeBeginUTC`) }
  get imagingTimeEndUTC() { return this.__attr(`imagingTimeEndUTC`) }
  get horizontalAccuracyCE90() { return this.__attr(`horizontalAccuracyCE90`) }
  get sensors() { return this.__attr(`sensors`) }
  get countries() { return this.__attr(`countries`) }
  get cities() { return this.__attr(`cities`) }
  get resolutionDegree() { return this.__attr(`resolutionDegree`) }
  get resolutionMeter() { return this.__attr(`resolutionMeter`) }
  get geometry() { return this.__attr(`geometry`) }
  get recordId() { return this.__attr(`recordId`) }
  get version() { return this.__attr(`version`) }
  get ingestionDateUTC() { return this.__attr(`ingestionDateUTC`) }
}
export function selectFromPolygonPartRecord() {
  return new PolygonPartRecordModelSelector()
}

export const polygonPartRecordModelPrimitives = selectFromPolygonPartRecord().classification.name.description.imagingTimeBeginUTC.imagingTimeEndUTC.horizontalAccuracyCE90.sensors.countries.cities.resolutionDegree.resolutionMeter.geometry.recordId.version.ingestionDateUTC
