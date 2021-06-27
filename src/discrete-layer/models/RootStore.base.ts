/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
import { ObservableMap } from "mobx"
import { types } from "mobx-state-tree"
import { MSTGQLStore, configureStoreMixin, QueryOptions, withTypedRefs } from "mst-gql"

import { Layer3DRecordModel, Layer3DRecordModelType } from "./Layer3DRecordModel"
import { layer3DRecordModelPrimitives, Layer3DRecordModelSelector } from "./Layer3DRecordModel.base"
import { LinkModel, LinkModelType } from "./LinkModel"
import { linkModelPrimitives, LinkModelSelector } from "./LinkModel.base"
import { LayerRasterRecordModel, LayerRasterRecordModelType } from "./LayerRasterRecordModel"
import { layerRasterRecordModelPrimitives, LayerRasterRecordModelSelector } from "./LayerRasterRecordModel.base"
import { EntityDescriptorModel, EntityDescriptorModelType } from "./EntityDescriptorModel"
import { entityDescriptorModelPrimitives, EntityDescriptorModelSelector } from "./EntityDescriptorModel.base"
import { CategoryConfigModel, CategoryConfigModelType } from "./CategoryConfigModel"
import { categoryConfigModelPrimitives, CategoryConfigModelSelector } from "./CategoryConfigModel.base"
import { FieldConfigModel, FieldConfigModelType } from "./FieldConfigModel"
import { fieldConfigModelPrimitives, FieldConfigModelSelector } from "./FieldConfigModel.base"

import { layerMetadataMixedModelPrimitives, LayerMetadataMixedModelSelector , LayerMetadataMixedUnion } from "./"

import { RecordType } from "./RecordTypeEnum"
import { SensorType } from "./SensorTypeEnum"
import { FieldCategory } from "./FieldCategoryEnum"

export type SearchOptions = {
  filter?: FilterField[]
  sort?: SortField[]
}
export type FilterField = {
  or?: boolean
  field: string
  like?: string
  eq?: string
  neq?: string
  gt?: string
  lt?: string
  gteq?: string
  lteq?: string
  in?: string[]
  bbox?: Bbox
}
export type Bbox = {
  llat: number
  llon: number
  ulat: number
  ulon: number
}
export type SortField = {
  field: string
  desc?: boolean
}
/* The TypeScript type that explicits the refs to other models in order to prevent a circular refs issue */
type Refs = {
  layerRasterRecords: ObservableMap<string, LayerRasterRecordModelType>,
  layer3DRecords: ObservableMap<string, Layer3DRecordModelType>,
  entityDescriptors: ObservableMap<string, EntityDescriptorModelType>
}


/**
* Enums for the names of base graphql actions
*/
export enum RootStoreBaseQueries {
querySearch="querySearch",
queryEntityDescriptors="queryEntityDescriptors"
}


/**
* Store, managing, among others, all the objects received through graphQL
*/
export const RootStoreBase = withTypedRefs<Refs>()(MSTGQLStore
  .named("RootStore")
  .extend(configureStoreMixin([['Layer3DRecord', () => Layer3DRecordModel], ['Link', () => LinkModel], ['LayerRasterRecord', () => LayerRasterRecordModel], ['EntityDescriptor', () => EntityDescriptorModel], ['CategoryConfig', () => CategoryConfigModel], ['FieldConfig', () => FieldConfigModel]], ['LayerRasterRecord', 'Layer3DRecord', 'EntityDescriptor'], "js"))
  .props({
    layerRasterRecords: types.optional(types.map(types.late((): any => LayerRasterRecordModel)), {}),
    layer3DRecords: types.optional(types.map(types.late((): any => Layer3DRecordModel)), {}),
    entityDescriptors: types.optional(types.map(types.late((): any => EntityDescriptorModel)), {})
  })
  .actions(self => ({
    querySearch(variables: { opts?: SearchOptions, end?: number, start?: number }, resultSelector: string | ((qb: LayerMetadataMixedModelSelector) => LayerMetadataMixedModelSelector) = layerMetadataMixedModelPrimitives.toString(), options: QueryOptions = {}) {
      return self.query<{ search: LayerMetadataMixedUnion[]}>(`query search($opts: SearchOptions, $end: Float, $start: Float) { search(opts: $opts, end: $end, start: $start) {
        ${typeof resultSelector === "function" ? resultSelector(new LayerMetadataMixedModelSelector()).toString() : resultSelector}
      } }`, variables, options)
    },
    queryEntityDescriptors(variables?: {  }, resultSelector: string | ((qb: EntityDescriptorModelSelector) => EntityDescriptorModelSelector) = entityDescriptorModelPrimitives.toString(), options: QueryOptions = {}) {
      return self.query<{ entityDescriptors: EntityDescriptorModelType[]}>(`query entityDescriptors { entityDescriptors {
        ${typeof resultSelector === "function" ? resultSelector(new EntityDescriptorModelSelector()).toString() : resultSelector}
      } }`, variables, options)
    },
  })))
