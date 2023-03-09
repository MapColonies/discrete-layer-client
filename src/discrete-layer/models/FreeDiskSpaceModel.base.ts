/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from "mobx-state-tree"
import { QueryBuilder } from "mst-gql"
import { ModelBase } from "./ModelBase"
import { RootStoreType } from "./index"


/**
 * FreeDiskSpaceBase
 * auto generated base class for the model FreeDiskSpaceModel.
 */
export const FreeDiskSpaceModelBase = ModelBase
  .named('FreeDiskSpace')
  .props({
    __typename: types.optional(types.literal("FreeDiskSpace"), "FreeDiskSpace"),
    freeDiskSpaceInKb: types.union(types.undefined, types.null, types.number),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class FreeDiskSpaceModelSelector extends QueryBuilder {
  get freeDiskSpaceInKb() { return this.__attr(`freeDiskSpaceInKb`) }
}
export function selectFromFreeDiskSpace() {
  return new FreeDiskSpaceModelSelector()
}

export const freeDiskSpaceModelPrimitives = selectFromFreeDiskSpace().freeDiskSpaceInKb
