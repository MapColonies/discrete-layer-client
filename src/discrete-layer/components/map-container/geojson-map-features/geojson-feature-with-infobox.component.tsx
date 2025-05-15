import { CSSProperties, useEffect, useMemo } from 'react';
import { CesiumCartesian3, CesiumCartographic, CesiumEntity, CesiumVerticalOrigin } from '@map-colonies/react-components';
import { Typography, useTheme } from '@map-colonies/react-core';
import center from '@turf/center';
import { AllGeoJSON } from '@turf/helpers';
import { Polygon, MultiPolygon } from 'geojson';
import _ from 'lodash';
import { useIntl } from 'react-intl';
import { IPosition, useHeightFromTerrain } from '../../../../common/hooks/useHeightFromTerrain';
import useStaticHTML from '../../../../common/hooks/useStaticHtml';
import { useForceEntitySelection } from '../../../../common/hooks/useForceEntitySelection.hook';
import { CesiumInfoBoxContainer } from './cesium-infoBox-container';
import GenericInfoBoxContainer from './generic-infoBox-container.component';
import { GeojsonFeature, GeojsonFeatureProps } from './geojson-feature.component';
import { crossesMeridian, ZERO_MERIDIAN } from '../../../../common/utils/geo.tools';

interface GeojsonFeatureWithInfoBoxProps extends GeojsonFeatureProps {
  noInfoMessage: string;
  infoBoxTitle: string;

  /**
   * Defaults to the `center of the feature`
   */
  markerPosition?: IPosition;
  
  /**
   * Defaults to `'assets/img/map-marker.gif'`
   */
  markerIconPath?: string;
  
  /**
   * Defaults to `0.3`
   */
  markerScale?: number;

  /**
   * Whether or not to select the entity after creation to show the infoBox.
   * 
   * Defaults to `true`
   */
  shouldFocusOnCreation?: boolean;

  /**
   * Whether or not to visualize the geojson feature on the map
   * 
   * Defaults to `false`
   */
  shouldVisualize?: boolean;

  /**
   * A predicate function that receives the feature data and returns whether the data is considered empty.
   * 
   * Default behavior - data is considered empty if the `properties` object is empty.
   */
  noDataFoundPredicate?: (data: Record<string, unknown>) => boolean;

  /**
   * Where to present marker if no features?
   */
  fallbackCoordinates?: IPosition;
}

const DEFAULT_MARKER_SCALE = 0.3;
const DEFAULT_MARKER_ICON = 'assets/img/map-marker.gif';
const LONGITUDE_POSITION = 0;
const LATITUDE_POSITION = 1;

export const GeojsonFeatureWithInfoBox: React.FC<GeojsonFeatureWithInfoBoxProps> = (props) => {
  const themeObj = useTheme();
  const theme = themeObj as Record<string, string>;
  const intl = useIntl();

  const { setCoordinates, newPositions } = useHeightFromTerrain();
  const markerPositionWithHeight = newPositions?.[0] as IPosition;

  // Geojson feature props
  const { feature, isPolylined, featureConfig } = props;


  const {
    infoBoxTitle,
    noInfoMessage,
    markerScale = DEFAULT_MARKER_SCALE,
    markerIconPath = DEFAULT_MARKER_ICON,
    shouldVisualize = false,
    markerPosition,
    shouldFocusOnCreation,
    noDataFoundPredicate,
    fallbackCoordinates,
  } = props;


  useEffect(() => {
    if (markerPosition) {
      setCoordinates([markerPosition]);
    } else if (!_.isEmpty(feature.geometry)) {
      const featureCenter = center(feature as AllGeoJSON);

      const centerCartographic: IPosition = {
        longitude: featureCenter.geometry.coordinates[LONGITUDE_POSITION],
        latitude: featureCenter.geometry.coordinates[LATITUDE_POSITION],
      };
      setCoordinates([centerCartographic]);
    } else if (fallbackCoordinates) {
      setCoordinates([fallbackCoordinates])
    }
  }, [markerPosition, fallbackCoordinates]);

  const FeatureInfoBoxHtml: React.FC = () => {
  
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

    const featureInfo = feature.properties as Record<string, unknown>;
    const featureHasData = noDataFoundPredicate ? noDataFoundPredicate(featureInfo) : !_.isEmpty(featureInfo);

    const style = useMemo(() => featureHasData ? hasDataStyle : noDataStyle, [featureHasData]);

    let content: JSX.Element = <></>;

    if (featureHasData) {
      const isCrossesMeridian = crossesMeridian(feature.geometry as Polygon | MultiPolygon, ZERO_MERIDIAN);
      content = (
        <>
          {
          isCrossesMeridian && <Typography tag='h3'
              style={{
                color: (theme.custom as unknown as Record<string,string>).GC_WARNING_MEDIUM,
                textAlign: 'center'
              }}
              dir={intl.locale === 'he' ? 'rtl' : 'ltr'}
            >
              {intl.formatMessage({ id: 'polygonParts-info.part-to-large.message' })}
            </Typography>
          }
          <table style={style}>
              <tbody>
                {Object.entries(featureInfo).map(
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
        </>
      );
    } else {
      content = (
        <div style={style}>
          <Typography tag='h3'
              style={{
                color: theme.textPrimaryOnDark,
              }}
              dir={intl.locale === 'he' ? 'rtl' : 'ltr'}
            >
              {noInfoMessage}
            </Typography>
        </div>
      );
    }

    return (
      <GenericInfoBoxContainer positionInRadians={markerPositionWithHeight}>
        {content}    
      </GenericInfoBoxContainer>
    )

  }

  const featureInfoHtml = useStaticHTML<{
    children: React.ReactNode;
    theme: Record<string, string>;
  }>({
    FunctionalComp: CesiumInfoBoxContainer,
    props: {
      children: (
        <FeatureInfoBoxHtml />
      ),
      theme: themeObj,
    },
  });

  const { entitySelected } = useForceEntitySelection([featureInfoHtml]);

  return (
    <>
      {markerPositionWithHeight && (
        <CesiumEntity
          name={infoBoxTitle}
          position={CesiumCartesian3.fromRadians(
            (markerPositionWithHeight as  CesiumCartographic).longitude,
            (markerPositionWithHeight as  CesiumCartographic).latitude,
            (markerPositionWithHeight as  CesiumCartographic).height
          )}
          billboard={{
            verticalOrigin: CesiumVerticalOrigin.BOTTOM,
            scale: markerScale,
            image: markerIconPath,
          }}
          description={featureInfoHtml}
          selected={shouldFocusOnCreation ? entitySelected : undefined}
        />
      )}

      {
        shouldVisualize && !_.isEmpty(feature) && <GeojsonFeature
          feature={feature}
          isPolylined={isPolylined}
          featureConfig={featureConfig}
        />
      }
    </>
  );
}