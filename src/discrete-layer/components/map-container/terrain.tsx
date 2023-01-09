import React, { useEffect } from 'react';
import {
  CesiumCesiumTerrainProvider,
  CesiumEllipsoidTerrainProvider,
  useCesiumMap,
} from '@map-colonies/react-components';
import CONFIG from '../../../common/config';
import { getTokenResource } from '../helpers/layersUtils';
import { queue } from '../snackbar/notification-queue';
import { Error } from '../../../common/components/tree/statuses/error';
import { useIntl } from 'react-intl';

interface TerrainProps {}

export const Terrain: React.FC<TerrainProps> = () => {
  const mapViewer = useCesiumMap();
  const intl = useIntl();

  mapViewer.scene.globe.depthTestAgainstTerrain = true;

  // eslint-disable-next-line
  const setTerrainProvider = () => {
      mapViewer.terrainProvider = new CesiumCesiumTerrainProvider({
        url: getTokenResource(CONFIG.DEFAULT_TERRAIN_PROVIDER_URL),
      });

      const terrainErrorEvent = mapViewer.terrainProvider.errorEvent;

      function handleTerrainError(e: unknown): void {
        if(CONFIG.DEFAULT_TERRAIN_PROVIDER_URL){
          console.error('Terrain provider errored. falling back to default terrain. ', e);

          queue.notify({
            body: (
              <Error
                className="errorNotification"
                message={intl.formatMessage({ id: "terrain-provider.access.error" })}
                details={CONFIG.DEFAULT_TERRAIN_PROVIDER_URL}
              />
            ),
          });
        }
        mapViewer.terrainProvider = new CesiumEllipsoidTerrainProvider({});

        // Remove the error listener after failing once.
        terrainErrorEvent.removeEventListener(handleTerrainError);
      }

      terrainErrorEvent.addEventListener(handleTerrainError);
  };

  useEffect(setTerrainProvider, []);

  return <></>;
};
