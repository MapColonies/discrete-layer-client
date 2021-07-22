/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from "mobx-state-tree"
import { QueryBuilder } from "mst-gql"
import { ModelBase } from "./ModelBase"
import { StatusEnumType } from "./StatusEnum"
import { TaskModel, TaskModelType } from "./TaskModel"
import { TaskModelSelector, taskModelPrimitives } from "./TaskModel.base"
import { RootStoreType } from "./index"


/**
 * JobBase
 * auto generated base class for the model JobModel.
 */
export const JobModelBase = ModelBase
  .named('Job')
  .props({
    __typename: types.optional(types.literal("Job"), "Job"),
    id: types.union(types.undefined, types.string),
    resourceId: types.union(types.undefined, types.null, types.string),
    version: types.union(types.undefined, types.null, types.string),
    description: types.union(types.undefined, types.null, types.string),
    parameters: types.union(types.undefined, types.null, types.frozen()),
    status: types.union(types.undefined, types.null, StatusEnumType),
    reason: types.union(types.undefined, types.null, types.string),
    type: types.union(types.undefined, types.null, types.string),
    percentage: types.union(types.undefined, types.null, types.number),
    priority: types.union(types.undefined, types.null, types.number),
    tasks: types.union(types.undefined, types.array(types.late((): any => TaskModel))),
    created: types.union(types.undefined, types.null, types.frozen()),
    updated: types.union(types.undefined, types.null, types.frozen()),
    isCleaned: types.union(types.undefined, types.null, types.boolean),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class JobModelSelector extends QueryBuilder {
  get id() { return this.__attr(`id`) }
  get resourceId() { return this.__attr(`resourceId`) }
  get version() { return this.__attr(`version`) }
  get description() { return this.__attr(`description`) }
  get parameters() { return this.__attr(`parameters`) }
  get status() { return this.__attr(`status`) }
  get reason() { return this.__attr(`reason`) }
  get type() { return this.__attr(`type`) }
  get percentage() { return this.__attr(`percentage`) }
  get priority() { return this.__attr(`priority`) }
  get created() { return this.__attr(`created`) }
  get updated() { return this.__attr(`updated`) }
  get isCleaned() { return this.__attr(`isCleaned`) }
  tasks(builder?: string | TaskModelSelector | ((selector: TaskModelSelector) => TaskModelSelector)) { return this.__child(`tasks`, TaskModelSelector, builder) }
}
export function selectFromJob() {
  return new JobModelSelector()
}

export const jobModelPrimitives = selectFromJob().resourceId.version.description.parameters.status.reason.type.percentage.priority.created.updated.isCleaned.id.tasks(taskModelPrimitives)
