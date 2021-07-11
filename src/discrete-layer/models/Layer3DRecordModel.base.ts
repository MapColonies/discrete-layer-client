/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from "mobx-state-tree"
import { QueryBuilder } from "mst-gql"
import { ModelBase } from "./ModelBase"
import { LinkModel, LinkModelType } from "./LinkModel"
import { LinkModelSelector, linkModelPrimitives } from "./LinkModel.base"
import { RecordTypeEnumType } from "./RecordTypeEnum"
import { SensorTypeEnumType } from "./SensorTypeEnum"
import { RootStoreType } from "./index"


/**
 * Layer3DRecordBase
 * auto generated base class for the model Layer3DRecordModel.
 */
export const Layer3DRecordModelBase = ModelBase
  .named('Layer3DRecord')
  .props({
    __typename: types.optional(types.literal("Layer3DRecord"), "Layer3DRecord"),
    type: types.union(types.undefined, types.null, RecordTypeEnumType),
    classification: types.union(types.undefined, types.null, types.string),
    productName: types.union(types.undefined, types.string),
    description: types.union(types.undefined, types.null, types.string),
    srsId: types.union(types.undefined, types.null, types.string),
    producerName: types.union(types.undefined, types.null, types.string),
    creationDate: types.union(types.undefined, types.null, types.frozen()),
    ingestionDate: types.union(types.undefined, types.null, types.frozen()),
    updateDate: types.union(types.undefined, types.null, types.frozen()),
    sourceDateStart: types.union(types.undefined, types.null, types.frozen()),
    sourceDateEnd: types.union(types.undefined, types.null, types.frozen()),
    accuracyCE90: types.union(types.undefined, types.null, types.number),
    sensorType: types.union(types.undefined, types.null, types.array(SensorTypeEnumType)),
    region: types.union(types.undefined, types.null, types.string),
    projectName: types.union(types.undefined, types.null, types.string),
    validationDate: types.union(types.undefined, types.null, types.frozen()),
    version: types.union(types.undefined, types.null, types.string),
    centroid: types.union(types.undefined, types.null, types.string),
    footprint: types.union(types.undefined, types.null, types.frozen()),
    relativeAccuracyCE90: types.union(types.undefined, types.null, types.number),
    estimatedPrecision: types.union(types.undefined, types.null, types.number),
    measuredPrecision: types.union(types.undefined, types.null, types.number),
    nominalResolution: types.union(types.undefined, types.null, types.number),
    accuracyLE90: types.union(types.undefined, types.null, types.number),
    //id: types.union(types.undefined, types.string),
    id: types.identifier, //Alex change till proper deffs
    insertDate: types.union(types.undefined, types.null, types.frozen()),
    wktGeometry: types.union(types.undefined, types.null, types.string),
    keywords: types.union(types.undefined, types.null, types.string),
    links: types.union(types.undefined, types.null, types.array(types.late((): any => LinkModel))),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class Layer3DRecordModelSelector extends QueryBuilder {
  get type() { return this.__attr(`type`) }
  get classification() { return this.__attr(`classification`) }
  get productName() { return this.__attr(`productName`) }
  get description() { return this.__attr(`description`) }
  get srsId() { return this.__attr(`srsId`) }
  get producerName() { return this.__attr(`producerName`) }
  get creationDate() { return this.__attr(`creationDate`) }
  get ingestionDate() { return this.__attr(`ingestionDate`) }
  get updateDate() { return this.__attr(`updateDate`) }
  get sourceDateStart() { return this.__attr(`sourceDateStart`) }
  get sourceDateEnd() { return this.__attr(`sourceDateEnd`) }
  get accuracyCE90() { return this.__attr(`accuracyCE90`) }
  get sensorType() { return this.__attr(`sensorType`) }
  get region() { return this.__attr(`region`) }
  get projectName() { return this.__attr(`projectName`) }
  get validationDate() { return this.__attr(`validationDate`) }
  get version() { return this.__attr(`version`) }
  get centroid() { return this.__attr(`centroid`) }
  get footprint() { return this.__attr(`footprint`) }
  get relativeAccuracyCE90() { return this.__attr(`relativeAccuracyCE90`) }
  get estimatedPrecision() { return this.__attr(`estimatedPrecision`) }
  get measuredPrecision() { return this.__attr(`measuredPrecision`) }
  get nominalResolution() { return this.__attr(`nominalResolution`) }
  get accuracyLE90() { return this.__attr(`accuracyLE90`) }
  get id() { return this.__attr(`id`) }
  get insertDate() { return this.__attr(`insertDate`) }
  get wktGeometry() { return this.__attr(`wktGeometry`) }
  get keywords() { return this.__attr(`keywords`) }
  links(builder?: string | LinkModelSelector | ((selector: LinkModelSelector) => LinkModelSelector)) { return this.__child(`links`, LinkModelSelector, builder) }
}
export function selectFromLayer3DRecord() {
  return new Layer3DRecordModelSelector()
}

export const layer3DRecordModelPrimitives = selectFromLayer3DRecord().type.classification.productName.description.srsId.producerName.creationDate.ingestionDate.updateDate.sourceDateStart.sourceDateEnd.accuracyCE90.sensorType.region.projectName.validationDate.version.centroid.footprint.relativeAccuracyCE90.estimatedPrecision.measuredPrecision.nominalResolution.accuracyLE90.insertDate.wktGeometry.keywords.id.links(linkModelPrimitives)
