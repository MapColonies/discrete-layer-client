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
    sensorType: types.union(types.undefined, types.null, types.array(SensorTypeEnumType)),
    region: types.union(types.undefined, types.null, types.string),
    projectName: types.union(types.undefined, types.null, types.string),
    footprint: types.union(types.undefined, types.null, types.frozen()),
    nominalResolution: types.union(types.undefined, types.null, types.number),
    accuracyLE90: types.union(types.undefined, types.null, types.number),
    accuracySE90: types.union(types.undefined, types.null, types.number),
    visualAccuracy: types.union(types.undefined, types.null, types.number),
    heightRange: types.union(types.undefined, types.null, types.number),
    srsOrigin: types.union(types.undefined, types.null, types.string),
    flightAlt: types.union(types.undefined, types.null, types.number),
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

export class Layer3DRecordModelSelector extends QueryBuilder {
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
  get projectName() { return this.__attr(`projectName`) }
  get footprint() { return this.__attr(`footprint`) }
  get nominalResolution() { return this.__attr(`nominalResolution`) }
  get accuracyLE90() { return this.__attr(`accuracyLE90`) }
  get accuracySE90() { return this.__attr(`accuracySE90`) }
  get visualAccuracy() { return this.__attr(`visualAccuracy`) }
  get heightRange() { return this.__attr(`heightRange`) }
  get srsOrigin() { return this.__attr(`srsOrigin`) }
  get flightAlt() { return this.__attr(`flightAlt`) }
  get id() { return this.__attr(`id`) }
  get insertDate() { return this.__attr(`insertDate`) }
  get keywords() { return this.__attr(`keywords`) }
  links(builder?: string | LinkModelSelector | ((selector: LinkModelSelector) => LinkModelSelector)) { return this.__child(`links`, LinkModelSelector, builder) }
}
export function selectFromLayer3DRecord() {
  return new Layer3DRecordModelSelector()
}

export const layer3DRecordModelPrimitives = selectFromLayer3DRecord().type.classification.productId.productName.productVersion.productType.description.srsId.srsName.producerName.creationDate.ingestionDate.updateDate.sourceDateStart.sourceDateEnd.resolution.accuracyCE90.sensorType.region.projectName.footprint.nominalResolution.accuracyLE90.accuracySE90.visualAccuracy.heightRange.srsOrigin.flightAlt.insertDate.keywords.id.links(linkModelPrimitives)
