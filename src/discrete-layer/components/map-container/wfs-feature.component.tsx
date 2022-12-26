import React, { useMemo } from 'react';
import {
  CesiumColor,
  CesiumConstantProperty,
  CesiumEntity,
  CesiumGeojsonLayer,
  CesiumCartesian3,
  CesiumVerticalOrigin
} from '@map-colonies/react-components';
import { useStore } from '../../models';
import { Feature } from 'geojson';
import { getCoordinatesDisplayText } from '../layer-details/utils';
import { useForceEntitySelection } from '../../../common/hooks/useForceEntitySelection.hook';

const NONE_OR_FIRST_ELEM = 0;
interface WfsFeatureProps {}

export const WfsFeature: React.FC<WfsFeatureProps> = () => {
  const store = useStore();
  
  
  const wfsFeature = store.mapMenusManagerStore.currentWfsFeatureInfo;
  
  const memoizedFeatureInfo = useMemo(() => {
    if(!wfsFeature) return '';
    const featureInfo = (wfsFeature.features?.[NONE_OR_FIRST_ELEM] as Feature | undefined)?.properties ?? {};
    
    return `${
      Object.entries(featureInfo as Record<string, unknown>).map(([key, val]) => {
        return `${key}: ${val as string}`
      }).join('</br>')
    }` 
  }, [wfsFeature])
  
  const { entitySelected } = useForceEntitySelection([memoizedFeatureInfo]);

  if(!wfsFeature || wfsFeature.features?.length === NONE_OR_FIRST_ELEM) return null;

  const longitude = Number(wfsFeature.pointCoordinates[0]);
  const latitude = Number(wfsFeature.pointCoordinates[1]);

  return (
    <>
    {
      <CesiumEntity
         name={`${getCoordinatesDisplayText(latitude, longitude)}`}
         position={CesiumCartesian3.fromDegrees(longitude, latitude)}
         billboard={{
           verticalOrigin: CesiumVerticalOrigin.BOTTOM,
           scale: 0.7,
           image: 'assets/img/map-marker.gif',
         }}
         description={`
            ${memoizedFeatureInfo}
         `}
         selected={entitySelected}
       />
    }

      {wfsFeature.features?.map((feature) => {
        if (wfsFeature.config.isVisualized === false) return null;

        const geoJsonFeature = feature as Feature;

        return (
          <CesiumGeojsonLayer
            key={geoJsonFeature.id}
            data={geoJsonFeature.geometry}
            onLoad={(geoJsonDataSource): void => {
              const featureFillColor = wfsFeature.config.color;
              const featureOutlineColor = wfsFeature.config.outlineColor;
              const lineWidth = 5;
              const outlineWidth = 4;

              geoJsonDataSource.entities.values.forEach((item) => {
                if (item.polyline) {
                  // @ts-ignore
                  item.polyline.material = CesiumColor.fromCssColorString(featureFillColor);
                  (item.polyline.width as CesiumConstantProperty).setValue(lineWidth);
                }

                if (item.polygon) {
                  // @ts-ignore
                  (item.polygon.outlineColor as CesiumConstantProperty).setValue(CesiumColor.fromCssColorString(featureOutlineColor));
                  (item.polygon.outlineWidth  as CesiumConstantProperty).setValue(outlineWidth)

                  // @ts-ignore
                  item.polygon.material = CesiumColor.fromCssColorString(featureFillColor);
                }
              });
            }}
          />
        );
      })}
    </>
  );
};
