import { Instance } from "mobx-state-tree"
import { FreeDiskSpaceModelBase } from "./FreeDiskSpaceModel.base"

/* The TypeScript type of an instance of FreeDiskSpaceModel */
export interface FreeDiskSpaceModelType extends Instance<typeof FreeDiskSpaceModel.Type> {}

/* A graphql query fragment builders for FreeDiskSpaceModel */
export { selectFromFreeDiskSpace, freeDiskSpaceModelPrimitives, FreeDiskSpaceModelSelector } from "./FreeDiskSpaceModel.base"

/**
 * FreeDiskSpaceModel
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const FreeDiskSpaceModel = FreeDiskSpaceModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log(): void {
      console.log(JSON.stringify(self))
    }
  }))
