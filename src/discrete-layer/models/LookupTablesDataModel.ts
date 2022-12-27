import { Instance } from "mobx-state-tree"
import { LookupTablesDataModelBase } from "./LookupTablesDataModel.base"

/* The TypeScript type of an instance of LookupTablesDataModel */
export interface LookupTablesDataModelType extends Instance<typeof LookupTablesDataModel.Type> {}

/* A graphql query fragment builders for LookupTablesDataModel */
export { selectFromLookupTablesData, lookupTablesDataModelPrimitives, LookupTablesDataModelSelector } from "./LookupTablesDataModel.base"

/**
 * LookupTablesDataModel
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const LookupTablesDataModel = LookupTablesDataModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log(): void {
      console.log(JSON.stringify(self))
    }
  }))
