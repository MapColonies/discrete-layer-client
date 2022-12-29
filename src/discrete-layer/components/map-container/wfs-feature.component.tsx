import React, { useMemo, useRef } from 'react';
import {
  CesiumColor,
  CesiumConstantProperty,
  CesiumEntity,
  CesiumGeojsonLayer,
  CesiumCartesian3,
  CesiumVerticalOrigin,
} from '@map-colonies/react-components';
import { useStore } from '../../models';
import { Feature } from 'geojson';
import { getCoordinatesDisplayText } from '../layer-details/utils';
import { useForceEntitySelection } from '../../../common/hooks/useForceEntitySelection.hook';
import { Icon, Typography, useTheme } from '@map-colonies/react-core';
import { CesiumInfoBoxContainer } from './cesium-infoBox-container';
import useStaticHTML from '../../../common/hooks/useStaticHtml';
import { useIntl } from 'react-intl';

const NONE_OR_FIRST_ELEM = 0;
const LONGITUDE_POSITION = 0;
const LATITUDE_POSITION = 1;

interface WfsFeatureProps {}

export const WfsFeature: React.FC<WfsFeatureProps> = () => {
  const store = useStore();
  const themeObj = useTheme();
  const intl = useIntl();
  const theme = themeObj as Record<string, string>;

  const wfsFeature = store.mapMenusManagerStore.currentWfsFeatureInfo;

  const featureInfo =(wfsFeature?.features?.[NONE_OR_FIRST_ELEM] as Feature | undefined)?.properties ?? {};

  const longitude = Number(wfsFeature?.pointCoordinates[LONGITUDE_POSITION]);
  const latitude = Number(wfsFeature?.pointCoordinates[LATITUDE_POSITION]);

  
  const WfsFeatureInfoContainer: React.FC<{lat: number, long: number}> = ({ lat, long, children }) => {
    return (
      <> 
        <Typography tag="h4" style={{ 
           padding: '0.5rem',
           color: theme.textPrimaryOnDark,
           display: 'flex',
           alignItems: 'center',
           justifyContent: 'center',
           fontSize: '1.1rem' 
        }}>
          <svg style={{stroke: 'currentColor', fill: 'currentColor', transform: 'scale(0.5)'}}xmlns="http://www.w3.org/2000/svg" height="48" width="48"><path d="M24 23.5q1.45 0 2.475-1.025Q27.5 21.45 27.5 20q0-1.45-1.025-2.475Q25.45 16.5 24 16.5q-1.45 0-2.475 1.025Q20.5 18.55 20.5 20q0 1.45 1.025 2.475Q22.55 23.5 24 23.5Zm0 16.55q6.65-6.05 9.825-10.975Q37 24.15 37 20.4q0-5.9-3.775-9.65T24 7q-5.45 0-9.225 3.75Q11 14.5 11 20.4q0 3.75 3.25 8.675Q17.5 34 24 40.05ZM24 44q-8.05-6.85-12.025-12.725Q8 25.4 8 20.4q0-7.5 4.825-11.95Q17.65 4 24 4q6.35 0 11.175 4.45Q40 12.9 40 20.4q0 5-3.975 10.875T24 44Zm0-23.6Z"/></svg>
          {getCoordinatesDisplayText(lat, long)}
        </Typography>
        {children}
      </>
    );
  }

  const wfsInfoHtml = useStaticHTML<{
    children: React.ReactNode;
    theme: Record<string, string>;
  }>({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    FunctionalComp: CesiumInfoBoxContainer,
    props: {
      children: (
        <WfsFeatureInfoContainer lat={latitude} long={longitude}>
          <table style={{
              width: '100%',
              padding: '0.5rem',
              color: theme.textPrimaryOnDark,
              backgroundColor: theme.gcAlternativeSurface,
            }}>
              <thead>
                <tr style={{textAlign: 'left'}}>
                  <th>Property</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(featureInfo as Record<string, unknown>).map(
                  ([key, val]) => {
                    return (
                      <tr key={key}>
                        <td>{key}</td>
                        <td>{`${val as string}`}</td>
                      </tr>
                    );
                  }
                )}
              </tbody>
          </table>
        </WfsFeatureInfoContainer>
      ),
      theme: themeObj,
    },
  });

  const { entitySelected } = useForceEntitySelection([wfsInfoHtml]);

  const noEntityDataHtml = useStaticHTML<{
    children: React.ReactNode;
    theme: Record<string, string>;
  }>({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    FunctionalComp: CesiumInfoBoxContainer,
    props: {
      children: (
        wfsFeature && <WfsFeatureInfoContainer lat={latitude} long={longitude}>
          <div
            style={{
              width: '100%',
              height: '5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Typography tag='h3'
              style={{
                color: theme.textPrimaryOnDark,
              }}
            >
              {
              intl.formatMessage({ id: 'wfs-info.no-data.message' })
              .replace("{feature}", intl.formatMessage({ id: wfsFeature.config.translationId ?? wfsFeature.typeName}))
              }
            </Typography>
          </div>
        </WfsFeatureInfoContainer>
      ),
      theme: themeObj,
    },
  });

  if(!wfsFeature) return null;

  if (wfsFeature.features?.length === NONE_OR_FIRST_ELEM)
    return (
      <CesiumEntity
        name={intl.formatMessage({ id: wfsFeature.config.translationId ?? wfsFeature.typeName})}
        position={CesiumCartesian3.fromDegrees(longitude, latitude)}
        billboard={{
          verticalOrigin: CesiumVerticalOrigin.BOTTOM,
          scale: 0.7,
          image: 'assets/img/map-marker.gif',
        }}
        description={noEntityDataHtml}
        selected={entitySelected}
      />
    );

  return (
    <>
      {
        <CesiumEntity
          name={intl.formatMessage({ id: wfsFeature.config.translationId ?? wfsFeature.typeName})}
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
                  (item.polygon.outlineWidth as CesiumConstantProperty).setValue(outlineWidth); 

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
