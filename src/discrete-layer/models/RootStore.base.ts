/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
import { ObservableMap } from "mobx"
import { types } from "mobx-state-tree"
import { MSTGQLStore, configureStoreMixin, QueryOptions, withTypedRefs } from "mst-gql"

import { CapabilityModel, CapabilityModelType } from "./CapabilityModel"
import { capabilityModelPrimitives, CapabilityModelSelector } from "./CapabilityModel.base"
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
import { LayerDemRecordModel, LayerDemRecordModelType } from "./LayerDemRecordModel"
import { layerDemRecordModelPrimitives, LayerDemRecordModelSelector } from "./LayerDemRecordModel.base"
import { VectorBestRecordModel, VectorBestRecordModelType } from "./VectorBestRecordModel"
import { vectorBestRecordModelPrimitives, VectorBestRecordModelSelector } from "./VectorBestRecordModel.base"
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
import { UpdateRulesModel, UpdateRulesModelType } from "./UpdateRulesModel"
import { updateRulesModelPrimitives, UpdateRulesModelSelector } from "./UpdateRulesModel.base"
import { UpdateRulesValueModel, UpdateRulesValueModelType } from "./UpdateRulesValueModel"
import { updateRulesValueModelPrimitives, UpdateRulesValueModelSelector } from "./UpdateRulesValueModel.base"
import { UpdateRulesOperationModel, UpdateRulesOperationModelType } from "./UpdateRulesOperationModel"
import { updateRulesOperationModelPrimitives, UpdateRulesOperationModelSelector } from "./UpdateRulesOperationModel.base"
import { ExternalServiceModel, ExternalServiceModelType } from "./ExternalServiceModel"
import { externalServiceModelPrimitives, ExternalServiceModelSelector } from "./ExternalServiceModel.base"
import { JobModel, JobModelType } from "./JobModel"
import { jobModelPrimitives, JobModelSelector } from "./JobModel.base"
import { DeploymentWithServicesModel, DeploymentWithServicesModelType } from "./DeploymentWithServicesModel"
import { deploymentWithServicesModelPrimitives, DeploymentWithServicesModelSelector } from "./DeploymentWithServicesModel.base"
import { K8SServiceModel, K8SServiceModelType } from "./K8SServiceModel"
import { k8SServiceModelPrimitives, K8SServiceModelSelector } from "./K8SServiceModel.base"
import { FileModel, FileModelType } from "./FileModel"
import { fileModelPrimitives, FileModelSelector } from "./FileModel.base"
import { DecryptedIdModel, DecryptedIdModelType } from "./DecryptedIdModel"
import { decryptedIdModelPrimitives, DecryptedIdModelSelector } from "./DecryptedIdModel.base"
import { TasksGroupModel, TasksGroupModelType } from "./TasksGroupModel"
import { tasksGroupModelPrimitives, TasksGroupModelSelector } from "./TasksGroupModel.base"

import { layerMetadataMixedModelPrimitives, LayerMetadataMixedModelSelector , LayerMetadataMixedUnion } from "./"

import { RecordType } from "./RecordTypeEnum"
import { ProductType } from "./ProductTypeEnum"
import { VerticalDatum } from "./VerticalDatumEnum"
import { Units } from "./UnitsEnum"
import { UndulationModel } from "./UndulationModelEnum"
import { DataType } from "./DataTypeEnum"
import { NoDataValue } from "./NoDataValueEnum"
import { FieldCategory } from "./FieldCategoryEnum"
import { AutocomplitionType } from "./AutocomplitionTypeEnum"
import { ValidationValueType } from "./ValidationValueTypeEnum"
import { DateGranularityType } from "./DateGranularityTypeEnum"
import { OperationType } from "./OperationTypeEnum"
import { FractionType } from "./FractionTypeEnum"
import { ServiceType } from "./ServiceTypeEnum"
import { Status } from "./StatusEnum"

