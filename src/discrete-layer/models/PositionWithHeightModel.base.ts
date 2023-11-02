/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from "mobx-state-tree"
import { QueryBuilder } from "mst-gql"
import { ModelBase } from "./ModelBase"
import { RootStoreType } from "./index"


/**
 * PositionWithHeightBase
 * auto generated base class for the model PositionWithHeightModel.
 */
export const PositionWithHeightModelBase = ModelBase
  .named('PositionWithHeight')
  .props({
    __typename: types.optional(types.literal("PositionWithHeight"), "PositionWithHeight"),
    latitude: types.union(types.undefined, types.number),
    longitude: types.union(types.undefined, types.number),
    height: types.union(types.undefined, types.null, types.number),
    productId: types.union(types.undefined, types.null, types.string),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class PositionWithHeightModelSelector extends QueryBuilder {
  get latitude() { return this.__attr(`latitude`) }
  get longitude() { return this.__attr(`longitude`) }
  get height() { return this.__attr(`height`) }
  get productId() { return this.__attr(`productId`) }
}
export function selectFromPositionWithHeight() {
  return new PositionWithHeightModelSelector()
}

export const positionWithHeightModelPrimitives = selectFromPositionWithHeight().latitude.longitude.height.productId
