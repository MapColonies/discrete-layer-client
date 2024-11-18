
import { useEffect, useState } from 'react';
import { BBox, Feature, GeoJsonProperties, Geometry } from 'geojson';
import { MapEvent } from 'ol';
import bboxPolygon from '@turf/bbox-polygon';
import { observer } from 'mobx-react';
import squareGrid from '@turf/square-grid';
import { GeoJSONFeature, useMap, VectorLayer, VectorSource } from '@map-colonies/react-components';
import { Style } from 'ol/style';
import { createTextStyle, FeatureType, FEATURE_LABEL_CONFIG, getWFSFeatureTypeName, PPMapStyles } from './pp-map.utils';
import { GetFeatureModelType, LayerRasterRecordModelType, useQuery, useStore } from '../../../models';
import { GeojsonFeatureInput } from '../../../models/RootStore.base';
import useZoomLevelsTable from '../../export-layer/hooks/useZoomLevelsTable';
import { ILayerImage } from '../../../models/layerImage';
import { useEnums } from '../../../../common/hooks/useEnum.hook';

interface PolygonPartsVectorLayerProps {
  layerRecord?: ILayerImage | null;
}

export const PolygonPartsVectorLayer: React.FC<PolygonPartsVectorLayerProps> = observer(({layerRecord}) => {
  const store = useStore();
  const mapOl = useMap();

  const [existingPolygoParts, setExistingPolygoParts] = useState<Feature[]>([]);
  const { data, loading, setQuery } = useQuery<{ getPolygonPartsFeature: GetFeatureModelType}>();
  const ZOOM_LEVELS_TABLE = useZoomLevelsTable();
  const ENUMS = useEnums();
  
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
  }, [data, loading]);

  const getExistingPolygoParts = (bbox: BBox) => {
    // const fakePP = squareGrid(bbox, 10, {units: 'miles'});
    // console.log(fakePP);
    // setExistingPolygoParts(fakePP.features);

    setQuery(store.queryGetPolygonPartsFeature({ 
      data: {
        feature:  bboxPolygon(mapOl.getView().calculateExtent() as BBox) as GeojsonFeatureInput,
        typeName: getWFSFeatureTypeName(layerRecord as LayerRasterRecordModelType, ENUMS),
        count: 100 
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