export type CapabilitiesLayersSearchParams = {
  data: CapabilitiesLayersSearchParam[]
}
export type CapabilitiesLayersSearchParam = {
  recordType: RecordType
  idList: string[]
}
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
  fromDate?: any
  tillDate?: any
}
export type ExplorerGetByPathSuffix = {
  pathSuffix: string
  type: RecordType
}
export type ExplorerGetById = {
  id: string
  type: RecordType
}
export type TasksSearchParams = {
  jobId: string
}
export type RecordUpdatePartial = {
  productName?: string
  description?: string
  productSubType?: string
  producerName?: string
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
  classification: string
  productName: string
  description?: string
  srsId: string
  producerName?: string
  creationDate?: any
  ingestionDate?: any
  updateDate?: any
  sourceDateStart: any
  sourceDateEnd: any
  minHorizontalAccuracyCE90?: number
  sensors?: string[]
  region?: string[]
  productId: string
  productVersion?: string
  productType: ProductType
  productSubType?: string
  srsName: string
  maxResolutionDeg?: number
  maxResolutionMeter?: number
  rms?: number
  scale?: number
  footprint: any
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
  productId?: string
  productName: string
  productVersion?: string
  productType: ProductType
  description?: string
  creationDate?: any
  updateDate?: any
  sourceDateStart: any
  sourceDateEnd: any
  minResolutionMeter?: number
  maxResolutionMeter?: number
  nominalResolution?: number
  maxAccuracyCE90?: number
  absoluteAccuracyLEP90: number
  accuracySE90?: number
  relativeAccuracyLEP90?: number
  visualAccuracy?: number
  sensors?: string[]
  footprint: any
  heightRangeFrom?: number
  heightRangeTo?: number
  srsId: string
  srsName: string
  srsOrigin?: string
  region?: string[]
  classification: string
  productionSystem?: string
  productionSystemVer?: string
  producerName?: string
  productionMethod?: string
  minFlightAlt?: number
  maxFlightAlt?: number
  geographicArea?: string
  productBoundingBox?: string
  id: string
  insertDate?: any
  wktGeometry?: string
  keywords?: string
  links?: LinkInput[]
}
export type IngestionDemData = {
  directory: string
  fileNames: string[]
  metadata: LayerDemRecordInput
  type: RecordType
}
export type LayerDemRecordInput = {
  type?: RecordType
  classification: string
  productName: string
  description?: string
  srsId: string
  srsName: string
  producerName?: string
  updateDate?: any
  sourceDateStart: any
  sourceDateEnd: any
  sensors?: string[]
  region?: string[]
  productId: string
  productType: ProductType
  footprint: any
  absoluteAccuracyLEP90: number
  relativeAccuracyLEP90?: number
  resolutionDegree?: number
  resolutionMeter: number
  layerPolygonParts?: any
  productBoundingBox?: string
  heightRangeFrom?: number
  heightRangeTo?: number
  verticalDatum: VerticalDatum
  units?: Units
  geographicArea?: string
  undulationModel: UndulationModel
  dataType: DataType
  noDataValue: NoDataValue
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
  layerDemRecords: ObservableMap<string, LayerDemRecordModelType>,
  bestRecords: ObservableMap<string, BestRecordModelType>,
  entityDescriptors: ObservableMap<string, EntityDescriptorModelType>,
  vectorBestRecords: ObservableMap<string, VectorBestRecordModelType>
}


/**
* Enums for the names of base graphql actions
*/
export enum RootStoreBaseQueries {
queryCapabilities="queryCapabilities",
querySearch="querySearch",
querySearchById="querySearchById",
queryGetDomain="queryGetDomain",
queryEntityDescriptors="queryEntityDescriptors",
queryGetExternalServices="queryGetExternalServices",
queryJobs="queryJobs",
queryGetClusterServices="queryGetClusterServices",
queryGetDirectory="queryGetDirectory",
queryGetDirectoryById="queryGetDirectoryById",
queryGetFile="queryGetFile",
queryGetFileById="queryGetFileById",
queryGetDecryptedId="queryGetDecryptedId",
queryTasks="queryTasks"
}
export enum RootStoreBaseMutations {
mutateUpdateMetadata="mutateUpdateMetadata",
mutateStartRasterIngestion="mutateStartRasterIngestion",
mutateStart3DIngestion="mutateStart3DIngestion",
mutateStartDemIngestion="mutateStartDemIngestion",
mutateUpdateJob="mutateUpdateJob",
mutateJobRetry="mutateJobRetry"
}

