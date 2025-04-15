import { Instance } from "mobx-state-tree"
import { FieldFeatureTypeModelBase } from "./FieldFeatureTypeModel.base"

/* The TypeScript type of an instance of FieldFeatureTypeModel */
export interface FieldFeatureTypeModelType extends Instance<typeof FieldFeatureTypeModel.Type> {}

/* A graphql query fragment builders for FieldFeatureTypeModel */
export { selectFromFieldFeatureType, fieldFeatureTypeModelPrimitives, FieldFeatureTypeModelSelector } from "./FieldFeatureTypeModel.base"

/**
 * FieldFeatureTypeModel
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const FieldFeatureTypeModel = FieldFeatureTypeModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log(): void {
      console.log(JSON.stringify(self))
    }
  }))
