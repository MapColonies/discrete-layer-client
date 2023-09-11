import { Instance } from "mobx-state-tree"
import { FilterableFieldConfigModelBase } from "./FilterableFieldConfigModel.base"

/* The TypeScript type of an instance of FilterableFieldConfigModel */
export interface FilterableFieldConfigModelType extends Instance<typeof FilterableFieldConfigModel.Type> {}

/* A graphql query fragment builders for FilterableFieldConfigModel */
export { selectFromFilterableFieldConfig, filterableFieldConfigModelPrimitives, FilterableFieldConfigModelSelector } from "./FilterableFieldConfigModel.base"

/**
 * FilterableFieldConfigModel
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const FilterableFieldConfigModel = FilterableFieldConfigModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log(): void {
      console.log(JSON.stringify(self))
    }
  }))
