import { Instance } from "mobx-state-tree"
import { PositionWithHeightModelBase } from "./PositionWithHeightModel.base"

/* The TypeScript type of an instance of PositionWithHeightModel */
export interface PositionWithHeightModelType extends Instance<typeof PositionWithHeightModel.Type> {}

/* A graphql query fragment builders for PositionWithHeightModel */
export { selectFromPositionWithHeight, positionWithHeightModelPrimitives, PositionWithHeightModelSelector } from "./PositionWithHeightModel.base"

/**
 * PositionWithHeightModel
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const PositionWithHeightModel = PositionWithHeightModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log(): void {
      console.log(JSON.stringify(self))
    }
  }))
