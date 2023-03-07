import { Instance } from "mobx-state-tree"
import { TriggerExportTaskModelBase } from "./TriggerExportTaskModel.base"

/* The TypeScript type of an instance of TriggerExportTaskModel */
export interface TriggerExportTaskModelType extends Instance<typeof TriggerExportTaskModel.Type> {}

/* A graphql query fragment builders for TriggerExportTaskModel */
export { selectFromTriggerExportTask, triggerExportTaskModelPrimitives, TriggerExportTaskModelSelector } from "./TriggerExportTaskModel.base"

/**
 * TriggerExportTaskModel
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const TriggerExportTaskModel = TriggerExportTaskModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log(): void {
      console.log(JSON.stringify(self))
    }
  }))
