
import { useEffect, useState } from 'react';
import { Feature, GeoJsonProperties, Geometry, LineString, MultiLineString, Polygon } from 'geojson';
import { observer } from 'mobx-react';
import lineStringToPolygon from '@turf/linestring-to-polygon';
import intersect from '@turf/intersect';
import bbox from '@turf/bbox';
import bboxPolygon from '@turf/bbox-polygon';
import { GeoJSONFeature, useMap, VectorLayer, VectorSource } from '@map-colonies/react-components';
import { Style } from 'ol/style';
import { createTextStyle, FeatureType, FEATURE_LABEL_CONFIG, getTypeName, PPMapStyles } from './pp-map.utils';
import { GetFeatureModelType, LayerRasterRecordModelType, useQuery, useStore } from '../../../models';
import { GeojsonFeatureInput } from '../../../models/RootStore.base';
import useZoomLevelsTable from '../../export-layer/hooks/useZoomLevelsTable';
import { ILayerImage } from '../../../models/layerImage';
import { SetWithContentEquality } from '../../../../common/helpers/set';
import { UserAction } from '../../../models/userStore';
import { IDispatchAction } from '../../../models/actionDispatcherStore';
import { useIntl } from 'react-intl';
import { emphasizeByHTML } from '../../../../common/helpers/formatters';

interface PolygonPartsVectorLayerProps {
  layerRecord?: ILayerImage | null;
  maskFeature?: Feature | null;
  partsToCheck?: Feature[];
  ingestionResolutionMeter?: number | null;
}

export const PolygonPartsByPolygonVectorLayer: React.FC<PolygonPartsVectorLayerProps> = observer(({layerRecord, maskFeature, partsToCheck, ingestionResolutionMeter}) => {
  const store = useStore();
  const intl = useIntl();
  const mapOl = useMap();

  const [existingPolygoParts, setExistingPolygoParts] = useState<Feature[]>([]);
  const [illegalParts, setIllegalParts] = useState<Feature[]>([]);
  const { data, loading, setQuery } = useQuery<{ getPolygonPartsFeature: GetFeatureModelType}>();
  const ZOOM_LEVELS_TABLE = useZoomLevelsTable();

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
  
  const getExistingPolygoParts = (feature: Feature | null | undefined) => {
    setQuery(store.queryGetPolygonPartsFeature({ 
      data: {
        feature:  feature as GeojsonFeatureInput,
        typeName: getTypeName(layerRecord as LayerRasterRecordModelType),
        count: 100 
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
      if(maskFeature){
        mapOl.getTargetElement().classList.add('olSpinner');
        store.discreteLayersStore.setPPCollisionCheckInProgress(true);
        getExistingPolygoParts(convertFeatureToPolygon(maskFeature));  
    }
  },[maskFeature]);
  
  useEffect(() => {
    if (!loading && data) {
      setExistingPolygoParts(data.getPolygonPartsFeature.features as Feature<Geometry, GeoJsonProperties>[]);
      mapOl.getTargetElement().classList.remove('olSpinner');
      store.discreteLayersStore.setPPCollisionCheckInProgress(false);
    } 
  }, [data, loading]);

  useEffect(() => {
    const interPartsSet = new SetWithContentEquality<Feature>(part => part.properties?.key);  
    if(ingestionResolutionMeter){
      partsToCheck?.forEach((part) => {
        existingPolygoParts?.forEach((eixstingPart) => {
          const intersection = intersect(
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
  }, [existingPolygoParts, ingestionResolutionMeter]);



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
        {existingPolygoParts.map((feat, idx) => {
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
          }
        )}
      </VectorSource>
    </VectorLayer>
  );
})