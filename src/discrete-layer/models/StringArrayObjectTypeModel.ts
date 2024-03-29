import { Instance } from "mobx-state-tree"
import { StringArrayObjectTypeModelBase } from "./StringArrayObjectTypeModel.base"

/* The TypeScript type of an instance of StringArrayObjectTypeModel */
export interface StringArrayObjectTypeModelType extends Instance<typeof StringArrayObjectTypeModel.Type> {}

/* A graphql query fragment builders for StringArrayObjectTypeModel */
export { selectFromStringArrayObjectType, stringArrayObjectTypeModelPrimitives, StringArrayObjectTypeModelSelector } from "./StringArrayObjectTypeModel.base"

/**
 * StringArrayObjectTypeModel
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const StringArrayObjectTypeModel = StringArrayObjectTypeModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log(): void {
      console.log(JSON.stringify(self))
    }
  }))
