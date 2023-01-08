import { Instance } from "mobx-state-tree"
import { LookupTableDataModelBase } from "./LookupTableDataModel.base"

/* The TypeScript type of an instance of LookupTableDataModel */
export interface LookupTableDataModelType extends Instance<typeof LookupTableDataModel.Type> {}

/* A graphql query fragment builders for LookupTableDataModel */
export { selectFromLookupTableData, lookupTableDataModelPrimitives, LookupTableDataModelSelector } from "./LookupTableDataModel.base"

/**
 * LookupTableDataModel
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const LookupTableDataModel = LookupTableDataModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log(): void {
      console.log(JSON.stringify(self))
    }
  }))
