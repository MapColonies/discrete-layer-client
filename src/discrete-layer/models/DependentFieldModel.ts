import { Instance } from "mobx-state-tree"
import { DependentFieldModelBase } from "./DependentFieldModel.base"

/* The TypeScript type of an instance of DependentFieldModel */
export interface DependentFieldModelType extends Instance<typeof DependentFieldModel.Type> {}

/* A graphql query fragment builders for DependentFieldModel */
export { selectFromDependentField, dependentFieldModelPrimitives, DependentFieldModelSelector } from "./DependentFieldModel.base"

/**
 * DependentFieldModel
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const DependentFieldModel = DependentFieldModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log(): void {
      console.log(JSON.stringify(self))
    }
  }))
