/* eslint-disable @typescript-eslint/naming-convention */
import React, { CSSProperties, useEffect, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { Feature, LineString, Polygon } from 'geojson';
import { useIntl } from 'react-intl';
import {
  CesiumEntity,
  CesiumCartesian3,
  CesiumVerticalOrigin,
} from '@map-colonies/react-components';
import { Typography, useTheme } from '@map-colonies/react-core';
import { useStore } from '../../models';
import { useForceEntitySelection } from '../../../common/hooks/useForceEntitySelection.hook';
import { CesiumInfoBoxContainer } from './cesium-infoBox-container';
import useStaticHTML from '../../../common/hooks/useStaticHtml';
import { useHeightFromTerrain } from '../../../common/hooks/useHeightFromTerrain';
import GenericInfoBoxContainer from './generic-infoBox-container.component';
import _ from 'lodash';
import { GeojsonFeature } from './geojson-feature.component';
import CONFIG from '../../../common/config';
import { IFeatureConfig } from "../../views/components/data-fetchers/wfs-features-fetcher.component";

const NONE_OR_FIRST_ELEM = 0;
const LONGITUDE_POSITION = 0;
const LATITUDE_POSITION = 1;

export const PolygonPartsFeature: React.FC = observer(() => {
  const store = useStore();
  const themeObj = useTheme();
  const intl = useIntl();
  const theme = themeObj as Record<string, string>;

  const polygonPartsFeature = store.mapMenusManagerStore.currentPolygonPartsInfo;

  const featureInfo =(polygonPartsFeature?.features?.[NONE_OR_FIRST_ELEM] as Feature | undefined)?.properties ?? {};
  const polygonPartsFeatureFound = !_.isEmpty(featureInfo);
  
  const {setCoordinates, newPositions} = useHeightFromTerrain();
  const positionCartographic = newPositions?.[NONE_OR_FIRST_ELEM];

  useEffect(() => {
    if(polygonPartsFeature?.pointCoordinates) {
        const longitude = Number(polygonPartsFeature.pointCoordinates[LONGITUDE_POSITION]);
        const latitude = Number(polygonPartsFeature.pointCoordinates[LATITUDE_POSITION]);

        setCoordinates([{ longitude, latitude }]);
      }
  }, [polygonPartsFeature?.pointCoordinates])

  const PolygonPartsInfoBoxHtml: React.FC = () => {
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

    const style = useMemo(() => polygonPartsFeatureFound ? hasDataStyle : noDataStyle, [polygonPartsFeatureFound]);

    let content: JSX.Element = <></>;

    if (polygonPartsFeatureFound) {
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
    } else if(polygonPartsFeature) {
      content = (
        <div style={style}>
          <Typography tag='h3'
              style={{
                color: theme.textPrimaryOnDark,
              }}
              dir={intl.locale === 'he' ? 'rtl' : 'ltr'}
            >
              {
                intl.formatMessage({ id: 'polygonParts-info.no-data.message' })
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

  const polygonPartsInfoHtml = useStaticHTML<{
    children: React.ReactNode;
    theme: Record<string, string>;
  }>({
    FunctionalComp: CesiumInfoBoxContainer,
    props: {
      children: (
        <PolygonPartsInfoBoxHtml />
      ),
      theme: themeObj,
    },
  });

  const { entitySelected } = useForceEntitySelection([polygonPartsInfoHtml]);
  
  if(!polygonPartsFeature || !positionCartographic) return null;

  return (
    <>
      {
       <CesiumEntity
        name={intl.formatMessage({ id: 'map-context-menu.polygon-parts.title' })}
        position={CesiumCartesian3.fromRadians(positionCartographic.longitude, positionCartographic.latitude, positionCartographic.height)}
        billboard={{
          verticalOrigin: CesiumVerticalOrigin.BOTTOM,
          scale: 0.3,
          image: 'assets/img/app/polygon-parts-marker.png',
        }}
        description={polygonPartsInfoHtml}
        selected={entitySelected}
        />
      }

      {polygonPartsFeature.features?.map((feature) => {
        const geoJsonFeature = feature as Feature;
        const polygonPartsFeatureConfig: IFeatureConfig = CONFIG.CONTEXT_MENUS.MAP.POLYGON_PARTS_FEATURE_CONFIG;

        return (
         <GeojsonFeature feature={geoJsonFeature as Feature<LineString | Polygon>} featureConfig={polygonPartsFeatureConfig} isPolylined={true} />
        );
      })}
    </>
  );
});
