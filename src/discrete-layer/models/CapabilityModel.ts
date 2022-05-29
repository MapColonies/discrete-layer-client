import { Instance } from "mobx-state-tree"
import { CapabilityModelBase } from "./CapabilityModel.base"

/* The TypeScript type of an instance of CapabilityModel */
export interface CapabilityModelType extends Instance<typeof CapabilityModel.Type> {}

/* A graphql query fragment builders for CapabilityModel */
export { selectFromCapability, capabilityModelPrimitives, CapabilityModelSelector } from "./CapabilityModel.base"

/**
 * CapabilityModel
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const CapabilityModel = CapabilityModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log(): void {
      console.log(JSON.stringify(self))
    }
  }))
