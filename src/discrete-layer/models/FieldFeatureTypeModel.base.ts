/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from "mobx-state-tree"
import { QueryBuilder } from "mst-gql"
import { ModelBase } from "./ModelBase"
import { RootStoreType } from "./index"


/**
 * FieldFeatureTypeBase
 * auto generated base class for the model FieldFeatureTypeModel.
 */
export const FieldFeatureTypeModelBase = ModelBase
  .named('FieldFeatureType')
  .props({
    __typename: types.optional(types.literal("FieldFeatureType"), "FieldFeatureType"),
    fieldName: types.union(types.undefined, types.null, types.string),
    aliasFieldName: types.union(types.undefined, types.null, types.string),
    type: types.union(types.undefined, types.null, types.string),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class FieldFeatureTypeModelSelector extends QueryBuilder {
  get fieldName() { return this.__attr(`fieldName`) }
  get aliasFieldName() { return this.__attr(`aliasFieldName`) }
  get type() { return this.__attr(`type`) }
}
export function selectFromFieldFeatureType() {
  return new FieldFeatureTypeModelSelector()
}

export const fieldFeatureTypeModelPrimitives = selectFromFieldFeatureType().fieldName.aliasFieldName.type