/**
* Store, managing, among others, all the objects received through graphQL
*/
export const RootStoreBase = withTypedRefs<Refs>()(MSTGQLStore
  .named("RootStore")
  .extend(configureStoreMixin([['Capability', () => CapabilityModel], ['Layer3DRecord', () => Layer3DRecordModel], ['Link', () => LinkModel], ['LayerRasterRecord', () => LayerRasterRecordModel], ['BestRecord', () => BestRecordModel], ['DiscreteOrder', () => DiscreteOrderModel], ['LayerDemRecord', () => LayerDemRecordModel], ['VectorBestRecord', () => VectorBestRecordModel], ['StringArrayObjectType', () => StringArrayObjectTypeModel], ['EntityDescriptor', () => EntityDescriptorModel], ['CategoryConfig', () => CategoryConfigModel], ['FieldConfig', () => FieldConfigModel], ['Autocompletion', () => AutocompletionModel], ['ValidationConfig', () => ValidationConfigModel], ['EnumAspects', () => EnumAspectsModel], ['UpdateRules', () => UpdateRulesModel], ['UpdateRulesValue', () => UpdateRulesValueModel], ['UpdateRulesOperation', () => UpdateRulesOperationModel], ['ExternalService', () => ExternalServiceModel], ['Job', () => JobModel], ['DeploymentWithServices', () => DeploymentWithServicesModel], ['K8sService', () => K8SServiceModel], ['File', () => FileModel], ['DecryptedId', () => DecryptedIdModel], ['TasksGroup', () => TasksGroupModel]], ['LayerRasterRecord', 'Layer3DRecord', 'LayerDemRecord', 'BestRecord', 'EntityDescriptor', 'VectorBestRecord'], "js"))
  .props({
    layerRasterRecords: types.optional(types.map(types.late((): any => LayerRasterRecordModel)), {}),
    layer3DRecords: types.optional(types.map(types.late((): any => Layer3DRecordModel)), {}),
    layerDemRecords: types.optional(types.map(types.late((): any => LayerDemRecordModel)), {}),
    bestRecords: types.optional(types.map(types.late((): any => BestRecordModel)), {}),
    entityDescriptors: types.optional(types.map(types.late((): any => EntityDescriptorModel)), {}),
    vectorBestRecords: types.optional(types.map(types.late((): any => VectorBestRecordModel)), {})
  })
  .actions(self => ({
    queryCapabilities(variables: { params: CapabilitiesLayersSearchParams }, resultSelector: string | ((qb: CapabilityModelSelector) => CapabilityModelSelector) = capabilityModelPrimitives.toString(), options: QueryOptions = {}) {
      return self.query<{ capabilities: CapabilityModelType[]}>(`query capabilities($params: CapabilitiesLayersSearchParams!) { capabilities(params: $params) {
        ${typeof resultSelector === "function" ? resultSelector(new CapabilityModelSelector()).toString() : resultSelector}
      } }`, variables, options)
    },
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
    queryGetExternalServices(variables?: {  }, resultSelector: string | ((qb: ExternalServiceModelSelector) => ExternalServiceModelSelector) = externalServiceModelPrimitives.toString(), options: QueryOptions = {}) {
      return self.query<{ getExternalServices: ExternalServiceModelType[]}>(`query getExternalServices { getExternalServices {
        ${typeof resultSelector === "function" ? resultSelector(new ExternalServiceModelSelector()).toString() : resultSelector}
      } }`, variables, options)
    },
    queryJobs(variables: { params?: JobsSearchParams }, resultSelector: string | ((qb: JobModelSelector) => JobModelSelector) = jobModelPrimitives.toString(), options: QueryOptions = {}) {
      return self.query<{ jobs: JobModelType[]}>(`query jobs($params: JobsSearchParams) { jobs(params: $params) {
        ${typeof resultSelector === "function" ? resultSelector(new JobModelSelector()).toString() : resultSelector}
      } }`, variables, options)
    },
    queryGetClusterServices(variables?: {  }, resultSelector: string | ((qb: DeploymentWithServicesModelSelector) => DeploymentWithServicesModelSelector) = deploymentWithServicesModelPrimitives.toString(), options: QueryOptions = {}) {
      return self.query<{ getClusterServices: DeploymentWithServicesModelType[]}>(`query getClusterServices { getClusterServices {
        ${typeof resultSelector === "function" ? resultSelector(new DeploymentWithServicesModelSelector()).toString() : resultSelector}
      } }`, variables, options)
    },
    queryGetDirectory(variables: { data: ExplorerGetByPathSuffix }, resultSelector: string | ((qb: FileModelSelector) => FileModelSelector) = fileModelPrimitives.toString(), options: QueryOptions = {}) {
      return self.query<{ getDirectory: FileModelType[]}>(`query getDirectory($data: ExplorerGetByPathSuffix!) { getDirectory(data: $data) {
        ${typeof resultSelector === "function" ? resultSelector(new FileModelSelector()).toString() : resultSelector}
      } }`, variables, options)
    },
    queryGetDirectoryById(variables: { data: ExplorerGetById }, resultSelector: string | ((qb: FileModelSelector) => FileModelSelector) = fileModelPrimitives.toString(), options: QueryOptions = {}) {
      return self.query<{ getDirectoryById: FileModelType[]}>(`query getDirectoryById($data: ExplorerGetById!) { getDirectoryById(data: $data) {
        ${typeof resultSelector === "function" ? resultSelector(new FileModelSelector()).toString() : resultSelector}
      } }`, variables, options)
    },
    queryGetFile(variables: { data: ExplorerGetByPathSuffix }, resultSelector: string | ((qb: LayerMetadataMixedModelSelector) => LayerMetadataMixedModelSelector) = layerMetadataMixedModelPrimitives.toString(), options: QueryOptions = {}) {
      return self.query<{ getFile: LayerMetadataMixedUnion}>(`query getFile($data: ExplorerGetByPathSuffix!) { getFile(data: $data) {
        ${typeof resultSelector === "function" ? resultSelector(new LayerMetadataMixedModelSelector()).toString() : resultSelector}
      } }`, variables, options)
    },
    queryGetFileById(variables: { data: ExplorerGetById }, resultSelector: string | ((qb: LayerMetadataMixedModelSelector) => LayerMetadataMixedModelSelector) = layerMetadataMixedModelPrimitives.toString(), options: QueryOptions = {}) {
      return self.query<{ getFileById: LayerMetadataMixedUnion}>(`query getFileById($data: ExplorerGetById!) { getFileById(data: $data) {
        ${typeof resultSelector === "function" ? resultSelector(new LayerMetadataMixedModelSelector()).toString() : resultSelector}
      } }`, variables, options)
    },
    queryGetDecryptedId(variables: { data: ExplorerGetById }, resultSelector: string | ((qb: DecryptedIdModelSelector) => DecryptedIdModelSelector) = decryptedIdModelPrimitives.toString(), options: QueryOptions = {}) {
      return self.query<{ getDecryptedId: DecryptedIdModelType}>(`query getDecryptedId($data: ExplorerGetById!) { getDecryptedId(data: $data) {
        ${typeof resultSelector === "function" ? resultSelector(new DecryptedIdModelSelector()).toString() : resultSelector}
      } }`, variables, options)
    },
    queryTasks(variables: { params?: TasksSearchParams }, resultSelector: string | ((qb: TasksGroupModelSelector) => TasksGroupModelSelector) = tasksGroupModelPrimitives.toString(), options: QueryOptions = {}) {
      return self.query<{ tasks: TasksGroupModelType[]}>(`query tasks($params: TasksSearchParams) { tasks(params: $params) {
        ${typeof resultSelector === "function" ? resultSelector(new TasksGroupModelSelector()).toString() : resultSelector}
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
    mutateStartDemIngestion(variables: { data: IngestionDemData }, optimisticUpdate?: () => void) {
      return self.mutate<{ startDemIngestion: string }>(`mutation startDemIngestion($data: IngestionDemData!) { startDemIngestion(data: $data) }`, variables, optimisticUpdate)
    },
    mutateUpdateJob(variables: { data: JobUpdateData, id: string }, optimisticUpdate?: () => void) {
      return self.mutate<{ updateJob: string }>(`mutation updateJob($data: JobUpdateData!, $id: String!) { updateJob(data: $data, id: $id) }`, variables, optimisticUpdate)
    },
    mutateJobRetry(variables: { id: string }, optimisticUpdate?: () => void) {
      return self.mutate<{ jobRetry: string }>(`mutation jobRetry($id: String!) { jobRetry(id: $id) }`, variables, optimisticUpdate)
    },
  })))
