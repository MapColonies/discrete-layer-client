/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from "mobx-state-tree"
import { QueryBuilder } from "mst-gql"
import { ModelBase } from "./ModelBase"
import { RootStoreType } from "./index"


/**
 * SourceValidationBase
 * auto generated base class for the model SourceValidationModel.
 */
export const SourceValidationModelBase = ModelBase
  .named('SourceValidation')
  .props({
    __typename: types.optional(types.literal("SourceValidation"), "SourceValidation"),
    isValid: types.union(types.undefined, types.boolean),
    message: types.union(types.undefined, types.string),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class SourceValidationModelSelector extends QueryBuilder {
  get isValid() { return this.__attr(`isValid`) }
  get message() { return this.__attr(`message`) }
}
export function selectFromSourceValidation() {
  return new SourceValidationModelSelector()
}

export const sourceValidationModelPrimitives = selectFromSourceValidation().isValid.message
