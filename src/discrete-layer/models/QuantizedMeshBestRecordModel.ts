import { Instance } from "mobx-state-tree"
import { QuantizedMeshBestRecordModelBase } from "./QuantizedMeshBestRecordModel.base"

/* The TypeScript type of an instance of QuantizedMeshBestRecordModel */
export interface QuantizedMeshBestRecordModelType extends Instance<typeof QuantizedMeshBestRecordModel.Type> {}

/* A graphql query fragment builders for QuantizedMeshBestRecordModel */
export { selectFromQuantizedMeshBestRecord, quantizedMeshBestRecordModelPrimitives, QuantizedMeshBestRecordModelSelector } from "./QuantizedMeshBestRecordModel.base"

/**
 * QuantizedMeshBestRecordModel
 */
export const QuantizedMeshBestRecordModel = QuantizedMeshBestRecordModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log() {
      console.log(JSON.stringify(self))
    }
  }))
