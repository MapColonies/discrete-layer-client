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
 * LayerRasterRecordBase
 * auto generated base class for the model LayerRasterRecordModel.
 */
export const LayerRasterRecordModelBase = ModelBase
  .named('LayerRasterRecord')
  .props({
    __typename: types.optional(types.literal("LayerRasterRecord"), "LayerRasterRecord"),
    type: types.union(types.undefined, types.null, RecordTypeEnumType),
    classification: types.union(types.undefined, types.null, types.string),
    productId: types.union(types.undefined, types.string),
    productName: types.union(types.undefined, types.string),
    productVersion: types.union(types.undefined, types.null, types.string),
    productType: types.union(types.undefined, types.string),
    description: types.union(types.undefined, types.null, types.string),
    srsId: types.union(types.undefined, types.null, types.string),
    srsName: types.union(types.undefined, types.null, types.string),
    producerName: types.union(types.undefined, types.null, types.string),
    creationDate: types.union(types.undefined, types.null, types.frozen()),
    ingestionDate: types.union(types.undefined, types.null, types.frozen()),
    updateDate: types.union(types.undefined, types.null, types.frozen()),
    sourceDateStart: types.union(types.undefined, types.null, types.frozen()),
    sourceDateEnd: types.union(types.undefined, types.null, types.frozen()),
    resolution: types.union(types.undefined, types.null, types.number),
    accuracyCE90: types.union(types.undefined, types.null, types.number),
    sensorType: types.union(types.undefined, types.null, SensorTypeEnumType),
    region: types.union(types.undefined, types.null, types.string),
    rms: types.union(types.undefined, types.null, types.number),
    scale: types.union(types.undefined, types.null, types.string),
    footprint: types.union(types.undefined, types.null, types.frozen()),
    //id: types.union(types.undefined, types.string),
    id: types.identifier, //Alex change till proper deffs
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
  get type() { return this.__attr(`type`) }
  get classification() { return this.__attr(`classification`) }
  get productId() { return this.__attr(`productId`) }
  get productName() { return this.__attr(`productName`) }
  get productVersion() { return this.__attr(`productVersion`) }
  get productType() { return this.__attr(`productType`) }
  get description() { return this.__attr(`description`) }
  get srsId() { return this.__attr(`srsId`) }
  get srsName() { return this.__attr(`srsName`) }
  get producerName() { return this.__attr(`producerName`) }
  get creationDate() { return this.__attr(`creationDate`) }
  get ingestionDate() { return this.__attr(`ingestionDate`) }
  get updateDate() { return this.__attr(`updateDate`) }
  get sourceDateStart() { return this.__attr(`sourceDateStart`) }
  get sourceDateEnd() { return this.__attr(`sourceDateEnd`) }
  get resolution() { return this.__attr(`resolution`) }
  get accuracyCE90() { return this.__attr(`accuracyCE90`) }
  get sensorType() { return this.__attr(`sensorType`) }
  get region() { return this.__attr(`region`) }
  get rms() { return this.__attr(`rms`) }
  get scale() { return this.__attr(`scale`) }
  get footprint() { return this.__attr(`footprint`) }
  get id() { return this.__attr(`id`) }
  get insertDate() { return this.__attr(`insertDate`) }
  get keywords() { return this.__attr(`keywords`) }
  links(builder?: string | LinkModelSelector | ((selector: LinkModelSelector) => LinkModelSelector)) { return this.__child(`links`, LinkModelSelector, builder) }
}
export function selectFromLayerRasterRecord() {
  return new LayerRasterRecordModelSelector()
}

export const layerRasterRecordModelPrimitives = selectFromLayerRasterRecord().type.classification.productId.productName.productVersion.productType.description.srsId.srsName.producerName.creationDate.ingestionDate.updateDate.sourceDateStart.sourceDateEnd.resolution.accuracyCE90.sensorType.region.rms.scale.footprint.insertDate.keywords.id.links(linkModelPrimitives)
