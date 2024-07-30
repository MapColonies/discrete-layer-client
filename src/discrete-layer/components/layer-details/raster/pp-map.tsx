import { CSSProperties, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { Box, GeoJSONFeature, getWMTSOptions, getXYZOptions, Legend, LegendItem, Map, TileLayer, TileOsm, TileWMTS, TileXYZ, VectorLayer, VectorSource } from '@map-colonies/react-components';
import { Feature, Geometry } from 'geojson';
import { get, isEmpty } from 'lodash';
import { Vector } from 'ol/layer';
import { FitOptions } from 'ol/View';
import { Style, Stroke, Fill } from 'ol/style';
import { validateGeoJSONString } from '../../../../common/utils/geojson.validation';
import { Mode } from '../../../../common/models/mode.enum';
import { MapLoadingIndicator } from '../../../../common/components/map/ol-map.loader';
import { useStore } from '../../../models/RootStore';
import { PolygonPartsVectorLayer } from './pp-vector-layer';
import { PPMapStyles } from './pp-map.utils';
import { ILayerImage } from '../../../models/layerImage';

interface GeoFeaturesPresentorProps {
  mode: Mode;
  geoFeatures?: Feature[];
  style?: CSSProperties | undefined,
  fitOptions?: FitOptions | undefined,
  selectedFeatureKey?: string;
  selectionStyle?: Style;
  showExisitngPolygonParts?: boolean;
  layerRecord?: ILayerImage | null;
}

const  DEFAULT_PROJECTION = 'EPSG:4326';

export const GeoFeaturesPresentorComponent: React.FC<GeoFeaturesPresentorProps> = ({
  mode,
  geoFeatures,
  style,
  fitOptions,
  selectedFeatureKey,
  selectionStyle,
  showExisitngPolygonParts,
  layerRecord
}) => {
  // const [geoJsonValue, setGeoJsonValue] = useState();
  const store = useStore();
  const intl = useIntl();
  // useEffect(() => {
  //   if(jsonValue && validateGeoJSONString(jsonValue).valid){
  //     //Postpone feature generation till OL-viewer present in DOM
  //     setTimeout(()=>{
  //       setGeoJsonValue(JSON.parse(jsonValue as string))
  //     }, [Mode.VIEW, Mode.EDIT].includes(mode) ? 300 : 0);
  //   } else {
  //     setGeoJsonValue(undefined);
  //   }

  // }, [mode,jsonValue]);
  
  const previewBaseMap = useMemo(() => {
    const olBaseMap = new Array();
    let baseMap = store.discreteLayersStore.baseMaps?.maps.find((map) => map.isForPreview);
    if(!baseMap){
      baseMap = store.discreteLayersStore.baseMaps?.maps.find((map) => map.isCurrent);
    }
    if(baseMap){
      baseMap.baseRasteLayers.forEach((layer) => {
        if(layer.type === 'WMTS_LAYER'){
          const wmtsOptions = getWMTSOptions({
            url: layer.options.url as string,
            layer: '',
            matrixSet: get(layer.options, 'tileMatrixSetID') as string,
            format: get(layer.options, 'format'),
            projection: DEFAULT_PROJECTION, // Should be taken from map-server capabilities (MAPCO-3780)
            style: get(layer.options, 'style'),
          });
          olBaseMap.push(
            <TileLayer key={layer.id} options={{ opacity: layer.opacity }}>
              <TileWMTS options={wmtsOptions} />
            </TileLayer>
          )
        }
        if(layer.type === 'XYZ_LAYER'){
          const xyzOptions = getXYZOptions({
            url: layer.options.url as string,
          });
          olBaseMap.push(
            <TileLayer key={layer.id} options={{ opacity: layer.opacity }}>
              <TileXYZ options={xyzOptions} />
            </TileLayer>
          )
        }
      })
    }
    return olBaseMap;
  }, []);
  

  const LegendsArray = useMemo(() => {
    const res:LegendItem[] = [];
    PPMapStyles.forEach((value, key)=>{
      res.push({
        title: intl.formatMessage({id: `polygon-parts.map-preview-legend.${key}`}) as string,
        style: value as Style
      })
    });
    return res;
  },[]);

  
  return (
    <Box style={{...style}}>
      <Map>
        <MapLoadingIndicator/>
        {previewBaseMap}
        {
          showExisitngPolygonParts && <PolygonPartsVectorLayer layerRecord={layerRecord}/>
        }
        <VectorLayer>
          <VectorSource>
            {geoFeatures?.map((feat, idx) => {
                let featureStyle = PPMapStyles.get(feat?.properties?.featureType);

                if( selectedFeatureKey && feat?.properties?.key === selectedFeatureKey){
                  featureStyle = selectionStyle;
                }

                return (feat && !isEmpty(feat.geometry))? <GeoJSONFeature 
                  geometry={{...feat.geometry}} 
                  fitOptions={{...fitOptions}}
                  fit={idx === 0}
                  featureStyle={featureStyle}
                /> : <></>
              }
            )}
          </VectorSource>
        </VectorLayer>
        <Legend legendItems={LegendsArray} title={intl.formatMessage({id: 'polygon-parts.map-preview-legend.title'})}/>
      </Map>
    </Box>
    )}