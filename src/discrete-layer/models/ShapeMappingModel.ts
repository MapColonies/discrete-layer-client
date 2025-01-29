import { Instance } from "mobx-state-tree"
import { ShapeMappingModelBase } from "./ShapeMappingModel.base"

/* The TypeScript type of an instance of ShapeMappingModel */
export interface ShapeMappingModelType extends Instance<typeof ShapeMappingModel.Type> {}

/* A graphql query fragment builders for ShapeMappingModel */
export { selectFromShapeMapping, shapeMappingModelPrimitives, ShapeMappingModelSelector } from "./ShapeMappingModel.base"

/**
 * ShapeMappingModel
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const ShapeMappingModel = ShapeMappingModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log(): void {
      console.log(JSON.stringify(self))
    }
  }))
