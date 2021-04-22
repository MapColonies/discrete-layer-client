import { Instance, types } from "mobx-state-tree"
import { LayerMetadataModelBase } from "./LayerMetadataModel.base"
import { momentDateType } from "./moment-date.type"

/* The TypeScript type of an instance of LayerMetadataModel */
export interface LayerMetadataModelType extends Instance<typeof LayerMetadataModel.Type> {}

/* A graphql query fragment builders for LayerMetadataModel */
export { selectFromLayerMetadata, layerMetadataModelPrimitives, LayerMetadataModelSelector } from "./LayerMetadataModel.base"



/**
 * LayerMetadataModel
 */
export const LayerMetadataModel = LayerMetadataModelBase
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
