import { Instance } from "mobx-state-tree"
import { EntityDescriptorModelBase } from "./EntityDescriptorModel.base"

/* The TypeScript type of an instance of EntityDescriptorModel */
export interface EntityDescriptorModelType extends Instance<typeof EntityDescriptorModel.Type> {}

/* A graphql query fragment builders for EntityDescriptorModel */
export { selectFromEntityDescriptor, entityDescriptorModelPrimitives, EntityDescriptorModelSelector } from "./EntityDescriptorModel.base"

/**
 * EntityDescriptorModel
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const EntityDescriptorModel = EntityDescriptorModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log() {
      console.log(JSON.stringify(self))
    }
  }))
