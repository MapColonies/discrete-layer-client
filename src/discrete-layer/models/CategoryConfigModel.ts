import { Instance } from "mobx-state-tree"
import { CategoryConfigModelBase } from "./CategoryConfigModel.base"

/* The TypeScript type of an instance of CategoryConfigModel */
export interface CategoryConfigModelType extends Instance<typeof CategoryConfigModel.Type> {}

/* A graphql query fragment builders for CategoryConfigModel */
export { selectFromCategoryConfig, categoryConfigModelPrimitives, CategoryConfigModelSelector } from "./CategoryConfigModel.base"

/**
 * CategoryConfigModel
 */
export const CategoryConfigModel = CategoryConfigModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log() {
      console.log(JSON.stringify(self))
    }
  }))
