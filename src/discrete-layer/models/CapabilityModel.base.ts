/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from "mobx-state-tree"
import { QueryBuilder } from "mst-gql"
import { ModelBase } from "./ModelBase"
import { ResourceUrlModel, ResourceUrlModelType } from "./ResourceUrlModel"
import { ResourceUrlModelSelector, resourceUrlModelPrimitives } from "./ResourceUrlModel.base"
import { RootStoreType } from "./index"


/**
 * CapabilityBase
 * auto generated base class for the model CapabilityModel.
 */
export const CapabilityModelBase = ModelBase
  .named('Capability')
  .props({
    __typename: types.optional(types.literal("Capability"), "Capability"),
    //id: types.union(types.undefined, types.string),
    id: types.identifier, //Alex change till proper deffs
    style: types.union(types.undefined, types.string),
    format: types.union(types.undefined, types.array(types.string)),
    tileMatrixSetID: types.union(types.undefined, types.array(types.string)),
    url: types.union(types.undefined, types.null, types.array(types.late((): any => ResourceUrlModel))),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class CapabilityModelSelector extends QueryBuilder {
  get id() { return this.__attr(`id`) }
  get style() { return this.__attr(`style`) }
  get format() { return this.__attr(`format`) }
  get tileMatrixSetID() { return this.__attr(`tileMatrixSetID`) }
  url(builder?: string | ResourceUrlModelSelector | ((selector: ResourceUrlModelSelector) => ResourceUrlModelSelector)) { return this.__child(`url`, ResourceUrlModelSelector, builder) }
}
export function selectFromCapability() {
  return new CapabilityModelSelector()
}

export const capabilityModelPrimitives = selectFromCapability().style.format.tileMatrixSetID.id.url(resourceUrlModelPrimitives)
