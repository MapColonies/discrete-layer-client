import { Instance } from "mobx-state-tree"
import { UpdateRulesOperationModelBase } from "./UpdateRulesOperationModel.base"

/* The TypeScript type of an instance of UpdateRulesOperationModel */
export interface UpdateRulesOperationModelType extends Instance<typeof UpdateRulesOperationModel.Type> {}

/* A graphql query fragment builders for UpdateRulesOperationModel */
export { selectFromUpdateRulesOperation, updateRulesOperationModelPrimitives, UpdateRulesOperationModelSelector } from "./UpdateRulesOperationModel.base"

/**
 * UpdateRulesOperationModel
 */
// eslint-disable-next-line
export const UpdateRulesOperationModel = UpdateRulesOperationModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log() {
      console.log(JSON.stringify(self))
    }
  }))
