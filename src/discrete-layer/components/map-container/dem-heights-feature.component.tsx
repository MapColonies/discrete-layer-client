import { CSSProperties, useEffect, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { useIntl } from 'react-intl';
import { CesiumCartesian3, CesiumEntity, CesiumVerticalOrigin } from '@map-colonies/react-components';
import { Typography, useTheme } from '@map-colonies/react-core';
import useStaticHTML from '../../../common/hooks/useStaticHtml';
import { useHeightFromTerrain } from '../../../common/hooks/useHeightFromTerrain';
import { useForceEntitySelection } from '../../../common/hooks/useForceEntitySelection.hook';
import { useStore } from '../../models';
import { CesiumInfoBoxContainer } from './cesium-infoBox-container';
import GenericInfoBoxContainer from './generic-infoBox-container.component';

const DemHeightsFeatureComponent: React.FC = observer(() => {
  const store = useStore();
  const intl = useIntl();
  const themeObj = useTheme();
  const theme = themeObj as Record<string, string>;

  const currentPositionDemHeight = store.mapMenusManagerStore.currentPositionDemHeight;
  const lastMenuPosition = store.mapMenusManagerStore.lastMenuCoordinate;

  const {setCoordinates, newPositions: currentPositionWithHeight} = useHeightFromTerrain();

  const { entitySelected } = useForceEntitySelection([currentPositionDemHeight]);

  const positionWithHeight = currentPositionWithHeight?.[0];

  useEffect(() => {
      if(lastMenuPosition){
        setCoordinates([lastMenuPosition]);
      }
  }, [currentPositionDemHeight])


  const demHeightDataFound = currentPositionDemHeight?.longitude && currentPositionDemHeight?.latitude && currentPositionDemHeight?.height !== null;

  const DemHeightInfoBoxHtml: React.FC = () => {
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

    const style = useMemo(() => demHeightDataFound ? hasDataStyle : noDataStyle, [demHeightDataFound]);

    let content: JSX.Element;

    if (demHeightDataFound) {
      content = (
        <table style={style}>
          <tbody>
            {Object.entries(
              currentPositionDemHeight as unknown as Record<string, unknown>
            ).map(([key, val]) => {
              return (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{`${val as string}`}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    } else {
      content = (
        <div style={style}>
          <Typography
            tag="h3"
            style={{
              color: theme.textPrimaryOnDark,
            }}
            dir={intl.locale === 'he' ? 'rtl' : 'ltr'}
          >
            {intl.formatMessage({ id: 'dem-heights-info.no-data.message' })}
          </Typography>
        </div>
      );
    } 

    return (
      <GenericInfoBoxContainer positionInRadians={positionWithHeight}>
        {content}    
      </GenericInfoBoxContainer>
    )

  }


  const demHeightInfoHtml = useStaticHTML<{
    children: React.ReactNode;
    theme: Record<string, string>;
  }>({
    FunctionalComp: CesiumInfoBoxContainer,
    props: {
      children: (
        <DemHeightInfoBoxHtml />
      ),
      theme: themeObj,
    },
  });


  if(currentPositionDemHeight && positionWithHeight) {
    return (
      <CesiumEntity
        name={intl.formatMessage({ id: 'map-context-menu.query-dem-height.title' })}
        position={CesiumCartesian3.fromRadians(positionWithHeight.longitude, positionWithHeight.latitude, positionWithHeight.height)}
        billboard={{
          verticalOrigin: CesiumVerticalOrigin.BOTTOM,
          scale: 0.3,
          image: 'assets/img/dem-height-marker.png',
        }}
        description={demHeightInfoHtml}
        selected={entitySelected}
      />
    );

  }

  return null;
});

export default DemHeightsFeatureComponent;