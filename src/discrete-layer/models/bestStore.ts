import { flow, types, getParent } from 'mobx-state-tree';
import { localStore } from '../../common/helpers/storage';
import { ResponseState } from '../../common/models/response-state.enum';
import { BestRecordModelType } from './BestRecordModel';
import { LayerRasterRecordModelType } from './LayerRasterRecordModel';
import { ModelBase } from './ModelBase';
import { MovedLayer } from '../components/best-management/interfaces/MovedLayer';
import { IRootStore, RootStoreType } from './RootStore';

export type LayersListResponse = LayerRasterRecordModelType[];

/* A graphql query fragment builders for BestRecordModel */
export { selectFromBestRecord, bestRecordModelPrimitives, BestRecordModelSelector } from './BestRecordModel.base';

/**
 * BestRecordModel
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const bestStore = ModelBase
  .props({
    state: types.enumeration<ResponseState>(
      'State',
      Object.values(ResponseState)
    ),
    layersList: types.maybe(types.frozen<LayerRasterRecordModelType[]>([])),
    editingBest: types.maybe(types.frozen()),
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
          const result = yield  Promise.resolve([
              {
                id: '6ac605c4-da38-11eb-8d19-0242ac130003',
                productName: `Weizmann Institute of Science (Rehovot, Israel)`,
                creationDate: new Date('2018-02-13T13:39:55.400Z'),
                description: '',
                geojson: {
                  type: 'Polygon',
                  coordinates: [[
                    [34.8076891807199, 31.9042863434239],
                    [34.816135996859, 31.9042863434239],
                    [34.816135996859,31.9118071956932],
                    [34.8076891807199,31.9118071956932],
                    [34.8076891807199,31.9042863434239],
                  ]],
                },
                referenceSystem: '',
                imagingTimeStart: new Date(),
                imagingTimeEnd: new Date(),
                type: '',
                source: '',
                category: '',
                thumbnail: '',
                properties: {
                  protocol: 'XYZ_LAYER',
                  url: 'https://tiles.openaerialmap.org/5a852c072553e6000ce5ac8d/0/7950e2de-5d9e-49aa-adec-6e92384be0b9/{z}/{x}/{y}.png',
                  meta: 'http://oin-hotosm.s3.amazonaws.com/5a852c072553e6000ce5ac8d/0/7950e2de-5d9e-49aa-adec-6e92384be0b9_meta.json'
                },
              },
              {
                id: '7c6dfeb2-da38-11eb-8d19-0242ac130003',
                productName: `Weizmann Institute of Science`,
                creationDate: new Date('2018-03-06T13:39:55.400Z'),
                description: '',
                geojson: {
                  type: 'Polygon',
                  coordinates: [[
                    [34.8099445223518, 31.9061345394902],
                    [34.8200994167574, 31.9061345394902],
                    [34.8200994167574, 31.9106311613979],
                    [34.8099445223518, 31.9106311613979],
                    [34.8099445223518, 31.9061345394902],
                  ]],
                },
                referenceSystem: '',
                imagingTimeStart: new Date(),
                imagingTimeEnd: new Date(),
                type: '',
                source: '',
                category: '',
                thumbnail: '',
                properties: {
                  protocol: 'XYZ_LAYER',
                  url: 'https://tiles.openaerialmap.org/5a9f90c42553e6000ce5ad6c/0/eee1a570-128e-4947-9ffa-1e69c1efab7c/{z}/{x}/{y}.png',
                  meta: 'http://oin-hotosm.s3.amazonaws.com/5a9f90c42553e6000ce5ad6c/0/eee1a570-128e-4947-9ffa-1e69c1efab7c_meta.json'
                },
              },
          ]);
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

    return {
      getLayersById,
      editBest,
      saveDraft,
      getDrafts,
      updateMovedLayer,
    };
  });
