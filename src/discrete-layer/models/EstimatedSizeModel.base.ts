/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from "mobx-state-tree"
import { QueryBuilder } from "mst-gql"
import { ModelBase } from "./ModelBase"
import { RootStoreType } from "./index"


/**
 * EstimatedSizeBase
 * auto generated base class for the model EstimatedSizeModel.
 */
export const EstimatedSizeModelBase = ModelBase
  .named('EstimatedSize')
  .props({
    __typename: types.optional(types.literal("EstimatedSize"), "EstimatedSize"),
    estimatedSizeBytes: types.union(types.undefined, types.null, types.number),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class EstimatedSizeModelSelector extends QueryBuilder {
  get estimatedSizeBytes() { return this.__attr(`estimatedSizeBytes`) }
}
export function selectFromEstimatedSize() {
  return new EstimatedSizeModelSelector()
}

export const estimatedSizeModelPrimitives = selectFromEstimatedSize().estimatedSizeBytes
