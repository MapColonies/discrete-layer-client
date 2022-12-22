/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from "mobx-state-tree"
import { QueryBuilder } from "mst-gql"
import { ModelBase } from "./ModelBase"
import { RootStoreType } from "./index"


/**
 * StyleBase
 * auto generated base class for the model StyleModel.
 */
export const StyleModelBase = ModelBase
  .named('Style')
  .props({
    __typename: types.optional(types.literal("Style"), "Style"),
    value: types.union(types.undefined, types.string),
    isDefault: types.union(types.undefined, types.null, types.string),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class StyleModelSelector extends QueryBuilder {
  get value() { return this.__attr(`value`) }
  get isDefault() { return this.__attr(`isDefault`) }
}
export function selectFromStyle() {
  return new StyleModelSelector()
}

export const styleModelPrimitives = selectFromStyle().value.isDefault
