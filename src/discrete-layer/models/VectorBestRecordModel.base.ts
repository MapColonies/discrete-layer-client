/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from "mobx-state-tree"
import { QueryBuilder } from "mst-gql"
import { ModelBase } from "./ModelBase"
import { LinkModel } from "./LinkModel"
import { linkModelPrimitives, LinkModelSelector } from "./LinkModel.base"
import { ProductTypeEnumType } from "./ProductTypeEnum"
import { RecordTypeEnumType } from "./RecordTypeEnum"
import { RootStoreType } from "./index"


/**
 * VectorBestRecordBase
 * auto generated base class for the model VectorBestRecordModel.
 */
export const VectorBestRecordModelBase = ModelBase
  .named('VectorBestRecord')
  .props({
    __typename: types.optional(types.literal("VectorBestRecord"), "VectorBestRecord"),
    type: types.union(types.undefined, types.null, RecordTypeEnumType),
    classification: types.union(types.undefined, types.string),
    productName: types.union(types.undefined, types.string),
    description: types.union(types.undefined, types.null, types.string),
    srsId: types.union(types.undefined, types.string),
    producerName: types.union(types.undefined, types.null, types.string),
    creationDate: types.union(types.undefined, types.null, types.frozen()),
    ingestionDate: types.union(types.undefined, types.null, types.frozen()),
    updateDate: types.union(types.undefined, types.null, types.frozen()),
    region: types.union(types.undefined, types.null, types.array(types.string)),
    productVersion: types.union(types.undefined, types.null, types.string),
    productType: types.union(types.undefined, ProductTypeEnumType),
    srsName: types.union(types.undefined, types.string),
    scale: types.union(types.undefined, types.null, types.number),
    footprint: types.union(types.undefined, types.frozen()),
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

export class VectorBestRecordModelSelector extends QueryBuilder {
  get type() { return this.__attr(`type`) }
  get classification() { return this.__attr(`classification`) }
  get productName() { return this.__attr(`productName`) }
  get description() { return this.__attr(`description`) }
  get srsId() { return this.__attr(`srsId`) }
  get producerName() { return this.__attr(`producerName`) }
  get creationDate() { return this.__attr(`creationDate`) }
  get ingestionDate() { return this.__attr(`ingestionDate`) }
  get updateDate() { return this.__attr(`updateDate`) }
  get region() { return this.__attr(`region`) }
  get productVersion() { return this.__attr(`productVersion`) }
  get productType() { return this.__attr(`productType`) }
  get srsName() { return this.__attr(`srsName`) }
  get scale() { return this.__attr(`scale`) }
  get footprint() { return this.__attr(`footprint`) }
  get id() { return this.__attr(`id`) }
  get insertDate() { return this.__attr(`insertDate`) }
  get keywords() { return this.__attr(`keywords`) }
  links(builder?: string | LinkModelSelector | ((selector: LinkModelSelector) => LinkModelSelector)) { return this.__child(`links`, LinkModelSelector, builder) }
}
export function selectFromVectorBestRecord() {
  return new VectorBestRecordModelSelector()
}

export const vectorBestRecordModelPrimitives = selectFromVectorBestRecord().type.classification.productName.description.srsId.producerName.creationDate.ingestionDate.updateDate.region.productVersion.productType.srsName.scale.footprint.insertDate.keywords.id.links(linkModelPrimitives)
