import { Instance, types } from 'mobx-state-tree';
import { BestRecordModelBase } from './BestRecordModel.base';
import { LayerRasterRecordModelType } from './LayerRasterRecordModel';
import { momentDateType } from './moment-date.type';

/* The TypeScript type of an instance of BestRecordModel */
export interface BestRecordModelType extends Instance<typeof BestRecordModel.Type> {}

/* A graphql query fragment builders for BestRecordModel */
export { selectFromBestRecord, bestRecordModelPrimitives, BestRecordModelSelector } from "./BestRecordModel.base"

/**
 * BestRecordModel
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const BestRecordModel = BestRecordModelBase
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
    footPrintShown: types.union(types.undefined, types.null, types.boolean),
    order: types.union(types.undefined, types.null, types.number),
    layerImageShown: types.union(types.undefined, types.null, types.boolean),
    isDraft: types.union(types.undefined, types.null, types.boolean),
    layersList: types.maybe(types.frozen<LayerRasterRecordModelType>([])),
  })
  .actions(self => ({
    // This is an auto-generated example action.
    log() {
      console.log(JSON.stringify(self))
    }

    const getLayersById: (ids: string[]) => Promise<void> = flow(
      function* getLayersById(ids): Generator<
        Promise<LayersListResponse>,
        void,
        LayersListResponse
      > {
        try {
          self.state = ResponseState.IDLE;
          // const result = yield self.root.fetch('/getRecordsById', 'GET', {});
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const result = yield  Promise.resolve(MOCK_DATA_IMAGERY_LAYERS_ISRAEL);
          // @ts-ignore
          self.layersList = result;
        } catch (error) {
          console.error(error);
          self.state = ResponseState.ERROR;
        }
      }
    );

    function editBest(best: BestRecordModelType | undefined): void {
      self.editingBest =  best ? {...best} : undefined;
    }

    function saveDraft(best: BestRecordModelType | undefined): void {
      const draftsKey = 'DRAFTS';
      const drafts = localStore.getObject(draftsKey);
      if(drafts === null){
        localStore.setObject(draftsKey,{
          data:[best]
        });
      }
      else {
        localStore.setObject(draftsKey,{
          data:[
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            ...(drafts.data as unknown[]),
            best
          ]
        });
      }
    }

    function getDrafts(): BestRecordModelType[] {
      const draftsKey = 'DRAFTS';
      const drafts = localStore.getObject(draftsKey);
      if(drafts === null){
        return [];
      }
      else {
        return drafts.data as BestRecordModelType[];
      }
    }

    function updateMovedLayer(id: string, from: number to: number): void {
      self.layersList = (self.layersList as LayerRasterRecordModelType)?.map((el: LayerRasterRecordModelType) => el.id === id ? {...el, zOrder} : el);
    }

    return {
      getLayersById,
      editBest,
      saveDraft,
      getDrafts,
      updateMovedLayer,
    };
  }));
