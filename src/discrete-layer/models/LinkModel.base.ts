/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from "mobx-state-tree"
import { QueryBuilder } from "mst-gql"
import { ModelBase } from "./ModelBase"
import { RootStoreType } from "./index"


/**
 * LinkBase
 * auto generated base class for the model LinkModel.
 */
export const LinkModelBase = ModelBase
  .named('Link')
  .props({
    __typename: types.optional(types.literal("Link"), "Link"),
    name: types.union(types.undefined, types.null, types.string),
    description: types.union(types.undefined, types.null, types.string),
    protocol: types.union(types.undefined, types.string),
    url: types.union(types.undefined, types.string),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class LinkModelSelector extends QueryBuilder {
  get name() { return this.__attr(`name`) }
  get description() { return this.__attr(`description`) }
  get protocol() { return this.__attr(`protocol`) }
  get url() { return this.__attr(`url`) }
}
export function selectFromLink() {
  return new LinkModelSelector()
}

export const linkModelPrimitives = selectFromLink().name.description.protocol.url
