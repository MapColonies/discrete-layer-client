import React, { useMemo, useRef } from 'react';
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
import { useTheme } from '@map-colonies/react-core';
import { CesiumInfoBoxContainer } from './cesium-infoBox-container';
import useStaticHTML from '../../../common/hooks/useStaticHtml';

const NONE_OR_FIRST_ELEM = 0;
interface WfsFeatureProps {}

export const WfsFeature: React.FC<WfsFeatureProps> = () => {
  const store = useStore();
  const themeObj = useTheme();
  const theme = themeObj as Record<string, string>;

  const wfsFeature = store.mapMenusManagerStore.currentWfsFeatureInfo;

  const basicCesiumInfoBoxStyle = `body {
    background-color: ${theme.surface};
  }
  `;
  
  const featureInfo = (wfsFeature?.features?.[NONE_OR_FIRST_ELEM] as Feature | undefined)?.properties ?? {};
  const longitude = Number(wfsFeature?.pointCoordinates[0]);
  const latitude = Number(wfsFeature?.pointCoordinates[1]);

  const memoizedFeatureInfo = useMemo(() => {
    if(!wfsFeature) return '';
    
    return `
    <style>
      ${basicCesiumInfoBoxStyle}
      .featureInfoTable {
        width: 100%;
        height: 100px;
        padding: 0.5rem;
        color: ${theme.textPrimaryOnDark} !important;
      }
    
      .featureInfoTable td,
      .featureInfoTable tr {
          text-align: left;
          padding: 0.2rem 0;
      }
    </style>
    <table class='featureInfoTable'>
      <tr>
        <th>Property</th>
        <th>Value</th>
      </tr>

    ${Object.entries(featureInfo as Record<string, unknown>)
      .map(([key, val]) => {
        return `
          <tr>
            <td>${key}</td>
            <td>${val as string}</td>
          </tr>
        `;
      })
      .join('')}
    `; 
  }, [wfsFeature])

  const wfsInfoHtml = useStaticHTML<{children: React.ReactNode}>({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    FunctionalComp: CesiumInfoBoxContainer,
    props: {
      children: <>
        <h4 className='coordinates'>${getCoordinatesDisplayText(latitude, longitude)}</h4>
        <table className='featureInfoTable'>
        <tr>
          <th>Property</th>
          <th>Value</th>
        </tr>
        ${Object.entries(featureInfo as Record<string, unknown>)
          .map(([key, val]) => {
          return <tr>
              <td>${key}</td>
              <td>${val as string}</td>
            </tr>
         })}
        </table>
      </>
    }
  })

  console.log(wfsInfoHtml)
  
  const { entitySelected } = useForceEntitySelection([memoizedFeatureInfo]);

  if(!wfsFeature) return null;


  const NoEntityData: React.FC = () => {
    return (
      <CesiumEntity
        name={`${getCoordinatesDisplayText(latitude, longitude)} - ${ wfsFeature.typeName }`}
        position={CesiumCartesian3.fromDegrees(longitude, latitude)}
        billboard={{
          verticalOrigin: CesiumVerticalOrigin.BOTTOM,
          scale: 0.7,
          image: 'assets/img/map-marker.gif',
        }}
        description={`
        <style> 
          ${basicCesiumInfoBoxStyle}
          .errorContainer {
            width: 100%;
            height: 5rem;
            position: relative;
          }
          .dataNotFoundError {
            position: absolute;
            color: ${theme.textPrimaryOnDark};
            top: 0;
            left: 50%;
            transform: translateX(-50%);
          }
          .coordinates {
            padding: 0.5rem;
          }
        </style>
        <h4 class='coordinates'>${getCoordinatesDisplayText(latitude, longitude)}</h4>
          <div class='errorContainer'> 
            <h3 class='dataNotFoundError'>No data to display.</h3>
          </div>
        `}
        selected={entitySelected}
      />
    );
  };

  if(wfsFeature.features?.length === NONE_OR_FIRST_ELEM) return <NoEntityData />;

  return (
    <>
    {
      <CesiumEntity
         name={`${ wfsFeature.typeName }`}
         position={CesiumCartesian3.fromDegrees(longitude, latitude)}
         billboard={{
           verticalOrigin: CesiumVerticalOrigin.BOTTOM,
           scale: 0.7,
           image: 'assets/img/map-marker.gif',
         }}
         description={wfsInfoHtml}
         selected={entitySelected}
       />
    }

      {wfsFeature.features?.map((feature) => {
        console.log(feature);
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
