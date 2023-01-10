import { Instance } from "mobx-state-tree"
import { AvailableActionsModelBase } from "./AvailableActionsModel.base"

/* The TypeScript type of an instance of AvailableActionsModel */
export interface AvailableActionsModelType extends Instance<typeof AvailableActionsModel.Type> {}

/* A graphql query fragment builders for AvailableActionsModel */
export { selectFromAvailableActions, availableActionsModelPrimitives, AvailableActionsModelSelector } from "./AvailableActionsModel.base"

/**
 * AvailableActionsModel
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const AvailableActionsModel = AvailableActionsModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log(): void {
      console.log(JSON.stringify(self))
    }
  }))
