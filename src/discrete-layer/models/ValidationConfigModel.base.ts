/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from "mobx-state-tree"
import { QueryBuilder } from "mst-gql"
import { ModelBase } from "./ModelBase"
import { ValidationTypeEnumType } from "./ValidationTypeEnum"
import { RootStoreType } from "./index"


/**
 * ValidationConfigBase
 * auto generated base class for the model ValidationConfigModel.
 */
export const ValidationConfigModelBase = ModelBase
  .named('ValidationConfig')
  .props({
    __typename: types.optional(types.literal("ValidationConfig"), "ValidationConfig"),
    errorMsgCode: types.union(types.undefined, types.string),
    type: types.union(types.undefined, ValidationTypeEnumType),
    min: types.union(types.undefined, types.null, types.string),
    max: types.union(types.undefined, types.null, types.string),
    minLength: types.union(types.undefined, types.null, types.number),
    maxLength: types.union(types.undefined, types.null, types.number),
    pattern: types.union(types.undefined, types.null, types.string),
    errorMsgTranslation: types.union(types.undefined, types.null, types.string),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class ValidationConfigModelSelector extends QueryBuilder {
  get errorMsgCode() { return this.__attr(`errorMsgCode`) }
  get type() { return this.__attr(`type`) }
  get min() { return this.__attr(`min`) }
  get max() { return this.__attr(`max`) }
  get minLength() { return this.__attr(`minLength`) }
  get maxLength() { return this.__attr(`maxLength`) }
  get pattern() { return this.__attr(`pattern`) }
}
export function selectFromValidationConfig() {
  return new ValidationConfigModelSelector()
}

export const validationConfigModelPrimitives = selectFromValidationConfig().errorMsgCode.type.min.max.minLength.maxLength.pattern
