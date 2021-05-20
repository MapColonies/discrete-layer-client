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
    id: types.identifier,
    source: types.union(types.undefined, types.null, types.string),
    sourceName: types.union(types.undefined, types.null, types.string),
    updateDate: types.union(types.undefined, types.null, types.frozen()),
    resolution: types.union(types.undefined, types.null, types.number),
    ep90: types.union(types.undefined, types.null, types.number),
    sensorType: types.union(types.undefined, types.null, SensorTypeEnumType),
    rms: types.union(types.undefined, types.null, types.number),
    scale: types.union(types.undefined, types.null, types.string),
    dsc: types.union(types.undefined, types.null, types.string),
    geometry: types.union(types.undefined, types.null, types.frozen()),
    version: types.union(types.undefined, types.null, types.string),
    typeName: types.union(types.undefined, types.null, types.string),
    schema: types.union(types.undefined, types.null, types.string),
    mdSource: types.union(types.undefined, types.null, types.string),
    xml: types.union(types.undefined, types.null, types.string),
    anyText: types.union(types.undefined, types.null, types.string),
    insertDate: types.union(types.undefined, types.null, types.frozen()),
    creationDate: types.union(types.undefined, types.null, types.frozen()),
    wktGeometry: types.union(types.undefined, types.null, types.string),
    links: types.union(types.undefined, types.null, types.array(types.late((): any => LinkModel))),
    anyTextTsvector: types.union(types.undefined, types.null, types.string),
    wkbGeometry: types.union(types.undefined, types.null, types.string),
    title: types.union(types.undefined, types.null, types.string),
    type: types.union(types.undefined, types.null, RecordTypeEnumType),
    srs: types.union(types.undefined, types.null, types.string),
    producerName: types.union(types.undefined, types.null, types.string),
    projectName: types.union(types.undefined, types.null, types.string),
    classification: types.union(types.undefined, types.null, types.string),
    keywords: types.union(types.undefined, types.null, types.string),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class LayerRasterRecordModelSelector extends QueryBuilder {
  get id() { return this.__attr(`id`) }
  get source() { return this.__attr(`source`) }
  get sourceName() { return this.__attr(`sourceName`) }
  get updateDate() { return this.__attr(`updateDate`) }
  get resolution() { return this.__attr(`resolution`) }
  get ep90() { return this.__attr(`ep90`) }
  get sensorType() { return this.__attr(`sensorType`) }
  get rms() { return this.__attr(`rms`) }
  get scale() { return this.__attr(`scale`) }
  get dsc() { return this.__attr(`dsc`) }
  get geometry() { return this.__attr(`geometry`) }
  get version() { return this.__attr(`version`) }
  get typeName() { return this.__attr(`typeName`) }
  get schema() { return this.__attr(`schema`) }
  get mdSource() { return this.__attr(`mdSource`) }
  get xml() { return this.__attr(`xml`) }
  get anyText() { return this.__attr(`anyText`) }
  get insertDate() { return this.__attr(`insertDate`) }
  get creationDate() { return this.__attr(`creationDate`) }
  get wktGeometry() { return this.__attr(`wktGeometry`) }
  get anyTextTsvector() { return this.__attr(`anyTextTsvector`) }
  get wkbGeometry() { return this.__attr(`wkbGeometry`) }
  get title() { return this.__attr(`title`) }
  get type() { return this.__attr(`type`) }
  get srs() { return this.__attr(`srs`) }
  get producerName() { return this.__attr(`producerName`) }
  get projectName() { return this.__attr(`projectName`) }
  get classification() { return this.__attr(`classification`) }
  get keywords() { return this.__attr(`keywords`) }
  links(builder?: string | LinkModelSelector | ((selector: LinkModelSelector) => LinkModelSelector)) { return this.__child(`links`, LinkModelSelector, builder) }
}
export function selectFromLayerRasterRecord() {
  return new LayerRasterRecordModelSelector()
}

export const layerRasterRecordModelPrimitives = selectFromLayerRasterRecord().source.sourceName.updateDate.resolution.ep90.sensorType.rms.scale.dsc.geometry.version.typeName.schema.mdSource.xml.anyText.insertDate.creationDate.wktGeometry.anyTextTsvector.wkbGeometry.title.type.srs.producerName.projectName.classification.keywords.id.links(linkModelPrimitives)
