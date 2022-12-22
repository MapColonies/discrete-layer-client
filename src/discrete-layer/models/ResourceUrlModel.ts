import { Instance } from "mobx-state-tree"
import { ResourceUrlModelBase } from "./ResourceUrlModel.base"

/* The TypeScript type of an instance of ResourceUrlModel */
export interface ResourceUrlModelType extends Instance<typeof ResourceUrlModel.Type> {}

/* A graphql query fragment builders for ResourceUrlModel */
export { selectFromResourceUrl, resourceUrlModelPrimitives, ResourceUrlModelSelector } from "./ResourceUrlModel.base"

/**
 * ResourceUrlModel
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const ResourceUrlModel = ResourceUrlModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log(): void {
      console.log(JSON.stringify(self))
    }
  }))
