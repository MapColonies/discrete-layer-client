/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from "mobx-state-tree"
import { QueryBuilder } from "mst-gql"
import { ModelBase } from "./ModelBase"
import { RootStoreType } from "./index"


/**
 * TriggerExportTaskBase
 * auto generated base class for the model TriggerExportTaskModel.
 */
export const TriggerExportTaskModelBase = ModelBase
  .named('TriggerExportTask')
  .props({
    __typename: types.optional(types.literal("TriggerExportTask"), "TriggerExportTask"),
    jobId: types.union(types.undefined, types.string),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class TriggerExportTaskModelSelector extends QueryBuilder {
  get jobId() { return this.__attr(`jobId`) }
}
export function selectFromTriggerExportTask() {
  return new TriggerExportTaskModelSelector()
}

export const triggerExportTaskModelPrimitives = selectFromTriggerExportTask().jobId
