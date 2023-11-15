/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from "mobx-state-tree"
import { QueryBuilder } from "mst-gql"
import { ModelBase } from "./ModelBase"
import { RootStoreType } from "./index"


/**
 * DependentFieldBase
 * auto generated base class for the model DependentFieldModel.
 */
export const DependentFieldModelBase = ModelBase
  .named('DependentField')
  .props({
    __typename: types.optional(types.literal("DependentField"), "DependentField"),
    name: types.union(types.undefined, types.string),
    valueFromPropertyName: types.union(types.undefined, types.string),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class DependentFieldModelSelector extends QueryBuilder {
  get name() { return this.__attr(`name`) }
  get valueFromPropertyName() { return this.__attr(`valueFromPropertyName`) }
}
export function selectFromDependentField() {
  return new DependentFieldModelSelector()
}

export const dependentFieldModelPrimitives = selectFromDependentField().name.valueFromPropertyName
