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
import { BestRecordModel, BestRecordModelType } from "./BestRecordModel"
import { bestRecordModelPrimitives, BestRecordModelSelector } from "./BestRecordModel.base"
import { DiscreteOrderModel, DiscreteOrderModelType } from "./DiscreteOrderModel"
import { discreteOrderModelPrimitives, DiscreteOrderModelSelector } from "./DiscreteOrderModel.base"
import { StringArrayObjectTypeModel, StringArrayObjectTypeModelType } from "./StringArrayObjectTypeModel"
import { stringArrayObjectTypeModelPrimitives, StringArrayObjectTypeModelSelector } from "./StringArrayObjectTypeModel.base"
import { EntityDescriptorModel, EntityDescriptorModelType } from "./EntityDescriptorModel"
import { entityDescriptorModelPrimitives, EntityDescriptorModelSelector } from "./EntityDescriptorModel.base"
import { CategoryConfigModel, CategoryConfigModelType } from "./CategoryConfigModel"
import { categoryConfigModelPrimitives, CategoryConfigModelSelector } from "./CategoryConfigModel.base"
import { FieldConfigModel, FieldConfigModelType } from "./FieldConfigModel"
import { fieldConfigModelPrimitives, FieldConfigModelSelector } from "./FieldConfigModel.base"
import { AutocompletionModel, AutocompletionModelType } from "./AutocompletionModel"
import { autocompletionModelPrimitives, AutocompletionModelSelector } from "./AutocompletionModel.base"
import { ValidationConfigModel, ValidationConfigModelType } from "./ValidationConfigModel"
import { validationConfigModelPrimitives, ValidationConfigModelSelector } from "./ValidationConfigModel.base"
import { EnumAspectsModel, EnumAspectsModelType } from "./EnumAspectsModel"
import { enumAspectsModelPrimitives, EnumAspectsModelSelector } from "./EnumAspectsModel.base"
import { JobModel, JobModelType } from "./JobModel"
import { jobModelPrimitives, JobModelSelector } from "./JobModel.base"
import { TaskModel, TaskModelType } from "./TaskModel"
import { taskModelPrimitives, TaskModelSelector } from "./TaskModel.base"

import { layerMetadataMixedModelPrimitives, LayerMetadataMixedModelSelector , LayerMetadataMixedUnion } from "./"

import { RecordType } from "./RecordTypeEnum"
import { SensorType } from "./SensorTypeEnum"
import { ProductType } from "./ProductTypeEnum"
import { FieldCategory } from "./FieldCategoryEnum"
import { AutocomplitionType } from "./AutocomplitionTypeEnum"
import { ValidationType } from "./ValidationTypeEnum"
import { Status } from "./StatusEnum"

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
export type StringArray = {
  value: string[]
}
export type JobsSearchParams = {
  resourceId?: string
  version?: string
  isCleaned?: boolean
  status?: Status
  type?: string
}
export type RecordUpdatePartial = {
  productName?: string
  description?: string
  sensorType?: SensorType[]
  classification?: string
  keywords?: string
  id: string
  type: RecordType
}
export type IngestionRasterData = {
  directory: string
  fileNames: string[]
  metadata: LayerRasterRecordInput
  type: RecordType
}
export type LayerRasterRecordInput = {
  type?: RecordType
  classification?: string
  productName: string
  description?: string
  srsId?: string
  producerName?: string
  creationDate?: any
  ingestionDate?: any
  updateDate?: any
  sourceDateStart?: any
  sourceDateEnd?: any
  accuracyCE90?: number
  sensorType?: SensorType[]
  region?: string
  productId: string
  productVersion?: string
  productType: ProductType
  productSubType?: string
  srsName?: string
  resolution?: number
  maxResolutionMeter?: number
  rms?: number
  scale?: string
  footprint?: any
  layerPolygonParts?: any
  includedInBests?: string[]
  productBoundingBox?: string
  id: string
  insertDate?: any
  keywords?: string
  links?: LinkInput[]
}
export type LinkInput = {
  name?: string
  description?: string
  protocol: string
  url: string
}
export type Ingestion3DData = {
  directory: string
  fileNames: string[]
  metadata: Layer3DRecordInput
  type: RecordType
}
export type Layer3DRecordInput = {
  type?: RecordType
  classification?: string
  productName: string
  description?: string
  srsId?: string
  producerName?: string
  creationDate?: any
  ingestionDate?: any
  updateDate?: any
  sourceDateStart?: any
  sourceDateEnd?: any
  accuracyCE90?: number
  sensorType?: SensorType[]
  region?: string
  projectName?: string
  validationDate?: any
  version?: string
  centroid?: string
  footprint?: any
  relativeAccuracyLE90?: number
  estimatedPrecision?: number
  measuredPrecision?: number
  nominalResolution?: number
  accuracyLE90?: number
  id: string
  insertDate?: any
  wktGeometry?: string
  keywords?: string
  links?: LinkInput[]
}
export type JobUpdateData = {
  parameters?: any
  status?: string
  percentage?: number
  reason?: string
  isCleaned?: boolean
  priority?: number
}
/* The TypeScript type that explicits the refs to other models in order to prevent a circular refs issue */
type Refs = {
  layerRasterRecords: ObservableMap<string, LayerRasterRecordModelType>,
  layer3DRecords: ObservableMap<string, Layer3DRecordModelType>,
  bestRecords: ObservableMap<string, BestRecordModelType>,
  entityDescriptors: ObservableMap<string, EntityDescriptorModelType>
}


