
import { useEffect, useState } from 'react';
import { BBox, Feature, GeoJsonProperties, Geometry } from 'geojson';
import { MapEvent } from 'ol';
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

export const PolygonPartsVectorLayer: React.FC<PolygonPartsVectorLayerProps> = observer(({layerRecord}) => {
  const store = useStore();
  const mapOl = useMap();
  const intl = useIntl();

  const [existingPolygoParts, setExistingPolygoParts] = useState<Feature[]>([]);
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
      getExistingPolygoParts(mapOl.getView().calculateExtent() as BBox);
      
      console.log(mapOl.getView().calculateExtent(), bboxPolygon(mapOl.getView().calculateExtent() as BBox))
    };

    mapOl.on('moveend', handleMoveEndEvent);

    getExistingPolygoParts(mapOl.getView().calculateExtent() as BBox);
    
    return (): void => {
      try {
        mapOl.un('moveend', handleMoveEndEvent);
      } catch (e) {
        console.log('OL "moveEnd" remove listener failed', e);
      }
    };
  },[]);
  
  useEffect(() => {
    if (!loading && data) {
      setExistingPolygoParts(data.getPolygonPartsFeature.features as Feature<Geometry, GeoJsonProperties>[]);
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

  const getExistingPolygoParts = (bbox: BBox) => {
    // const fakePP = squareGrid(bbox, 10, {units: 'miles'});
    // console.log(fakePP);
    // setExistingPolygoParts(fakePP.features);

    setQuery(store.queryGetPolygonPartsFeature({ 
      data: {
        feature:  bboxPolygon(mapOl.getView().calculateExtent() as BBox) as GeojsonFeatureInput,
        typeName: getWFSFeatureTypeName(layerRecord as LayerRasterRecordModelType, ENUMS),
        count: CONFIG.POLYGON_PARTS.MAX.WFS_FEATURES
      } 
    }));
  };

    
  return (
    <VectorLayer>
      <VectorSource>
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