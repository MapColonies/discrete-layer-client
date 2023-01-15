/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from "mobx-state-tree"
import { QueryBuilder } from "mst-gql"
import { ModelBase } from "./ModelBase"
import { RootStoreType } from "./index"


/**
 * LookupTableDataBase
 * auto generated base class for the model LookupTableDataModel.
 */
export const LookupTableDataModelBase = ModelBase
  .named('LookupTableData')
  .props({
    __typename: types.optional(types.literal("LookupTableData"), "LookupTableData"),
    dictionary: types.union(types.undefined, types.frozen()),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class LookupTableDataModelSelector extends QueryBuilder {
  get dictionary() { return this.__attr(`dictionary`) }
}
export function selectFromLookupTableData() {
  return new LookupTableDataModelSelector()
}

export const lookupTableDataModelPrimitives = selectFromLookupTableData().dictionary
