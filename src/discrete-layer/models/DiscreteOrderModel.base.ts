/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from "mobx-state-tree"
import { QueryBuilder } from "mst-gql"
import { ModelBase } from "./ModelBase"
import { RootStoreType } from "./index"


/**
 * DiscreteOrderBase
 * auto generated base class for the model DiscreteOrderModel.
 */
export const DiscreteOrderModelBase = ModelBase
  .named('DiscreteOrder')
  .props({
    __typename: types.optional(types.literal("DiscreteOrder"), "DiscreteOrder"),
    id: types.union(types.undefined, types.string),
    zOrder: types.union(types.undefined, types.number),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class DiscreteOrderModelSelector extends QueryBuilder {
  get id() { return this.__attr(`id`) }
  get zOrder() { return this.__attr(`zOrder`) }
}
export function selectFromDiscreteOrder() {
  return new DiscreteOrderModelSelector()
}

export const discreteOrderModelPrimitives = selectFromDiscreteOrder().zOrder
