/* eslint-disable @typescript-eslint/naming-convention */
import React from 'react';
import { observer } from 'mobx-react-lite';
import { Feature, LineString, Polygon } from 'geojson';
import { useIntl } from 'react-intl';
import CONFIG from '../../../../common/config';
import { useStore } from '../../../models';
import { IFeatureConfig } from "../../../views/components/data-fetchers/wfs-features-fetcher.component";
import { GeojsonFeatureWithInfoBox } from './geojson-feature-with-infobox.component';


export const PolygonPartsFeature: React.FC = observer(() => {
  const store = useStore();
  const intl = useIntl();
  const polygonPartsFeature = store.mapMenusManagerStore.currentPolygonPartsInfo;

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
          />
        );
      })}
    </>
  );
});