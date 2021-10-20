/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from "mobx-state-tree"
import { QueryBuilder } from "mst-gql"
import { ModelBase } from "./ModelBase"
import { RootStoreType } from "./index"


/**
 * StringArrayObjectTypeBase
 * auto generated base class for the model StringArrayObjectTypeModel.
 */
export const StringArrayObjectTypeModelBase = ModelBase
  .named('StringArrayObjectType')
  .props({
    __typename: types.optional(types.literal("StringArrayObjectType"), "StringArrayObjectType"),
    value: types.union(types.undefined, types.array(types.string)),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class StringArrayObjectTypeModelSelector extends QueryBuilder {
  get value() { return this.__attr(`value`) }
}
export function selectFromStringArrayObjectType() {
  return new StringArrayObjectTypeModelSelector()
}

export const stringArrayObjectTypeModelPrimitives = selectFromStringArrayObjectType().value
