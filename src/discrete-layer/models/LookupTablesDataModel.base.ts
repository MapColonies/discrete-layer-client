/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from "mobx-state-tree"
import { QueryBuilder } from "mst-gql"
import { ModelBase } from "./ModelBase"
import { RootStoreType } from "./index"


/**
 * LookupTablesDataBase
 * auto generated base class for the model LookupTablesDataModel.
 */
export const LookupTablesDataModelBase = ModelBase
  .named('LookupTablesData')
  .props({
    __typename: types.optional(types.literal("LookupTablesData"), "LookupTablesData"),
    classificationList: types.union(types.undefined, types.frozen()),
    countryList: types.union(types.undefined, types.frozen()),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class LookupTablesDataModelSelector extends QueryBuilder {
  get classificationList() { return this.__attr(`classificationList`) }
  get countryList() { return this.__attr(`countryList`) }
}
export function selectFromLookupTablesData() {
  return new LookupTablesDataModelSelector()
}

export const lookupTablesDataModelPrimitives = selectFromLookupTablesData().classificationList.countryList
