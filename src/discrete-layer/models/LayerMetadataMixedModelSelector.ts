/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { QueryBuilder } from "mst-gql"
import { LayerMetadata3DModelType } from "./LayerMetadata3DModel"
import { LayerMetadata3DModelSelector, layerMetadata3DModelPrimitives } from "./LayerMetadata3DModel.base"
import { LayerMetadataModelType } from "./LayerMetadataModel"
import { LayerMetadataModelSelector, layerMetadataModelPrimitives } from "./LayerMetadataModel.base"

export type LayerMetadataMixedUnion = LayerMetadataModelType | LayerMetadata3DModelType

export class LayerMetadataMixedModelSelector extends QueryBuilder {
  layerMetadata(builder?: string | LayerMetadataModelSelector | ((selector: LayerMetadataModelSelector) => LayerMetadataModelSelector)) { return this.__inlineFragment(`LayerMetadata`, LayerMetadataModelSelector, builder) }
  layerMetadata3D(builder?: string | LayerMetadata3DModelSelector | ((selector: LayerMetadata3DModelSelector) => LayerMetadata3DModelSelector)) { return this.__inlineFragment(`LayerMetadata3D`, LayerMetadata3DModelSelector, builder) }
}
export function selectFromLayerMetadataMixed() {
  return new LayerMetadataMixedModelSelector()
}

// provides all primitive fields of union member types combined together
export const layerMetadataMixedModelPrimitives = selectFromLayerMetadataMixed().layerMetadata(layerMetadataModelPrimitives).layerMetadata3D(layerMetadata3DModelPrimitives)