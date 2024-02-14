import { Instance } from "mobx-state-tree"
import { UserLoginModelBase } from "./UserLoginModel.base"

/* The TypeScript type of an instance of UserLoginModel */
export interface UserLoginModelType extends Instance<typeof UserLoginModel.Type> {}

/* A graphql query fragment builders for UserLoginModel */
export { selectFromUserLogin, userLoginModelPrimitives, UserLoginModelSelector } from "./UserLoginModel.base"

/**
 * UserLoginModel
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const UserLoginModel = UserLoginModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log(): void {
      console.log(JSON.stringify(self))
    }
  }))
