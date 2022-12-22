import { Instance } from "mobx-state-tree"
import { StyleModelBase } from "./StyleModel.base"

/* The TypeScript type of an instance of StyleModel */
export interface StyleModelType extends Instance<typeof StyleModel.Type> {}

/* A graphql query fragment builders for StyleModel */
export { selectFromStyle, styleModelPrimitives, StyleModelSelector } from "./StyleModel.base"

/**
 * StyleModel
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const StyleModel = StyleModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log(): void {
      console.log(JSON.stringify(self))
    }
  }))
