/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from "mobx-state-tree"
import { QueryBuilder } from "mst-gql"
import { ModelBase } from "./ModelBase"
import { RootStoreType } from "./index"


/**
 * McEnumsBase
 * auto generated base class for the model McEnumsModel.
 */
export const McEnumsModelBase = ModelBase
  .named('McEnums')
  .props({
    __typename: types.optional(types.literal("MCEnums"), "MCEnums"),
    enums: types.union(types.undefined, types.frozen()),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class McEnumsModelSelector extends QueryBuilder {
  get enums() { return this.__attr(`enums`) }
}
export function selectFromMcEnums() {
  return new McEnumsModelSelector()
}

export const mcEnumsModelPrimitives = selectFromMcEnums().enums
