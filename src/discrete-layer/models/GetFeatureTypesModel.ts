import { Instance } from "mobx-state-tree"
import { GetFeatureTypesModelBase } from "./GetFeatureTypesModel.base"

/* The TypeScript type of an instance of GetFeatureTypesModel */
export interface GetFeatureTypesModelType extends Instance<typeof GetFeatureTypesModel.Type> {}

/* A graphql query fragment builders for GetFeatureTypesModel */
export { selectFromGetFeatureTypes, getFeatureTypesModelPrimitives, GetFeatureTypesModelSelector } from "./GetFeatureTypesModel.base"

/**
 * GetFeatureTypesModel
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const GetFeatureTypesModel = GetFeatureTypesModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log(): void {
      console.log(JSON.stringify(self))
    }
  }))
