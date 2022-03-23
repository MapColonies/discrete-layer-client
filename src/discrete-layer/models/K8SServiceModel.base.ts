/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from "mobx-state-tree"
import { QueryBuilder } from "mst-gql"
import { ModelBase } from "./ModelBase"
import { RootStoreType } from "./index"


/**
 * K8SServiceBase
 * auto generated base class for the model K8SServiceModel.
 */
export const K8SServiceModelBase = ModelBase
  .named('K8SService')
  .props({
    __typename: types.optional(types.literal("K8sService"), "K8sService"),
    name: types.union(types.undefined, types.null, types.string),
    uid: types.union(types.undefined, types.null, types.string),
    addresses: types.union(types.undefined, types.null, types.array(types.string)),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class K8SServiceModelSelector extends QueryBuilder {
  get name() { return this.__attr(`name`) }
  get uid() { return this.__attr(`uid`) }
  get addresses() { return this.__attr(`addresses`) }
}
export function selectFromK8SService() {
  return new K8SServiceModelSelector()
}

export const k8SServiceModelPrimitives = selectFromK8SService().name.uid.addresses
