/* eslint-disable @typescript-eslint/naming-convention */
import React, { CSSProperties, useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Feature, LineString, Polygon } from 'geojson';
import { useIntl } from 'react-intl';
import polygonToLine from '@turf/polygon-to-line';
import {
  CesiumColor,
  CesiumConstantProperty,
  CesiumEntity,
  CesiumGeojsonLayer,
  CesiumCartesian3,
  CesiumVerticalOrigin,
  CesiumMath,
} from '@map-colonies/react-components';
import { Typography, useTheme } from '@map-colonies/react-core';
import { useStore } from '../../models';
import { useForceEntitySelection } from '../../../common/hooks/useForceEntitySelection.hook';
import { CesiumInfoBoxContainer } from './cesium-infoBox-container';
import useStaticHTML from '../../../common/hooks/useStaticHtml';
import { IPosition, useHeightFromTerrain } from '../../../common/hooks/useHeightFromTerrain';
import GenericInfoBoxContainer from './generic-infoBox-container.component';
import _ from 'lodash';

const NONE_OR_FIRST_ELEM = 0;
const LONGITUDE_POSITION = 0;
const LATITUDE_POSITION = 1;

interface WfsFeatureProps {}

export const WfsFeature: React.FC<WfsFeatureProps> = observer(() => {
  const store = useStore();
  const themeObj = useTheme();
  const intl = useIntl();
  const theme = themeObj as Record<string, string>;

  const wfsFeature = store.mapMenusManagerStore.currentWfsFeatureInfo;

  const featureInfo =(wfsFeature?.features?.[NONE_OR_FIRST_ELEM] as Feature | undefined)?.properties ?? {};
  const wfsFeatureFound = !_.isEmpty(featureInfo);
  
  const {setCoordinates, newPositions} = useHeightFromTerrain();
  const positionCartographic = newPositions?.[NONE_OR_FIRST_ELEM];

  useEffect(() => {
    if(wfsFeature?.pointCoordinates) {
        const longitude = Number(wfsFeature.pointCoordinates[LONGITUDE_POSITION]);
        const latitude = Number(wfsFeature.pointCoordinates[LATITUDE_POSITION]);

        setCoordinates([{ longitude, latitude }]);
      }
  }, [wfsFeature?.pointCoordinates])

  
  const WfsFeatureGeometries: React.FC<{feature: Feature<LineString | Polygon>, isPolylined?: boolean}> =
 ({ feature, isPolylined = false }) => {
    const [featureWithHeight, setFeatureWithHeight] = useState<Feature<LineString | Polygon>>();
    const [transformedFeature, setTransformedFeature] = useState<Feature<LineString | Polygon>>();
    const { setCoordinates, newPositions } = useHeightFromTerrain();
    
    useEffect(() => {
      if (isPolylined && feature.geometry.type === 'Polygon') {
        /* Polyline features fixes cesium bug with polygon visualization, Also allows us to clamp it to ground (Using terrain). */
        setTransformedFeature(polygonToLine(feature.geometry) as Feature<LineString>);
      } else {
        setTransformedFeature(feature);
      }
    }, [feature])

    useEffect(() => {
      if(transformedFeature) {
        switch(transformedFeature.geometry.type) {
          case "LineString": {
            const posArr: IPosition[] = transformedFeature.geometry.coordinates.map(coord => ({ longitude: coord[0], latitude: coord[1] }));
            setCoordinates(posArr);
            break;
          }
  
          case "Polygon":{
            // NOTICE THE coordinates[0].
            const posArr: IPosition[] = transformedFeature.geometry.coordinates[0].map(coord => ({ longitude: coord[0], latitude: coord[1] }));
            setCoordinates(posArr);
            break;
          }
  
          default:
            break;
        }
      }
    }, [transformedFeature])

    useEffect(() => {
      if(newPositions && transformedFeature) {
        const newCoordinates = newPositions.map(cartographic => {
          return [CesiumMath.toDegrees(cartographic.longitude), CesiumMath.toDegrees(cartographic.latitude), cartographic.height]
        });

        setFeatureWithHeight({
          ...transformedFeature,
          // @ts-ignore
          geometry: {
            ...transformedFeature.geometry,
            coordinates: transformedFeature.geometry.type === 'LineString' ? newCoordinates : [newCoordinates]
          }
        })
      }
    }, [newPositions, transformedFeature])

    if(!featureWithHeight || !wfsFeature) return null;

    return <CesiumGeojsonLayer
              clampToGround={true}
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

  const WfsInfoBoxHtml: React.FC = () => {
    const noDataStyle: CSSProperties = {
      width: '100%',
      height: '5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    };

    const hasDataStyle: CSSProperties = {
      width: '100%',
      padding: '0.5rem',
      color: theme.textPrimaryOnDark,
      backgroundColor: theme.gcAlternativeSurface,
    };

    const style = useMemo(() => wfsFeatureFound ? hasDataStyle : noDataStyle, [wfsFeatureFound]);

    let content: JSX.Element = <></>;

    if (wfsFeatureFound) {
      content = (
          <table style={style}>
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
      );
    } else if(wfsFeature) {
      content = (
        <div style={style}>
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
      );
    } 

    return (
      <GenericInfoBoxContainer positionInRadians={positionCartographic}>
        {content}    
      </GenericInfoBoxContainer>
    )

  }

  const wfsInfoHtml = useStaticHTML<{
    children: React.ReactNode;
    theme: Record<string, string>;
  }>({
    FunctionalComp: CesiumInfoBoxContainer,
    props: {
      children: (
        <WfsInfoBoxHtml />
      ),
      theme: themeObj,
    },
  });

  const { entitySelected } = useForceEntitySelection([wfsInfoHtml]);
  
  if(!wfsFeature || !positionCartographic) return null;

  return (
    <>
      {
       <CesiumEntity
        name={intl.formatMessage({ id: wfsFeature.config.translationId ?? wfsFeature.typeName})}
        position={CesiumCartesian3.fromRadians(positionCartographic.longitude, positionCartographic.latitude, positionCartographic.height)}
        billboard={{
          verticalOrigin: CesiumVerticalOrigin.BOTTOM,
          scale: 0.3,
          image: `assets/img/${wfsFeature.config.markerIcon ? `${wfsFeature.config.markerIcon}.png` : 'map-marker.gif'}`,
        }}
        description={wfsInfoHtml}
        selected={entitySelected}
        />
      }

      {wfsFeature.features?.map((feature) => {
        if (wfsFeature.config.isVisualized === false) return null;

        const geoJsonFeature = feature as Feature;

        return (
         <WfsFeatureGeometries feature={geoJsonFeature as Feature<LineString | Polygon>} isPolylined={true} />
        );
      })}
    </>
  );
});
