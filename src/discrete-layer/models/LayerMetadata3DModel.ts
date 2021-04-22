import { Instance, types } from "mobx-state-tree"
import { LayerMetadata3DModelBase } from "./LayerMetadata3DModel.base"
import { momentDateType } from "./moment-date.type"

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
  .props({
    /* eslint-disable */
    /* tslint:disable */
    insertDate: types.maybe(momentDateType),
    creationDate: types.maybe(momentDateType),
    updateDate: types.maybe(momentDateType),
    /* tslint:enable */
    /* eslint-enable */
  })
