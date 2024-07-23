/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from "mobx-state-tree"
import { QueryBuilder } from "mst-gql"
import { ModelBase } from "./ModelBase"
import { RootStoreType } from "./index"


/**
 * SourceInfoBase
 * auto generated base class for the model SourceInfoModel.
 */
export const SourceInfoModelBase = ModelBase
  .named('SourceInfo')
  .props({
    __typename: types.optional(types.literal("SourceInfo"), "SourceInfo"),
    srs: types.union(types.undefined, types.string),
    fileFormat: types.union(types.undefined, types.string),
    resolutionDegree: types.union(types.undefined, types.number),
    extentPolygon: types.union(types.undefined, types.frozen()),
    fileName: types.union(types.undefined, types.string),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class SourceInfoModelSelector extends QueryBuilder {
  get srs() { return this.__attr(`srs`) }
  get fileFormat() { return this.__attr(`fileFormat`) }
  get resolutionDegree() { return this.__attr(`resolutionDegree`) }
  get extentPolygon() { return this.__attr(`extentPolygon`) }
  get fileName() { return this.__attr(`fileName`) }
}
export function selectFromSourceInfo() {
  return new SourceInfoModelSelector()
}

export const sourceInfoModelPrimitives = selectFromSourceInfo().srs.fileFormat.resolutionDegree.extentPolygon.fileName
