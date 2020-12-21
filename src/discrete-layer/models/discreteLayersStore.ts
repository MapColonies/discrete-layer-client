/* eslint-disable camelcase */
import { types, Instance, flow, getParent } from 'mobx-state-tree';
import { ApiHttpResponse } from '../../common/models/api-response';
import { ResponseState } from '../../common/models/response-state.enum';
import { createMockData, MOCK_DATA_IMAGERY_LAYERS_ISRAEL } from '../../__mocks-data__/search-results.mock';
import { searchParams } from './search-params';
import { IRootStore } from './rootStore';
import { ILayerImage } from './layerImage';
export type LayersImagesResponse = ILayerImage[];

export interface SearchResult {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

export type SearchResponse = ApiHttpResponse<SearchResult>;

export const discreteLayersStore = types
  .model({
    state: types.enumeration<ResponseState>(
      'State',
      Object.values(ResponseState)
    ),
    searchParams: types.optional(searchParams, {}),
    layersImages: types.maybe(types.frozen<LayersImagesResponse>([])),
  })
  .views((self) => ({
    get root(): IRootStore {
      return getParent(self);
    },
  }))
  .actions((self) => {
    const getLayersImages: () => Promise<void> = flow(
      function* getLayersImages(): Generator<
        Promise<LayersImagesResponse>, //SearchResponse
        void,
        LayersImagesResponse
      > {
        try {
          console.log('Fetch layers images--->');
          self.state = ResponseState.IDLE;
          // const result = yield self.root.fetch('/searchLayerImages', 'GET', {});
          // const result = yield Promise.resolve(createMockData(20,'mock'));
          
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const result = yield  Promise.resolve(MOCK_DATA_IMAGERY_LAYERS_ISRAEL);
          self.layersImages = result.map(item => ({...item, selected:false}));
        } catch (error) {
          console.error(error);
          self.state = ResponseState.ERROR;
        }
      }
    );

    function clearLayersImages(): void {
      self.layersImages = [];
    }

    function showLayer(id: string, isShow: boolean): void {
      self.layersImages = self.layersImages?.map(el => el.id === id ? {...el, selected: isShow} : el);
    }

    return {
      getLayersImages,
      clearLayersImages,
      showLayer
    };
  });

export interface IConflictsStore extends Instance<typeof discreteLayersStore> {}
