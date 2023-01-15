import { Instance } from "mobx-state-tree"
import { GetFeatureModelBase } from "./GetFeatureModel.base"

/* The TypeScript type of an instance of GetFeatureModel */
export interface GetFeatureModelType extends Instance<typeof GetFeatureModel.Type> {}

/* A graphql query fragment builders for GetFeatureModel */
export { selectFromGetFeature, getFeatureModelPrimitives, GetFeatureModelSelector } from "./GetFeatureModel.base"

/**
 * GetFeatureModel
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const GetFeatureModel = GetFeatureModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log(): void {
      console.log(JSON.stringify(self))
    }
  }))
