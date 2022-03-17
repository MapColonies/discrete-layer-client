import { Instance } from "mobx-state-tree"
import { DeploymentWithServicesModelBase } from "./DeploymentWithServicesModel.base"

/* The TypeScript type of an instance of DeploymentWithServicesModel */
export interface DeploymentWithServicesModelType extends Instance<typeof DeploymentWithServicesModel.Type> {}

/* A graphql query fragment builders for DeploymentWithServicesModel */
export { selectFromDeploymentWithServices, deploymentWithServicesModelPrimitives, DeploymentWithServicesModelSelector } from "./DeploymentWithServicesModel.base"

/**
 * DeploymentWithServicesModel
 */
export const DeploymentWithServicesModel = DeploymentWithServicesModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log() {
      console.log(JSON.stringify(self))
    }
  }))
