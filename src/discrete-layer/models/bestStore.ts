import { types, getParent } from 'mobx-state-tree';
import { isEmpty, get } from 'lodash';
import { localStore } from '../../common/helpers/storage';
import { ResponseState } from '../../common/models/response-state.enum';
import { MovedLayer } from '../components/best-management/interfaces/MovedLayer';
import { BestRecordModelType } from './BestRecordModel';
import { LayerRasterRecordModelType } from './LayerRasterRecordModel';
import { ModelBase } from './ModelBase';
import { IRootStore, RootStoreType } from './RootStore';
import { DiscreteOrder } from './DiscreteOrder';

export type LayersListResponse = LayerRasterRecordModelType[];

interface IBestEditData {
  layersList?: LayerRasterRecordModelType[];
  editingBest?: BestRecordModelType;
}

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
    storedData:  types.maybe(types.frozen<IBestEditData>({layersList: [] as LayerRasterRecordModelType[], editingBest: {} as BestRecordModelType})),
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
            ...((drafts.data as BestRecordModelType[]).filter((item) => item.id !== best?.id)),
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

    function showFootprint(id: string, isShow: boolean): void {
      // just update is footprint shown for persistancy
      self.layersList?.find((el) => {
        if(el.id === id){
          el.footprintShown = isShow;
        } 
      });
    }

    function addImportLayersToBest(importLayers: LayerRasterRecordModelType[]): void {
      if (!isEmpty(importLayers)) {
        self.layersList =  [
          ...self.layersList ?? []
        ];
        importLayers.forEach(layer => {
          // @ts-ignore
          const discretes = get(self.editingBest, 'discretes') as DiscreteOrder[];
          if (!isEmpty(discretes)) {
            discretes.push({ id: layer.id, zOrder: discretes.length });
          } else {
            // @ts-ignore
            (self.editingBest as Record<string,unknown>).discretes = [ { id: layer.id, zOrder: 0 } ];
          }
        });
      }
    }

    function preserveData(): void {
      if(self.storedData){
        self.storedData = {
          layersList: self.layersList ? [ ...self.layersList ]: [],
          editingBest: {...self.editingBest} as BestRecordModelType,
        }
      }
    }

    function restoreData(): void {
      if(self.storedData && !isEmpty(self.storedData.editingBest?.productName)) {
        self.layersList = [...self.storedData.layersList??[]];
        self.editingBest = {...self.storedData.editingBest} as BestRecordModelType;
      }
    }

    function isDirty(): boolean {
      return !isEmpty(self.editingBest) && !isEmpty(self.storedData?.editingBest?.productName);
    }

    function resetData(): void {
      self.layersList = [];
    }

    return {
      setLayersList,
      editBest,
      saveDraft,
      getDrafts,
      updateMovedLayer,
      showLayer,
      showFootprint,
      addImportLayersToBest,
      preserveData,
      restoreData,
      resetData,
      isDirty,
    };
  });
