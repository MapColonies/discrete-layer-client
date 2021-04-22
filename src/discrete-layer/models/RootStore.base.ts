/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
import { ObservableMap } from "mobx"
import { types } from "mobx-state-tree"
import { MSTGQLStore, configureStoreMixin, QueryOptions, withTypedRefs } from "mst-gql"

import { LinkModel, LinkModelType } from "./LinkModel"
import { linkModelPrimitives, LinkModelSelector } from "./LinkModel.base"
import { LayerMetadataModel, LayerMetadataModelType } from "./LayerMetadataModel"
import { layerMetadataModelPrimitives, LayerMetadataModelSelector } from "./LayerMetadataModel.base"
import { LayerMetadata3DModel, LayerMetadata3DModelType } from "./LayerMetadata3DModel"
import { layerMetadata3DModelPrimitives, LayerMetadata3DModelSelector } from "./LayerMetadata3DModel.base"

import { layerMetadataMixedModelPrimitives, LayerMetadataMixedModelSelector , LayerMetadataMixedUnion } from "./LayerMetadataMixedModelSelector" // *****ALEX CHANGE


/* The TypeScript type that explicits the refs to other models in order to prevent a circular refs issue */
type Refs = {
  layerMetadata: ObservableMap<string, LayerMetadataModelType>
  layerMetadata3DS: ObservableMap<string, LayerMetadata3DModelType> // *****ALEX CHANGE
}


/**
* Enums for the names of base graphql actions
*/
export enum RootStoreBaseQueries {
queryCatalogItems="queryCatalogItems"
}


/**
* Store, managing, among others, all the objects received through graphQL
*/
export const RootStoreBase = withTypedRefs<Refs>()(MSTGQLStore
  .named("RootStore")
  .extend(configureStoreMixin([['Link', () => LinkModel], ['LayerMetadata', () => LayerMetadataModel], ['LayerMetadata3D', () => LayerMetadata3DModel]], ['LayerMetadata', 'LayerMetadata3D'], "js")) // *****ALEX CHANGE
  .props({
    layerMetadata: types.optional(types.map(types.late((): any => LayerMetadataModel)), {}),
    layerMetadata3DS: types.optional(types.map(types.late((): any => LayerMetadata3DModel)), {}), // *****ALEX CHANGE
  })
  .actions(self => ({
    queryCatalogItems(variables?: {  }, resultSelector: string | ((qb: LayerMetadataMixedModelSelector) => LayerMetadataMixedModelSelector) = layerMetadataMixedModelPrimitives.toString(), options: QueryOptions = {}) {
      return self.query<{ catalogItems: LayerMetadataMixedUnion[]}>(`query catalogItems { catalogItems {
        ${typeof resultSelector === "function" ? resultSelector(new LayerMetadataMixedModelSelector()).toString() : resultSelector}
      } }`, variables, options)
    },
  })))
