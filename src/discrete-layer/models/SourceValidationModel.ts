import { Instance } from "mobx-state-tree"
import { SourceValidationModelBase } from "./SourceValidationModel.base"

/* The TypeScript type of an instance of SourceValidationModel */
export interface SourceValidationModelType extends Instance<typeof SourceValidationModel.Type> {}

/* A graphql query fragment builders for SourceValidationModel */
export { selectFromSourceValidation, sourceValidationModelPrimitives, SourceValidationModelSelector } from "./SourceValidationModel.base"

/**
 * SourceValidationModel
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const SourceValidationModel = SourceValidationModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log(): void {
      console.log(JSON.stringify(self))
    }
  }))
