import { Instance } from "mobx-state-tree"
import { TileMatrixSetModelBase } from "./TileMatrixSetModel.base"

/* The TypeScript type of an instance of TileMatrixSetModel */
export interface TileMatrixSetModelType extends Instance<typeof TileMatrixSetModel.Type> {}

/* A graphql query fragment builders for TileMatrixSetModel */
export { selectFromTileMatrixSet, tileMatrixSetModelPrimitives, TileMatrixSetModelSelector } from "./TileMatrixSetModel.base"

/**
 * TileMatrixSetModel
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const TileMatrixSetModel = TileMatrixSetModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log(): void {
      console.log(JSON.stringify(self))
    }
  }))
