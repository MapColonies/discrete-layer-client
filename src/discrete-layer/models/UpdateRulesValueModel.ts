import { Instance } from "mobx-state-tree"
import { UpdateRulesValueModelBase } from "./UpdateRulesValueModel.base"

/* The TypeScript type of an instance of UpdateRulesValueModel */
export interface UpdateRulesValueModelType extends Instance<typeof UpdateRulesValueModel.Type> {}

/* A graphql query fragment builders for UpdateRulesValueModel */
export { selectFromUpdateRulesValue, updateRulesValueModelPrimitives, UpdateRulesValueModelSelector } from "./UpdateRulesValueModel.base"

/**
 * UpdateRulesValueModel
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const UpdateRulesValueModel = UpdateRulesValueModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log(): void {
      console.log(JSON.stringify(self))
    }
  }))
