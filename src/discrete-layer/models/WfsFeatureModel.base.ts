/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from "mobx-state-tree"
import { QueryBuilder } from "mst-gql"
import { ModelBase } from "./ModelBase"
import { RootStoreType } from "./index"


/**
 * WfsFeatureBase
 * auto generated base class for the model WfsFeatureModel.
 */
export const WfsFeatureModelBase = ModelBase
  .named('WfsFeature')
  .props({
    __typename: types.optional(types.literal("WfsFeature"), "WfsFeature"),
    type: types.union(types.undefined, types.string),
    geometry: types.union(types.undefined, types.frozen()),
    id: types.union(types.undefined, types.null, types.string),
    properties: types.union(types.undefined, types.frozen()),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class WfsFeatureModelSelector extends QueryBuilder {
  get type() { return this.__attr(`type`) }
  get geometry() { return this.__attr(`geometry`) }
  get id() { return this.__attr(`id`) }
  get properties() { return this.__attr(`properties`) }
}
export function selectFromWfsFeature() {
  return new WfsFeatureModelSelector()
}

export const wfsFeatureModelPrimitives = selectFromWfsFeature().type.geometry.properties
