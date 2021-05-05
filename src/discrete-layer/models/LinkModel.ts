import { Instance } from "mobx-state-tree"
import { LinkModelBase } from "./LinkModel.base"

/* The TypeScript type of an instance of LinkModel */
export interface LinkModelType extends Instance<typeof LinkModel.Type> {}

/* A graphql query fragment builders for LinkModel */
export { selectFromLink, linkModelPrimitives, LinkModelSelector } from "./LinkModel.base"

/**
 * LinkModel
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const LinkModel = LinkModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log(): void {
      console.log(JSON.stringify(self))
    }
  }))
