import { PropsWithChildren, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { CesiumCartesian3, CesiumEntity, CesiumMath, CesiumVerticalOrigin } from '@map-colonies/react-components';
import { Typography, useTheme } from '@map-colonies/react-core';
import { useIntl } from 'react-intl';
import useStaticHTML from '../../../common/hooks/useStaticHtml';
import { IPosition, useHeightFromTerrain } from '../../../common/hooks/useHeightFromTerrain';
import CreateSvgIconLocationOn from '../../../icons/LocationOn';
import { useStore } from '../../models';
import { getCoordinatesDisplayText } from '../layer-details/utils';
import { CesiumInfoBoxContainer } from './cesium-infoBox-container';
import { useForceEntitySelection } from '../../../common/hooks/useForceEntitySelection.hook';
import _ from 'lodash';


const DemHeightsFeatureComponent: React.FC = observer(() => {
  const store = useStore();
  const intl = useIntl();
  const themeObj = useTheme();
  const theme = themeObj as Record<string, string>;

  const currentPositionDemHeight = store.mapMenusManagerStore.currentPositionDemHeight;
  const lastMenuPosition = store.mapMenusManagerStore.lastMenuCoordinate;

  const {setCoordinates, newPositions: currentPositionWithHeight} = useHeightFromTerrain();

  const positionWithHeight = currentPositionWithHeight?.[0];

  useEffect(() => {
      if(lastMenuPosition){
        setCoordinates([lastMenuPosition]);
      }
  }, [currentPositionDemHeight])

  const DemHeightInfoContainer: React.FC<PropsWithChildren<{ position?: IPosition }>> = ({ position, children }) => {    
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


  const demHeightInfoHtml = useStaticHTML<{
    children: React.ReactNode;
    theme: Record<string, string>;
  }>({
    FunctionalComp: CesiumInfoBoxContainer,
    props: {
      children: (
        positionWithHeight && currentPositionDemHeight && <DemHeightInfoContainer position={positionWithHeight}>
          <table style={{
              width: '100%',
              padding: '0.5rem',
              color: theme.textPrimaryOnDark,
              backgroundColor: theme.gcAlternativeSurface,
            }}>
              <tbody>
                {Object.entries(currentPositionDemHeight as unknown as Record<string, unknown>).map(
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
        </DemHeightInfoContainer>
      ),
      theme: themeObj,
    },
  });

  const { entitySelected } = useForceEntitySelection([demHeightInfoHtml]);

  const noHeightDataHtml = useStaticHTML<{
    children: React.ReactNode;
    theme: Record<string, string>;
  }>({
    FunctionalComp: CesiumInfoBoxContainer,
    props: {
      children: (
        positionWithHeight && <DemHeightInfoContainer position={positionWithHeight}>
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
              intl.formatMessage({ id: 'dem-heights-info.no-data.message' })
              }
            </Typography>
          </div>
        </DemHeightInfoContainer>
      ),
      theme: themeObj,
    },
  });

  if(positionWithHeight && currentPositionDemHeight?.height === null && currentPositionDemHeight?.longitude && currentPositionDemHeight?.latitude) {
    return (
      <CesiumEntity
        name={intl.formatMessage({ id: 'map-context-menu.query-dem-height.title' })}
        position={CesiumCartesian3.fromRadians(positionWithHeight.longitude, positionWithHeight.latitude, positionWithHeight.height)}
        billboard={{
          verticalOrigin: CesiumVerticalOrigin.BOTTOM,
          scale: 0.7,
          image: 'assets/img/map-marker.gif',
        }}
        description={noHeightDataHtml}
        selected={entitySelected}
      />
    );

  }

  if(positionWithHeight && currentPositionDemHeight?.longitude && currentPositionDemHeight?.latitude && currentPositionDemHeight?.height) {
    return (
        <CesiumEntity
          name={intl.formatMessage({ id: 'map-context-menu.query-dem-height.title' })}
          position={CesiumCartesian3.fromRadians(positionWithHeight.longitude, positionWithHeight.latitude, positionWithHeight.height)}
          billboard={{
            verticalOrigin: CesiumVerticalOrigin.BOTTOM,
            scale: 0.7,
            image: 'assets/img/map-marker.gif',
          }}
          description={demHeightInfoHtml}
          selected={entitySelected}
        />
    )
  }

  return null;
});

export default DemHeightsFeatureComponent;