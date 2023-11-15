/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from "mobx-state-tree"
import { QueryBuilder } from "mst-gql"
import { ModelBase } from "./ModelBase"
import { RootStoreType } from "./index"


/**
 * LookupTableBindingBase
 * auto generated base class for the model LookupTableBindingModel.
 */
export const LookupTableBindingModelBase = ModelBase
  .named('LookupTableBinding')
  .props({
    __typename: types.optional(types.literal("LookupTableBinding"), "LookupTableBinding"),
    valueFromPropertyName: types.union(types.undefined, types.string),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class LookupTableBindingModelSelector extends QueryBuilder {
  get valueFromPropertyName() { return this.__attr(`valueFromPropertyName`) }
}
export function selectFromLookupTableBinding() {
  return new LookupTableBindingModelSelector()
}

export const lookupTableBindingModelPrimitives = selectFromLookupTableBinding().valueFromPropertyName
