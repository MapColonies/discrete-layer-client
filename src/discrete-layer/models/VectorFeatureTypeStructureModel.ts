import { Instance } from "mobx-state-tree"
import { VectorFeatureTypeStructureModelBase } from "./VectorFeatureTypeStructureModel.base"

/* The TypeScript type of an instance of VectorFeatureTypeStructureModel */
export interface VectorFeatureTypeStructureModelType extends Instance<typeof VectorFeatureTypeStructureModel.Type> {}

/* A graphql query fragment builders for VectorFeatureTypeStructureModel */
export { selectFromVectorFeatureTypeStructure, vectorFeatureTypeStructureModelPrimitives, VectorFeatureTypeStructureModelSelector } from "./VectorFeatureTypeStructureModel.base"

/**
 * VectorFeatureTypeStructureModel
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const VectorFeatureTypeStructureModel = VectorFeatureTypeStructureModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log(): void {
      console.log(JSON.stringify(self))
    }
  }))
