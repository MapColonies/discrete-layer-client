/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from "mobx-state-tree"
import { QueryBuilder } from "mst-gql"
import { ModelBase } from "./ModelBase"
import { RecordTypeEnumType } from "./RecordTypeEnum"
import { ServiceTypeEnumType } from "./ServiceTypeEnum"
import { RootStoreType } from "./index"


/**
 * ExternalServiceBase
 * auto generated base class for the model ExternalServiceModel.
 */
export const ExternalServiceModelBase = ModelBase
  .named('ExternalService')
  .props({
    __typename: types.optional(types.literal("ExternalService"), "ExternalService"),
    url: types.union(types.undefined, types.string),
    type: types.union(types.undefined, ServiceTypeEnumType),
    display: types.union(types.undefined, types.string),
    entity: types.union(types.undefined, RecordTypeEnumType),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class ExternalServiceModelSelector extends QueryBuilder {
  get url() { return this.__attr(`url`) }
  get type() { return this.__attr(`type`) }
  get display() { return this.__attr(`display`) }
  get entity() { return this.__attr(`entity`) }
}
export function selectFromExternalService() {
  return new ExternalServiceModelSelector()
}

export const externalServiceModelPrimitives = selectFromExternalService().url.type.display.entity
