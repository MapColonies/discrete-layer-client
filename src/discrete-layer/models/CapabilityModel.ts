import { Instance } from "mobx-state-tree"
import { CapabilityModelBase } from "./CapabilityModel.base"

/* The TypeScript type of an instance of CapabilityModel */
export interface CapabilityModelType extends Instance<typeof CapabilityModel.Type> {}

/* A graphql query fragment builders for CapabilityModel */
export { selectFromCapability, capabilityModelPrimitives, CapabilityModelSelector } from "./CapabilityModel.base"

/**
 * CapabilityModel
 */
export const CapabilityModel = CapabilityModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log() {
      console.log(JSON.stringify(self))
    }
  }))
