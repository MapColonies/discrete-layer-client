/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from "mobx-state-tree"
import { QueryBuilder } from "mst-gql"
import { ModelBase } from "./ModelBase"
import { RootStoreType } from "./index"


/**
 * UserLoginBase
 * auto generated base class for the model UserLoginModel.
 */
export const UserLoginModelBase = ModelBase
  .named('UserLogin')
  .props({
    __typename: types.optional(types.literal("UserLogin"), "UserLogin"),
    isValid: types.union(types.undefined, types.boolean),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class UserLoginModelSelector extends QueryBuilder {
  get isValid() { return this.__attr(`isValid`) }
}
export function selectFromUserLogin() {
  return new UserLoginModelSelector()
}

export const userLoginModelPrimitives = selectFromUserLogin().isValid
