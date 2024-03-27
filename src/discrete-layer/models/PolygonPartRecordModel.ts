import { Instance, types } from "mobx-state-tree"
import { PolygonPartRecordModelBase } from "./PolygonPartRecordModel.base"
import { momentDateType } from "./moment-date.type"

/* The TypeScript type of an instance of PolygonPartRecordModel */
export interface PolygonPartRecordModelType extends Instance<typeof PolygonPartRecordModel.Type> {}

/* A graphql query fragment builders for PolygonPartRecordModel */
export { selectFromPolygonPartRecord, polygonPartRecordModelPrimitives, PolygonPartRecordModelSelector } from "./PolygonPartRecordModel.base"

/**
 * PolygonPartRecordModel
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const PolygonPartRecordModel = PolygonPartRecordModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log(): void {
      console.log(JSON.stringify(self))
    }
  }))
  .props({
    /* eslint-disable */
    /* tslint:disable */
    ingestionDateUTC: types.maybe(momentDateType),
    imagingTimeBeginUTC: types.maybe(momentDateType),
    imagingTimeEndUTC: types.maybe(momentDateType),
    /* tslint:enable */
    /* eslint-enable */
  })
