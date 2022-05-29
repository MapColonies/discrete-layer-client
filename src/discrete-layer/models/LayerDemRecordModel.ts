import { Instance } from "mobx-state-tree"
import { LayerDemRecordModelBase } from "./LayerDemRecordModel.base"

/* The TypeScript type of an instance of LayerDemRecordModel */
export interface LayerDemRecordModelType extends Instance<typeof LayerDemRecordModel.Type> {}

/* A graphql query fragment builders for LayerDemRecordModel */
export { selectFromLayerDemRecord, layerDemRecordModelPrimitives, LayerDemRecordModelSelector } from "./LayerDemRecordModel.base"

/**
 * LayerDemRecordModel
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const LayerDemRecordModel = LayerDemRecordModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log(): void {
      console.log(JSON.stringify(self))
    }
  }))
