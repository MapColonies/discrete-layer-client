import { Instance } from "mobx-state-tree"
import { FilterFieldValidationModelBase } from "./FilterFieldValidationModel.base"

/* The TypeScript type of an instance of FilterFieldValidationModel */
export interface FilterFieldValidationModelType extends Instance<typeof FilterFieldValidationModel.Type> {}

/* A graphql query fragment builders for FilterFieldValidationModel */
export { selectFromFilterFieldValidation, filterFieldValidationModelPrimitives, FilterFieldValidationModelSelector } from "./FilterFieldValidationModel.base"

/**
 * FilterFieldValidationModel
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const FilterFieldValidationModel = FilterFieldValidationModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log(): void {
      console.log(JSON.stringify(self))
    }
  }))
