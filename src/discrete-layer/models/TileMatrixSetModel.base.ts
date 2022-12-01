/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from "mobx-state-tree"
import { QueryBuilder } from "mst-gql"
import { ModelBase } from "./ModelBase"
import { RootStoreType } from "./index"


/**
 * TileMatrixSetBase
 * auto generated base class for the model TileMatrixSetModel.
 */
export const TileMatrixSetModelBase = ModelBase
  .named('TileMatrixSet')
  .props({
    __typename: types.optional(types.literal("TileMatrixSet"), "TileMatrixSet"),
    tileMatrixSetID: types.union(types.undefined, types.string),
    tileMatrixLabels: types.union(types.undefined, types.array(types.string)),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class TileMatrixSetModelSelector extends QueryBuilder {
  get tileMatrixSetID() { return this.__attr(`tileMatrixSetID`) }
  get tileMatrixLabels() { return this.__attr(`tileMatrixLabels`) }
}
export function selectFromTileMatrixSet() {
  return new TileMatrixSetModelSelector()
}

export const tileMatrixSetModelPrimitives = selectFromTileMatrixSet().tileMatrixSetID.tileMatrixLabels
