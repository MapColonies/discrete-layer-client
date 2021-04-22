import { Instance } from "mobx-state-tree"
import { LayerMetadata3DModelBase } from "./LayerMetadata3DModel.base"

/* The TypeScript type of an instance of LayerMetadata3DModel */
export interface LayerMetadata3DModelType extends Instance<typeof LayerMetadata3DModel.Type> {}

/* A graphql query fragment builders for LayerMetadata3DModel */
export { selectFromLayerMetadata3D, layerMetadata3DModelPrimitives, LayerMetadata3DModelSelector } from "./LayerMetadata3DModel.base"

/**
 * LayerMetadata3DModel
 */
export const LayerMetadata3DModel = LayerMetadata3DModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log() {
      console.log(JSON.stringify(self))
    }
  }))
