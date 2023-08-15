import { Instance } from "mobx-state-tree"
import { PositionsWithHeightsModelBase } from "./PositionsWithHeightsModel.base"

/* The TypeScript type of an instance of PositionsWithHeightsModel */
export interface PositionsWithHeightsModelType extends Instance<typeof PositionsWithHeightsModel.Type> {}

/* A graphql query fragment builders for PositionsWithHeightsModel */
export { selectFromPositionsWithHeights, positionsWithHeightsModelPrimitives, PositionsWithHeightsModelSelector } from "./PositionsWithHeightsModel.base"

/**
 * PositionsWithHeightsModel
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const PositionsWithHeightsModel = PositionsWithHeightsModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log(): void {
      console.log(JSON.stringify(self))
    }
  }))
