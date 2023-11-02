/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from "mobx-state-tree"
import { QueryBuilder } from "mst-gql"
import { ModelBase } from "./ModelBase"
import { RootStoreType } from "./index"


/**
 * BriefFieldConfigBase
 * auto generated base class for the model BriefFieldConfigModel.
 */
export const BriefFieldConfigModelBase = ModelBase
  .named('BriefFieldConfig')
  .props({
    __typename: types.optional(types.literal("BriefFieldConfig"), "BriefFieldConfig"),
    order: types.union(types.undefined, types.number),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class BriefFieldConfigModelSelector extends QueryBuilder {
  get order() { return this.__attr(`order`) }
}
export function selectFromBriefFieldConfig() {
  return new BriefFieldConfigModelSelector()
}

export const briefFieldConfigModelPrimitives = selectFromBriefFieldConfig().order
