import { Instance } from "mobx-state-tree"
import { ValidationConfigModelBase } from "./ValidationConfigModel.base"

/* The TypeScript type of an instance of ValidationConfigModel */
export interface ValidationConfigModelType extends Instance<typeof ValidationConfigModel.Type> {}

/* A graphql query fragment builders for ValidationConfigModel */
export { selectFromValidationConfig, validationConfigModelPrimitives, ValidationConfigModelSelector } from "./ValidationConfigModel.base"

/**
 * ValidationConfigModel
 */
export const ValidationConfigModel = ValidationConfigModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log() {
      console.log(JSON.stringify(self))
    }
  }))
