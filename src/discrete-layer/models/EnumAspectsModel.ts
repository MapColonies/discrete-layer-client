import { Instance } from "mobx-state-tree"
import { EnumAspectsModelBase } from "./EnumAspectsModel.base"

/* The TypeScript type of an instance of EnumAspectsModel */
export interface EnumAspectsModelType extends Instance<typeof EnumAspectsModel.Type> {}

/* A graphql query fragment builders for EnumAspectsModel */
export { selectFromEnumAspects, enumAspectsModelPrimitives, EnumAspectsModelSelector } from "./EnumAspectsModel.base"

/**
 * EnumAspectsModel
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const EnumAspectsModel = EnumAspectsModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log() {
      console.log(JSON.stringify(self))
    }
  }))
