import { Instance } from "mobx-state-tree"
import { ExternalServiceModelBase } from "./ExternalServiceModel.base"

/* The TypeScript type of an instance of ExternalServiceModel */
export interface ExternalServiceModelType extends Instance<typeof ExternalServiceModel.Type> {}

/* A graphql query fragment builders for ExternalServiceModel */
export { selectFromExternalService, externalServiceModelPrimitives, ExternalServiceModelSelector } from "./ExternalServiceModel.base"

/**
 * ExternalServiceModel
 */
export const ExternalServiceModel = ExternalServiceModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log() {
      console.log(JSON.stringify(self))
    }
  }))
