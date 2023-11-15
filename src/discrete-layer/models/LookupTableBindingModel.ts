import { Instance } from "mobx-state-tree"
import { LookupTableBindingModelBase } from "./LookupTableBindingModel.base"

/* The TypeScript type of an instance of LookupTableBindingModel */
export interface LookupTableBindingModelType extends Instance<typeof LookupTableBindingModel.Type> {}

/* A graphql query fragment builders for LookupTableBindingModel */
export { selectFromLookupTableBinding, lookupTableBindingModelPrimitives, LookupTableBindingModelSelector } from "./LookupTableBindingModel.base"

/**
 * LookupTableBindingModel
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const LookupTableBindingModel = LookupTableBindingModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log(): void {
      console.log(JSON.stringify(self))
    }
  }))
