import { Instance, types } from "mobx-state-tree"
import { JobModelBase } from "./JobModel.base"
import { TaskModel } from "./TaskModel"
import { momentDateType } from "./moment-date.type"

/* The TypeScript type of an instance of JobModel */
export interface JobModelType extends Instance<typeof JobModel.Type> {}

/* A graphql query fragment builders for JobModel */
export { selectFromJob, jobModelPrimitives, JobModelSelector } from "./JobModel.base"

/**
 * JobModel
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const JobModel = JobModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log() {
      console.log(JSON.stringify(self))
    }
  }))
  .props({
    /* eslint-disable */
    /* tslint:disable */
    created: types.maybe(momentDateType),
    updated: types.maybe(momentDateType),
    expirationDate: types.maybe(momentDateType),
    /* tslint:enable */
    /* eslint-enable */
    tasks: types.union(types.undefined, types.array(types.late((): any => TaskModel))),
  })
