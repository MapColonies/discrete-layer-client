import { Instance, types } from "mobx-state-tree"
import { TasksGroupModelBase } from "./TasksGroupModel.base"
import { momentDateType } from "./moment-date.type"

/* The TypeScript type of an instance of TasksGroupModel */
export interface TasksGroupModelType extends Instance<typeof TasksGroupModel.Type> {}

/* A graphql query fragment builders for TasksGroupModel */
export { selectFromTasksGroup, tasksGroupModelPrimitives, TasksGroupModelSelector } from "./TasksGroupModel.base"

/**
 * TasksGroupModel
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const TasksGroupModel = TasksGroupModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log(): void {
      console.log(JSON.stringify(self))
    }
  }))
  .props({
    /* eslint-disable */
    /* tslint:disable */
    created: types.maybe(momentDateType),
    updated: types.maybe(momentDateType),
    /* tslint:enable */
    /* eslint-enable */
  })
