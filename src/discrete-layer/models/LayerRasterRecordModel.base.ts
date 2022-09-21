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
import { RootStoreType } from "./index"


/**
 * LayerRasterRecordBase
 * auto generated base class for the model LayerRasterRecordModel.
 */
export const LayerRasterRecordModelBase = ModelBase
  .named('LayerRasterRecord')
  .props({
    __typename: types.optional(types.literal("LayerRasterRecord"), "LayerRasterRecord"),
    //id: types.union(types.undefined, types.string),
    id: types.identifier, //Alex change till proper deffs
    type: types.union(types.undefined, types.null, RecordTypeEnumType),
    classification: types.union(types.undefined, types.string),
    productName: types.union(types.undefined, types.string),
    description: types.union(types.undefined, types.null, types.string),
    srsId: types.union(types.undefined, types.string),
    producerName: types.union(types.undefined, types.string),
    creationDate: types.union(types.undefined, types.null, types.frozen()),
    ingestionDate: types.union(types.undefined, types.null, types.frozen()),
    updateDate: types.union(types.undefined, types.null, types.frozen()),
    sourceDateStart: types.union(types.undefined, types.frozen()),
    sourceDateEnd: types.union(types.undefined, types.frozen()),
    minHorizontalAccuracyCE90: types.union(types.undefined, types.null, types.number),
    sensors: types.union(types.undefined, types.array(types.string)),
    region: types.union(types.undefined, types.array(types.string)),
    productId: types.union(types.undefined, types.null, types.string),
    productVersion: types.union(types.undefined, types.null, types.string),
    productType: types.union(types.undefined, ProductTypeEnumType),
    productSubType: types.union(types.undefined, types.null, types.string),
    srsName: types.union(types.undefined, types.string),
    maxResolutionDeg: types.union(types.undefined, types.null, types.number),
    maxResolutionMeter: types.union(types.undefined, types.null, types.number),
    rms: types.union(types.undefined, types.null, types.number),
    scale: types.union(types.undefined, types.null, types.number),
    footprint: types.union(types.undefined, types.frozen()),
    layerPolygonParts: types.union(types.undefined, types.null, types.frozen()),
    includedInBests: types.union(types.undefined, types.null, types.array(types.string)),
    productBoundingBox: types.union(types.undefined, types.null, types.string),
    insertDate: types.union(types.undefined, types.null, types.frozen()),
    keywords: types.union(types.undefined, types.null, types.string),
    links: types.union(types.undefined, types.null, types.array(types.late((): any => LinkModel))),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class LayerRasterRecordModelSelector extends QueryBuilder {
  get id() { return this.__attr(`id`) }
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
  get minHorizontalAccuracyCE90() { return this.__attr(`minHorizontalAccuracyCE90`) }
  get sensors() { return this.__attr(`sensors`) }
  get region() { return this.__attr(`region`) }
  get productId() { return this.__attr(`productId`) }
  get productVersion() { return this.__attr(`productVersion`) }
  get productType() { return this.__attr(`productType`) }
  get productSubType() { return this.__attr(`productSubType`) }
  get srsName() { return this.__attr(`srsName`) }
  get maxResolutionDeg() { return this.__attr(`maxResolutionDeg`) }
  get maxResolutionMeter() { return this.__attr(`maxResolutionMeter`) }
  get rms() { return this.__attr(`rms`) }
  get scale() { return this.__attr(`scale`) }
  get footprint() { return this.__attr(`footprint`) }
  get layerPolygonParts() { return this.__attr(`layerPolygonParts`) }
  get includedInBests() { return this.__attr(`includedInBests`) }
  get productBoundingBox() { return this.__attr(`productBoundingBox`) }
  get insertDate() { return this.__attr(`insertDate`) }
  get keywords() { return this.__attr(`keywords`) }
  links(builder?: string | LinkModelSelector | ((selector: LinkModelSelector) => LinkModelSelector)) { return this.__child(`links`, LinkModelSelector, builder) }
}
export function selectFromLayerRasterRecord() {
  return new LayerRasterRecordModelSelector()
}

export const layerRasterRecordModelPrimitives = selectFromLayerRasterRecord().type.classification.productName.description.srsId.producerName.creationDate.ingestionDate.updateDate.sourceDateStart.sourceDateEnd.minHorizontalAccuracyCE90.sensors.region.productId.productVersion.productType.productSubType.srsName.maxResolutionDeg.maxResolutionMeter.rms.scale.footprint.layerPolygonParts.includedInBests.productBoundingBox.insertDate.keywords.id.links(linkModelPrimitives)
