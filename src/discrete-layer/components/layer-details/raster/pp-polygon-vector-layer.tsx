
import { useEffect, useState } from 'react';
import { Feature, GeoJsonProperties, Geometry, LineString, MultiLineString, Polygon } from 'geojson';
import { observer } from 'mobx-react';
import lineStringToPolygon from '@turf/linestring-to-polygon';
import bbox from '@turf/bbox';
import bboxPolygon from '@turf/bbox-polygon';
import booleanIntersects from '@turf/boolean-intersects';
import { GeoJSONFeature, useMap, VectorLayer, VectorSource } from '@map-colonies/react-components';
import { Style } from 'ol/style';
import { createTextStyle, FeatureType, FEATURE_LABEL_CONFIG, getWFSFeatureTypeName, PPMapStyles } from './pp-map.utils';
import CONFIG from '../../../../common/config';
import { GetFeatureModelType, LayerRasterRecordModelType, useQuery, useStore } from '../../../models';
import { GeojsonFeatureInput } from '../../../models/RootStore.base';
import useZoomLevelsTable from '../../export-layer/hooks/useZoomLevelsTable';
import { ILayerImage } from '../../../models/layerImage';
import { SetWithContentEquality } from '../../../../common/helpers/set';
import { UserAction } from '../../../models/userStore';
import { IDispatchAction } from '../../../models/actionDispatcherStore';
import { useIntl } from 'react-intl';
import { emphasizeByHTML } from '../../../../common/helpers/formatters';
import { useEnums } from '../../../../common/hooks/useEnum.hook';

interface PolygonPartsVectorLayerProps {
  layerRecord?: ILayerImage | null;
  maskFeature?: Feature | null;
  partsToCheck?: Feature[];
  ingestionResolutionMeter?: number | null;
}

const START_PAGE = 0;

export const PolygonPartsByPolygonVectorLayer: React.FC<PolygonPartsVectorLayerProps> = observer(({layerRecord, maskFeature, partsToCheck, ingestionResolutionMeter}) => {
  const store = useStore();
  const intl = useIntl();
  const mapOl = useMap();

  const [existingPolygonParts, setExistingPolygonParts] = useState<Feature[]>([]);
  const [illegalParts, setIllegalParts] = useState<Feature[]>([]);
  const { data, error, loading, setQuery } = useQuery<{ getPolygonPartsFeature: GetFeatureModelType}>();
  const [page, setPage] = useState(START_PAGE);
  const ZOOM_LEVELS_TABLE = useZoomLevelsTable();
  const ENUMS = useEnums();

  const convertFeatureToPolygon = (feature: Feature) => {
    switch(feature.geometry.type){
      case 'LineString':
        return lineStringToPolygon(feature as Feature<LineString | MultiLineString>);
      case 'MultiLineString':
        return bboxPolygon(bbox(feature));
      default:
        return feature;
    }
  }
  
  const showLoadingSpinner = (isShown: boolean) => {
    isShown? 
      mapOl.getTargetElement().classList.add('olSpinner') :
      mapOl.getTargetElement().classList.remove('olSpinner');
  };

  const getExistingPolygoParts = (feature: Feature | null | undefined, startIndex: number) => {
    setQuery(store.queryGetPolygonPartsFeature({ 
      data: {
        feature:  feature as GeojsonFeatureInput,
        typeName: getWFSFeatureTypeName(layerRecord as LayerRasterRecordModelType, ENUMS),
        count: CONFIG.POLYGON_PARTS.MAX.WFS_FEATURES,
        startIndex
      } 
    }));
  };
  
  const dispatchAction = (action: Record<string,unknown>): void => {
    store.actionDispatcherStore.dispatchAction(
      {
        action: action.action,
        data: action.data,
      } as IDispatchAction
      );
    };
    
    useEffect(() => {
      if (maskFeature) {
        showLoadingSpinner(true);
        store.discreteLayersStore.setPPCollisionCheckInProgress(true);
        getExistingPolygoParts(convertFeatureToPolygon(maskFeature), START_PAGE);  
    }
  },[maskFeature]);
  
  useEffect(() => {
    if (!loading && data && maskFeature) {
      setExistingPolygonParts([
        ...(page === 0 ? existingPolygonParts.slice(1) : existingPolygonParts),
        ...data.getPolygonPartsFeature.features as Feature<Geometry, GeoJsonProperties>[]
      ]);
      if (data.getPolygonPartsFeature.numberReturned as number !== 0) {
        getExistingPolygoParts(convertFeatureToPolygon(maskFeature), (page+1) * CONFIG.POLYGON_PARTS.MAX.WFS_FEATURES);
        setPage(page+1);
      }
    } 
    if (loading){
      showLoadingSpinner(true);
    } else{
      showLoadingSpinner(false);
      store.discreteLayersStore.setPPCollisionCheckInProgress(false);
    }
  }, [data, loading]);

  useEffect(() => {
    if (!loading && error) {
      showLoadingSpinner(false);
      dispatchAction(
        {
          action: UserAction.SYSTEM_CALLBACK_SHOW_PPERROR_ON_UPDATE,
          data: 
            {
              error: [
                intl.formatMessage(
                  {id: 'validation-general.polygonParts.wfsServerError'}
              )]
            },
        }
      );
    } 
  }, [error, loading]);

  useEffect(() => {
    const interPartsSet = new SetWithContentEquality<Feature>(part => part.properties?.key);  
    if (ingestionResolutionMeter) {
      partsToCheck?.forEach((part) => {
        existingPolygonParts?.forEach((eixstingPart) => {
          const intersection = booleanIntersects( 
            part.geometry as Polygon, 
            eixstingPart.geometry as Polygon
          );
          if (intersection && ingestionResolutionMeter > eixstingPart.properties?.resolutionMeter) {
            interPartsSet.add(part);
          }
        });
      });

      setIllegalParts(interPartsSet.values());
      
      dispatchAction(
        {
          action: UserAction.SYSTEM_CALLBACK_SHOW_PPERROR_ON_UPDATE,
          data: (interPartsSet.values().length > 0) ? 
            {
              error: [
                intl.formatMessage(
                  {id: 'validation-general.polygonParts.resolutionCollision'},
                  {numErrorParts: emphasizeByHTML(`${interPartsSet.values().length}`)}
              )]
            } : undefined,
        }
      );
    }
  }, [existingPolygonParts, ingestionResolutionMeter]);



  return (
    <VectorLayer>
      <VectorSource>
        {illegalParts.map((feat, idx) => {
            const illegalStyle = new Style({
              stroke: PPMapStyles.get(FeatureType.ILLEGAL_PP)?.getStroke(),
              fill: PPMapStyles.get(FeatureType.ILLEGAL_PP)?.getFill(),
            });

            return feat ? <GeoJSONFeature 
              geometry={{...feat.geometry}} 
              fit={false}
              featureStyle={illegalStyle}
            /> : <></>
          }
        )}
        {
          existingPolygonParts.map((feat, idx) => {
            const greenStyle = new Style({
              text: createTextStyle(feat, 4, FEATURE_LABEL_CONFIG.polygons, ZOOM_LEVELS_TABLE),
              stroke: PPMapStyles.get(FeatureType.EXISTING_PP)?.getStroke(),
              fill: PPMapStyles.get(FeatureType.EXISTING_PP)?.getFill(),
            });

            return feat ? <GeoJSONFeature 
              geometry={{...feat.geometry}} 
              fit={false}
              featureStyle={greenStyle}
            /> : <></>
          })
        }
      </VectorSource>
    </VectorLayer>
  );
})