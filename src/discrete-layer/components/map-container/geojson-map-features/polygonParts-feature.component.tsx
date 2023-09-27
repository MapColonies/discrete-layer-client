/* eslint-disable @typescript-eslint/naming-convention */
import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Feature, LineString, Polygon } from 'geojson';
import { useIntl } from 'react-intl';
import CONFIG from '../../../../common/config';
import { useStore } from '../../../models';
import { IFeatureConfig } from "../../../views/components/data-fetchers/wfs-features-fetcher.component";
import { GeojsonFeatureWithInfoBox } from './geojson-feature-with-infobox.component';
import { IPosition } from '../../../../common/hooks/useHeightFromTerrain';
import { CesiumRectangle, useCesiumMap } from '@map-colonies/react-components';


export const PolygonPartsFeature: React.FC = observer(() => {
  const store = useStore();
  const intl = useIntl();
  const cesiumViewer = useCesiumMap();
  const polygonPartsFeature = store.mapMenusManagerStore.currentPolygonPartsInfo;
  const lastMenuPosition = store.mapMenusManagerStore.lastMenuCoordinate;

  const [markerPosition, setMarkerPosition] = useState<IPosition>();

  useEffect(() => {
      if(lastMenuPosition){
        setMarkerPosition(lastMenuPosition);
      }
  }, [polygonPartsFeature])

  useEffect(() => {
    // Fly to polygon parts features after data received.
    if(store.mapMenusManagerStore.multiplePolygonPartsBBox) {
      const polygonPartsFeaturesRect = CesiumRectangle.fromDegrees(
        ...store.mapMenusManagerStore.multiplePolygonPartsBBox
      ) as CesiumRectangle;

      cesiumViewer.camera.flyTo({ destination: polygonPartsFeaturesRect });
    }
  }, [store.mapMenusManagerStore.multiplePolygonPartsBBox]);

  if(!polygonPartsFeature) return null;

  // If there are no features, use array with an empty object instead so that `GeojsonFeatureWithInfoBox` component will render no data found message
  const polygonPartsFeatures = polygonPartsFeature.features?.length ? polygonPartsFeature.features : [{}];

  return (
    <>
      {polygonPartsFeatures?.map((feature) => {
        const geoJsonFeature = feature as Feature;
        const polygonPartsFeatureConfig: IFeatureConfig = CONFIG.CONTEXT_MENUS.MAP.POLYGON_PARTS_FEATURE_CONFIG;

        return ( 
         <GeojsonFeatureWithInfoBox
            feature={geoJsonFeature as Feature<LineString | Polygon>}
            featureConfig={polygonPartsFeatureConfig}
            isPolylined={true}
            infoBoxTitle={intl.formatMessage({ id: 'map-context-menu.polygon-parts.title' })}
            noInfoMessage={intl.formatMessage({ id: 'polygonParts-info.no-data.message' })}
            markerIconPath={'assets/img/app/polygon-parts-marker.png'}
            shouldFocusOnCreation={polygonPartsFeatures.length === 1}
            shouldVisualize={true}
            markerPosition={markerPosition}
          />
        );
      })}
    </>
  );
});