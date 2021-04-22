/* eslint-disable camelcase */
import { types, Instance, flow, getParent } from 'mobx-state-tree';
import lineStringToPolygon from '@turf/linestring-to-polygon';
import intersect from '@turf/intersect';
import bboxPolygon from '@turf/bbox-polygon';
import bbox from '@turf/bbox';
import { LineString, MultiPolygon, Polygon } from 'geojson';
import { CswClient, IRequestExecutor } from '@map-colonies/csw-client';
import { ApiHttpResponse } from '../../common/models/api-response';
import { ResponseState } from '../../common/models/response-state.enum';
import { createMockData, MOCK_DATA_IMAGERY_LAYERS_ISRAEL } from '../../__mocks-data__/search-results.mock';
import { searchParams } from './search-params';
import { IRootStore, RootStoreType } from './RootStore';
import { ILayerImage } from './layerImage';
import { ModelBase } from "./ModelBase"
import { yellow } from '@material-ui/core/colors';
import { LayerMetadataMixedUnion } from './LayerMetadataMixedModelSelector';
export type LayersImagesResponse = ILayerImage[];

export interface SearchResult {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

export type SearchResponse = ApiHttpResponse<SearchResult>;

export const discreteLayersStore = ModelBase
  .props({
    state: types.enumeration<ResponseState>(
      'State',
      Object.values(ResponseState)
    ),
    searchParams: types.optional(searchParams, {}),
    layersImages: types.maybe(types.frozen<LayersImagesResponse>([])),
    highlightedLayer: types.maybe(types.frozen<ILayerImage>()),
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
    const getLayersImages: () => Promise<void> = flow(
      function* getLayersImages(): Generator<
        Promise<LayersImagesResponse>, //SearchResponse
        void,
        LayersImagesResponse
      > {
        try {
          self.state = ResponseState.IDLE;
          // TODO: MOCK should be replaced by actual API call
          // const result = yield self.root.fetch('/searchLayerImages', 'GET', {});
          // const result = yield Promise.resolve(createMockData(20,'mock'));
          
          // *** communicate with pycsw directly - CORS
          // const result = yield self.root.fetch('http://127.0.0.1:54532/?version=2.0.2&service=CSW&request=GetRecords&typeNames=csw:Record&ElementSetName=full&resultType=results&outputSchema=http://schema.mapcolonies.com&outputFormat=application/json', 'GET', {});
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const result = yield  Promise.resolve(MOCK_DATA_IMAGERY_LAYERS_ISRAEL);
          self.layersImages = filterBySearchParams(result).map(item => ({...item, selected:false, order:null}));

          // const layers = [];
          // self.root.layerMetadata.data_.forEach((layer)=> {
          //   layers.push(layer) 
          // });
          // self.root.layerMetadata3DS.data_.forEach((layer)=> {
          //   layers.push(layer) 
          // });
          // // @ts-ignore
          // const result = yield Promise.resolve(layers);
          // // @ts-ignore
          // self.layersImages = filterBySearchParams(result).map(item => ({...item, selected:false, order:null}));
          
          // *** communicate with pycsw with cswClient - CORS
          // const cswClient = new CswClient(
          //   'http://127.0.0.1:56477/?version=2.0.2&service=CSW',
          //   self.root.fetch as IRequestExecutor,
          //   {
          //     shemas: [],
          //     nameSpaces: {
          //       namespacePrefixes: {
          //         'http://schema.mapcolonies.com': 'mc',
          //       },
          //     },
          //     credentials: {},
          //   });
          // const options = {
          //   filter: [
          //     {
          //       field: 'mcgc:geojson',
          //       bbox: {
          //         llat: 31.9042863434239,
          //         llon: 34.8076891807199,
          //         ulat: 31.913197,
          //         ulon: 34.810811,
          //       },
          //     },
          //   ],
          // };
          // self.layersImages = yield cswClient.GetRecords(1, 10, options, 'http://schema.mapcolonies.com');
        } catch (error) {
          console.error(error);
          self.state = ResponseState.ERROR;
        }
      }
    );

    // TODO: Remove when actual API is integrated
    function filterBySearchParams(layers: ILayerImage[]): ILayerImage[] {
      return layers.filter((layer) => {
        let layerBBoxPolygon: Polygon;
        switch(layer.geojson?.type){
          case 'Polygon':
            layerBBoxPolygon = layer.geojson;
            break;
          case 'MultiPolygon':
            layerBBoxPolygon = bboxPolygon(bbox(layer.geojson as MultiPolygon)).geometry;
            break;
          case 'LineString':
            layerBBoxPolygon = lineStringToPolygon(layer.geojson as LineString).geometry;
            break;
          default:
            throw(new Error('Unknow Geojson feature type'));
        }
        const intersection = intersect(
          layerBBoxPolygon, 
          {
            ...(self.searchParams.geojson as Polygon)
          }
        );
        return intersection ? true : false;
      });

    }

    function clearLayersImages(): void {
      self.layersImages = [];
    }

    function showLayer(id: string, isShow: boolean, order: number | null): void {
      self.layersImages = self.layersImages?.map(el => el.id === id ? {...el, selected: isShow, order} : el);
    }

    function highlightLayer(id: string): void {
      self.highlightedLayer = self.layersImages?.find(el => el.id === id);
    }

    return {
      getLayersImages,
      clearLayersImages,
      showLayer,
      highlightLayer,
    };
  });

export interface IConflictsStore extends Instance<typeof discreteLayersStore> {}
