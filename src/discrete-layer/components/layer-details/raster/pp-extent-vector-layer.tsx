
import { useEffect, useState } from 'react';
import { BBox, Feature, GeoJsonProperties, Geometry } from 'geojson';
import { debounce } from 'lodash';
import { MapEvent } from 'ol';
import { Size } from 'ol/size';
import GeoJSON from "ol/format/GeoJSON";
import intersect from '@turf/intersect';
import { polygon } from '@turf/helpers';
import bboxPolygon from '@turf/bbox-polygon';
import { observer } from 'mobx-react';
import { GeoJSONFeature, useMap, VectorLayer, VectorSource } from '@map-colonies/react-components';
import { Style } from 'ol/style';
import { createTextStyle, FeatureType, FEATURE_LABEL_CONFIG, getWFSFeatureTypeName, PPMapStyles } from './pp-map.utils';
import CONFIG from '../../../../common/config';
import { GetFeatureModelType, LayerRasterRecordModelType, useQuery, useStore } from '../../../models';
import { GeojsonFeatureInput } from '../../../models/RootStore.base';
import useZoomLevelsTable from '../../export-layer/hooks/useZoomLevelsTable';
import { ILayerImage } from '../../../models/layerImage';
import { useEnums } from '../../../../common/hooks/useEnum.hook';
import { UserAction } from '../../../models/userStore';
import { IDispatchAction } from '../../../models/actionDispatcherStore';
import { useIntl } from 'react-intl';

interface PolygonPartsVectorLayerProps {
  layerRecord?: ILayerImage | null;
}

const START_OFFSET = 0;
const START_PAGE = 0;
const ZOOM_LEVEL_STOP_FETCHING_PP = 7; // TODO: to take from configuration
const DEBOUNCE_MOUSE_INTERVAL = 500;

export const PolygonPartsVectorLayer: React.FC<PolygonPartsVectorLayerProps> = observer(({layerRecord}) => {
  const store = useStore();
  const mapOl = useMap();
  const intl = useIntl();

  const [existingPolygoParts, setExistingPolygoParts] = useState<Feature[]>([]);
  const [page, setPage] = useState(START_PAGE);
  const { data, error, loading, setQuery } = useQuery<{ getPolygonPartsFeature: GetFeatureModelType}>();
  const ZOOM_LEVELS_TABLE = useZoomLevelsTable();
  const ENUMS = useEnums();
  
  const showLoadingSpinner = (isShown: boolean) => {
    isShown? 
      mapOl.getTargetElement().classList.add('olSpinner') :
      mapOl.getTargetElement().classList.remove('olSpinner');
  };
  
  useEffect(() => {
    const handleMoveEndEvent = (e: MapEvent): void => {
      setPage(START_PAGE);
      setExistingPolygoParts([
        {
          type: 'Feature',
          geometry: {
            ...layerRecord?.footprint
          },
          properties: {
            text: 'hide'
          }
        }
      ]);
      getExistingPolygoParts(mapOl.getView().calculateExtent() as BBox, START_OFFSET);
    };

    const debounceCall = debounce(handleMoveEndEvent, DEBOUNCE_MOUSE_INTERVAL);
    mapOl.on('moveend', debounceCall);

    getExistingPolygoParts(mapOl.getView().calculateExtent() as BBox, START_OFFSET);
    
    return (): void => {
      try {
        mapOl.un('moveend', debounceCall);
      } catch (e) {
        console.log('OL "moveEnd" remove listener failed', e);
      }
    };
  },[]);
  
  useEffect(() => {
    if (!loading && data) {
      setExistingPolygoParts([
        ...(page === 0 ? existingPolygoParts.slice(1) : existingPolygoParts),
        ...data.getPolygonPartsFeature.features as Feature<Geometry, GeoJsonProperties>[]
      ]);
      if(data.getPolygonPartsFeature.numberReturned as number !== 0){
        getExistingPolygoParts(mapOl.getView().calculateExtent() as BBox, (page+1) * CONFIG.POLYGON_PARTS.MAX.WFS_FEATURES);
        setPage(page+1);
      }
    } 
    if (loading){
      showLoadingSpinner(true);
    }else{
      showLoadingSpinner(false);
    }
  }, [data, loading]);

  useEffect(() => {
    if (!loading && error) {
      store.actionDispatcherStore.dispatchAction(
        {
          action: UserAction.SYSTEM_CALLBACK_SHOW_PPERROR_ON_UPDATE,
          data: {
            error: [
              intl.formatMessage(
                {id: 'validation-general.polygonParts.wfsServerError'}
            )]
          },
        } as IDispatchAction
      );
    }
  }, [error, loading]);

  const getExistingPolygoParts = (bbox: BBox, startIndex: number) => {
    // const fakePP = squareGrid(bbox, 10, {units: 'miles'});
    // console.log(fakePP);
    // setExistingPolygoParts(fakePP.features);

    const currentZoomLevel = mapOl.getView().getZoom();

    if(currentZoomLevel && currentZoomLevel < ZOOM_LEVEL_STOP_FETCHING_PP) 
    {
      setExistingPolygoParts([
        {
          type: 'Feature',
          geometry: {
            ...layerRecord?.footprint
          },
          properties: null
        }
      ])
    } else {
      setQuery(store.queryGetPolygonPartsFeature({ 
        data: {
          feature:  bboxPolygon(bbox) as GeojsonFeatureInput,
          typeName: getWFSFeatureTypeName(layerRecord as LayerRasterRecordModelType, ENUMS),
          count: CONFIG.POLYGON_PARTS.MAX.WFS_FEATURES,
          startIndex
        } 
    }));
    }
  };
    
  return (
    <VectorLayer>
      <VectorSource>
        {existingPolygoParts.map((feat, idx) => {
            const greenStyle = new Style({
              text: createTextStyle(feat, 4, FEATURE_LABEL_CONFIG.polygons, ZOOM_LEVELS_TABLE, intl.formatMessage({id: 'polygon-parts.map-preview.zoom-before-fetch'})),
              stroke: PPMapStyles.get(FeatureType.EXISTING_PP)?.getStroke(),
              fill: PPMapStyles.get(FeatureType.EXISTING_PP)?.getFill(),
            });

            const BUFFER = 2; // Add extra pixels to perimeter around the OL extent in order to discard new geometry boundaries
            const size = mapOl.getSize() as Size;
            const bbox = bboxPolygon(mapOl.getView().calculateExtent([size[0] + BUFFER,size[1] + BUFFER]) as BBox);
            const extentPolygon = polygon(bbox.geometry.coordinates);
            
            //@ts-ignore
            const featureClippedPolygon = intersect(feat, extentPolygon);
           
            if (featureClippedPolygon) {
              const geometry = new GeoJSON().readGeometry(featureClippedPolygon.geometry);
              greenStyle.setGeometry(geometry);
            }

            return feat ? <GeoJSONFeature 
              geometry={{...feat.geometry}} 
              fit={false}
              featureStyle={greenStyle}
            /> : <></>
          }
        )}
      </VectorSource>
    </VectorLayer>
  );
})