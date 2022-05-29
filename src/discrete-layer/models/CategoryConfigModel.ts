import { Instance } from "mobx-state-tree"
import { CategoryConfigModelBase } from "./CategoryConfigModel.base"

/* The TypeScript type of an instance of CategoryConfigModel */
export interface CategoryConfigModelType extends Instance<typeof CategoryConfigModel.Type> {}

/* A graphql query fragment builders for CategoryConfigModel */
export { selectFromCategoryConfig, categoryConfigModelPrimitives, CategoryConfigModelSelector } from "./CategoryConfigModel.base"

/**
 * CategoryConfigModel
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const CategoryConfigModel = CategoryConfigModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log(): void {
      console.log(JSON.stringify(self))
    }
  }))
