/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from "mobx-state-tree"
import { QueryBuilder } from "mst-gql"
import { ModelBase } from "./ModelBase"
import { StatusEnumType } from "./StatusEnum"
import { RootStoreType } from "./index"


/**
 * TasksGroupBase
 * auto generated base class for the model TasksGroupModel.
 */
export const TasksGroupModelBase = ModelBase
  .named('TasksGroup')
  .props({
    __typename: types.optional(types.literal("TasksGroup"), "TasksGroup"),
    jobId: types.union(types.undefined, types.null, types.string),
    type: types.union(types.undefined, types.null, types.string),
    parameters: types.union(types.undefined, types.null, types.frozen()),
    created: types.union(types.undefined, types.null, types.frozen()),
    updated: types.union(types.undefined, types.null, types.frozen()),
    status: types.union(types.undefined, types.null, StatusEnumType),
    percentage: types.union(types.undefined, types.null, types.number),
    reason: types.union(types.undefined, types.null, types.string),
    counts: types.union(types.undefined, types.null, types.number),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class TasksGroupModelSelector extends QueryBuilder {
  get jobId() { return this.__attr(`jobId`) }
  get type() { return this.__attr(`type`) }
  get parameters() { return this.__attr(`parameters`) }
  get created() { return this.__attr(`created`) }
  get updated() { return this.__attr(`updated`) }
  get status() { return this.__attr(`status`) }
  get percentage() { return this.__attr(`percentage`) }
  get reason() { return this.__attr(`reason`) }
  get counts() { return this.__attr(`counts`) }
}
export function selectFromTasksGroup() {
  return new TasksGroupModelSelector()
}

export const tasksGroupModelPrimitives = selectFromTasksGroup().jobId.type.parameters.created.updated.status.percentage.reason.counts
