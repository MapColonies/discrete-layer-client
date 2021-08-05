import { types, getParent } from 'mobx-state-tree';
import { localStore } from '../../common/helpers/storage';
import { ResponseState } from '../../common/models/response-state.enum';
import { MovedLayer } from '../components/best-management/interfaces/MovedLayer';
import { BestRecordModelType } from './BestRecordModel';
import { LayerRasterRecordModelType } from './LayerRasterRecordModel';
import { ModelBase } from './ModelBase';
import { IRootStore, RootStoreType } from './RootStore';

export type LayersListResponse = LayerRasterRecordModelType[];

/* A graphql query fragment builders for BestRecordModel */
export { selectFromBestRecord, bestRecordModelPrimitives, BestRecordModelSelector } from './BestRecordModel.base';

export const bestStore = ModelBase
  .props({
    state: types.enumeration<ResponseState>(
      'State',
      Object.values(ResponseState)
    ),
    layersList: types.maybe(types.frozen<LayerRasterRecordModelType[]>([])),
    editingBest: types.maybe(types.frozen<BestRecordModelType>()),
    movedLayer: types.maybe(types.frozen<MovedLayer>()),
  })
  .views((self) => ({
    get store(): IRootStore {
      return self.__getStore<RootStoreType>()
    },
    get root(): IRootStore {
      return getParent(self);
    },
  }))
  .actions((self) => {

    function setLayersList(layers: LayerRasterRecordModelType[]): void {
      self.layersList =  [...layers];
    }

    function editBest(best: BestRecordModelType | undefined): void {
      self.editingBest =  best ? {...best} : undefined;
    }

    function saveDraft(best: BestRecordModelType | undefined): void {
      const draftsKey = 'DRAFTS';
      const drafts = localStore.getObject(draftsKey);
      if (drafts === null) {
        localStore.setObject(draftsKey, {
          data: [best]
        });
      } else {
        localStore.setObject(draftsKey, {
          data: [
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
      if (drafts === null) {
        return [];
      } else {
        return drafts.data as BestRecordModelType[];
      }
    }

    function updateMovedLayer(movedLayer: MovedLayer): void {
      self.movedLayer = { ...movedLayer };
    }

    function showLayer(id: string, isShow: boolean): void {
      self.layersList = self.layersList?.map(el => el.id === id ? {...el, layerImageShown: isShow} : el);
    }


    return {
      setLayersList,
      editBest,
      saveDraft,
      getDrafts,
      updateMovedLayer,
      showLayer,
    };
  });
