/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from "mobx-state-tree"
import { QueryBuilder } from "mst-gql"
import { ModelBase } from "./ModelBase"
import { RootStoreType } from "./index"


/**
 * ResourceUrlBase
 * auto generated base class for the model ResourceUrlModel.
 */
export const ResourceUrlModelBase = ModelBase
  .named('ResourceUrl')
  .props({
    __typename: types.optional(types.literal("ResourceURL"), "ResourceURL"),
    format: types.union(types.undefined, types.string),
    resourceType: types.union(types.undefined, types.string),
    template: types.union(types.undefined, types.string),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class ResourceUrlModelSelector extends QueryBuilder {
  get format() { return this.__attr(`format`) }
  get resourceType() { return this.__attr(`resourceType`) }
  get template() { return this.__attr(`template`) }
}
export function selectFromResourceUrl() {
  return new ResourceUrlModelSelector()
}

export const resourceUrlModelPrimitives = selectFromResourceUrl().format.resourceType.template
