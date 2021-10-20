/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from "mobx-state-tree"
import { QueryBuilder } from "mst-gql"
import { ModelBase } from "./ModelBase"
import { AutocomplitionTypeEnumType } from "./AutocomplitionTypeEnum"
import { RootStoreType } from "./index"


/**
 * AutocompletionBase
 * auto generated base class for the model AutocompletionModel.
 */
export const AutocompletionModelBase = ModelBase
  .named('Autocompletion')
  .props({
    __typename: types.optional(types.literal("Autocompletion"), "Autocompletion"),
    type: types.union(types.undefined, AutocomplitionTypeEnumType),
    value: types.union(types.undefined, types.string),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class AutocompletionModelSelector extends QueryBuilder {
  get type() { return this.__attr(`type`) }
  get value() { return this.__attr(`value`) }
}
export function selectFromAutocompletion() {
  return new AutocompletionModelSelector()
}

export const autocompletionModelPrimitives = selectFromAutocompletion().type.value
