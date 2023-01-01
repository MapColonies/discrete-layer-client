/* eslint-disable @typescript-eslint/naming-convention */
import React from 'react';
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
import { Typography, useTheme } from '@map-colonies/react-core';
import { CesiumInfoBoxContainer } from './cesium-infoBox-container';
import useStaticHTML from '../../../common/hooks/useStaticHtml';
import { useIntl } from 'react-intl';
import CreateSvgIconLocationOn from '@material-ui/icons/LocationOn';

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
           margin: '0',
           marginBottom: '10px',
           color: theme.textPrimaryOnDark,
           display: 'flex',
           alignItems: 'center',
           justifyContent: 'center',
           fontSize: '1rem' 
        }}>
            <CreateSvgIconLocationOn className="glow-missing-icon" style={{stroke: 'currentColor', fill: 'currentColor', transform: 'scale(0.5)'}} height="48" width="48" />
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
