/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { QueryBuilder } from "mst-gql"
import { BestRecordModelType } from "./BestRecordModel"
import { BestRecordModelSelector, bestRecordModelPrimitives } from "./BestRecordModel.base"
import { Layer3DRecordModelType } from "./Layer3DRecordModel"
import { Layer3DRecordModelSelector, layer3DRecordModelPrimitives } from "./Layer3DRecordModel.base"
import { LayerDemRecordModelType } from "./LayerDemRecordModel"
import { LayerDemRecordModelSelector, layerDemRecordModelPrimitives } from "./LayerDemRecordModel.base"
import { LayerRasterRecordModelType } from "./LayerRasterRecordModel"
import { LayerRasterRecordModelSelector, layerRasterRecordModelPrimitives } from "./LayerRasterRecordModel.base"
import { VectorBestRecordModelType } from "./VectorBestRecordModel"
import { VectorBestRecordModelSelector, vectorBestRecordModelPrimitives } from "./VectorBestRecordModel.base"

export type LayerMetadataMixedUnion = Layer3DRecordModelType | LayerRasterRecordModelType | BestRecordModelType | LayerDemRecordModelType | VectorBestRecordModelType

export class LayerMetadataMixedModelSelector extends QueryBuilder {
  layer3DRecord(builder?: string | Layer3DRecordModelSelector | ((selector: Layer3DRecordModelSelector) => Layer3DRecordModelSelector)) { return this.__inlineFragment(`Layer3DRecord`, Layer3DRecordModelSelector, builder) }
  layerRasterRecord(builder?: string | LayerRasterRecordModelSelector | ((selector: LayerRasterRecordModelSelector) => LayerRasterRecordModelSelector)) { return this.__inlineFragment(`LayerRasterRecord`, LayerRasterRecordModelSelector, builder) }
  bestRecord(builder?: string | BestRecordModelSelector | ((selector: BestRecordModelSelector) => BestRecordModelSelector)) { return this.__inlineFragment(`BestRecord`, BestRecordModelSelector, builder) }
  layerDemRecord(builder?: string | LayerDemRecordModelSelector | ((selector: LayerDemRecordModelSelector) => LayerDemRecordModelSelector)) { return this.__inlineFragment(`LayerDemRecord`, LayerDemRecordModelSelector, builder) }
  vectorBestRecord(builder?: string | VectorBestRecordModelSelector | ((selector: VectorBestRecordModelSelector) => VectorBestRecordModelSelector)) { return this.__inlineFragment(`VectorBestRecord`, VectorBestRecordModelSelector, builder) }
}
export function selectFromLayerMetadataMixed() {
  return new LayerMetadataMixedModelSelector()
}

// provides all primitive fields of union member types combined together
export const layerMetadataMixedModelPrimitives = selectFromLayerMetadataMixed().layer3DRecord(layer3DRecordModelPrimitives).layerRasterRecord(layerRasterRecordModelPrimitives).bestRecord(bestRecordModelPrimitives).layerDemRecord(layerDemRecordModelPrimitives).vectorBestRecord(vectorBestRecordModelPrimitives)