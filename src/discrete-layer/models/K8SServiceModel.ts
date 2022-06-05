import { Instance } from "mobx-state-tree"
import { K8SServiceModelBase } from "./K8SServiceModel.base"

/* The TypeScript type of an instance of K8SServiceModel */
export interface K8SServiceModelType extends Instance<typeof K8SServiceModel.Type> {}

/* A graphql query fragment builders for K8SServiceModel */
export { selectFromK8SService, k8SServiceModelPrimitives, K8SServiceModelSelector } from "./K8SServiceModel.base"

/**
 * K8SServiceModel
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const K8SServiceModel = K8SServiceModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log(): void {
      console.log(JSON.stringify(self))
    }
  }))
