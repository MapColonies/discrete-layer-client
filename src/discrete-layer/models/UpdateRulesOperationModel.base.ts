/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from "mobx-state-tree"
import { QueryBuilder } from "mst-gql"
import { ModelBase } from "./ModelBase"
import { FractionTypeEnumType } from "./FractionTypeEnum"
import { OperationTypeEnumType } from "./OperationTypeEnum"
import { RootStoreType } from "./index"


/**
 * UpdateRulesOperationBase
 * auto generated base class for the model UpdateRulesOperationModel.
 */
export const UpdateRulesOperationModelBase = ModelBase
  .named('UpdateRulesOperation')
  .props({
    __typename: types.optional(types.literal("UpdateRulesOperation"), "UpdateRulesOperation"),
    type: types.union(types.undefined, types.null, OperationTypeEnumType),
    fraction: types.union(types.undefined, types.null, FractionTypeEnumType),
    value: types.union(types.undefined, types.null, types.number),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class UpdateRulesOperationModelSelector extends QueryBuilder {
  get type() { return this.__attr(`type`) }
  get fraction() { return this.__attr(`fraction`) }
  get value() { return this.__attr(`value`) }
}
export function selectFromUpdateRulesOperation() {
  return new UpdateRulesOperationModelSelector()
}

export const updateRulesOperationModelPrimitives = selectFromUpdateRulesOperation().type.fraction.value
