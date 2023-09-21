/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from "mobx-state-tree"
import { QueryBuilder } from "mst-gql"
import { ModelBase } from "./ModelBase"
import { RootStoreType } from "./index"


/**
 * FilterFieldValidationBase
 * auto generated base class for the model FilterFieldValidationModel.
 */
export const FilterFieldValidationModelBase = ModelBase
  .named('FilterFieldValidation')
  .props({
    __typename: types.optional(types.literal("FilterFieldValidation"), "FilterFieldValidation"),
    min: types.union(types.undefined, types.null, types.number),
    max: types.union(types.undefined, types.null, types.number),
    minLength: types.union(types.undefined, types.null, types.number),
    maxLength: types.union(types.undefined, types.null, types.number),
    pattern: types.union(types.undefined, types.null, types.string),
    valueAsNumber: types.union(types.undefined, types.null, types.boolean),
    valueAsDate: types.union(types.undefined, types.null, types.boolean),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class FilterFieldValidationModelSelector extends QueryBuilder {
  get min() { return this.__attr(`min`) }
  get max() { return this.__attr(`max`) }
  get minLength() { return this.__attr(`minLength`) }
  get maxLength() { return this.__attr(`maxLength`) }
  get pattern() { return this.__attr(`pattern`) }
  get valueAsNumber() { return this.__attr(`valueAsNumber`) }
  get valueAsDate() { return this.__attr(`valueAsDate`) }
}
export function selectFromFilterFieldValidation() {
  return new FilterFieldValidationModelSelector()
}

export const filterFieldValidationModelPrimitives = selectFromFilterFieldValidation().min.max.minLength.maxLength.pattern.valueAsNumber.valueAsDate
