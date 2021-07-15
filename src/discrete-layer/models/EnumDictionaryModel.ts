import { Instance } from "mobx-state-tree"
import { EnumDictionaryModelBase } from "./EnumDictionaryModel.base"

/* The TypeScript type of an instance of EnumDictionaryModel */
export interface EnumDictionaryModelType extends Instance<typeof EnumDictionaryModel.Type> {}

/* A graphql query fragment builders for EnumDictionaryModel */
export { selectFromEnumDictionary, enumDictionaryModelPrimitives, EnumDictionaryModelSelector } from "./EnumDictionaryModel.base"

/**
 * EnumDictionaryModel
 */
export const EnumDictionaryModel = EnumDictionaryModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log() {
      console.log(JSON.stringify(self))
    }
  }))
