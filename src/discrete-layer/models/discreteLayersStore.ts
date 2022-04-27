/* eslint-disable camelcase */
import { types, Instance, flow, getParent } from 'mobx-state-tree';
import lineStringToPolygon from '@turf/linestring-to-polygon';
import intersect from '@turf/intersect';
import bboxPolygon from '@turf/bbox-polygon';
import bbox from '@turf/bbox';
import { cloneDeep, set, get } from 'lodash';
import { Geometry, Polygon } from 'geojson';
import { ApiHttpResponse } from '../../common/models/api-response';
import { ResponseState } from '../../common/models/response-state.enum';
import { MOCK_DATA_IMAGERY_LAYERS_ISRAEL } from '../../__mocks-data__/search-results.mock';
import { TabViews } from '../views/tab-views';
import { searchParams } from './search-params';
import { IRootStore, RootStoreType } from './RootStore';
import { ILayerImage } from './layerImage';
import { ModelBase } from './ModelBase';
import { EntityDescriptorModelType } from './EntityDescriptorModel';
import { CapabilityModelType } from './CapabilityModel';

export type LayersImagesResponse = ILayerImage[];

export interface SearchResult {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

export type SearchResponse = ApiHttpResponse<SearchResult>;

export interface ITabViewData {
  idx: TabViews;
  selectedLayer?: ILayerImage;
  layersImages?: ILayerImage[];
  filters?: unknown;
}

export const discreteLayersStore = ModelBase
  .props({
    state: types.enumeration<ResponseState>(
      'State',
      Object.values(ResponseState)
    ),
    searchParams: types.optional(searchParams, {}),
    layersImages: types.maybe(types.frozen<LayersImagesResponse>([])),
    highlightedLayer: types.maybe(types.frozen<ILayerImage>()),
    selectedLayer: types.maybe(types.frozen<ILayerImage>()),
    tabViews: types.maybe(types.frozen<ITabViewData[]>([{idx: TabViews.CATALOG}, {idx: TabViews.SEARCH_RESULTS}, {idx: TabViews.CREATE_BEST}])),
    entityDescriptors: types.maybe(types.frozen<EntityDescriptorModelType[]>([])),
    previewedLayers: types.maybe(types.frozen<string[]>([])),
    capabilities: types.maybe(types.frozen<CapabilityModelType[]>([])),
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
          const result = yield Promise.resolve(MOCK_DATA_IMAGERY_LAYERS_ISRAEL);
          self.layersImages = filterBySearchParams(result).map(item => ({...item, footprintShown: true, layerImageShown: false, order: null}));
          
        } catch (error) {
          console.error(error);
          self.state = ResponseState.ERROR;
        }
      }
    );

    function setEntityDescriptors(data: EntityDescriptorModelType[]): void {
      self.entityDescriptors = cloneDeep(data);
    }

    function setLayersImages(data: ILayerImage[], showFootprint = true): void {
      // self.layersImages = filterBySearchParams(data).map(item => ({...item, footprintShown: true, layerImageShown: false, order: null}));
      self.layersImages = data.map(item => ({
          ...item,
          footprintShown: showFootprint,
          layerImageShown: false,
          order: null
        })
      );
    }

    function setLayersImagesData(data: ILayerImage[]): void {
      self.layersImages = data.map(item => ({
          ...item,
          layerImageShown: false,
          order: null
        })
      );
    }

    function updateLayer(data: ILayerImage): void {
      // self.layersImages = filterBySearchParams(data).map(item => ({...item, footprintShown: true, layerImageShown: false, order: null}));
      const layerForUpdate = self.layersImages?.find(layer => layer.id === data.id);
      for (const key in layerForUpdate){
        set(layerForUpdate,key, get(data,key));
      }
    }

    // TODO: Remove when actual API is integrated
    function filterBySearchParams(layers: ILayerImage[]): ILayerImage[] {
      return layers.filter((layer) => {
        let layerBBoxPolygon: Polygon;
        const geometry: Geometry = layer.footprint as Geometry;
        switch(geometry.type){
          case 'Polygon':
            layerBBoxPolygon = layer.footprint as Polygon;
            break;
          case 'MultiPolygon':
            layerBBoxPolygon = bboxPolygon(bbox(geometry)).geometry;
            break;
          case 'LineString':
            layerBBoxPolygon = lineStringToPolygon(geometry).geometry;
            break;
          default:
            throw(new Error('Unknown Geojson feature type'));
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
      self.layersImages = self.layersImages?.map(el => el.id === id ? {...el, layerImageShown: isShow, order} : el);
    }

    function showFootprint(id: string, isShow: boolean): void {
      self.layersImages = self.layersImages?.map(el => el.id === id ? {...el, footprintShown: isShow} : el);
    }

    function highlightLayer(layer: ILayerImage | undefined): void {
      self.highlightedLayer =  layer ? {...layer} : undefined;
    }

    function selectLayer(layer: ILayerImage | undefined): void {
      self.selectedLayer =  layer ? {...layer} : undefined;
    }

    function selectLayerByID(layerID: string): void {
      const layer = self.layersImages?.find(layer => layer.id === layerID);
      self.selectedLayer =  layer ? {...layer} : undefined;
    }

    function setTabviewData(tabView: TabViews): void {
      if (self.tabViews) {
        const idxTabViewToUpdate = self.tabViews.findIndex((tab) => tab.idx === tabView);

        self.tabViews[idxTabViewToUpdate].selectedLayer = self.selectedLayer;
        self.tabViews[idxTabViewToUpdate].layersImages = self.layersImages ? [ ...self.layersImages ]: [];
      } 
    }

    function restoreTabviewData(tabView: TabViews): void {
      if(self.tabViews) {
        const idxTabViewToUpdate = self.tabViews.findIndex((tab) => tab.idx === tabView);

        self.selectedLayer = self.tabViews[idxTabViewToUpdate].selectedLayer;
        self.layersImages = self.tabViews[idxTabViewToUpdate].layersImages??[];
      } 
    }

    function addPreviewedLayer(id: string): void {
      self.previewedLayers = [
        ...self.previewedLayers ?? [],
        id
      ];
    }

    function removePreviewedLayer(id: string): void {
      self.previewedLayers = self.previewedLayers?.filter(layerId => layerId !== id);
    }

    function isPreviewedLayer(id: string): boolean {
      return self.previewedLayers?.find(layerId => layerId === id) !== undefined ? true : false;
    }

    function cleanPreviewedLayer(): void {
      self.previewedLayers = [];
    }

    function setCapabilities(data: CapabilityModelType[]): void {
      self.capabilities = cloneDeep(data);
    }

    return {
      getLayersImages,
      setLayersImages,
      setLayersImagesData,
      clearLayersImages,
      showLayer,
      highlightLayer,
      selectLayer,
      selectLayerByID,
      setTabviewData,
      restoreTabviewData,
      showFootprint,
      setEntityDescriptors,
      updateLayer,
      addPreviewedLayer,
      cleanPreviewedLayer,
      removePreviewedLayer,
      isPreviewedLayer,
      setCapabilities,
    };
  });

export interface IConflictsStore extends Instance<typeof discreteLayersStore> {}
