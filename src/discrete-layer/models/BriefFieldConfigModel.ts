import { Instance } from "mobx-state-tree"
import { BriefFieldConfigModelBase } from "./BriefFieldConfigModel.base"

/* The TypeScript type of an instance of BriefFieldConfigModel */
export interface BriefFieldConfigModelType extends Instance<typeof BriefFieldConfigModel.Type> {}

/* A graphql query fragment builders for BriefFieldConfigModel */
export { selectFromBriefFieldConfig, briefFieldConfigModelPrimitives, BriefFieldConfigModelSelector } from "./BriefFieldConfigModel.base"

/**
 * BriefFieldConfigModel
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const BriefFieldConfigModel = BriefFieldConfigModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log(): void {
      console.log(JSON.stringify(self))
    }
  }))
