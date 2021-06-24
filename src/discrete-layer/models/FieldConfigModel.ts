import { Instance } from "mobx-state-tree"
import { FieldConfigModelBase } from "./FieldConfigModel.base"

/* The TypeScript type of an instance of FieldConfigModel */
export interface FieldConfigModelType extends Instance<typeof FieldConfigModel.Type> {}

/* A graphql query fragment builders for FieldConfigModel */
export { selectFromFieldConfig, fieldConfigModelPrimitives, FieldConfigModelSelector } from "./FieldConfigModel.base"

/**
 * FieldConfigModel
 */
export const FieldConfigModel = FieldConfigModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log() {
      console.log(JSON.stringify(self))
    }
  }))
