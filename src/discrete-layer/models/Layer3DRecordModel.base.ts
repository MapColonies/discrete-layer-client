/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from "mobx-state-tree"
import { QueryBuilder } from "mst-gql"
import { ModelBase } from "./ModelBase"
import { LinkModel, LinkModelType } from "./LinkModel"
import { LinkModelSelector, linkModelPrimitives } from "./LinkModel.base"
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
    typeName: types.union(types.undefined, types.null, types.string),
    schema: types.union(types.undefined, types.null, types.string),
    mdSource: types.union(types.undefined, types.null, types.string),
    xml: types.union(types.undefined, types.null, types.string),
    anyText: types.union(types.undefined, types.null, types.string),
    insertDate: types.union(types.undefined, types.null, types.frozen()),
    wktGeometry: types.union(types.undefined, types.null, types.string),
    links: types.union(types.undefined, types.null, types.array(types.union(types.null, types.late((): any => LinkModel)))),
    anyTextTsvector: types.union(types.undefined, types.null, types.string),
    description: types.union(types.undefined, types.null, types.string),
    wkbGeometry: types.union(types.undefined, types.null, types.string),
    identifier: types.union(types.undefined, types.null, types.string),
    title: types.union(types.undefined, types.null, types.string),
    type: types.union(types.undefined, types.null, types.string),
    srs: types.union(types.undefined, types.null, types.string),
    producerName: types.union(types.undefined, types.null, types.string),
    projectName: types.union(types.undefined, types.null, types.string),
    creationDate: types.union(types.undefined, types.null, types.frozen()),
    classification: types.union(types.undefined, types.null, types.string),
    keywords: types.union(types.undefined, types.null, types.string),
    id: types.identifier,
    sourceName: types.union(types.undefined, types.string),
    source: types.union(types.undefined, types.null, types.string),
    updateDate: types.union(types.undefined, types.null, types.string),
    resolution: types.union(types.undefined, types.null, types.number),
    ep90: types.union(types.undefined, types.null, types.number),
    sensorType: types.union(types.undefined, types.null, SensorTypeEnumType),
    rms: types.union(types.undefined, types.null, types.number),
    scale: types.union(types.undefined, types.null, types.string),
    dsc: types.union(types.undefined, types.null, types.string),
    geometry: types.union(types.undefined, types.null, types.frozen()),
    version: types.union(types.undefined, types.null, types.string),
    accuracyLE90: types.union(types.undefined, types.null, types.string),
    selected: types.union(types.undefined, types.null, types.boolean),
    order: types.union(types.undefined, types.null, types.number),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class Layer3DRecordModelSelector extends QueryBuilder {
  get typeName() { return this.__attr(`typeName`) }
  get schema() { return this.__attr(`schema`) }
  get mdSource() { return this.__attr(`mdSource`) }
  get xml() { return this.__attr(`xml`) }
  get anyText() { return this.__attr(`anyText`) }
  get insertDate() { return this.__attr(`insertDate`) }
  get wktGeometry() { return this.__attr(`wktGeometry`) }
  get anyTextTsvector() { return this.__attr(`anyTextTsvector`) }
  get description() { return this.__attr(`description`) }
  get wkbGeometry() { return this.__attr(`wkbGeometry`) }
  get identifier() { return this.__attr(`identifier`) }
  get title() { return this.__attr(`title`) }
  get type() { return this.__attr(`type`) }
  get srs() { return this.__attr(`srs`) }
  get producerName() { return this.__attr(`producerName`) }
  get projectName() { return this.__attr(`projectName`) }
  get creationDate() { return this.__attr(`creationDate`) }
  get classification() { return this.__attr(`classification`) }
  get keywords() { return this.__attr(`keywords`) }
  get id() { return this.__attr(`id`) }
  get sourceName() { return this.__attr(`sourceName`) }
  get source() { return this.__attr(`source`) }
  get updateDate() { return this.__attr(`updateDate`) }
  get resolution() { return this.__attr(`resolution`) }
  get ep90() { return this.__attr(`ep90`) }
  get sensorType() { return this.__attr(`sensorType`) }
  get rms() { return this.__attr(`rms`) }
  get scale() { return this.__attr(`scale`) }
  get dsc() { return this.__attr(`dsc`) }
  get geometry() { return this.__attr(`geometry`) }
  get version() { return this.__attr(`version`) }
  get accuracyLE90() { return this.__attr(`accuracyLE90`) }
  get selected() { return this.__attr(`selected`) }
  get order() { return this.__attr(`order`) }
  links(builder?: string | LinkModelSelector | ((selector: LinkModelSelector) => LinkModelSelector)) { return this.__child(`links`, LinkModelSelector, builder) }
}
export function selectFromLayer3DRecord() {
  return new Layer3DRecordModelSelector()
}

export const layer3DRecordModelPrimitives = selectFromLayer3DRecord().typeName.schema.mdSource.xml.anyText.insertDate.wktGeometry.anyTextTsvector.description.wkbGeometry.identifier.title.type.srs.producerName.projectName.creationDate.classification.keywords.sourceName.source.updateDate.resolution.ep90.sensorType.rms.scale.dsc.geometry.version.accuracyLE90.selected.order.links(linkModelPrimitives)