/**
* Enums for the names of base graphql actions
*/
export enum RootStoreBaseQueries {
querySearch="querySearch",
querySearchById="querySearchById",
queryGetDomain="queryGetDomain",
queryEntityDescriptors="queryEntityDescriptors",
queryJobs="queryJobs"
}
export enum RootStoreBaseMutations {
mutateUpdateMetadata="mutateUpdateMetadata",
mutateStartRasterIngestion="mutateStartRasterIngestion",
mutateStart3DIngestion="mutateStart3DIngestion",
mutateUpdateJob="mutateUpdateJob"
}

/**
* Store, managing, among others, all the objects received through graphQL
*/
export const RootStoreBase = withTypedRefs<Refs>()(MSTGQLStore
  .named("RootStore")
  .extend(configureStoreMixin([['Layer3DRecord', () => Layer3DRecordModel], ['Link', () => LinkModel], ['LayerRasterRecord', () => LayerRasterRecordModel], ['BestRecord', () => BestRecordModel], ['DiscreteOrder', () => DiscreteOrderModel], ['StringArrayObjectType', () => StringArrayObjectTypeModel], ['EntityDescriptor', () => EntityDescriptorModel], ['CategoryConfig', () => CategoryConfigModel], ['FieldConfig', () => FieldConfigModel], ['Autocompletion', () => AutocompletionModel], ['ValidationConfig', () => ValidationConfigModel], ['EnumAspects', () => EnumAspectsModel], ['Job', () => JobModel], ['Task', () => TaskModel]], ['LayerRasterRecord', 'Layer3DRecord', 'BestRecord', 'EntityDescriptor'], "js"))
  .props({
    layerRasterRecords: types.optional(types.map(types.late((): any => LayerRasterRecordModel)), {}),
    layer3DRecords: types.optional(types.map(types.late((): any => Layer3DRecordModel)), {}),
    bestRecords: types.optional(types.map(types.late((): any => BestRecordModel)), {}),
    entityDescriptors: types.optional(types.map(types.late((): any => EntityDescriptorModel)), {})
  })
  .actions(self => ({
    querySearch(variables: { opts?: SearchOptions, end?: number, start?: number }, resultSelector: string | ((qb: LayerMetadataMixedModelSelector) => LayerMetadataMixedModelSelector) = layerMetadataMixedModelPrimitives.toString(), options: QueryOptions = {}) {
      return self.query<{ search: LayerMetadataMixedUnion[]}>(`query search($opts: SearchOptions, $end: Float, $start: Float) { search(opts: $opts, end: $end, start: $start) {
        ${typeof resultSelector === "function" ? resultSelector(new LayerMetadataMixedModelSelector()).toString() : resultSelector}
      } }`, variables, options)
    },
    querySearchById(variables: { idList: StringArray }, resultSelector: string | ((qb: LayerMetadataMixedModelSelector) => LayerMetadataMixedModelSelector) = layerMetadataMixedModelPrimitives.toString(), options: QueryOptions = {}) {
      return self.query<{ searchById: LayerMetadataMixedUnion[]}>(`query searchById($idList: StringArray!) { searchById(idList: $idList) {
        ${typeof resultSelector === "function" ? resultSelector(new LayerMetadataMixedModelSelector()).toString() : resultSelector}
      } }`, variables, options)
    },
    queryGetDomain(variables: { recordType: string, domain: string }, resultSelector: string | ((qb: StringArrayObjectTypeModelSelector) => StringArrayObjectTypeModelSelector) = stringArrayObjectTypeModelPrimitives.toString(), options: QueryOptions = {}) {
      return self.query<{ getDomain: StringArrayObjectTypeModelType}>(`query getDomain($recordType: String!, $domain: String!) { getDomain(recordType: $recordType, domain: $domain) {
        ${typeof resultSelector === "function" ? resultSelector(new StringArrayObjectTypeModelSelector()).toString() : resultSelector}
      } }`, variables, options)
    },
    queryEntityDescriptors(variables?: {  }, resultSelector: string | ((qb: EntityDescriptorModelSelector) => EntityDescriptorModelSelector) = entityDescriptorModelPrimitives.toString(), options: QueryOptions = {}) {
      return self.query<{ entityDescriptors: EntityDescriptorModelType[]}>(`query entityDescriptors { entityDescriptors {
        ${typeof resultSelector === "function" ? resultSelector(new EntityDescriptorModelSelector()).toString() : resultSelector}
      } }`, variables, options)
    },
    queryJobs(variables: { params?: JobsSearchParams }, resultSelector: string | ((qb: JobModelSelector) => JobModelSelector) = jobModelPrimitives.toString(), options: QueryOptions = {}) {
      return self.query<{ jobs: JobModelType[]}>(`query jobs($params: JobsSearchParams) { jobs(params: $params) {
        ${typeof resultSelector === "function" ? resultSelector(new JobModelSelector()).toString() : resultSelector}
      } }`, variables, options)
    },
    mutateUpdateMetadata(variables: { data: RecordUpdatePartial }, optimisticUpdate?: () => void) {
      return self.mutate<{ updateMetadata: string }>(`mutation updateMetadata($data: RecordUpdatePartial!) { updateMetadata(data: $data) }`, variables, optimisticUpdate)
    },
    mutateStartRasterIngestion(variables: { data: IngestionRasterData }, optimisticUpdate?: () => void) {
      return self.mutate<{ startRasterIngestion: string }>(`mutation startRasterIngestion($data: IngestionRasterData!) { startRasterIngestion(data: $data) }`, variables, optimisticUpdate)
    },
    mutateStart3DIngestion(variables: { data: Ingestion3DData }, optimisticUpdate?: () => void) {
      return self.mutate<{ start3DIngestion: string }>(`mutation start3DIngestion($data: Ingestion3DData!) { start3DIngestion(data: $data) }`, variables, optimisticUpdate)
    },
    mutateUpdateJob(variables: { data: JobUpdateData, id: string }, optimisticUpdate?: () => void) {
      return self.mutate<{ updateJob: string }>(`mutation updateJob($data: JobUpdateData!, $id: String!) { updateJob(data: $data, id: $id) }`, variables, optimisticUpdate)
    },
  })))
