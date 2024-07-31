import { Instance } from "mobx-state-tree"
import { SourceInfoModelBase } from "./SourceInfoModel.base"

/* The TypeScript type of an instance of SourceInfoModel */
export interface SourceInfoModelType extends Instance<typeof SourceInfoModel.Type> {}

/* A graphql query fragment builders for SourceInfoModel */
export { selectFromSourceInfo, sourceInfoModelPrimitives, SourceInfoModelSelector } from "./SourceInfoModel.base"

/**
 * SourceInfoModel
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const SourceInfoModel = SourceInfoModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log(): void {
      console.log(JSON.stringify(self))
    }
  }))
