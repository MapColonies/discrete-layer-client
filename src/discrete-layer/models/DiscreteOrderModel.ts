import { Instance } from "mobx-state-tree"
import { DiscreteOrderModelBase } from "./DiscreteOrderModel.base"

/* The TypeScript type of an instance of DiscreteOrderModel */
export interface DiscreteOrderModelType extends Instance<typeof DiscreteOrderModel.Type> {}

/* A graphql query fragment builders for DiscreteOrderModel */
export { selectFromDiscreteOrder, discreteOrderModelPrimitives, DiscreteOrderModelSelector } from "./DiscreteOrderModel.base"

/**
 * DiscreteOrderModel
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const DiscreteOrderModel = DiscreteOrderModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log() {
      console.log(JSON.stringify(self))
    }
  }))
