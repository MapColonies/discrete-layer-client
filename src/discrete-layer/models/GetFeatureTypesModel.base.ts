/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from "mobx-state-tree"
import { QueryBuilder } from "mst-gql"
import { ModelBase } from "./ModelBase"
import { RootStoreType } from "./index"


/**
 * GetFeatureTypesBase
 * auto generated base class for the model GetFeatureTypesModel.
 */
export const GetFeatureTypesModelBase = ModelBase
  .named('GetFeatureTypes')
  .props({
    __typename: types.optional(types.literal("GetFeatureTypes"), "GetFeatureTypes"),
    typesArr: types.union(types.undefined, types.null, types.array(types.string)),
    featureConfigs: types.union(types.undefined, types.null, types.frozen()),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class GetFeatureTypesModelSelector extends QueryBuilder {
  get typesArr() { return this.__attr(`typesArr`) }
  get featureConfigs() { return this.__attr(`featureConfigs`) }
}
export function selectFromGetFeatureTypes() {
  return new GetFeatureTypesModelSelector()
}

export const getFeatureTypesModelPrimitives = selectFromGetFeatureTypes().typesArr.featureConfigs
