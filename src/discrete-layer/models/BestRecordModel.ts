import { Instance, types } from "mobx-state-tree"
import { BestRecordModelBase } from "./BestRecordModel.base"
import { momentDateType } from "./moment-date.type"

/* The TypeScript type of an instance of BestRecordModel */
export interface BestRecordModelType extends Instance<typeof BestRecordModel.Type> {}

/* A graphql query fragment builders for BestRecordModel */
export { selectFromBestRecord, bestRecordModelPrimitives, BestRecordModelSelector } from "./BestRecordModel.base"

/**
 * BestRecordModel
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const BestRecordModel = BestRecordModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log() {
      console.log(JSON.stringify(self))
    }
  }))
  .props({
    /* eslint-disable */
    /* tslint:disable */
    insertDate: types.maybe(momentDateType),
    creationDate: types.maybe(momentDateType),
    updateDate: types.maybe(momentDateType),
    ingestionDate: types.maybe(momentDateType),
    sourceDateStart: types.maybe(momentDateType),
    sourceDateEnd: types.maybe(momentDateType),
    /* tslint:enable */
    /* eslint-enable */

    // TODO: should be removed
    isDraft: types.union(types.undefined, types.null, types.boolean),
  })