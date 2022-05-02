import { Instance } from "mobx-state-tree"
import { DecryptedIdModelBase } from "./DecryptedIdModel.base"

/* The TypeScript type of an instance of DecryptedIdModel */
export interface DecryptedIdModelType extends Instance<typeof DecryptedIdModel.Type> {}

/* A graphql query fragment builders for DecryptedIdModel */
export { selectFromDecryptedId, decryptedIdModelPrimitives, DecryptedIdModelSelector } from "./DecryptedIdModel.base"

/**
 * DecryptedIdModel
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const DecryptedIdModel = DecryptedIdModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log() {
      console.log(JSON.stringify(self))
    }
  }))
