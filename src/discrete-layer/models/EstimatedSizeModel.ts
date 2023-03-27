import { Instance } from "mobx-state-tree"
import { EstimatedSizeModelBase } from "./EstimatedSizeModel.base"

/* The TypeScript type of an instance of EstimatedSizeModel */
export interface EstimatedSizeModelType extends Instance<typeof EstimatedSizeModel.Type> {}

/* A graphql query fragment builders for EstimatedSizeModel */
export { selectFromEstimatedSize, estimatedSizeModelPrimitives, EstimatedSizeModelSelector } from "./EstimatedSizeModel.base"

/**
 * EstimatedSizeModel
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const EstimatedSizeModel = EstimatedSizeModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log(): void {
      console.log(JSON.stringify(self))
    }
  }))
