import { Instance } from "mobx-state-tree"
import { AutocompletionModelBase } from "./AutocompletionModel.base"

/* The TypeScript type of an instance of AutocompletionModel */
export interface AutocompletionModelType extends Instance<typeof AutocompletionModel.Type> {}

/* A graphql query fragment builders for AutocompletionModel */
export { selectFromAutocompletion, autocompletionModelPrimitives, AutocompletionModelSelector } from "./AutocompletionModel.base"

/**
 * AutocompletionModel
 */
export const AutocompletionModel = AutocompletionModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log() {
      console.log(JSON.stringify(self))
    }
  }))
