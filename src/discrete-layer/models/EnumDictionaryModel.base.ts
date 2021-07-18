/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from "mobx-state-tree"
import { QueryBuilder } from "mst-gql"
import { ModelBase } from "./ModelBase"
import { RootStoreType } from "./index"


/**
 * EnumDictionaryBase
 * auto generated base class for the model EnumDictionaryModel.
 */
export const EnumDictionaryModelBase = ModelBase
  .named('EnumDictionary')
  .props({
    __typename: types.optional(types.literal("EnumDictionary"), "EnumDictionary"),
    displayKey: types.union(types.undefined, types.string),
    tooltipKey: types.union(types.undefined, types.null, types.string),
    icon: types.union(types.undefined, types.null, types.string),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class EnumDictionaryModelSelector extends QueryBuilder {
  get displayKey() { return this.__attr(`displayKey`) }
  get tooltipKey() { return this.__attr(`tooltipKey`) }
  get icon() { return this.__attr(`icon`) }
}
export function selectFromEnumDictionary() {
  return new EnumDictionaryModelSelector()
}

export const enumDictionaryModelPrimitives = selectFromEnumDictionary().displayKey.tooltipKey.icon
