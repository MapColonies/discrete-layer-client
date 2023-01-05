import React, { useEffect } from 'react';
import {
  CesiumCesiumTerrainProvider,
  CesiumEllipsoidTerrainProvider,
  useCesiumMap,
} from '@map-colonies/react-components';
import CONFIG from '../../../common/config';
import { getTokenResource } from '../helpers/layersUtils';

interface TerrainProps {}

export const Terrain: React.FC<TerrainProps> = () => {
  const mapViewer = useCesiumMap();

  // eslint-disable-next-line
  const setTerrainProvider = () => {
      mapViewer.terrainProvider = new CesiumCesiumTerrainProvider({
        url: getTokenResource(CONFIG.DEFAULT_TERRAIN_PROVIDER_URL),
      });

      const terrainErrorEvent = mapViewer.terrainProvider.errorEvent;

      function handleTerrainError(e: unknown): void {
        console.error('Terrain provider errored. falling back to default terrain. ', e);
        mapViewer.terrainProvider = new CesiumEllipsoidTerrainProvider({});

        // Remove the error listener after failing once.
        terrainErrorEvent.removeEventListener(handleTerrainError);
      }

      terrainErrorEvent.addEventListener(handleTerrainError);
  };

  useEffect(setTerrainProvider, []);

  return <></>;
};
