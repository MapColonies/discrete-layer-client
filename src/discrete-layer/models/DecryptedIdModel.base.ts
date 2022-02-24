/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from "mobx-state-tree"
import { QueryBuilder } from "mst-gql"
import { ModelBase } from "./ModelBase"
import { RootStoreType } from "./index"


/**
 * DecryptedIdBase
 * auto generated base class for the model DecryptedIdModel.
 */
export const DecryptedIdModelBase = ModelBase
  .named('DecryptedId')
  .props({
    __typename: types.optional(types.literal("DecryptedId"), "DecryptedId"),
    data: types.union(types.undefined, types.string),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class DecryptedIdModelSelector extends QueryBuilder {
  get data() { return this.__attr(`data`) }
}
export function selectFromDecryptedId() {
  return new DecryptedIdModelSelector()
}

export const decryptedIdModelPrimitives = selectFromDecryptedId().data
