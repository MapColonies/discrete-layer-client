/* eslint-disable @typescript-eslint/naming-convention */
import React, { useEffect, useState } from 'react';
import {
  CesiumColor,
  CesiumConstantProperty,
  CesiumEntity,
  CesiumGeojsonLayer,
  CesiumCartesian3,
  CesiumVerticalOrigin,
  CesiumCartographic,
  useCesiumMap,
  cesiumSampleTerrainMostDetailed,
  CesiumMath,
} from '@map-colonies/react-components';
import { useStore } from '../../models';
import { Feature, LineString, Polygon } from 'geojson';
import { getCoordinatesDisplayText } from '../layer-details/utils';
import { useForceEntitySelection } from '../../../common/hooks/useForceEntitySelection.hook';
import { Typography, useTheme } from '@map-colonies/react-core';
import { CesiumInfoBoxContainer } from './cesium-infoBox-container';
import useStaticHTML from '../../../common/hooks/useStaticHtml';
import { useIntl } from 'react-intl';
import CreateSvgIconLocationOn from '@material-ui/icons/LocationOn';
import { IPosition, useHeightFromTerrain } from '../../../common/hooks/useHeightFromTerrain';

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
  const {setCoordinates, newPositions} = useHeightFromTerrain();

  useEffect(() => {
    if(wfsFeature?.pointCoordinates) {
        const longitude = Number(wfsFeature.pointCoordinates[LONGITUDE_POSITION]);
        const latitude = Number(wfsFeature.pointCoordinates[LATITUDE_POSITION]);

        console.log("POINT",longitude, latitude)
        setCoordinates([{ longitude, latitude }]);
      }
  }, [wfsFeature?.pointCoordinates])

  
  const WfsFeatureGeometries: React.FC<{feature: Feature}> = ({ feature }) => {
    const mapViewer = useCesiumMap();
    const [featureWithHeight, setFeatureWithHeight] = useState<Feature<LineString | Polygon>>();
    
    useEffect(() => {

          if(feature.geometry.type === 'LineString') {
            const cartographicArr = feature.geometry.coordinates.map(coord => CesiumCartographic.fromCartesian(CesiumCartesian3.fromDegrees(coord[0], coord[1])));

            void cesiumSampleTerrainMostDetailed(
              mapViewer.terrainProvider,
              cartographicArr
            ).then(val => {
              setFeatureWithHeight({
                ...feature,
                geometry: {
                  ...feature.geometry,
                  type: 'LineString',
                  coordinates: val.map(cartographic => {
                    return [CesiumMath.toDegrees(cartographic.longitude), CesiumMath.toDegrees(cartographic.latitude), cartographic.height]
                  })
                }
              })
            })
          }

          if(feature.geometry.type === 'Polygon') {
            // NOTICE THE coordinates[0].
            const cartographicArr = feature.geometry.coordinates[0].map(coord => CesiumCartographic.fromCartesian(CesiumCartesian3.fromDegrees(coord[0], coord[1])));
            
            void cesiumSampleTerrainMostDetailed(
              mapViewer.terrainProvider,
              cartographicArr
            ).then(val => {
              setFeatureWithHeight({
                ...feature,
                geometry: {
                  ...feature.geometry,
                  type: 'Polygon',
                  coordinates: [val.map(cartographic => {
                    return [CesiumMath.toDegrees(cartographic.longitude), CesiumMath.toDegrees(cartographic.latitude), cartographic.height]
                  })]
                }
              })
            })
          }
    }, [feature])

    if(!featureWithHeight || !wfsFeature) return null;

    return <CesiumGeojsonLayer
        key={featureWithHeight.id}
        data={featureWithHeight.geometry}
        onLoad={(geoJsonDataSource): void => {
          const featureFillColor = wfsFeature.config.color;
          const featureOutlineColor = wfsFeature.config.outlineColor;
          const lineWidth = wfsFeature.config.outlineWidth;
          const outlineWidth = wfsFeature.config.outlineWidth;

          geoJsonDataSource.entities.values.forEach((item) => {
            if (item.polyline) {
              // @ts-ignore
              item.polyline.material = CesiumColor.fromCssColorString(featureFillColor);
              (item.polyline.width as CesiumConstantProperty).setValue(lineWidth);
              (item.polyline.clampToGround as CesiumConstantProperty).setValue(true);
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
  }
  
  const WfsFeatureInfoContainer: React.FC<{ position?: IPosition }> = ({ position, children }) => {    
    if(!position) return null;

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
          {getCoordinatesDisplayText(CesiumMath.toDegrees(position.latitude), CesiumMath.toDegrees(position.longitude))}
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
        <WfsFeatureInfoContainer position={newPositions?.[NONE_OR_FIRST_ELEM]}>
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
        wfsFeature && <WfsFeatureInfoContainer position={newPositions?.[NONE_OR_FIRST_ELEM]}>
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
              dir={intl.locale === 'he' ? 'rtl' : 'ltr'}
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
  
  if(!wfsFeature || !newPositions) return null;
  
  const position = newPositions[0];

  if (wfsFeature.features?.length === NONE_OR_FIRST_ELEM)

    return (
      <CesiumEntity
        name={intl.formatMessage({ id: wfsFeature.config.translationId ?? wfsFeature.typeName})}
        position={CesiumCartesian3.fromRadians(position.longitude, position.latitude, position.height)}
        billboard={{
          verticalOrigin: CesiumVerticalOrigin.BOTTOM,
          scale: 0.7,
          image: 'assets/img/map-marker.gif',
          heightReference: 1
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
          position={CesiumCartesian3.fromRadians(position.longitude, position.latitude, position.height)}
          billboard={{
            verticalOrigin: CesiumVerticalOrigin.BOTTOM,
            scale: 0.7,
            image: 'assets/img/map-marker.gif',
            heightReference: 1
          }}
          description={wfsInfoHtml}
          selected={entitySelected}
        />
      }

      {wfsFeature.features?.map((feature) => {
        if (wfsFeature.config.isVisualized === false) return null;

        const geoJsonFeature = feature as Feature;

        return (
         <WfsFeatureGeometries feature={geoJsonFeature} />
        );
      })}
    </>
  );
};
