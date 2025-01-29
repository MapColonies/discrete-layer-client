/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from "mobx-state-tree"
import { QueryBuilder } from "mst-gql"
import { ModelBase } from "./ModelBase"
import { ProviderTypeEnumType } from "./ProviderTypeEnum"
import { RootStoreType } from "./index"


/**
 * ShapeMappingBase
 * auto generated base class for the model ShapeMappingModel.
 */
export const ShapeMappingModelBase = ModelBase
  .named('ShapeMapping')
  .props({
    __typename: types.optional(types.literal("ShapeMapping"), "ShapeMapping"),
    provider: types.union(types.undefined, ProviderTypeEnumType),
    valuePath: types.union(types.undefined, types.string),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class ShapeMappingModelSelector extends QueryBuilder {
  get provider() { return this.__attr(`provider`) }
  get valuePath() { return this.__attr(`valuePath`) }
}
export function selectFromShapeMapping() {
  return new ShapeMappingModelSelector()
}

export const shapeMappingModelPrimitives = selectFromShapeMapping().provider.valuePath
