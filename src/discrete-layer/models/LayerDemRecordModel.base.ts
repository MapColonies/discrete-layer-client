/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from "mobx-state-tree"
import { QueryBuilder } from "mst-gql"
import { ModelBase } from "./ModelBase"
import { LinkModel, LinkModelType } from "./LinkModel"
import { LinkModelSelector, linkModelPrimitives } from "./LinkModel.base"
import { ProductTypeEnumType } from "./ProductTypeEnum"
import { RecordTypeEnumType } from "./RecordTypeEnum"
import { SensorTypeEnumType } from "./SensorTypeEnum"
import { RootStoreType } from "./index"


/**
 * LayerDemRecordBase
 * auto generated base class for the model LayerDemRecordModel.
 */
export const LayerDemRecordModelBase = ModelBase
  .named('LayerDemRecord')
  .props({
    __typename: types.optional(types.literal("LayerDEMRecord"), "LayerDEMRecord"),
    type: types.union(types.undefined, types.null, RecordTypeEnumType),
    classification: types.union(types.undefined, types.string),
    productName: types.union(types.undefined, types.string),
    description: types.union(types.undefined, types.null, types.string),
    srsId: types.union(types.undefined, types.null, types.string),
    srsName: types.union(types.undefined, types.string),
    producerName: types.union(types.undefined, types.null, types.string),
    updateDate: types.union(types.undefined, types.null, types.frozen()),
    sourceDateStart: types.union(types.undefined, types.frozen()),
    sourceDateEnd: types.union(types.undefined, types.frozen()),
    sensorType: types.union(types.undefined, types.null, types.array(SensorTypeEnumType)),
    region: types.union(types.undefined, types.null, types.string),
    productId: types.union(types.undefined, types.string),
    productType: types.union(types.undefined, ProductTypeEnumType),
    footprint: types.union(types.undefined, types.frozen()),
    absoluteAccuracyLEP90: types.union(types.undefined, types.number),
    relativeAccuracyLEP90: types.union(types.undefined, types.number),
    resolutionDegree: types.union(types.undefined, types.null, types.number),
    resolutionMeter: types.union(types.undefined, types.number),
    layerPolygonParts: types.union(types.undefined, types.null, types.frozen()),
    productBoundingBox: types.union(types.undefined, types.null, types.string),
    heightRangeFrom: types.union(types.undefined, types.number),
    heightRangeTo: types.union(types.undefined, types.number),
    geographicArea: types.union(types.undefined, types.null, types.string),
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

export class LayerDemRecordModelSelector extends QueryBuilder {
  get type() { return this.__attr(`type`) }
  get classification() { return this.__attr(`classification`) }
  get productName() { return this.__attr(`productName`) }
  get description() { return this.__attr(`description`) }
  get srsId() { return this.__attr(`srsId`) }
  get srsName() { return this.__attr(`srsName`) }
  get producerName() { return this.__attr(`producerName`) }
  get updateDate() { return this.__attr(`updateDate`) }
  get sourceDateStart() { return this.__attr(`sourceDateStart`) }
  get sourceDateEnd() { return this.__attr(`sourceDateEnd`) }
  get sensorType() { return this.__attr(`sensorType`) }
  get region() { return this.__attr(`region`) }
  get productId() { return this.__attr(`productId`) }
  get productType() { return this.__attr(`productType`) }
  get footprint() { return this.__attr(`footprint`) }
  get absoluteAccuracyLEP90() { return this.__attr(`absoluteAccuracyLEP90`) }
  get relativeAccuracyLEP90() { return this.__attr(`relativeAccuracyLEP90`) }
  get resolutionDegree() { return this.__attr(`resolutionDegree`) }
  get resolutionMeter() { return this.__attr(`resolutionMeter`) }
  get layerPolygonParts() { return this.__attr(`layerPolygonParts`) }
  get productBoundingBox() { return this.__attr(`productBoundingBox`) }
  get heightRangeFrom() { return this.__attr(`heightRangeFrom`) }
  get heightRangeTo() { return this.__attr(`heightRangeTo`) }
  get geographicArea() { return this.__attr(`geographicArea`) }
  get id() { return this.__attr(`id`) }
  get insertDate() { return this.__attr(`insertDate`) }
  get wktGeometry() { return this.__attr(`wktGeometry`) }
  get keywords() { return this.__attr(`keywords`) }
  links(builder?: string | LinkModelSelector | ((selector: LinkModelSelector) => LinkModelSelector)) { return this.__child(`links`, LinkModelSelector, builder) }
}
export function selectFromLayerDemRecord() {
  return new LayerDemRecordModelSelector()
}

export const layerDemRecordModelPrimitives = selectFromLayerDemRecord().type.classification.productName.description.srsId.srsName.producerName.updateDate.sourceDateStart.sourceDateEnd.sensorType.region.productId.productType.footprint.absoluteAccuracyLEP90.relativeAccuracyLEP90.resolutionDegree.resolutionMeter.layerPolygonParts.productBoundingBox.heightRangeFrom.heightRangeTo.geographicArea.insertDate.wktGeometry.keywords.id.links(linkModelPrimitives)
