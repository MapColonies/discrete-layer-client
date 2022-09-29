import { Instance } from "mobx-state-tree"
import { McEnumsModelBase } from "./McEnumsModel.base"

/* The TypeScript type of an instance of McEnumsModel */
export interface McEnumsModelType extends Instance<typeof McEnumsModel.Type> {}

/* A graphql query fragment builders for McEnumsModel */
export { selectFromMcEnums, mcEnumsModelPrimitives, McEnumsModelSelector } from "./McEnumsModel.base"

/**
 * McEnumsModel
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const McEnumsModel = McEnumsModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log(): void {
      console.log(JSON.stringify(self))
    }
  }))
