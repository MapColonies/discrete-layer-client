import { CSSProperties, useEffect, useMemo, useState } from 'react';
import { Box, GeoJSONFeature, getWMTSOptions, getXYZOptions, Map, TileLayer, TileOsm, TileWMTS, TileXYZ, VectorLayer, VectorSource } from '@map-colonies/react-components';
import { Feature, Geometry } from 'geojson';
import { FitOptions } from 'ol/View';
import { validateGeoJSONString } from '../../../../common/utils/geojson.validation';
import { Mode } from '../../../../common/models/mode.enum';
import { useStore } from '../../../models/RootStore';
import { get, isEmpty } from 'lodash';
import { Style, Stroke, Fill } from 'ol/style';
import { PolygonPartsVectorLayer } from './pp-vector-layer';

interface GeoFeaturesPresentorProps {
  mode: Mode;
  geoFeatures?: Feature[];
  style?: CSSProperties | undefined,
  fitOptions?: FitOptions | undefined,
  selectedFeatureKey?: string;
  selectionStyle?: Style;
  showExisitngPolygonParts?: boolean;
}

const  DEFAULT_PROJECTION = 'EPSG:4326';

export const GeoFeaturesPresentorComponent: React.FC<GeoFeaturesPresentorProps> = ({
  mode,
  geoFeatures,
  style,
  fitOptions,
  selectedFeatureKey,
  selectionStyle,
  showExisitngPolygonParts
}) => {
  // const [geoJsonValue, setGeoJsonValue] = useState();
  const store = useStore();
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

  return (
    <Box style={{...style}}>
      <Map>
        {previewBaseMap}
        {
          showExisitngPolygonParts && <PolygonPartsVectorLayer/>
        }
        <VectorLayer>
          <VectorSource>
            {geoFeatures?.map((feat, idx) => {
                let featureStyle: Style | undefined;
                if(idx === 0){
                  featureStyle  = new Style({
                    stroke: new Stroke({
                      width: 4,
                      color: "#000000"
                    }),
                  });
                }
                else {
                  const redStyle = new Style({
                    stroke: new Stroke({
                      width: 2,
                      color: "#ff0000"
                    }),
                    fill: new Fill({
                      color: "#aa2727"
                    })
                  });
                  

                  if( feat.properties?.key === selectedFeatureKey){
                    featureStyle = selectionStyle;
                  }
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
      </Map>
    </Box>
    )}