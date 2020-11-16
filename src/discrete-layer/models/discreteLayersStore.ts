/* eslint-disable camelcase */
import { types, Instance, flow, getParent } from 'mobx-state-tree';
import { ApiHttpResponse } from '../../common/models/api-response';
import { ResponseState } from '../../common/models/response-state.enum';
// import { createMockData } from '../../__mocks-data__/search-results.mock';
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
        Promise<SearchResponse>,
        void,
        LayersImagesResponse
      > {
        try {
          console.log('Fetch layers images--->');
          self.state = ResponseState.IDLE;
          const result = yield self.root.fetch('/searchLayerImages', 'GET', {});
          // const result = yield Promise.resolve(createMockData(20,'mock'));
          self.layersImages = result;
        } catch (error) {
          console.error(error);
          self.state = ResponseState.ERROR;
        }
      }
    );

    return {
      getLayersImages,
    };
  });

export interface IConflictsStore extends Instance<typeof discreteLayersStore> {}
