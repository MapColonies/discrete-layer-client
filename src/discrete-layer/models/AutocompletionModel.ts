import { Instance } from "mobx-state-tree"
import { AutocompletionModelBase } from "./AutocompletionModel.base"

/* The TypeScript type of an instance of AutocompletionModel */
export interface AutocompletionModelType extends Instance<typeof AutocompletionModel.Type> {}

/* A graphql query fragment builders for AutocompletionModel */
export { selectFromAutocompletion, autocompletionModelPrimitives, AutocompletionModelSelector } from "./AutocompletionModel.base"

/**
 * AutocompletionModel
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const AutocompletionModel = AutocompletionModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log(): void {
      console.log(JSON.stringify(self))
    }
  }))
