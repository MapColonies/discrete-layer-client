import { Instance } from "mobx-state-tree"
import { WfsFeatureModelBase } from "./WfsFeatureModel.base"

/* The TypeScript type of an instance of WfsFeatureModel */
export interface WfsFeatureModelType extends Instance<typeof WfsFeatureModel.Type> {}

/* A graphql query fragment builders for WfsFeatureModel */
export { selectFromWfsFeature, wfsFeatureModelPrimitives, WfsFeatureModelSelector } from "./WfsFeatureModel.base"

/**
 * WfsFeatureModel
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const WfsFeatureModel = WfsFeatureModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log(): void {
      console.log(JSON.stringify(self))
    }
  }))
