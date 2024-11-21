/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { QueryBuilder } from "mst-gql"
import { Layer3DRecordModelType } from "./Layer3DRecordModel"
import { Layer3DRecordModelSelector, layer3DRecordModelPrimitives } from "./Layer3DRecordModel.base"
import { LayerDemRecordModelType } from "./LayerDemRecordModel"
import { LayerDemRecordModelSelector, layerDemRecordModelPrimitives } from "./LayerDemRecordModel.base"
import { LayerRasterRecordModelType } from "./LayerRasterRecordModel"
import { LayerRasterRecordModelSelector, layerRasterRecordModelPrimitives } from "./LayerRasterRecordModel.base"
import { PolygonPartRecordModelType } from "./PolygonPartRecordModel"
import { QuantizedMeshBestRecordModelType } from "./QuantizedMeshBestRecordModel"
import { QuantizedMeshBestRecordModelSelector, quantizedMeshBestRecordModelPrimitives } from "./QuantizedMeshBestRecordModel.base"
import { VectorBestRecordModelType } from "./VectorBestRecordModel"
import { VectorBestRecordModelSelector, vectorBestRecordModelPrimitives } from "./VectorBestRecordModel.base"

export type LayerMetadataMixedUnion = Layer3DRecordModelType | LayerRasterRecordModelType | LayerDemRecordModelType | VectorBestRecordModelType | QuantizedMeshBestRecordModelType | PolygonPartRecordModelType

export class LayerMetadataMixedModelSelector extends QueryBuilder {
  layer3DRecord(builder?: string | Layer3DRecordModelSelector | ((selector: Layer3DRecordModelSelector) => Layer3DRecordModelSelector)) { return this.__inlineFragment(`Layer3DRecord`, Layer3DRecordModelSelector, builder) }
  layerRasterRecord(builder?: string | LayerRasterRecordModelSelector | ((selector: LayerRasterRecordModelSelector) => LayerRasterRecordModelSelector)) { return this.__inlineFragment(`LayerRasterRecord`, LayerRasterRecordModelSelector, builder) }
  layerDemRecord(builder?: string | LayerDemRecordModelSelector | ((selector: LayerDemRecordModelSelector) => LayerDemRecordModelSelector)) { return this.__inlineFragment(`LayerDemRecord`, LayerDemRecordModelSelector, builder) }
  vectorBestRecord(builder?: string | VectorBestRecordModelSelector | ((selector: VectorBestRecordModelSelector) => VectorBestRecordModelSelector)) { return this.__inlineFragment(`VectorBestRecord`, VectorBestRecordModelSelector, builder) }
  quantizedMeshBestRecord(builder?: string | QuantizedMeshBestRecordModelSelector | ((selector: QuantizedMeshBestRecordModelSelector) => QuantizedMeshBestRecordModelSelector)) { return this.__inlineFragment(`QuantizedMeshBestRecord`, QuantizedMeshBestRecordModelSelector, builder) }
}
export function selectFromLayerMetadataMixed() {
  return new LayerMetadataMixedModelSelector()
}

// provides all primitive fields of union member types combined together
export const layerMetadataMixedModelPrimitives = selectFromLayerMetadataMixed().layer3DRecord(layer3DRecordModelPrimitives).layerRasterRecord(layerRasterRecordModelPrimitives).layerDemRecord(layerDemRecordModelPrimitives).vectorBestRecord(vectorBestRecordModelPrimitives).quantizedMeshBestRecord(quantizedMeshBestRecordModelPrimitives)