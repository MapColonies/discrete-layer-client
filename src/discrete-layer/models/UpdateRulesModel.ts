import { Instance } from "mobx-state-tree"
import { UpdateRulesModelBase } from "./UpdateRulesModel.base"

/* The TypeScript type of an instance of UpdateRulesModel */
export interface UpdateRulesModelType extends Instance<typeof UpdateRulesModel.Type> {}

/* A graphql query fragment builders for UpdateRulesModel */
export { selectFromUpdateRules, updateRulesModelPrimitives, UpdateRulesModelSelector } from "./UpdateRulesModel.base"

/**
 * UpdateRulesModel
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const UpdateRulesModel = UpdateRulesModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log() {
      console.log(JSON.stringify(self))
    }
  }))
