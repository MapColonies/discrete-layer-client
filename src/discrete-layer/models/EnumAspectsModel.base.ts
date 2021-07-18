/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from "mobx-state-tree"
import { QueryBuilder } from "mst-gql"
import { ModelBase } from "./ModelBase"
import { RootStoreType } from "./index"


/**
 * EnumAspectsBase
 * auto generated base class for the model EnumAspectsModel.
 */
export const EnumAspectsModelBase = ModelBase
  .named('EnumAspects')
  .props({
    __typename: types.optional(types.literal("EnumAspects"), "EnumAspects"),
    dictionary: types.union(types.undefined, types.frozen()),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class EnumAspectsModelSelector extends QueryBuilder {
  get dictionary() { return this.__attr(`dictionary`) }
}
export function selectFromEnumAspects() {
  return new EnumAspectsModelSelector()
}

export const enumAspectsModelPrimitives = selectFromEnumAspects().dictionary
